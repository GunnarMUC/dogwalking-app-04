import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // Get user to determine role
    const userRows =
      await sql`SELECT user_type FROM auth_users WHERE id = ${userId}`;
    const user = userRows?.[0];

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    let bookings;

    if (user.user_type === "owner") {
      // Get bookings for this owner
      let query = sql`
        SELECT b.id, b.owner_id, b.walker_id, b.pet_id, b.scheduled_date, 
               b.duration_minutes, b.status, b.price, b.special_requests, 
               b.walk_notes, b.photo_urls, b.created_at,
               p.name as pet_name, p.breed as pet_breed, p.photo_url as pet_photo,
               w.name as walker_name, w.email as walker_email, w.phone_number as walker_phone,
               wp.hourly_rate, wp.bio as walker_bio
        FROM bookings b
        JOIN pets p ON b.pet_id = p.id
        JOIN auth_users w ON b.walker_id = w.id
        LEFT JOIN walker_profiles wp ON w.id = wp.user_id
        WHERE b.owner_id = ${userId}
      `;

      if (status) {
        bookings =
          await sql`${query} AND b.status = ${status} ORDER BY b.scheduled_date DESC`;
      } else {
        bookings = await sql`${query} ORDER BY b.scheduled_date DESC`;
      }
    } else if (user.user_type === "walker") {
      // Get bookings for this walker
      let query = sql`
        SELECT b.id, b.owner_id, b.walker_id, b.pet_id, b.scheduled_date, 
               b.duration_minutes, b.status, b.price, b.special_requests, 
               b.walk_notes, b.photo_urls, b.created_at,
               p.name as pet_name, p.breed as pet_breed, p.photo_url as pet_photo,
               p.special_instructions as pet_instructions,
               o.name as owner_name, o.email as owner_email, o.phone_number as owner_phone,
               o.address as owner_address
        FROM bookings b
        JOIN pets p ON b.pet_id = p.id
        JOIN auth_users o ON b.owner_id = o.id
        WHERE b.walker_id = ${userId}
      `;

      if (status) {
        bookings =
          await sql`${query} AND b.status = ${status} ORDER BY b.scheduled_date DESC`;
      } else {
        bookings = await sql`${query} ORDER BY b.scheduled_date DESC`;
      }
    } else {
      return Response.json({ error: "Invalid user type" }, { status: 403 });
    }

    return Response.json({ bookings });
  } catch (err) {
    console.error("GET /api/bookings error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const {
      walker_id,
      pet_id,
      scheduled_date,
      duration_minutes = 30,
      special_requests,
    } = body || {};

    // Get user to check if they're an owner
    const userRows =
      await sql`SELECT user_type FROM auth_users WHERE id = ${userId}`;
    const user = userRows?.[0];

    if (!user || user.user_type !== "owner") {
      return Response.json(
        { error: "Only dog owners can create bookings" },
        { status: 403 },
      );
    }

    // Validate required fields
    if (!walker_id || !pet_id || !scheduled_date) {
      return Response.json(
        { error: "Walker, pet, and scheduled date are required" },
        { status: 400 },
      );
    }

    // Validate pet belongs to owner
    const petRows =
      await sql`SELECT id FROM pets WHERE id = ${pet_id} AND owner_id = ${userId}`;
    if (petRows.length === 0) {
      return Response.json(
        { error: "Pet not found or doesn't belong to you" },
        { status: 404 },
      );
    }

    // Validate walker exists and is active
    const walkerRows = await sql`
      SELECT u.id, wp.hourly_rate, wp.is_available 
      FROM auth_users u
      LEFT JOIN walker_profiles wp ON u.id = wp.user_id
      WHERE u.id = ${walker_id} AND u.user_type = 'walker'
    `;
    const walker = walkerRows?.[0];

    if (!walker) {
      return Response.json({ error: "Walker not found" }, { status: 404 });
    }

    if (!walker.is_available) {
      return Response.json(
        { error: "Walker is not currently available" },
        { status: 400 },
      );
    }

    // Calculate price based on duration and hourly rate
    const hourlyRate = walker.hourly_rate || 25; // Default rate if not set
    const price = (duration_minutes / 60) * hourlyRate;

    // Create booking
    const result = await sql`
      INSERT INTO bookings (owner_id, walker_id, pet_id, scheduled_date, duration_minutes, status, price, special_requests)
      VALUES (${userId}, ${walker_id}, ${pet_id}, ${scheduled_date}, ${duration_minutes}, 'pending', ${price}, ${special_requests || null})
      RETURNING id, owner_id, walker_id, pet_id, scheduled_date, duration_minutes, status, price, special_requests, created_at
    `;

    const booking = result?.[0] || null;
    return Response.json({ booking }, { status: 201 });
  } catch (err) {
    console.error("POST /api/bookings error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
