// "use strict" is a directive that enables strict mode in JavaScript. When this directive is used, the JavaScript code is executed in strict mode, which enforces a stricter set of rules and provides better error handling.
"use strict";

// TELLING TO RUN THE FUNCTION START WHEN DOM IS LOADED
window.addEventListener("DOMContentLoaded", start);

//MAKING A CONSTANT VARIABLE FOR FILTER
const myGlobalObj = { filter: "*" };

// ARRAY WHERE ALL STUDENTS WILL BE PUSHED TOO
let allStudents = [];

//PROTOTYPE FOR EACH STUDENT
const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  gender: "",
  image: "",
  house: "",
};

// STARTING THE WHOLE INIT LOOP
function start() {
  document.querySelectorAll(".filter").forEach((each) => {
    each.addEventListener("click", filterClick);
  });

  loadJSON();
}

// MOTHER FILTER FUNCTION
function filterClick(evt) {
  console.log(evt.target.dataset.filter);
  myGlobalObj.filter = evt.target.dataset.filter;

  let filteredStudents;
  if (myGlobalObj.filter !== "*") {
    filteredStudents = allStudents.filter(filterAll);
  } else {
    filteredStudents = allStudents;
  }

  displayList(filteredStudents); // Redisplay the list with the new filter setting
}

// FILTER FUNCTION 2 - CHECKS IF VARIABLE IS EQUAL TO OBJECT
function filterAll(student) {
  console.log(myGlobalObj.filter);
  if (student.house === myGlobalObj.filter) {
    return true;
  }
}

// FETCHING THE DATA - PARRALEL FETCHING MAKES TWO VARIABLES
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

// PREPARING THE OBJECTS
function prepareObjects(studentData, bloodData) {
  studentData.forEach((jsonObject) => {
    //  we create an object based on the prototype made before
    const student = Object.create(Student);

    // we already have the some of the stuff in the JSON object, so we just assign it

    //HOUSE

    student.house = jsonObject.house.trim().toLowerCase();
    student.house =
      student.house[0].toUpperCase() + student.house.slice(1).toLowerCase();

    // HOUSE COLOR

    //NEED TO FIND OUT HOW TO ASSIGN COLOR BASED ON HOUSE

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

    if (student.lastName.includes("-")) {
      student.image = `images/${student.lastName
        .slice(student.lastName.indexOf("-") + 1)
        .toLowerCase()}_${student.firstName[0].toLowerCase()}.png`;
    } else if (student.firstName === "Parvati") {
      student.image = "images/patil_parvati.png";
    } else if (student.firstName === "Padma") {
      student.image = "images/patil_padma.png";
    } else if (student.firstName === "Leanne") {
      student.image = "images/default.png";
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
      student.bloodStatus = "Muggle Blood";
    }

    // PUSH

    allStudents.push(student);
  });

  displayList(allStudents);
}

// DISPLAYING THE WHOLE LIST
function displayList(student) {
  console.log(student);

  // CLEAR LIST
  document.querySelector("#list tbody").innerHTML = "";

  // BUILD NEW LIST
  student.forEach(displayStudent);
}

// DISPLAYING EACH STUDENT IN THE LIST
function displayStudent(student) {
  // CREATE CLONE
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  // ----- SET CLONE DATA -----

  //FULLNAME
  clone.querySelector(
    "[data-field=fullName] h2"
  ).textContent = `${student.firstName} ${student.lastName}`;

  //IMAGES
  const imageTd = clone.querySelector('td[data-field="image"]');
  const imageElement = imageTd.querySelector("img");
  imageElement.src = student.image;

  // //FIRSTNAME
  // clone.querySelector("[data-field=firstName]").textContent = student.firstName;

  // //LASTNAME
  // clone.querySelector("[data-field=lastName]").textContent = student.lastName;

  // //MIDDLENAME
  // clone.querySelector("[data-field=middleName]").textContent =
  //   student.middleName;

  // //NICKNAME
  // clone.querySelector("[data-field=nickName]").textContent = student.nickName;

  // //GENDER
  // clone.querySelector("[data-field=gender]").textContent = student.gender;

  // //HOUSE
  // clone.querySelector("[data-field=house]").textContent = student.house;

  // // BLOOD STATUS
  // clone.querySelector("[data-field=blood]").textContent = student.bloodStatus;

  // APPEND THE CLONE
  document.querySelector("#list tbody").appendChild(clone);
}
