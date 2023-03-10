// fetch api spiegazione ed esempi

// prendiamo i personaggi di futurama!

// https://api.sampleapis.com/futurama/

// available endpoints: [characters, epidoses, questions, inventory]

/*******************************/

//https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript

String.prototype.hashCode = function () {
  var hash = 0,
    i,
    chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

/*********************************/

const BASE_URL = "https://api.sampleapis.com/futurama/";

async function getResource(resource) {
  const results = await fetch(BASE_URL + resource);
  return await results.json();
}

function createCharacter(data) {
  /*
  name, image, sayings:Array
  */

  console.log(data.image);

  this.name = { last: data.name };
  this.images = { main: data.image };
  this.sayings = data.sayings;
  this.local = true;
  this.id = data.name.hashCode();
}

class Characters {
  localStorageKey = "localCharacters";
  characters = [];
  filters = [];
  favorite = [];
  originalCharacters = [];
  localStorageCharacters = JSON.parse(
    localStorage.getItem(this.localStorageKey) ?? "[]"
  );
  addCharacter = false;

  constructor(characters = []) {
    this.originalCharacters = characters;
    this.characters = characters.concat(this.localStorageCharacters);
    this.filters = this.characters;
    this.favorite = JSON.parse(localStorage.getItem("_favorite") ?? "[]");
  }

  toggleAddCharacter() {
    this.addCharacter = !this.addCharacter;

    if (this.addCharacter) this.addToStorage();

    this.render();
  }

  getTemplate() {
    return `
    <div class="rounded overflow-hidden">
        <div>
            <img src="{{image}}" class="max-h-[150] m-auto" />
        </div>
        <div class="p-4 grid gap-2">
            <p class="font-bold text-zinc-800">{{name}}</p>
            <button type="button" class="rounded-md bg-indigo-600 py-1.5 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 say" data-id="{{id}}">Get Random saying!</button>
            <button type="button" class="rounded-md py-1.5 px-3.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 togglefavorite {{favorite_classes}}" data-id="{{id}}">{{favorite_label}}</button>
            {{localPlaceholder}}
        </div>
    </div>
    `;
  }
  isFavorite(id) {
    return this.favorite.includes(id);
  }

  addCharacterTemplate() {
    const template = `<div class="rounded overflow-hidden {{addCharacterPlaceholder}}">
      <div>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/OOjs_UI_icon_add.svg/1200px-OOjs_UI_icon_add.svg.png"
          class="max-h-[150] m-auto"
        />
      </div>
      <div class="p-4 grid gap-2">
        <p class="font-bold text-zinc-800">New Character</p>
        <button
          type="button"
          class="rounded-md bg-indigo-600 py-1.5 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 say"
          id="addCharacter">
          Add Character
        </button>
      </div>
    </div>
    <div class="rounded overflow-hidden" {{formPlaceholder}}>
          <div>
            <div class="mb-6">
              <input
                type="text"
                id="name"
                class="border border-gray-300 my-4 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 "
                placeholder="Character name"
                required />
                <input
                type="url"
                id="image"
                class="border border-gray-300 my-4 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 "
                placeholder="Image Url"
                required />
                <input
                type="text"
                id="sayings"
                class="border border-gray-300 my-4 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 "
                placeholder="Add all the sayings separated by a coma"
                required />
            </div>
          </div>
          <div class="p-4 grid gap-2">
            <button
              type="button"
              class="rounded-md bg-indigo-600 py-1.5 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 say"
              id="submitForm">
              Add character
            </button>
          </div>
        </div> `;
    return template
      .replaceAll(
        "{{addCharacterPlaceholder}}",
        !this.addCharacter ? "" : "hidden"
      )
      .replaceAll("{{formPlaceholder}}", this.addCharacter ? "" : "hidden");
  }

  removeLocalButtonTemplate(id) {
    return `<button type="button" class="removeLocal rounded-md py-1.5 px-3.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-red-600 hover:bg-red-500 focus-visible:outline-red-600" data-id="${id}">Remove from local</button>`;
  }

  getHtml() {
    if (this.characters.length === 0)
      throw new Error(
        "No chaarcters loaded, instantiate constructor with data first"
      );
    const html = [];
    this.filters.forEach((character) => {
      const favorite_label = this.isFavorite(character.id)
        ? "Remove from favorite"
        : "Add to favorite";
      const favorite_classes = this.isFavorite(character.id)
        ? "bg-red-600 hover:bg-red-500 focus-visible:outline-red-600"
        : "bg-fuchsia-600 hover:bg-fuchsia-500 focus-visible:outline-fuchsia-600";

      html.push(
        this.getTemplate()
          .replaceAll("{{image}}", character.images.main)
          .replaceAll("{{name}}", character.name.last)
          .replaceAll("{{id}}", character.id)
          .replaceAll("{{favorite_label}}", favorite_label)
          .replaceAll("{{favorite_classes}}", favorite_classes)
          .replace(
            "{{localPlaceholder}}",
            character.local ? this.removeLocalButtonTemplate(character.id) : ""
          )
      );
    });

    html.push(this.addCharacterTemplate());

    return html.join("");
  }
  getRandomSayingById(id) {
    const character = this.characters.filter((char) => char.id === id);
    const { sayings } = character[0];
    const randomPosition = Math.floor(Math.random() * sayings.length);
    return sayings[randomPosition];
  }
  toggleFavorite(id) {
    if (this.favorite.includes(id))
      this.favorite = this.favorite.filter((f) => f !== parseInt(id));
    else this.favorite.push(id);
    this.updateFavorite(this.favorite);
  }
  updateFavorite(favorite) {
    localStorage.setItem("_favorite", JSON.stringify(favorite));
    this.render();
  }
  keyupEvent = () => {
    const searchEl = document.getElementById("charSearch");
    const text = searchEl.value;
    this.filters = this.characters.filter((char) =>
      char.name.last.toLowerCase().startsWith(text)
    );
    if (text === "") this.filters = this.characters;
    this.render();
  };
  render() {
    console.log("rendering")
    document.getElementById("characters").innerHTML = this.getHtml();
    document.querySelectorAll(".say").forEach((el) => {
      el.addEventListener("click", () => {
        const id = parseInt(el.getAttribute("data-id"));
        alert(this.getRandomSayingById(id));
      });
    });
    document.querySelectorAll(".togglefavorite").forEach((el) => {
      el.addEventListener("click", () => {
        const id = parseInt(el.getAttribute("data-id"));
        this.toggleFavorite(id);
      });
    });

    document.querySelectorAll(".removeLocal").forEach((el) => {
      el.addEventListener("click", () => {
        const id = parseInt(el.getAttribute("data-id"));
        this.removeFromStorage(id);
      });
    });

    document.getElementById("searchContainer").style = "display:block";
    const searchEl = document.getElementById("charSearch");
    searchEl.removeEventListener("keyup", this.keyupEvent);
    searchEl.addEventListener("keyup", this.keyupEvent);

    document.getElementById("addCharacter").addEventListener("click", () => {
      this.toggleAddCharacter();
    });
    document.getElementById("submitForm").addEventListener("click", () => {
      this.addToStorage();
    });
  }

  markInputAsError(el) {
    console.log(el);

    el.classList.add("bg-red-600", "text-white", "dark:placeholder-white");
    el.classList.remove("dark:placeholder-gray-400", "text-gray-900");
  }

  unMarkInputAsError(el) {
    el.classList.remove("bg-red-600", "text-white", "dark:placeholder-white");
    el.classList.add("dark:placeholder-gray-400", "text-gray-900");
  }

  removeFromStorage(id) {
    this.localStorageCharacters = this.localStorageCharacters.filter(
      (el) => el.id !== id
    );
    this.characters = this.originalCharacters.concat(this.localStorageCharacters);

    console.log(this.characters, this.localStorageCharacters);

    localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(this.localStorageCharacters)
    );

    this.keyupEvent();
  }

  //"[{"name":{"last":"lollo"},"images":{"main":"https://i.ytimg.com/vi/1Rge8eUdMlA/hqdefault.jpg"},"sayings":["son vivo e vegeto","barcollo ma non mollo","Ho trovato la mia vita ","Mej nu piatt e maccarun le carotine gli spinaci k m n'aggia fà"],"local":true,"id":103154316},{"name":{"last":"lucio"},"images":{"main":"https://i.ytimg.com/vi/aOLynl-Yxo4/hqdefault.jpg"},"sayings":["a me mi piace la nutella","Semplicemente... me piace 'a Nutella","Devo dimagrire 10 kili perché sono ingrassato un pò","L'insalatina non mi piace","Mej nu piatt e maccarun le carotine gli spinaci k m n'aggia fà"],"local":true,"id":103324320}]"

  addToStorage() {
    console.log("adding");
    const newName = document.getElementById("name");
    const newSayings = document.getElementById("sayings");
    const newImage = document.getElementById("image");
    let error = false;

    console.log(newImage.value);

    if (newImage.value === "") {
      error = true;
      this.markInputAsError(newImage);
    } else {
      this.unMarkInputAsError(newImage);
    }

    if (newName.value === "") {
      error = true;
      this.markInputAsError(newName);
    } else {
      this.unMarkInputAsError(newName);
    }
    if (newSayings.value === "") {
      error = true;
      this.markInputAsError(newSayings);
    } else {
      this.unMarkInputAsError(newSayings);
    }

    if (error) return;

    /*if (
      newImage.value !== "" &&
      newName.value !== "" &&
      newSayings.value !== ""
    ) */

    if (
      this.characters.some(
        (el) => el.name.last.toLowerCase() === newName.value.toLowerCase()
      )
    ) {
      alert("Character already existing");
      console.log("can't");
      this.markInputAsError(newName);
      return;
    }

    const newCharacter = new createCharacter({
      name: newName.value,
      sayings: newSayings.value.split(","),
      image: newImage.value,
    });

    this.localStorageCharacters.push(newCharacter);
    this.characters.push(newCharacter);

    console.log("saving");

    localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(this.localStorageCharacters)
    );

    this.toggleAddCharacter();

    /*
  name, image, sayings:Array
  */
  }
}

getResource("characters").then((characters) => {
  const charactersObject = new Characters(characters);
  charactersObject.render();
});
