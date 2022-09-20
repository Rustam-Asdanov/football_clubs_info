const myForm = document.forms[0];
const abilityForm = document.forms[1];

myForm.addEventListener("submit", abilityData);
abilityForm.addEventListener("submit", sendData);

const formDataObj = {};

let ability_rate = {
  pace: 50,
  dribbling: 50,
  shooting: 50,
  defending: 50,
  passing: 50,
  physical: 50,
  overall: 50,
};

const headers = [
  "N",
  "fullname",
  "country",
  "club",
  "age",
  "position",
  "number",
  "image",
];
setUrl("/api/v1/player");

function abilityData(event) {
  event.preventDefault();
  const myFormData = new FormData(event.target);

  myFormData.forEach((value, key) => (formDataObj[key] = value));

  document.getElementsByClassName("ability-box")[0].classList.remove("hide");
  return false;
}

// This function control save and modify methods
function sendData(event) {
  event.preventDefault();

  formDataObj["rating"] = ability_rate;

  if (myForm["submit"].value === "Save") {
    console.log(formDataObj);
    newObject(formDataObj);
  } else if (myForm["submit"].value === "Modify") {
    modifyObject(myForm["_id"].value, formDataObj);
  }
  // myForm.reset();
  document.getElementsByClassName("ability-box")[0].classList.add("hide");
  return true;
}

document
  .querySelectorAll("div.ability-box input[type='number']")
  .forEach((elem) =>
    elem.addEventListener("keyup", (e) => {
      let overall_input = 0;
      delete ability_rate["overall"];

      ability_rate[elem.name] = Number(elem.value);
      Object.values(ability_rate).forEach((value) => {
        overall_input += value;
      });
      ability_rate["overall"] = Math.round(overall_input / 6);
      document.getElementsByName("overall")[0].value = ability_rate["overall"];
    })
  );

function randomRatingGenerate() {
  let overall_input = 0;
  delete ability_rate["overall"];
  Object.keys(ability_rate).forEach((key) => {
    ability_rate[key] = Math.round(Math.random() * 70 + 30);
    document.getElementsByName(key)[0].value = ability_rate[key];
    overall_input += ability_rate[key];
  });

  ability_rate["overall"] = Math.round(overall_input / 6);
  document.getElementsByName("overall")[0].value = ability_rate["overall"];
}

function toggleForm(btn) {
  const formBox = document.getElementsByClassName("form")[0];
  if (formBox.clientHeight > 0) {
    formBox.style.height = "0px";
    btn.src = "/img/plus.png";
  } else {
    formBox.style.height = "684px";
    btn.src = "/img/minus.png";
  }
}

let page = window.location.href.split("/").pop();
if (page == "newPlayer") {
  page = 0;
}

document.getElementById("previous-obj-btn").addEventListener("click", () => {
  if (page > 0) {
    window.open(`/newPlayer/${--page}`, "_self");
  }
});

document.getElementById("next-obj-btn").addEventListener("click", async () => {
  let message = "";
  await fetch(`/newPlayer/${++page}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => (message = data.message))
    .catch((err) => err);
  if (!message) {
    window.open(`/newPlayer/${page}`, "_self");
  } else {
    alert(message);
    page--;
  }
});

// search box
async function searchPlayer(playerName) {
  if (playerName == "") return;

  await fetch("/api/v1/player/search/" + playerName, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
}
