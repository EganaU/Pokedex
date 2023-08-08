const pokemonContainer = document.querySelector(".pokemon-container");
const spinner = document.querySelector("#spinner");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
const intersectionTarget = document.querySelector("#intersection-target");
var typesdisplayed = 0;
var area = document.getElementById("filtertypearea")
var types = ["grass","fire","water","bug","normal","poison","electric","ground","fairy","fighting","psychic","rock","ghost"]


let limit = 10;
let offset = 1;

function fetchPokemon(id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then((res) => res.json())
    .then((data) => {
        createPokemon(data);
      spinner.style.display = "none";
    });
}

function fetchPokemons(offset, limit) {
  spinner.style.display = "block";
    for (let i = offset; i <= offset + limit - 1; i++) {
      fetchPokemon(i);
    }
  }


function removeChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

fetchPokemons(offset, limit);


function getTypes(types) {
  const typesContainer = document.createElement("div");
  typesContainer.classList.add("types-container");
  const type = types[0];
  const typeContainer = document.createElement("type-container")
  typeContainer.classList.add("type-container")
  var typeName = document.createElement("p");
  typeName.textContent = type.type.name;
  currenttype = type.type.name
  console.log(currenttype);
  typeContainer.appendChild(typeName);
  typesContainer.appendChild(typeContainer);
  return typesContainer ;
}

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      offset += limit;
      fetchPokemons(offset, limit);
    }
  },
  {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  }
);

observer.observe(intersectionTarget);

function createPokemon(pokemon) {

  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card-container");

  const card = document.createElement("div");
  card.classList.add("pokemon-block");

  const spriteContainer = document.createElement("div");
  spriteContainer.classList.add("img-container");

  const sprite = document.createElement("img");
  sprite.src = pokemon.sprites.front_default;

  spriteContainer.appendChild(sprite);

  const name = document.createElement("p");
  name.classList.add("name");
  name.textContent = pokemon.name;
  
   card.appendChild(spriteContainer);
   card.appendChild(name);
   card.appendChild(getTypes(pokemon.types));
   cardContainer.appendChild(card);
   pokemonContainer.appendChild(cardContainer);
  }

  const filterTypeSelect = document.getElementById("filter-type");

  filterTypeSelect.addEventListener("change", () => {
    const selectedType = filterTypeSelect.value;
    removeChildNodes(pokemonContainer); 
  
    if (selectedType === "all") {
      fetchPokemons(offset, limit);
      return;
    }
    fetch(`https://pokeapi.co/api/v2/type/${selectedType}/`)
      .then((res) => res.json())
      .then((data) => {
        const pokemonIds = data.pokemon.map((entry) => entry.pokemon.url.split("/").slice(-2, -1));
        for (const id of pokemonIds) {
          fetchPokemon(id);
        }
      });
  });

  const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

function searchPokemonByName(name) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Pokémon not found");
      }
      return res.json();
    })
    .then((data) => {
      removeChildNodes(pokemonContainer);
      createPokemon(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  if (searchTerm) {
    searchPokemonByName(searchTerm);
  }
});