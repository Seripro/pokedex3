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

app.get("/api/v1/pokemons", async (c) => {
  const pokemons: Pokemon[] = [];
  for (let i = 1; i <= MAX_ID; i++) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const pokemon = await res.json();
    pokemons.push(pokemon);
  }
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
