import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user to check if they're an owner
    const userRows =
      await sql`SELECT user_type FROM auth_users WHERE id = ${userId}`;
    const user = userRows?.[0];

    if (!user || user.user_type !== "owner") {
      return Response.json(
        { error: "Only dog owners can view pets" },
        { status: 403 },
      );
    }

    const pets = await sql`
      SELECT id, owner_id, name, breed, age, weight, special_instructions, photo_url, created_at
      FROM pets 
      WHERE owner_id = ${userId}
      ORDER BY created_at DESC
    `;

    return Response.json({ pets });
  } catch (err) {
    console.error("GET /api/pets error", err);
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
    const { name, breed, age, weight, special_instructions, photo_url } =
      body || {};

    // Get user to check if they're an owner
    const userRows =
      await sql`SELECT user_type FROM auth_users WHERE id = ${userId}`;
    const user = userRows?.[0];

    if (!user || user.user_type !== "owner") {
      return Response.json(
        { error: "Only dog owners can add pets" },
        { status: 403 },
      );
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return Response.json({ error: "Pet name is required" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO pets (owner_id, name, breed, age, weight, special_instructions, photo_url)
      VALUES (${userId}, ${name.trim()}, ${breed || null}, ${age || null}, ${weight || null}, ${special_instructions || null}, ${photo_url || null})
      RETURNING id, owner_id, name, breed, age, weight, special_instructions, photo_url, created_at
    `;

    const pet = result?.[0] || null;
    return Response.json({ pet });
  } catch (err) {
    console.error("POST /api/pets error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
