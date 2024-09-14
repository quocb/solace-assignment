import { NextRequest, NextResponse } from "next/server";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { or, ilike } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get("search") || "";
  const pageParam = searchParams.get("page");
  const pageSizeParam = searchParams.get("pageSize");

  const page = pageParam ? parseInt(pageParam) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam) : 5;
  const offset = (page - 1) * pageSize;

  try {
    const conditions = [];

    if (searchTerm) {
      const term = `%${searchTerm}%`;

      conditions.push(
        ilike(advocates.firstName, term),
        ilike(advocates.lastName, term),
        ilike(advocates.city, term),
        ilike(advocates.degree, term)
      );
    }

    let query = db
      .select()
      .from(advocates)
      .where(or(...conditions));

    const data = await query.limit(pageSize).offset(offset).execute();

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching advocates:", error);
    return NextResponse.json({ error: "Failed to fetch advocates" }, { status: 500 });
  }
}
