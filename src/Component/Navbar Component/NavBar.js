import Logo from "./Logo";
import Results from "./Results";
import Search from "./Search";

export default function NavBar({ movies, query, setQuery }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <Search query={query} setQuery={setQuery} />
      <Results movies={movies} />
    </nav>
  );
}
