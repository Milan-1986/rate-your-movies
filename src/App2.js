import { useEffect, useState } from "react";

import NavBar from "./Component/Navbar Component/NavBar";
import Main from "./Component/Main/Main";
import Box from "./Component/Main/Box";
import WatchedMovieList from "./Component/Main/WatchedMovieList";
import WatchedSummary from "./Component/Main/WatchedSummary";
import MovieList from "./Component/Main/MovieList&Movie";
import SelectedMovie from "./Component/Main/SelectedMovie";

const KEY = "7a3e8aab";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [watched, setWatched] = useState(storageMovies);

  function storageMovies() {
    const storage = JSON.parse(localStorage.getItem("watched"));
    return storage ? storage : [];
  }

  function handleSelectedId(movieId) {
    setSelectedId((selectedId) => (movieId === selectedId ? null : movieId));
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched?.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      const controller = new AbortController();
      const moviesQuery = async function () {
        try {
          setLoading(true);
          setError("");
          const response = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!response.ok)
            throw new Error(
              "Something went wrong with fetching data or internet connection."
            );
          const moviesData = await response.json();
          if (moviesData.Response === "False")
            throw new Error("Movie not found.");
          setMovies(moviesData.Search);
          setError("");
        } catch (error) {
          if (error.name !== "AbortError") {
            setError(error.message);
          }
        } finally {
          setLoading(false);
        }
      };

      if (query.length < 1) {
        setMovies([]);
        setError("");
        return;
      }

      handleCloseMovie();
      moviesQuery();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  return (
    <>
      <NavBar movies={movies} query={query} setQuery={setQuery} />
      <Main>
        <Box>
          {loading && <Loader />}
          {!loading && !error && (
            <MovieList movies={movies} onSelectedMovie={handleSelectedId} />
          )}
          {error && <Mistake error={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <SelectedMovie
              onAddWatched={handleAddWatched}
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function Mistake({ error }) {
  return <div className="error">{error}</div>;
}

export function Loader() {
  return <div className="loader">Loading...</div>;
}
