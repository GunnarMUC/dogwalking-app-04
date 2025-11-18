import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const rows = await sql`
      SELECT id, name, email, image, user_type, phone_number, address, created_at, updated_at
      FROM auth_users 
      WHERE id = ${userId} 
      LIMIT 1
    `;

    const user = rows?.[0] || null;
    return Response.json({ user });
  } catch (err) {
    console.error("GET /api/profile error", err);
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
    const { name, user_type, phone_number, address } = body || {};

    const setClauses = [];
    const values = [];

    if (typeof name === "string" && name.trim().length > 0) {
      setClauses.push("name = $" + (values.length + 1));
      values.push(name.trim());
    }

    if (
      typeof user_type === "string" &&
      ["owner", "walker"].includes(user_type)
    ) {
      setClauses.push("user_type = $" + (values.length + 1));
      values.push(user_type);
    }

    if (typeof phone_number === "string" && phone_number.trim().length > 0) {
      setClauses.push("phone_number = $" + (values.length + 1));
      values.push(phone_number.trim());
    }

    if (typeof address === "string" && address.trim().length > 0) {
      setClauses.push("address = $" + (values.length + 1));
      values.push(address.trim());
    }

    setClauses.push("updated_at = $" + (values.length + 1));
    values.push(new Date().toISOString());

    if (setClauses.length === 1) {
      // Only updated_at was added
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    const finalQuery = `
      UPDATE auth_users 
      SET ${setClauses.join(", ")} 
      WHERE id = $${values.length + 1} 
      RETURNING id, name, email, image, user_type, phone_number, address, created_at, updated_at
    `;

    const result = await sql(finalQuery, [...values, userId]);
    const updated = result?.[0] || null;

    return Response.json({ user: updated });
  } catch (err) {
    console.error("PUT /api/profile error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
