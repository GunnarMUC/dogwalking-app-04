import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const petId = params.id;

    if (!petId || isNaN(parseInt(petId))) {
      return Response.json({ error: "Invalid pet ID" }, { status: 400 });
    }

    const pets = await sql`
      SELECT p.id, p.owner_id, p.name, p.breed, p.age, p.weight, p.special_instructions, p.photo_url, p.created_at
      FROM pets p
      WHERE p.id = ${parseInt(petId)} AND p.owner_id = ${userId}
      LIMIT 1
    `;

    const pet = pets?.[0] || null;

    if (!pet) {
      return Response.json({ error: "Pet not found" }, { status: 404 });
    }

    return Response.json({ pet });
  } catch (err) {
    console.error("GET /api/pets/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const petId = params.id;
    const body = await request.json();
    const { name, breed, age, weight, special_instructions, photo_url } =
      body || {};

    if (!petId || isNaN(parseInt(petId))) {
      return Response.json({ error: "Invalid pet ID" }, { status: 400 });
    }

    // Verify pet ownership
    const existingPets = await sql`
      SELECT id FROM pets WHERE id = ${parseInt(petId)} AND owner_id = ${userId}
    `;

    if (existingPets.length === 0) {
      return Response.json({ error: "Pet not found" }, { status: 404 });
    }

    const setClauses = [];
    const values = [];

    if (typeof name === "string" && name.trim().length > 0) {
      setClauses.push("name = $" + (values.length + 1));
      values.push(name.trim());
    }

    if (typeof breed === "string") {
      setClauses.push("breed = $" + (values.length + 1));
      values.push(breed.trim() || null);
    }

    if (typeof age === "number" && age > 0) {
      setClauses.push("age = $" + (values.length + 1));
      values.push(age);
    }

    if (typeof weight === "number" && weight > 0) {
      setClauses.push("weight = $" + (values.length + 1));
      values.push(weight);
    }

    if (typeof special_instructions === "string") {
      setClauses.push("special_instructions = $" + (values.length + 1));
      values.push(special_instructions.trim() || null);
    }

    if (typeof photo_url === "string") {
      setClauses.push("photo_url = $" + (values.length + 1));
      values.push(photo_url.trim() || null);
    }

    if (setClauses.length === 0) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    const finalQuery = `
      UPDATE pets 
      SET ${setClauses.join(", ")} 
      WHERE id = $${values.length + 1} AND owner_id = $${values.length + 2}
      RETURNING id, owner_id, name, breed, age, weight, special_instructions, photo_url, created_at
    `;

    const result = await sql(finalQuery, [...values, parseInt(petId), userId]);
    const pet = result?.[0] || null;

    return Response.json({ pet });
  } catch (err) {
    console.error("PUT /api/pets/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const petId = params.id;

    if (!petId || isNaN(parseInt(petId))) {
      return Response.json({ error: "Invalid pet ID" }, { status: 400 });
    }

    const result = await sql`
      DELETE FROM pets 
      WHERE id = ${parseInt(petId)} AND owner_id = ${userId}
      RETURNING id
    `;

    if (result.length === 0) {
      return Response.json({ error: "Pet not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/pets/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
