"use client";
import { useState, useEffect } from "react";
import Movie from "./movie/movieCard";
import { MovieType } from "./types/movie";

const Home = () => {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMovie, setNewMovie] = useState({
    titulo: "",
    ano: "",
    synopsis: "",
    puntaje: "",
    imagen: "",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  interface InputChangeEvent {
    target: {
      name: string;
      value: string;
    };
  }

  const handleInputChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setNewMovie((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteMovie = async (index: number) => {
    try {
      const movieToDelete = movies[index];
      const response = await fetch("/api/movies/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: movieToDelete._id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete the movie");
      }

      setMovies((prev) => {
        const updatedMovies = [...prev];
        updatedMovies.splice(index, 1);
        return updatedMovies;
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  const handleAddMovie = async () => {
    try {
      if (editingIndex !== null) {
        // Editing an existing movie
        const movieToEdit = movies[editingIndex];
        const response = await fetch("/api/movies/edit", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: movieToEdit._id, ...newMovie }),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to update the movie");
        }

        setMovies((prev) => {
          const updatedMovies = [...prev];
          updatedMovies[editingIndex] = data.movie;
          return updatedMovies;
        });
      } else {
        // Adding a new movie
        const response = await fetch("/api/movies/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMovie),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to create a movie");
        }

        setMovies((prev) => [...prev, data.movie]);
      }
      closeModal();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  const handleEditMovie = (index: number) => {
    const movieToEdit = movies[index];
    setEditingIndex(index);
    setNewMovie({
      titulo: movieToEdit.titulo,
      ano: movieToEdit.ano.toString(), // Convert to string for input fields
      synopsis: movieToEdit.synopsis,
      puntaje: movieToEdit.puntaje.toString(), // Convert to string for input fields
      imagen: movieToEdit.imagen,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewMovie({ titulo: "", ano: "", synopsis: "", puntaje: "", imagen: "" });
    setEditingIndex(null);
  };

  useEffect(() => {
    const getMovies = async () => {
      const response = await fetch("/api/movies/all");
      const data = await response.json();
      setMovies(data.allMovies);
    };
    getMovies();
  }, []);

  return (
    <div className="bg-gradient-to-b from-darkblue via-gray-900 to-black min-h-screen text-white">
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-4xl font-extrabold text-center mb-10">
          Top de Mejores Peliculas
        </h1>
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
          >
            Add New Movie
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {movies?.map((movie, index) => (
            <div key={index} className="relative">
              <Movie {...movie} />

              <button
                onClick={() => handleEditMovie(index)}
                className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteMovie(index)}
                className="absolute top-2 right-16 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4 text-white">
              {editingIndex !== null ? "Edit Movie" : "Add a New Movie"}
            </h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="titulo"
                  value={newMovie.titulo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Year</label>
                <input
                  type="number"
                  name="ano"
                  value={newMovie.ano}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Synopsis
                </label>
                <textarea
                  name="synopsis"
                  value={newMovie.synopsis}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
                  rows={3}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Score</label>
                <input
                  type="number"
                  name="puntaje"
                  step="0.1"
                  value={newMovie.puntaje}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  name="imagen"
                  value={newMovie.imagen}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
                />
              </div>
            </form>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleAddMovie}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200"
              >
                {editingIndex !== null ? "Save Changes" : "Add Movie"}
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
