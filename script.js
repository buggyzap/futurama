// fetch api spiegazione ed esempi

// prendiamo i personaggi di futurama!

// https://api.sampleapis.com/futurama/

// available endpoints: [characters, epidoses, questions, inventory]

const BASE_URL = "https://api.sampleapis.com/futurama/";

async function getResource(resource) {
  const results = await fetch(BASE_URL + resource);
  return await results.json();
}

class Characters {
  characters = [];
  filters = [];
  favorite = [];
  constructor(characters = []) {
    this.characters = characters;
    this.filters = characters;
    this.favorite = JSON.parse(localStorage.getItem("_favorite") ?? "[]");
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
        </div>
    </div>
    `;
  }
  isFavorite(id) {
    return this.favorite.includes(id);
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
      );
    });
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
    document.getElementById("searchContainer").style = "display:block";
    const searchEl = document.getElementById("charSearch");
    searchEl.removeEventListener("keyup", this.keyupEvent);
    searchEl.addEventListener("keyup", this.keyupEvent);
  }
}

getResource("characters").then((characters) => {
  const charactersObject = new Characters(characters);
  charactersObject.render();
});
