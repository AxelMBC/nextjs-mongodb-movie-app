"use client";
import { useState, useEffect } from "react";
import Movie from "./movie/movieCard";
import { MovieType } from "./types/movie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faGithub,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";

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
          Top Peliculas
        </h1>
        {movies.length == 0 ? (
          <div className="flex justify-center">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
              >
                +
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
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteMovie(index)}
                    className="me-3 absolute top-2 right-16 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-2 py-1 rounded"
                  >
                    Borrar
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold text-center mb-6">
          Links Externos:{" "}
        </h2>

        <div className="flex items-center justify-center pb-16">
          <a target="_blank" href="https://www.instagram.com/axelbarrazaa/">
            <FontAwesomeIcon icon={faInstagram} className="fa-fw fa-2xl" />
          </a>
          <a target="_blank" href="https://github.com/AxelMBC">
            <FontAwesomeIcon icon={faGithub} className="fa-fw fa-2xl" />
          </a>
          <a target="_blank" href="https://www.linkedin.com/in/axelmbc/">
            <FontAwesomeIcon icon={faLinkedin} className="fa-fw fa-2xl" />
          </a>
          <a target="_blank" href="https://www.axelbarraza.com/">
            <FontAwesomeIcon icon={faBriefcase} className="fa-fw fa-2xl" />
          </a>
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
                <label className="block text-sm font-medium mb-2">Titulo</label>
                <input
                  type="text"
                  name="titulo"
                  value={newMovie.titulo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Año</label>
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
                <label className="block text-sm font-medium mb-2">
                  Puntaje
                </label>
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
                  URL de Imagen
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
                {editingIndex !== null ? "Guardar Cambios" : "Agregar Pelicula"}
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
