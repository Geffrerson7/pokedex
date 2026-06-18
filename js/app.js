const pokemonLocal = [
  { nombre: "bulbasaur",  imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",  tipos: ["grass", "poison"] },
  { nombre: "charmander", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",  tipos: ["fire"] },
  { nombre: "squirtle",   imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",  tipos: ["water"] },
  { nombre: "pikachu",    imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png", tipos: ["electric"] },
  { nombre: "jigglypuff", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png", tipos: ["normal", "fairy"] },
  { nombre: "gengar",     imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",  tipos: ["ghost", "poison"] }
];

const contenedor = document.getElementById("resultado");

function crearTarjeta(pokemon) {
    const { nombre, imagen, tipos } = pokemon;
  const articulo = document.createElement("article");   // crea el nodo <article>
  articulo.className = "bg-white rounded-xl shadow p-4 text-center";
  articulo.innerHTML = `
    <img src="${imagen}" alt="${nombre}" class="w-24 h-24 mx-auto">
    <h2 class="capitalize font-bold text-slate-800 mt-2">${nombre}</h2>
  `;
  return articulo;
}

function render(lista) {
  contenedor.innerHTML = "";                 // 1. limpia lo anterior
  lista.forEach(function (pokemon) {
    const tarjeta = crearTarjeta(pokemon);   // 2. crea el nodo
    contenedor.appendChild(tarjeta);         // 3. lo inserta en el DOM
  });
}

render(pokemonLocal);   // ¡píntalo!