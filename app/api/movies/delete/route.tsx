import { NextResponse } from "next/server";
import Movie from "../../../models/movie";
import { connectDB } from "../../../utils/connectDB";

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json(); // Parse the request body for the `id`

    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
      return NextResponse.json({ message: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Movie deleted successfully" },
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
