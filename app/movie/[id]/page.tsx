"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Movie {
  titulo: string;
  ano: number;
  synopsis: string;
  puntaje: number;
  imagen: string;
}

export default function MovieDetails() {
  const id = usePathname().split("/")[2]; // Extract slug from URL
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`/api/movies/single?id=${id}`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch movie");
        }
        const data = await response.json();
        setMovie(data.movie);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return <h1 className="text-center text-2xl text-white">Loading...</h1>;
  }

  if (error) {
    return <h1 className="text-center text-2xl text-white">{error}</h1>;
  }

  if (!movie) {
    return <h1 className="text-center text-2xl text-white">Movie Not Found</h1>;
  }

  return (
    <div className="bg-gradient-to-b from-darkblue via-gray-900 to-black min-h-screen text-white">
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-lg mb-6">
            <Image
              src={movie.imagen}
              alt={movie.titulo}
              width={600}
              height={400}
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          </div>
          <h1 className="text-4xl font-extrabold text-center mb-4">
            {movie.titulo}
          </h1>
          <p className="text-center text-gray-400 mb-6">Año: {movie.ano}</p>
          <p className="text-gray-300 text-lg leading-relaxed text-center">
            {movie.synopsis}
          </p>
          <div className="mt-6 text-center">
            <span className="text-yellow-400 font-bold text-2xl">
              {movie.puntaje}
            </span>
            <span className="ml-2 text-gray-400 text-lg">/ 10</span>
          </div>
          <Link href="/">
            <button className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
