import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { client } from "./redisClient.js";
import type { Pokemon } from "./types/pokemon.js";

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

const fetchData = async (id: number) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const pokemon = await res.json();
  return pokemon;
};

const processInParallel = async () => {
  let pokemons: Pokemon[] = [];
  for (let j = 10; j <= MAX_ID; j = j + 10) {
    let Ids = [];
    for (let i = j - 9; i <= j; i++) {
      Ids.push(i);
    }
    const res = await Promise.all(Ids.map((id) => fetchData(id)));
    pokemons.push(...res);
  }
  return pokemons;
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

// 3.9947245000000002秒
app.get("/api/v2/pokemons", async (c) => {
  const start = performance.now();
  const pokemons = await processInParallel();
  const end = performance.now();
  console.log((end - start) / 1000);
  return c.json(pokemons);
});

// キャッシュなし：5.208721250000003秒
// キャッシュあり：0.63928125秒
app.get("/api/v3/pokemons", async (c) => {
  const start = performance.now();
  const value = await client.get("pokemons");
  if (!value) {
    console.log("キャッシュがありません");
    const pokemons = await processInParallel();
    await client.set("pokemons", JSON.stringify(pokemons));
    await client.expire("pokemons", 3600);
    const end = performance.now();
    console.log((end - start) / 1000);
    return c.json(pokemons);
  } else {
    console.log("キャッシュがあります");
    const pokemons = JSON.parse(value);
    const end = performance.now();
    console.log((end - start) / 1000);
    return c.json(pokemons);
  }
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
