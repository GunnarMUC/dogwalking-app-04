import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get walker profiles for the current user
    const profiles = await sql`
      SELECT wp.id, wp.user_id, wp.bio, wp.experience_years, wp.hourly_rate, 
             wp.service_areas, wp.availability, wp.is_available, wp.created_at,
             u.name, u.email, u.image
      FROM walker_profiles wp
      JOIN auth_users u ON wp.user_id = u.id
      WHERE wp.user_id = ${userId}
      ORDER BY wp.created_at DESC
    `;

    return Response.json({ profiles });
  } catch (err) {
    console.error("GET /api/walker-profiles error", err);
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
    const { bio, experience_years, hourly_rate, service_areas, availability } =
      body || {};

    // Get user to check if they're a walker
    const userRows =
      await sql`SELECT user_type FROM auth_users WHERE id = ${userId}`;
    const user = userRows?.[0];

    if (!user || user.user_type !== "walker") {
      return Response.json(
        { error: "Only dog walkers can create profiles" },
        { status: 403 },
      );
    }

    // Check if profile already exists
    const existingProfiles = await sql`
      SELECT id FROM walker_profiles WHERE user_id = ${userId}
    `;

    if (existingProfiles.length > 0) {
      return Response.json(
        { error: "Walker profile already exists. Use PUT to update." },
        { status: 409 },
      );
    }

    const result = await sql`
      INSERT INTO walker_profiles (user_id, bio, experience_years, hourly_rate, service_areas, availability, is_available)
      VALUES (${userId}, ${bio || null}, ${experience_years || null}, ${hourly_rate || null}, ${JSON.stringify(service_areas || [])}, ${JSON.stringify(availability || {})}, ${true})
      RETURNING id, user_id, bio, experience_years, hourly_rate, service_areas, availability, is_available, created_at
    `;

    const profile = result?.[0] || null;
    return Response.json({ profile });
  } catch (err) {
    console.error("POST /api/walker-profiles error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const {
      bio,
      experience_years,
      hourly_rate,
      service_areas,
      availability,
      is_available,
    } = body || {};

    // Verify profile exists
    const existingProfiles = await sql`
      SELECT id FROM walker_profiles WHERE user_id = ${userId}
    `;

    if (existingProfiles.length === 0) {
      return Response.json(
        { error: "Walker profile not found" },
        { status: 404 },
      );
    }

    const setClauses = [];
    const values = [];

    if (typeof bio === "string") {
      setClauses.push("bio = $" + (values.length + 1));
      values.push(bio.trim() || null);
    }

    if (typeof experience_years === "number" && experience_years >= 0) {
      setClauses.push("experience_years = $" + (values.length + 1));
      values.push(experience_years);
    }

    if (typeof hourly_rate === "number" && hourly_rate > 0) {
      setClauses.push("hourly_rate = $" + (values.length + 1));
      values.push(hourly_rate);
    }

    if (Array.isArray(service_areas)) {
      setClauses.push("service_areas = $" + (values.length + 1));
      values.push(JSON.stringify(service_areas));
    }

    if (typeof availability === "object" && availability !== null) {
      setClauses.push("availability = $" + (values.length + 1));
      values.push(JSON.stringify(availability));
    }

    if (typeof is_available === "boolean") {
      setClauses.push("is_available = $" + (values.length + 1));
      values.push(is_available);
    }

    if (setClauses.length === 0) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    const finalQuery = `
      UPDATE walker_profiles 
      SET ${setClauses.join(", ")} 
      WHERE user_id = $${values.length + 1}
      RETURNING id, user_id, bio, experience_years, hourly_rate, service_areas, availability, is_available, created_at
    `;

    const result = await sql(finalQuery, [...values, userId]);
    const profile = result?.[0] || null;

    return Response.json({ profile });
  } catch (err) {
    console.error("PUT /api/walker-profiles error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
