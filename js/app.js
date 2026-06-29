let pokedex = [];
let ultimaBusqueda = "";

const MAX_STAT = 255;

// Colores hex por tipo para el sistema de color dinámico
const coloresTipo = {
  normal: { a: "#9098A1", b: "#B8BEC5", glow: "rgba(144,152,161,0.20)" },
  fire: { a: "#FF6B35", b: "#FF8C42", glow: "rgba(255,107,53,0.25)" },
  water: { a: "#3A9BD5", b: "#5BC4F5", glow: "rgba(58,155,213,0.25)" },
  electric: { a: "#D4A017", b: "#F5C542", glow: "rgba(212,160,23,0.25)" },
  grass: { a: "#3DAA58", b: "#5CC96B", glow: "rgba(61,170,88,0.25)" },
  ice: { a: "#4DC8D8", b: "#7DE8F5", glow: "rgba(77,200,216,0.25)" },
  fighting: { a: "#C84B31", b: "#E06040", glow: "rgba(200,75,49,0.25)" },
  poison: { a: "#9B4DCA", b: "#B56FE0", glow: "rgba(155,77,202,0.25)" },
  ground: { a: "#B8860B", b: "#D4A843", glow: "rgba(184,134,11,0.25)" },
  flying: { a: "#5BA3D9", b: "#80C0F0", glow: "rgba(91,163,217,0.25)" },
  psychic: { a: "#DE4F8E", b: "#F578B0", glow: "rgba(222,79,142,0.25)" },
  bug: { a: "#6A9B1E", b: "#8BC34A", glow: "rgba(106,155,30,0.25)" },
  rock: { a: "#8B7355", b: "#A89070", glow: "rgba(139,115,85,0.25)" },
  ghost: { a: "#6B52AE", b: "#9A7FD4", glow: "rgba(107,82,174,0.25)" },
  dragon: { a: "#4A47A3", b: "#7B78D4", glow: "rgba(74,71,163,0.25)" },
  dark: { a: "#4A4040", b: "#706060", glow: "rgba(74,64,64,0.20)" },
  steel: { a: "#6D7F8F", b: "#9AB0C0", glow: "rgba(109,127,143,0.20)" },
  fairy: { a: "#D4527A", b: "#F07AA0", glow: "rgba(212,82,122,0.25)" },
};

function getColor(tipo) {
  return (
    coloresTipo[tipo] ?? {
      a: "#6B7280",
      b: "#9CA3AF",
      glow: "rgba(107,114,128,0.20)",
    }
  );
}

const contenedor = document.getElementById("resultado");
const buscador = document.getElementById("buscador");
const botonBuscar = document.getElementById("btn-buscar");
const mensaje = document.getElementById("mensaje");
const textoMensaje = document.getElementById("texto-mensaje");
const botonReintentar = document.getElementById("btn-reintentar");
const spinner = document.getElementById("spinner");
const botonCargar = document.getElementById("cargar-mas");

// ─── CREAR TARJETA BASE (sin botón capturar) ─────────────────────────────────
function crearTarjeta(pokemon) {
  const { nombre, imagen, tipos, id } = pokemon;
  const img = imagen ?? "https://via.placeholder.com/96?text=?";
  const [principal] = tipos;
  const color = getColor(principal);
  const numPad = id ? `#${String(id).padStart(3, "0")}` : "";

  const articulo = document.createElement("article");
  articulo.className = "poke-card";
  articulo.style.cssText = `--type-a:${color.a}; --type-b:${color.b};`;
  articulo.style.boxShadow = `0 0 0 transparent`;

  // Hover glow dinámico
  articulo.addEventListener("mouseenter", () => {
    articulo.style.boxShadow = `0 20px 40px ${color.glow}, 0 4px 12px rgba(0,0,0,0.12)`;
  });
  articulo.addEventListener("mouseleave", () => {
    articulo.style.boxShadow = `0 0 0 transparent`;
  });

  const typesBadges = tipos
    .map(
      (tipo, i) =>
        `<span class="poke-type-badge${i > 0 ? " poke-type-badge--secondary" : ""}" style="background:${getColor(tipo).a}">${tipo}</span>`,
    )
    .join("");

  const statsHTML = pokemon.stats
    .map((s) => {
      const pct = Math.round((s.valor / MAX_STAT) * 100);
      const nombreCorto =
        {
          hp: "HP",
          attack: "Ataque",
          defense: "Defensa",
          "special-attack": "Sp.Atq",
          "special-defense": "Sp.Def",
          speed: "Veloc.",
        }[s.nombre] ?? s.nombre;
      return `
        <div class="poke-stat-row">
          <span class="poke-stat-row__name">${nombreCorto}</span>
          <span class="poke-stat-row__val">${s.valor}</span>
          <div class="poke-stat-bar-bg">
            <div class="poke-stat-bar-fill" style="width:${pct}%"></div>
          </div>
        </div>`;
    })
    .join("");

  articulo.innerHTML = `
    <div class="poke-card__splash"></div>
    <div class="poke-card__orb"></div>

    <div class="poke-card__header">
      <span class="poke-card__number">${numPad}</span>
      <div class="poke-card__types">${typesBadges}</div>
    </div>

    <div class="poke-card__img-wrap">
      <img class="poke-card__img" src="${img}" alt="${nombre}" loading="lazy">
      <div class="poke-card__img-shadow"></div>
    </div>

    <p class="poke-card__name">${nombre}</p>

    <div class="poke-card__stats">${statsHTML}</div>
  `;

  return articulo;
}

