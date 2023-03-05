"use strict";

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];

const Student = {
  firstName: "Null",
  lastName: "Null",
  middleName: "",
  nickName: "",
  gender: "Null",
  image: "",
  house: "Null",
};

function start() {
  console.log("ready");
  loadJSON();
}

// function loadJSON() {
//   fetch("https://petlatkea.dk/2021/hogwarts/students.json")
//     .then((response) => response.json())
//     .then((jsonData) => {
//       // when loaded, prepare objects
//       prepareObjects(jsonData);
//     });
// }
async function loadJSON() {
  let [studentData, bloodData] = await Promise.all([
    fetch("https://petlatkea.dk/2021/hogwarts/students.json").then((response) =>
      response.json()
    ),
    fetch("https://petlatkea.dk/2021/hogwarts/families.json").then((response) =>
      response.json()
    ),
  ]);
  prepareObjects(studentData, bloodData);
}

function prepareObjects(studentData, bloodData) {
  studentData.forEach((jsonObject) => {
    //  we create an object based on the prototype made before
    const student = Object.create(Student);

    // we already have the some of the stuff in the JSON object, so we just assign it

    //HOUSE

    student.house = jsonObject.house.trim().toLowerCase();
    student.house =
      student.house[0].toUpperCase() + student.house.slice(1).toLowerCase();

    //GENDER

    student.gender = jsonObject.gender.trim().toLowerCase();
    student.gender =
      student.gender[0].toUpperCase() + student.gender.slice(1).toLowerCase();

    // FIRST NAME

    const text = jsonObject.fullname.trim().split(" ");

    student.firstName = text[0].trim().toLowerCase();
    student.firstName =
      student.firstName[0].toUpperCase() +
      student.firstName.slice(1).toLowerCase();

    // LAST NAME

    student.lastName = text[text.length - 1].trim().toLowerCase();

    // Split the last name by hyphen
    const lastNameParts = student.lastName.split("-");

    // Loop through each part and capitalize the first letter
    for (let i = 0; i < lastNameParts.length; i++) {
      lastNameParts[i] =
        lastNameParts[i][0].toUpperCase() +
        lastNameParts[i].slice(1).toLowerCase();
    }

    // Join the parts back together with hyphen
    student.lastName = lastNameParts.join("-");

    // MIDDLE NAME & NICK NAME

    // make an if else statement -- middle name (if they have 3 in the length) -- nick name (could just do an else with people // only 1 = ernie)

    if (text.length === 3) {
      if (text[1].startsWith('"')) {
        student.nickName = text[1].slice(1, -1);
      } else {
        student.middleName = text[1].trim().toLowerCase();
        student.middleName =
          student.middleName[0].toUpperCase() +
          student.middleName.slice(1).toLowerCase();
      }
    }

    // IMAGES
    // check for both full last and first name
    // give a dummy image for leeann

    if (student.lastName.includes("-")) {
      student.image = `images/${student.lastName
        .slice(student.lastName.indexOf("-") + 1)
        .toLowerCase()}_${student.firstName[0].toLowerCase()}.png`;
    } else {
      student.image = `images/${student.lastName.toLowerCase()}_${student.firstName[0].toLowerCase()}.png`;
    }

    //BLOOD

    let halfBlood = bloodData.half;
    let pureBlood = bloodData.pure;

    if (halfBlood.includes(student.lastName)) {
      student.bloodStatus = "Half Blood";
    } else if (pureBlood.includes(student.lastName)) {
      student.bloodStatus = "Pure Blood";
    } else {
      student.bloodStatus = "Muggle";
    }

    // values = pure, half and muggle

    // PUSH

    allStudents.push(student);
  });

  displayList();
}

function displayList() {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  allStudents.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=middleName]").textContent =
    student.middleName;
  clone.querySelector("[data-field=nickName]").textContent = student.nickName;
  clone.querySelector("[data-field=gender]").textContent = student.gender;

  //IMAGES
  const imageTd = clone.querySelector('td[data-field="image"]');
  const imageElement = imageTd.querySelector("img");
  imageElement.src = student.image;

  //HOUSE

  clone.querySelector("[data-field=house]").textContent = student.house;

  // BLOOD STATUS

  clone.querySelector("[data-field=blood]").textContent = student.bloodStatus;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
