import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const userId = session.user.id;

    const bookingRows = await sql`
      SELECT b.id, b.owner_id, b.walker_id, b.pet_id, b.scheduled_date, 
             b.duration_minutes, b.status, b.price, b.special_requests, 
             b.walk_notes, b.photo_urls, b.created_at,
             p.name as pet_name, p.breed as pet_breed, p.photo_url as pet_photo,
             p.special_instructions as pet_instructions,
             o.name as owner_name, o.email as owner_email, o.phone_number as owner_phone,
             o.address as owner_address,
             w.name as walker_name, w.email as walker_email, w.phone_number as walker_phone,
             wp.hourly_rate, wp.bio as walker_bio
      FROM bookings b
      JOIN pets p ON b.pet_id = p.id
      JOIN auth_users o ON b.owner_id = o.id
      JOIN auth_users w ON b.walker_id = w.id
      LEFT JOIN walker_profiles wp ON w.id = wp.user_id
      WHERE b.id = ${id} AND (b.owner_id = ${userId} OR b.walker_id = ${userId})
    `;

    const booking = bookingRows?.[0];

    if (!booking) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    return Response.json({ booking });
  } catch (err) {
    console.error("GET /api/bookings/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const userId = session.user.id;
    const body = await request.json();
    const { status, walk_notes, photo_urls } = body || {};

    // Get the current booking to verify ownership
    const bookingRows = await sql`
      SELECT b.*, u.user_type
      FROM bookings b
      JOIN auth_users u ON (b.owner_id = u.id OR b.walker_id = u.id)
      WHERE b.id = ${id} AND (b.owner_id = ${userId} OR b.walker_id = ${userId})
    `;

    const booking = bookingRows?.[0];

    if (!booking) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    // Determine what updates are allowed based on user role and current status
    const setClauses = [];
    const values = [];

    if (status) {
      // Status update rules:
      // - Walkers can accept (pending -> confirmed) or complete (confirmed -> completed)
      // - Owners can cancel (pending -> cancelled)
      const currentStatus = booking.status;

      if (booking.walker_id === userId) {
        // Walker actions
        if (status === "confirmed" && currentStatus === "pending") {
          setClauses.push("status = $" + (values.length + 1));
          values.push(status);
        } else if (status === "completed" && currentStatus === "confirmed") {
          setClauses.push("status = $" + (values.length + 1));
          values.push(status);
        } else {
          return Response.json(
            { error: "Invalid status transition" },
            { status: 400 },
          );
        }
      } else if (booking.owner_id === userId) {
        // Owner actions
        if (
          status === "cancelled" &&
          (currentStatus === "pending" || currentStatus === "confirmed")
        ) {
          setClauses.push("status = $" + (values.length + 1));
          values.push(status);
        } else {
          return Response.json(
            { error: "Invalid status transition" },
            { status: 400 },
          );
        }
      }
    }

    // Walk notes can only be updated by walker
    if (walk_notes !== undefined && booking.walker_id === userId) {
      setClauses.push("walk_notes = $" + (values.length + 1));
      values.push(walk_notes);
    }

    // Photo URLs can only be updated by walker
    if (photo_urls !== undefined && booking.walker_id === userId) {
      setClauses.push("photo_urls = $" + (values.length + 1));
      values.push(JSON.stringify(photo_urls || []));
    }

    if (setClauses.length === 0) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    const updateQuery = `
      UPDATE bookings 
      SET ${setClauses.join(", ")} 
      WHERE id = $${values.length + 1}
      RETURNING id, owner_id, walker_id, pet_id, scheduled_date, duration_minutes, status, price, special_requests, walk_notes, photo_urls, created_at
    `;

    const result = await sql(updateQuery, [...values, id]);
    const updatedBooking = result?.[0] || null;

    return Response.json({ booking: updatedBooking });
  } catch (err) {
    console.error("PUT /api/bookings/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const userId = session.user.id;

    // Check if booking exists and belongs to the user
    const bookingRows = await sql`
      SELECT id, owner_id, status 
      FROM bookings 
      WHERE id = ${id} AND owner_id = ${userId}
    `;

    const booking = bookingRows?.[0];

    if (!booking) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    // Only allow deletion if booking is still pending
    if (booking.status !== "pending") {
      return Response.json(
        {
          error: "Can only delete pending bookings",
        },
        { status: 400 },
      );
    }

    await sql`DELETE FROM bookings WHERE id = ${id}`;

    return Response.json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/bookings/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
