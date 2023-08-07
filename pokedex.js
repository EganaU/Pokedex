
const pokemonContainer = document.querySelector(".pokemon-container");
const spinner = document.querySelector("#spinner");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
const intersectionTarget = document.querySelector("#intersection-target");
var typesdisplayed = 0;
var area = document.getElementById("filtertypearea")

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

 function filtertype(){
  var types = ["grass","fire","water","bug","normal","poison","electric","ground","fairy","fighting","psychic","rock","ghost"]
  if(typesdisplayed==0){
      var input = document.createElement("input");
      input.innerText = "Enter the type"
      input.setAttribute("placeholder","Enter the type")
      input.setAttribute("id","type")
      var btnfiltrar = document.createElement("button");
      btnfiltrar.innerText = "Filter";
      btnfiltrar.setAttribute("onclick",filter());
      area.appendChild(input);
      area.appendChild(btnfiltrar);
      typesdisplayed = 1;
    }else{
      typesdisplayed = 0;
      area.textContent = "";
    
    }
  }
  
  function filter(){
    //var tipo = document.getElementById("type").value;
    console.log("bene");
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

  for (let i = 0; i < 1; i++) {
    const type = types[i];

    const typeContainer = document.createElement("type-container")
    typeContainer.classList.add("type-container")

    const typeName = document.createElement("p");
    typeName.textContent = type.type.name;

    typeContainer.appendChild(typeName);

    typesContainer.appendChild(typeContainer);
  }

  return typesContainer;
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
  const flipCard = document.createElement("div");
  flipCard.classList.add("pokemon-card");

  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card-container");

  flipCard.appendChild(cardContainer);

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
  card.appendChild(getTypes(pokemon.types))
 

  cardContainer.appendChild(card);
  pokemonContainer.appendChild(flipCard);
}


