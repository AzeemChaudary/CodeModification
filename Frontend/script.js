import {
  getCharacters,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  markFavourite
} from "./rest-service.js";
import { searchByName } from "./helpers.js";
const endpoint = 'http://localhost:3000'

window.addEventListener("load", initApp);

let artists;

async function initApp() {
  artists = await getCharacters();
  updateCharactersGrid();
  document
    .querySelector("#btn-create-character")
    .addEventListener("click", (event) =>showCreateCharacterDialog(event));
  document
    .querySelector("#form-create-character")
    .addEventListener("submit",(event) => createCharacterClicked(event));


  document
    .querySelector("#form-update-character .btn-cancel")
    .addEventListener("click", (event) =>cancelUpdate(event));

  document
    .querySelector("#form-create-character .btn-cancel")
    .addEventListener("click", (event) =>cancelCreate(event));

  document
    .querySelector("#form-update-character")
    .addEventListener("submit", (event) =>updateCharacterClicked(event));

    document
    .querySelector("#form-update-character")
    .addEventListener("click", (event) =>MarkFavouriteClicked(event));

  document
    .querySelector("#sortbyselect")
    .addEventListener("change", (event) =>searchByName(event));
  document
    .querySelector("#input-search")
    .addEventListener("input", (event) =>searchByName(event));
  document
    .querySelector("#filter-bar")
    .addEventListener("change", (event) =>searchByName(event));
}

function cancelCreate(event) {
  event.preventDefault();
  document.querySelector("#dialog-create-character").close();
}

function cancelUpdate(event) {
  event.preventDefault();
  console.log("Cancel update button clicked!");
  document.querySelector("#dialog-update-character").close();
}

function updateClicked(characterObject) {
  //saves the form in as a variable so easier to use below
  const updateForm = document.querySelector("#form-update-character");

  //the following makes info from object be displayed in the ModalWindow to provide
  //Feedback to the user

  //sets value of the form title to that of the object.

  updateForm.name.value = characterObject.name;
  updateForm.image.value = characterObject.image;
  updateForm.birth.value = characterObject.birth;
  updateForm.genres.value = characterObject.genres;
  updateForm.labels.value = characterObject.labels;
  updateForm.website.value = characterObject.website;
  updateForm.shortDescription.value = characterObject.shortDescription;

  //sets the id of the form to the id for the specific object
  updateForm.setAttribute("data-id", characterObject.id);

  //shows the update form
  document.querySelector("#dialog-update-character").showModal();

  console.log("Update button clicked!");
}
// }

async function createCharacterClicked(event) {
  console.log("createCharacterClicked")
  event.preventDefault();
  const form = document.querySelector("#form-create-character");
  const name = form.characterName.value;
  const image = form.characterImage.value;
  const birth = form.characterBirth.value;
  const genres = form.genres.value;
  const labels = form.labels.value;
  const website = form.website.value;
  const shortDescription = form.shortDescription.value;
console.log("name" + name)
console.log(image , birth , genres , labels , website , shortDescription)


  const response = await createCharacter(
    name,
    image,
    birth,
    genres,
    labels,
    website,
    shortDescription
  );
  console.log("response" + response)
  if (response==200) {
    document.querySelector("#dialog-create-character").close();
    updateCharactersGrid();
    form.reset();
    hideErrorMessage();
    alert("ARTIST CREATED!");
     await getCharacters();
    // event.target.parentNode.close();
  } else {
    console.log(response.status, response.statusText);
    showErrorMessage("Something went wrong. Please try again");
  }
}

async function updateCharacterClicked(event) {
  event.preventDefault();
  const form = document.querySelector("#form-update-character");
  // extract the values from inputs in the form
  const name = form.name.value;
  const image = form.image.value;
  const birth = form.birth.value;
  const genres = form.genres.value;
  const labels = form.labels.value;
  const website = form.website.value;
  const shortDescription = form.shortDescription.value;

  //gets the id of the post
  const id = form.getAttribute("data-id");

  //puts in data from from passes it to updateCharacter
  const response = await updateCharacter(
    id,
    name,
    image,
    birth,
    genres,
    labels,
    website,
    shortDescription
  ); //match the parameters in updatepost!!!
  if (response==200) {
    document.querySelector("#dialog-update-character").close();
    updateCharactersGrid();
    alert("ARTIST UPDATED!");
    await getCharacters();
    console.log("Update Character button clicked!");
  } else {
    console.log(response.status, response.statusText);
    showErrorMessage("Something went wrong. Please try again");
    event.target.parentNode.close();
  }
}

