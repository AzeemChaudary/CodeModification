
const endpoint = 'http://localhost:3000'

async function getCharacters() {
  const res = await fetch(`${endpoint}/artists`);
  const data = await res.json();
  console.log(data);
  return data;
}
async function createCharacter(
  name,
  image,
  birth,
  genres,
  labels,
  website,
  shortDescription) {
  console.log("createCharacter")
  console.log(event)
  // event.preventDefault();
  // const form = event.target;
  // const name = form.name.value;
  // const birth = form.birth.value;
  // const genres = form.genres.value;
  // const label = form.label.value;
  // const image = form.image.value;
  // const website = form.website.value;
  // const shortDescription = form.shortDescription.value;

  console.log(name , birth , genres , website)
  const newCharacter = {
    name:name ,
    birth:birth ,
    genres : genres,
    label:labels,
    image:image,
    website:website,
    shortDescription : shortDescription,
  };
  console.log(newCharacter);
  const characterJson = JSON.stringify(newCharacter);
  const response = await fetch(`${endpoint}/artists`, {
    method: "POST",
    body: characterJson,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status==200) {
    return 200
  }else {
    throw new Error("Failed to create artist"); // Handle the error
  }
}

async function updateCharacter( id,
  name,
  image,
  birth,
  genres,
  labels,
  website,
  shortDescription,
  ) {
  
 

  const updatedCharacter = {
    name:name ,
    birth:birth ,
    genres : genres,
    label:labels,
    image:image,
    website:website,
    shortDescription : shortDescription,
  };
  const upCharacterJson = JSON.stringify(updatedCharacter);
  const response = await fetch(`${endpoint}/artists/${id}`, {
    method: "PUT",
    body: upCharacterJson,
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status==200) {
    return 200;
    // getCharacters();
    // alert("ARTIST UPDATED!");
  }else {
    throw new Error("Failed to Update artist"); // Handle the error
  }
}

 async function deleteCharacter(id) {
  const response = await fetch(`${endpoint}/artists/${id}`, {
    method: "DELETE",
  });
  if (response.status==200) {
    return 200;    alert("ARTIST DELETED!");
  }else {
    throw new Error("Failed to create artist"); // Handle the error
  }
}

async function markFavourite(id){
  const updatedCharacter = {
    isFavorite:true
  };
  
  
  const upCharacterJson = JSON.stringify(updatedCharacter);

const response=await fetch(`${endpoint}/favouriteArtists/${id}`, {
  method: "PUT",
  body: upCharacterJson,
  headers: {
    "Content-Type": "application/json",
  }
}
)
if (response.status==200) {
  return 200;
  
}else {
  throw new Error("Failed to Markthe Artist as Favourite"); // Handle the error
}
}

export { getCharacters, createCharacter, updateCharacter, deleteCharacter , markFavourite };
