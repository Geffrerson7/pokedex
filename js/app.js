const pokemonLocal = [
  {
    nombre: "bulbasaur",
    imagen:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    tipos: ["grass", "poison"],
  },
  {
    nombre: "charmander",
    imagen:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    tipos: ["fire"],
  },
  {
    nombre: "squirtle",
    imagen:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    tipos: ["water"],
  },
  {
    nombre: "pikachu",
    imagen:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    tipos: ["electric"],
  },
  {
    nombre: "jigglypuff",
    imagen:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png",
    tipos: ["normal", "fairy"],
  },
  {
    nombre: "gengar",
    imagen:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
    tipos: ["ghost", "poison"],
  },
];

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
    <div class="flex gap-1 justify-center mt-2 flex-wrap">${badges}</div>
  `;
  return articulo;
}

function render(lista) {
  contenedor.innerHTML = "";
  lista.forEach(function (pokemon) {
    const tarjeta = crearTarjeta(pokemon);
    contenedor.appendChild(tarjeta);
  });
}

buscador.addEventListener("input", function () {
  const texto = buscador.value.toLowerCase();
  const filtrados = pokemonLocal.filter((p) => p.nombre.includes(texto));
  render(filtrados);
});

render(pokemonLocal);
