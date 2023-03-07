// "use strict" is a directive that enables strict mode in JavaScript. When this directive is used, the JavaScript code is executed in strict mode, which enforces a stricter set of rules and provides better error handling.
"use strict";

// TELLING TO RUN THE FUNCTION START WHEN DOM IS LOADED
window.addEventListener("DOMContentLoaded", start);

// ARRAY WHERE ALL STUDENTS WILL BE PUSHED TOO
let allStudents = [];

//GLOBAL OBJECT FOR SETTINGS
const settings = {
  filter: "all",
  sortBy: "house",
  sortDir: "asc",
};

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

// REGISTER IF BTN AND FILTERS ARE CLICKED/APPLIED - BEEING CALLED IN START FUNCTION
function registerBtn() {
  document.querySelectorAll("[data-action='filter']").forEach((each) => {
    each.addEventListener("click", selectFilter);
  });

  document.querySelectorAll("[data-action='sort']").forEach((each) => {
    each.addEventListener("click", selectSort);
  });
}

// STARTING THE WHOLE INIT LOOP
function start() {
  registerBtn();
  loadJSON();
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

// ------------------------------------------FILTERING------------------------------------------

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  //filterList(filter);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  //let filteredList = allStudents;
  if (settings.filterBy === "Hufflepuff") {
    filteredList = allStudents.filter(isHuf);
  } else if (settings.filterBy === "Slytherin") {
    filteredList = allStudents.filter(isSlyt);
  } else if (settings.filterBy === "Gryffindor") {
    filteredList = allStudents.filter(isGryf);
  } else if (settings.filterBy === "Ravenclaw") {
    filteredList = allStudents.filter(isRav);
  } else {
    false;
  }
  return filteredList;
}

function isHuf(student) {
  return student.house === "Hufflepuff";
}

function isSlyt(student) {
  return student.house === "Slytherin";
}

function isGryf(student) {
  return student.house === "Gryffindor";
}

function isRav(student) {
  return student.house === "Ravenclaw";
}

// ------------------------------------------SORTING------------------------------------------
function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  // HIGHLIGHT WHEN SORTED AFTER

  //FIND OLD HIGHLIGHTED
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);

  //REMOVES SORTAFTER CLASS
  oldElement.classList.remove("sortAfter");

  //INDICATE ACTIVE SORTED
  event.target.classList.add("sortAfter");

  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }

  console.log(sortBy, sortDir);

  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  //let sortedList = allStudents;
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }

  sortedList = sortedList.sort(genericSort);

  function genericSort(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  return sortedList;
}

// BOTH SORT AND FILTER PUSH TO LIST
function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);

  displayList(sortedList);
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

  //IMAGES
  const imageTd = clone.querySelector('td[data-field="image"]');
  const imageElement = imageTd.querySelector("img");
  imageElement.src = student.image;

  //FIRSTNAME
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;

  //LASTNAME
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;

  // //MIDDLENAME
  // clone.querySelector("[data-field=middleName]").textContent =
  //   student.middleName;

  // //NICKNAME
  // clone.querySelector("[data-field=nickName]").textContent = student.nickName;

  //GENDER
  clone.querySelector("[data-field=gender]").textContent = student.gender;

  //HOUSE
  clone.querySelector("[data-field=house]").textContent = student.house;

  // BLOOD STATUS
  clone.querySelector("[data-field=blood]").textContent = student.bloodStatus;

  // APPEND THE CLONE
  document.querySelector("#list tbody").appendChild(clone);
}

// function updateNumberOfStudents(array) {
//   const numberOfStudents = array.length;
//   const paragraph = document.querySelector("p.numberOfStudents");
//   paragraph.textContent = `Number of students shown: ${numberOfStudents}`;
// }

// updateNumberOfStudents(displayList);
