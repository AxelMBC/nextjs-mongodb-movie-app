import { NextResponse } from "next/server";
import Movie from "../../../models/movie";
import { connectDB } from "../../../utils/connectDB";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const { id, titulo, ano, synopsis, puntaje, imagen } = await req.json();

    console.log("Update Request Body: ", {
      id,
      titulo,
      ano,
      synopsis,
      puntaje,
      imagen,
    });

    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { titulo, ano, synopsis, puntaje, imagen },
      { new: true } // Return the updated document
    );

    if (!updatedMovie) {
      return NextResponse.json({ message: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(
      { movie: updatedMovie, message: "Movie Updated" },
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
