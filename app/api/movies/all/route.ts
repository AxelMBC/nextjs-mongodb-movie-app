import { NextResponse } from "next/server";
import Movie from "../../../models/movie";
import { connectDB } from "../../../utils/connectDB";

export async function GET() {
  try {
    await connectDB();

    const allMovies = await Movie.find();

    return NextResponse.json(
      { allMovies, message: "Movie Created" },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
