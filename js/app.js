let pokedex = [];

const coloresTipo = {
  normal: "bg-gray-200 text-gray-800",
  fire: "bg-red-200 text-red-800",
  water: "bg-blue-200 text-blue-800",
  electric: "bg-yellow-200 text-yellow-800",
  grass: "bg-green-200 text-green-800",
  ice: "bg-cyan-200 text-cyan-800",
  fighting: "bg-orange-200 text-orange-800",
  poison: "bg-purple-200 text-purple-800",
  ground: "bg-amber-200 text-amber-800",
  flying: "bg-sky-200 text-sky-800",
  psychic: "bg-pink-200 text-pink-800",
  bug: "bg-lime-200 text-lime-800",
  rock: "bg-stone-200 text-stone-800",
  ghost: "bg-indigo-200 text-indigo-800",
  dragon: "bg-violet-200 text-violet-800",
  dark: "bg-slate-300 text-slate-900",
  steel: "bg-zinc-200 text-zinc-800",
  fairy: "bg-rose-200 text-rose-800",
};

const contenedor = document.getElementById("resultado");
const buscador = document.getElementById("buscador");

function crearTarjeta(pokemon) {
  const { nombre, imagen, tipos } = pokemon;
  const img = imagen ?? "https://via.placeholder.com/96?text=?";
  const [principal] = tipos;
  const colorPrincipal =
    coloresTipo[principal] ?? "bg-slate-200 text-slate-700";
  const badges = tipos
    .map(function (tipo) {
      const color = coloresTipo[tipo] ?? "bg-slate-200 text-slate-700";

      return `
      <span class="text-xs px-2 py-1 rounded-full ${color}">
        ${tipo}
      </span>
    `;
    })
    .join("");

  const articulo = document.createElement("article");
  articulo.className = "bg-white rounded-xl shadow p-4 text-center";
  articulo.innerHTML = `
    <img src="${img}" alt="${nombre}" class="w-24 h-24 mx-auto">
    <h2 class="capitalize font-bold text-slate-800 mt-2">${nombre}</h2>
    <p class="mt-2 text-sm font-medium text-slate-600">
      Tipo principal:
      <span class="inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold capitalize ${colorPrincipal}">
        ${principal}
      </span>
    </p>
    <div class="flex gap-1 justify-center mt-2 flex-wrap">${badges}</div>
  `;
  return articulo;
}

function adaptarPokemon(data) {
  return {
    nombre: data.name,
    imagen:
      data.sprites?.front_default ?? "https://via.placeholder.com/96?text=?",
    tipos: data.types.map((t) => t.type.name),
  };
}

function render(lista) {
  contenedor.innerHTML = "";
  lista.forEach(function (pokemon) {
    const tarjeta = crearTarjeta(pokemon);
    contenedor.appendChild(tarjeta);
  });
}

async function obtenerPokemon(idONombre) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${idONombre}`,
  );
  return response.json();
}

async function cargarPokedex() {
  const nombres = [
    "bulbasaur",
    "charmander",
    "squirtle",
    "pikachu",
    "jigglypuff",
    "gengar",
  ];
  const datos = await Promise.all(nombres.map(obtenerPokemon)); // varios en paralelo, con await
  pokedex = datos.map(adaptarPokemon);
  render(pokedex);
}

cargarPokedex();

contenedor.innerHTML = `
  <div class="col-span-full flex flex-col items-center justify-center py-10">
    <div
      class="w-12 h-12 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin"
    ></div>
    <p class="mt-4 text-slate-500 font-medium">
      Cargando Pokédex...
    </p>
  </div>
`;

buscador.addEventListener("input", function () {
  const texto = buscador.value.toLowerCase();
  const filtrados = pokedex.filter((p) => p.nombre.includes(texto));
  render(filtrados);
});
