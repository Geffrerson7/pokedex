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
const boton = document.getElementById("btn-buscar");
const mensaje = document.getElementById("mensaje");
const spinner = document.getElementById("spinner");

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
        <span
          class="
            px-3
            py-1
            rounded-full
            text-xs
            font-semibold
            tracking-wide
            shadow-md
            transition
            duration-300
            hover:scale-110
            ${color}
          "
        >
          ${tipo}
        </span>
      `;
    })
    .join("");

  const articulo = document.createElement("article");
  articulo.className = `
    group
    bg-white/10
    backdrop-blur-xl
    border
    border-white/20
    rounded-3xl
    p-4
    md:p-5
    text-center
    shadow-xl
    transition-transform transition-shadow
    duration-500
    hover:scale-[1.02]
    hover:-translate-y-1
    hover:shadow-cyan-500/20
    `;

  articulo.innerHTML = `
  <img src="${img}" alt="${nombre}" class="w-28 h-28 mx-auto drop-shadow-2xl">
  <h2
    class="
      capitalize
      text-2xl
      font-black
      bg-gradient-to-r
      from-cyan-300
      via-white
      to-purple-300
      bg-clip-text
      text-transparent
    "
  >
    ${nombre}
  </h2>

  <div class="mt-4">
    <p
      class="
        text-xs
        uppercase
        tracking-[0.2em]
        text-slate-400
        mb-2
      "
    >
      Tipo principal
    </p>

    <span
      class="
        inline-flex
        items-center
        justify-center
        px-5
        py-2
        rounded-full
        text-sm
        font-bold
        capitalize
        shadow-lg
        ring-2
        ring-white/20
        ${colorPrincipal}
      "
    >
      ${principal}
    </span>
  </div>

  <div class="mt-5">
    <p
      class="
        text-xs
        uppercase
        tracking-[0.2em]
        text-slate-400
        mb-2
      "
    >
      Tipos
    </p>

    <div
      class="
        flex
        gap-2
        justify-center
        flex-wrap
      "
    >
      ${badges}
    </div>
  </div>
`;
  return articulo;
}

function adaptarPokemon(data) {
  return {
    nombre: data.name,
    imagen:
      data.sprites?.front_default ?? "https://via.placeholder.com/96?text=?",
    tipos: data.types.map((t) => t.type.name),
    stats: data.stats.map((s) => ({ nombre: s.stat.name, valor: s.base_stat })),
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

  if (!response.ok) {
    throw new Error(`No se encontró "${idONombre}"`);
  }

  return response.json();
}

async function cargarPokedex() {
  spinner.classList.remove("hidden");
  try {
    const nombres = [
      "bulbasaur",
      "charmander",
      "squirtle",
      "pikachu",
      "jigglypuff",
      "gengar",
    ];
    const datos = await Promise.all(nombres.map(obtenerPokemon));
    pokedex = datos.map(adaptarPokemon);
    render(pokedex);
  } catch (error) {
    mensaje.textContent = "No se pudo cargar la Pokédex.";
    mensaje.classList.remove("hidden");
  } finally {
    spinner.classList.add("hidden");
  }
}

cargarPokedex();

contenedor.innerHTML = `
  <div
    class="
      col-span-full
      flex
      flex-col
      items-center
      justify-center
      py-16
    "
  >
    <div class="relative w-20 h-20">
      <div
        class="
          absolute
          inset-0
          rounded-full
          border-4
          border-slate-700
        "
      ></div>

      <div
        class="
          absolute
          inset-0
          rounded-full
          border-4
          border-transparent
          border-t-cyan-400
          animate-spin
        "
      ></div>

      <div
        class="
          absolute
          inset-3
          rounded-full
          border-2
          border-transparent
          border-t-purple-400
          animate-spin
        "
        style="animation-direction: reverse;"
      ></div>
    </div>

    <p
      class="
        mt-6
        text-sm
        uppercase
        tracking-[0.3em]
        text-slate-400
      "
    >
      Escaneando Pokédex...
    </p>
  </div>
`;

async function buscarPokemon(nombre) {
  const data = await obtenerPokemon(nombre.toLowerCase());
  return adaptarPokemon(data);
}

function capturar(pokemon) {
  if (!pokedex.some((p) => p.nombre === pokemon.nombre)) {
    pokedex.push(pokemon);
  }
  render(pokedex);
  buscador.value = "";
}

function mostrarResultado(pokemon) {
  const tarjeta = crearTarjeta(pokemon);

  const stats = document.createElement("div");
  stats.className =
    "mt-5 p-4 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-md";

  stats.innerHTML = pokemon.stats
    .map((s) => {
      const porcentaje = Math.min(s.valor, 100);

      return `
        <div class="mb-3">
          <div class="flex justify-between items-center mb-1">
            <span class="capitalize text-slate-300 text-xs tracking-wide">
              ${s.nombre}
            </span>

            <span class="font-bold text-cyan-300 text-xs">
              ${s.valor}
            </span>
          </div>

          <div class="h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              class="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-transform transition-shadow duration-700"
              style="width:${porcentaje}%"
            ></div>
          </div>
        </div>
      `;
    })
    .join("");

  tarjeta.appendChild(stats);

  const boton = document.createElement("button");

  boton.textContent = "⚡ Capturar";

  boton.className = `
    mt-5
    w-full
    py-3
    rounded-2xl
    font-bold
    text-white
    bg-gradient-to-r
    from-cyan-600
    to-blue-700
    shadow-lg
    shadow-cyan-900/30
    transition-transform transition-shadow
    duration-300
    hover:scale-[1.02]
    hover:shadow-cyan-500/20
    active:scale-[0.98]
  `;

  boton.addEventListener("click", () => capturar(pokemon));

  tarjeta.appendChild(boton);

  contenedor.innerHTML = "";
  contenedor.appendChild(tarjeta);
}

async function mostrarBusqueda(nombre) {
  spinner.classList.remove("hidden");
  mensaje.classList.add("hidden");

  try {
    const pokemon = await buscarPokemon(nombre);
    mostrarResultado(pokemon);
  } catch (error) {
    mensaje.textContent = error.message;
    mensaje.classList.remove("hidden");
  } finally {
    spinner.classList.add("hidden");
  }
}

boton.addEventListener("click", function () {
  const nombre = buscador.value.trim();
  if (nombre !== "") mostrarBusqueda(nombre);
});

buscador.addEventListener("keydown", function (event) {
  if (event.key === "Enter") boton.click();
});

let offset = 0;

async function cargarMas() {
  const respuesta = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=12&offset=${offset}`,
  );
  const lista = await respuesta.json();

  const datos = await Promise.all(
    lista.results.map((item) => fetch(item.url).then((r) => r.json())),
  );

  datos.map(adaptarPokemon).forEach(function (pokemon) {
    if (!pokedex.some((p) => p.nombre === pokemon.nombre)) {
      pokedex.push(pokemon);
    }
  });

  offset += 12;
  render(pokedex);
}

document.getElementById("cargar-mas").addEventListener("click", cargarMas);
