import { NextResponse } from "next/server";
import Movie from "../../../models/movie";
import { connectDB } from "../../../utils/connectDB";

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const id = url.searchParams.get("id"); // Extract `id` from the query parameter

    if (!id) {
      return NextResponse.json(
        { message: "Movie ID is required" },
        { status: 400 }
      );
    }

    const movie = await Movie.findById(id);
    if (!movie) {
      return NextResponse.json({ message: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json({ movie }, { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
