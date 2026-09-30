import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const MAX_ID = 1000;

type Pokemon = {
  name: string;
  sprites: {
    front_default: string;
  };
};

// 20.95678699999998秒
app.get("/api/v1/pokemons", async (c) => {
  const start = performance.now();
  const pokemons: Pokemon[] = [];
  for (let i = 1; i <= MAX_ID; i++) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const pokemon = await res.json();
    pokemons.push(pokemon);
  }
  const end = performance.now();
  console.log((end - start) / 1000);
  return c.json(pokemons);
});

// 8.606802832999998秒
app.get("/api/v2/pokemons", async (c) => {
  const start = performance.now();
  let Ids = [];
  for (let i = 1; i < MAX_ID; i++) {
    Ids.push(i);
  }
  const fetchData = async (id: number) => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemon = await res.json();
    return pokemon;
  };
  const pokemons = await Promise.all(Ids.map((id) => fetchData(id)));
  const end = performance.now();
  console.log((end - start) / 1000);
  return c.json(pokemons);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