function adaptarPokemon(data) {
  return {
    id: data.id,
    nombre: data.name,
    imagen:
      data.sprites?.front_default ?? "https://via.placeholder.com/96?text=?",
    tipos: data.types.map((t) => t.type.name),
    stats: data.stats.map((s) => ({ nombre: s.stat.name, valor: s.base_stat })),
  };
}

function render(lista) {
  botonCargar.classList.remove("hidden");
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

  if (response.status === 404) return null;

  if (!response.ok) throw new Error(`No se encontró "${idONombre}"`);

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
    textoMensaje.textContent = "No se pudo cargar la Pokédex.";
    mensaje.classList.remove("hidden");
    botonCargar.classList.add("hidden");
    botonReintentar.classList.add("hidden");
  } finally {
    spinner.classList.add("hidden");
  }
}

cargarPokedex();

async function buscarPokemon(nombre) {
  const data = await obtenerPokemon(nombre.toLowerCase());
  if (data === null) return null;
  return adaptarPokemon(data);
}

function capturar(pokemon) {
  if (!pokedex.some((p) => p.nombre === pokemon.nombre)) {
    pokedex.push(pokemon);
  }
  render(pokedex);
  buscador.value = "";
}

// ─── RESULTADO DE BÚSQUEDA (con botón capturar original) ─────────────────────
function mostrarResultado(pokemon) {
  const tarjeta = crearTarjeta(pokemon);

  const btnCapturar = document.createElement("button");

  btnCapturar.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="w-5 h-5">
      <circle cx="32" cy="32" r="30" fill="#ffffff"/>
      <path d="M2 32a30 30 0 0 1 60 0H2z" fill="#ef4444"/>
      <circle cx="32" cy="32" r="8" fill="#fff" stroke="#111827" stroke-width="3"/>
      <path d="M2 32h60" stroke="#111827" stroke-width="4"/>
      <circle cx="32" cy="32" r="3" fill="#d1d5db"/>
      <circle cx="32" cy="32" r="30" fill="none" stroke="#111827" stroke-width="3"/>
    </svg>
    <span>Capturar</span>
  `;

  btnCapturar.className = `
    mt-5
    w-full
    flex
    items-center
    justify-center
    gap-2
    py-2.5
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

  btnCapturar.addEventListener("click", () => capturar(pokemon));
  tarjeta.appendChild(btnCapturar);

  botonCargar.classList.add("hidden");

  contenedor.innerHTML = "";
  contenedor.appendChild(tarjeta);
}

async function mostrarBusqueda(nombre) {
  ultimaBusqueda = nombre;

  spinner.classList.remove("hidden");
  mensaje.classList.add("hidden");
  botonReintentar.classList.add("hidden");

  try {
    const pokemon = await buscarPokemon(nombre);

    if (pokemon === null) {
      contenedor.innerHTML = `
        <div class="col-span-full py-12 text-center">
          <h2 class="text-2xl font-bold text-slate-200">No se encontró "${nombre}"</h2>
          <p class="mt-2 text-slate-400">Intenta buscar otro Pokémon.</p>
        </div>
      `;

      botonCargar.classList.add("hidden");
      return;
    }

    mostrarResultado(pokemon);

    botonReintentar.classList.add("hidden");
  } catch (error) {
    textoMensaje.textContent = error.message;
    mensaje.classList.remove("hidden");
    botonReintentar.classList.remove("hidden");
  } finally {
    spinner.classList.add("hidden");
  }
}

botonBuscar.addEventListener("click", function () {
  const nombre = buscador.value.trim();
  if (nombre !== "") mostrarBusqueda(nombre);
});

buscador.addEventListener("keydown", function (event) {
  if (event.key === "Enter") botonBuscar.click();
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

botonReintentar.addEventListener("click", () => {
  if (ultimaBusqueda !== "") {
    buscador.value = ultimaBusqueda;
    mostrarBusqueda(ultimaBusqueda);
  }
});
