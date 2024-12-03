import { NextResponse } from "next/server";
import Movie from "../../../models/movie";
import { connectDB } from "../../../utils/connectDB";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { titulo, ano, synopsis, puntaje, imagen } = await req.json(); // Parse the request body
    console.log("req.body: ", { titulo, ano, synopsis, puntaje, imagen });

    const newMovie = await Movie.create({
      titulo,
      ano,
      synopsis,
      puntaje,
      imagen,
    });

    return NextResponse.json(
      { movie: newMovie, message: "Movie Created" },
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
