import Link from "next/link";

export default function MovieCard({ movie }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
      <img
        src={movie.imagen}
        alt={movie.titulo}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <Link href={`/movie/${movie._id}`}>
          <h2 className="text-xl font-semibold text-blue-400 hover:underline">
            {movie.titulo}
          </h2>
        </Link>
        <p className="text-sm text-gray-400">Year: {movie.ano}</p>
        <p className="text-gray-300 mt-2 text-sm">{movie.synopsis}</p>
        <div className="flex items-center mt-4">
          <span className="text-yellow-400 font-bold">{movie.puntaje}</span>
          <span className="ml-2 text-sm text-gray-400">/ 10</span>
        </div>
      </div>
    </div>
  );
}