function deleteCharacterClicked(characterObject) {
  console.log(characterObject);
  document.querySelector("#dialog-delete-character-title").textContent =
    characterObject.name;
  document.querySelector("#dialog-delete-character").showModal();
  document
    .querySelector("#form-delete-character")
    .addEventListener("submit", () =>
      deleteCharacterConfirm(characterObject.id)
    );
  document
    .querySelector("#cancelDelete")
    .addEventListener("click", (event) => cancelDeleteCharacter(event));
}

function cancelDeleteCharacter(event) {
  event.preventDefault();
  document.querySelector("#dialog-delete-character").close();
}

async function deleteCharacterConfirm(characterObject) {
  const response = await deleteCharacter(characterObject);

  if (response==200) {
    updateCharactersGrid();
    showDeleteFeedback();
    alert("ARTIST DELETED!");
  } else {
    document.querySelector("#dialog-failed-to-update").showModal();
  }
}

function showDeleteFeedback() {
  const dialog = document.getElementById("dialog-delete-feedback");
  const dialogMessage = document.getElementById(
    "dialog-delete-feedback-message"
  );
  dialogMessage.textContent;
  dialog.showModal();
  setTimeout(closeDialog, 1000);

  function closeDialog() {
    dialog.close();
  }
}

function showCreateCharacterDialog() {
  document.querySelector("#dialog-create-character").showModal();
  console.log("Create New Character button clicked!");
}

async function updateCharactersGrid() {
  artists = await getCharacters();
  searchByName(artists);
}

async function MarkFavouriteClicked(characterObject , Event){
  Event.preventDefault;
  const form = document.querySelector("#form-update-character");
  const id = form.getAttribute("data-id");

console.log("characterObject" + characterObject.id)
const response = await markFavourite(characterObject.id)
if(response==200){
  alert("ARTIST MARKED AS FAVOURITE!");
    await getCharacters();
}else{
  alert("Failed to mark the Artist as Favourite")
}
}


function showCharacters(characterList) {
  document.querySelector("#characters").innerHTML = "";
  if (characterList.length !== 0) {
    for (const character of characterList) {
      showCharacter(character);
    }
  } else {
    document.querySelector("#characters").insertAdjacentHTML(
      "beforeend",
      /*html*/ `
    <h2 id="search-error-msg"> No Artists were found. Please try again.</h2>
    `
    );
  }
}

function createStarSVG() {
  return /*html*/ `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  `;
}

function showCharacter(characterObject) {
  const html = /*html*/ `
        <article class="grid-item">
        <div class="clickable">
        <div class="image-container">    
            <img src="${characterObject.image}" />
            
            ${characterObject.isFavorite ? createStarSVG() : ''}
  </div>
            <h3></h3><b>${characterObject.name}</b></h3>
            <p>Birth: ${characterObject.birthdate}</p>
            <p>active since: ${characterObject.activeSince}</p>
            <p>Genres: ${characterObject.genres}</p>
           </div>
        
            <div class="btns">
                <button class="btn-delete">Delete</button>
                <button class="btn-update">Update</button>
                <button class="btn-favourite">Mark as Favourite</button>
            </div>
        </article>
    `;
  document.querySelector("#characters").insertAdjacentHTML("beforeend", html);

  const gridItem = document.querySelector(
    "#characters article:last-child .clickable"
  );

  gridItem.addEventListener("click", () => {
    showCharacterModal(characterObject);
  });

  document
    .querySelector("#characters article:last-child .btn-delete")
    .addEventListener("click", () => deleteCharacterClicked(characterObject));
  document
    .querySelector("#characters article:last-child .btn-update")
    .addEventListener("click", () => updateClicked(characterObject));
    document
    .querySelector("#characters article:last-child .btn-favourite")
    .addEventListener("click", () => MarkFavouriteClicked(characterObject , Event));
}

function showCharacterModal(characterObject) {
  const modal = document.querySelector("#character-modal");
  modal.querySelector("#character-image").src = characterObject.image;
  modal.querySelector("#character-name").textContent = characterObject.name;
  modal.querySelector("#character-birth").textContent = characterObject.birth;
  modal.querySelector("#character-genres").textContent = characterObject.genres;
  modal.querySelector("#character-labels").textContent = characterObject.labels;
  modal.querySelector("#character-website").textContent =characterObject.website;
    characterObject.website;
  modal.querySelector("#character-shortDescription").textContent =
    characterObject.shortDescription;

  modal.showModal();
  modal.querySelector("button").addEventListener("click", () => {
    modal.close();
  });
}

export { showCharacters, artists };
