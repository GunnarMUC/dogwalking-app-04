import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const walkerId = searchParams.get("walkerId");
    const area = searchParams.get("area");
    const minRate = searchParams.get("minRate");
    const maxRate = searchParams.get("maxRate");
    const minExperience = searchParams.get("minExperience");

    // Get user to check if they're an owner
    const userRows =
      await sql`SELECT user_type FROM auth_users WHERE id = ${session.user.id}`;
    const user = userRows?.[0];

    if (!user || user.user_type !== "owner") {
      return Response.json(
        { error: "Only dog owners can search for walkers" },
        { status: 403 },
      );
    }

    // If walkerId is provided, fetch that specific walker
    if (walkerId) {
      const walkerQuery = `
        SELECT u.id, u.name, u.email, u.phone_number, u.image,
               wp.bio, wp.experience_years, wp.hourly_rate, wp.service_areas, 
               wp.is_available, wp.created_at,
               COALESCE(AVG(CASE WHEN b.status = 'completed' THEN 5.0 END), 0) as avg_rating,
               COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_walks
        FROM auth_users u
        JOIN walker_profiles wp ON u.id = wp.user_id
        LEFT JOIN bookings b ON u.id = b.walker_id
        WHERE u.id = $1 AND wp.is_available = true
        GROUP BY u.id, u.name, u.email, u.phone_number, u.image, 
                 wp.bio, wp.experience_years, wp.hourly_rate, wp.service_areas, 
                 wp.is_available, wp.created_at
      `;

      const walkers = await sql(walkerQuery, [parseInt(walkerId)]);

      if (walkers.length === 0) {
        return Response.json({ error: "Walker not found" }, { status: 404 });
      }

      const processedWalkers = walkers.map((walker) => ({
        ...walker,
        service_areas: walker.service_areas || [],
        avg_rating: parseFloat(walker.avg_rating || 0),
        completed_walks: parseInt(walker.completed_walks || 0),
      }));

      return Response.json({ walkers: processedWalkers });
    }

    // Base query for available walkers
    let conditions = ["wp.is_available = true"];
    let params = [];
    let paramCount = 0;

    // Filter by service area if provided
    if (area && area.trim()) {
      paramCount++;
      conditions.push(`wp.service_areas::text ILIKE $${paramCount}`);
      params.push(`%${area.trim()}%`);
    }

    // Filter by hourly rate range
    if (minRate) {
      paramCount++;
      conditions.push(`wp.hourly_rate >= $${paramCount}`);
      params.push(parseFloat(minRate));
    }

    if (maxRate) {
      paramCount++;
      conditions.push(`wp.hourly_rate <= $${paramCount}`);
      params.push(parseFloat(maxRate));
    }

    // Filter by minimum experience
    if (minExperience) {
      paramCount++;
      conditions.push(`wp.experience_years >= $${paramCount}`);
      params.push(parseInt(minExperience));
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // TODO: REFACTOR - Before Launch
    // This query mixes string concatenation with parameterized queries.
    // While params are still safely parameterized, the pattern is fragile.
    // Recommended approach:
    // 1. Use a query builder (e.g., Drizzle ORM)
    // 2. Or build the query using Neon's tagged templates consistently
    // 3. Or use a WHERE builder function that maintains parameterization
    // See: CODE_REVIEW_RECOMMENDATIONS.md #2 for details
    const query = `
      SELECT u.id, u.name, u.email, u.phone_number, u.image,
             wp.bio, wp.experience_years, wp.hourly_rate, wp.service_areas, 
             wp.is_available, wp.created_at,
             COALESCE(AVG(CASE WHEN b.status = 'completed' THEN 5.0 END), 0) as avg_rating,
             COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_walks
      FROM auth_users u
      JOIN walker_profiles wp ON u.id = wp.user_id
      LEFT JOIN bookings b ON u.id = b.walker_id
      ${whereClause}
      GROUP BY u.id, u.name, u.email, u.phone_number, u.image, 
               wp.bio, wp.experience_years, wp.hourly_rate, wp.service_areas, 
               wp.is_available, wp.created_at
      ORDER BY wp.hourly_rate ASC, wp.experience_years DESC
    `;

    const walkers = await sql(query, params);

    // Process the results to parse JSON fields
    const processedWalkers = walkers.map((walker) => ({
      ...walker,
      service_areas: walker.service_areas || [],
      avg_rating: parseFloat(walker.avg_rating || 0),
      completed_walks: parseInt(walker.completed_walks || 0),
    }));

    return Response.json({ walkers: processedWalkers });
  } catch (err) {
    console.error("GET /api/walkers/search error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
