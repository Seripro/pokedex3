import { useEffect, useState } from "react";
import "./App.css";

type Pokemon = {
  name: string;
  sprites: {
    front_default: string;
  };
};

function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:3000/api/v3/pokemons");
      const pokemons: Pokemon[] = await res.json();
      setPokemons(pokemons);
    };
    fetchData();
  }, []);
  return (
    <>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ポケモンの名前を入力してください"
      />
      {pokemons
        .filter((pokemon) => pokemon.name.includes(query))
        .map((pokemon) => {
          return (
            <div key={pokemon.name}>
              <img src={pokemon.sprites.front_default} />
              <p>{pokemon.name}</p>
            </div>
          );
        })}
    </>
  );
}

export default App;
