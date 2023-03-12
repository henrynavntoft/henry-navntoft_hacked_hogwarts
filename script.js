// "use strict" is a directive that enables strict mode in JavaScript. When this directive is used, the JavaScript code is executed in strict mode, which enforces a stricter set of rules and provides better error handling.
"use strict";

// ---------------------TELLING TO RUN THE FUNCTION START WHEN DOM IS LOADED
window.addEventListener("DOMContentLoaded", start);

// --------------------ARRAY WHERE ALL STUDENTS WILL BE PUSHED TOO
let allStudents = [];

// ------------------ARRAY WHER ALL EXPELLED STUDENTS WILL BE PUSHED TOO
let expelledStudents = [];

// Set up a global variable to hold the interval ID
let interval;

//-------------------GLOBAL OBJECT FOR SETTINGS
const settings = {
  filter: "all",
  sortBy: "house",
  sortDir: "asc",
};

//------------------------------------PROTOTYPE FOR EACH STUDENT--------------------------------------
const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  gender: "",
  image: "",
  house: "",
  stars: false,
  winner: false,
  expelled: false,
};

// ---------------------------------SEARCH------------------------------
function searchStudents(student) {
  const searchInput = document.querySelector("#searchInput");
  const searchQuery = searchInput.value.toLowerCase();

  console.log(searchQuery);

  const matchingStudents = allStudents.filter(function (student) {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    return fullName.includes(searchQuery);
  });

  // Display the matching students
  displayList(matchingStudents);
}

//----------------------------HACKING------------------------------

function hackTheSystem() {
  let hacked = true;
  console.log(hacked);
  // Check if student already exists in array
  const studentExists = allStudents.some(
    (student) =>
      student.firstName === "Henry" && student.lastName === "Navntoft"
  );

  if (studentExists === true) {
    console.log("You have already been added to the student list.");
  } else {
    //CHANGE BACKGROUND COLOR FOR HACKING EFFECT
    document.querySelector("body").style.backgroundColor = "var(--highlight)";

    // Insert yourself
    const mySelfStudent = {
      firstName: "Henry",
      lastName: "Navntoft",
      middleName: "Lundberg",
      nickName: "",
      gender: "Boy",
      image: "images/navntoft_h.png",
      house: "Hufflepuff",
      bloodStatus: "Pure Blood",
      stars: false,
      winner: false,
      expelled: false,
    };
    allStudents.push(mySelfStudent);

    console.log(
      "You have been added to the student list and the system has been hacked!"
    );
  }

  randomBloodStatus();

  startCheckingInq();

  buildList();
}

// -------------------------------FOR HACKING -- RANDOM BLOOD STATUS ---------------------------------
function randomBloodStatus() {
  allStudents.forEach(function (student) {
    if (student.bloodStatus === "Pure Blood") {
      const bloodStatuses = ["Pure Blood", "Half Blood", "Muggle Blood"];
      const randomBloodStatus =
        bloodStatuses[Math.floor(Math.random() * bloodStatuses.length)];
      student.bloodStatus = randomBloodStatus;
    } else {
      student.bloodStatus = "Pure Blood";
    }
  });
}

// -------------------------BREAK INQ SQUAD------------------------

function startCheckingInq() {
  // Set the interval to run every 2 seconds (adjust as needed)
  interval = setInterval(removeInq, 2000);
}

function removeInq() {
  allStudents.forEach(function (student) {
    if (student.stars === true) {
      student.stars = false;
      buildList();
    }
  });
}

// --------------------------REGISTER IF BTN AND FILTERS ARE CLICKED/APPLIED - BEEING CALLED IN START FUNCTION-----------------
function registerBtn() {
  document.querySelectorAll("[data-action='filter']").forEach((each) => {
    each.addEventListener("click", selectFilter);
  });

  document.querySelectorAll("[data-action='sort']").forEach((each) => {
    each.addEventListener("click", selectSort);
  });

  const searchButton = document.querySelector("#searchButton");
  searchButton.addEventListener("click", searchStudents);

  document
    .querySelector(".hackButton")
    .addEventListener("click", hackTheSystem);
}

// -------------------------------STARTING THE WHOLE INIT LOOP--------------------------
function start() {
  registerBtn();
  loadJSON();
}

// ------------------------------FETCHING THE DATA - PARRALEL FETCHING TAKES TWO PARAMETERS----------------
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

// -------------------------------------------PREPARING THE OBJECTS---------------------------------------
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
  } else if (settings.filterBy === "Expelled") {
    filteredList = expelledStudents;
  } else {
    filteredList = allStudents;
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

function isExpelled(student) {
  return student.expelled === true;
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

// ------------------------ PREFECTS  ----------------------------------------
function makePrefect(selectedStudent) {
  // Get all the winners
  const allWinners = allStudents.filter((student) => student.winner);

  // Get the number of winners of the same gender and house
  const sameGenderHouseWinners = allWinners.filter(
    (student) =>
      student.gender === selectedStudent.gender &&
      student.house === selectedStudent.house
  );

  // Check if there is already a winner of the same gender and house
  if (sameGenderHouseWinners.length >= 1) {
    console.log("Max 1 prefect of each gender in each house");
    removeOther(sameGenderHouseWinners[0]);
  }
  // If there is no winner of the same gender and house, check if there is a winner of the opposite gender and house
  else {
    const oppositeGenderHouseWinners = allWinners.filter(
      (student) =>
        student.gender !== selectedStudent.gender &&
        student.house === selectedStudent.house
    );
    // Check if there is already a winner of the opposite gender and house
    if (oppositeGenderHouseWinners.length >= 2) {
      console.log("Max 1 prefect of each gender in each house");
      removeOther(oppositeGenderHouseWinners[0], selectedStudent);
    }
    // If there is no winner of either gender in the same house, make the student a winner
    else {
      makeWinner(selectedStudent);
    }
  }

  function removeOther(other) {
    document.querySelector("#remove_other").classList.remove("hidden");

    //EVENTLISTENERS
    document
      .querySelector("#remove_other .close_button")
      .addEventListener("click", closeDialog);

    document
      .querySelector("#remove_other .remove_button")
      .addEventListener("click", removeStudent);

    document.querySelector(
      "#remove_aorb [data-field=otherwinner]"
    ).textContent = other.firstName;

    //IF USER CHOSE TO IGNORE:
    function closeDialog() {
      document.querySelector("#remove_other").classList.add("hidden");
      document
        .querySelector("#remove_other .close_button")
        .removeEventListener("click", closeDialog);
      document
        .querySelector("#remove_other .remove_button")
        .removeEventListener("click", removeStudent);
    }
    //IF USER CHOSE TO REMOVE:
    function removeStudent() {
      removeWinner(other);
      makeWinner(selectedStudent);
      buildList();
      closeDialog();
    }
  }

  // function removeAorB(winnerA, winnerB) {
  //   document.querySelector("#remove_aorb").classList.remove("hidden");

  //   //EVENTLISTENERS
  //   document
  //     .querySelector("#remove_aorb .close_button")
  //     .addEventListener("click", closeDialog);

  //   document
  //     .querySelector("#remove_aorb .remove_studentA")
  //     .addEventListener("click", removeStudentA);

  //   document
  //     .querySelector("#remove_aorb .remove_studentB")
  //     .addEventListener("click", removeStudentB);

  //   document.querySelector("#remove_aorb [data-field=winnerA]").textContent =
  //     winnerA.firstName;

  //   document.querySelector("#remove_aorb [data-field=winnerB]").textContent =
  //     winnerB.firstName;

  //   //IF USER CHOSE TO IGNORE:
  //   function closeDialog() {
  //     document.querySelector("#remove_aorb").classList.add("hidden");
  //     document
  //       .querySelector("#remove_aorb .close_button")
  //       .removeEventListener("click", closeDialog);
  //     document
  //       .querySelector("#remove_aorb .remove_studentA")
  //       .removeEventListener("click", removeStudentA);
  //     document
  //       .querySelector("#remove_aorb .remove_studentB")
  //       .removeEventListener("click", removeStudentB);
  //   }

  //   function removeStudentA() {
  //     //CHOICE A
  //     removeWinner(winnerA);
  //     makeWinner(selectedStudent);
  //     buildList();
  //     closeDialog();
  //   }

  //   function removeStudentB() {
  //     //CHOICE B
  //     removeWinner(winnerB);
  //     makeWinner(selectedStudent);
  //     buildList();
  //     closeDialog();
  //   }
  // }

  function removeWinner(winnerStudent) {
    winnerStudent.winner = false;
  }

  function makeWinner(loserStudent) {
    //if (student.house === "Hufflepuff") {}
    loserStudent.winner = true;
  }
}

// --------------------------BOTH SORT AND FILTER PUSH TO LIST-------------------------
function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);

  displayList(sortedList);
}

// ---------------------------------DISPLAYING THE WHOLE LIST------------------------------
function displayList(student) {
  console.log(student);

  const totalStudents = allStudents.length;
  const gryffindorStudents = allStudents.filter(
    (student) => student.house === "Gryffindor"
  ).length;
  const hufflepuffStudents = allStudents.filter(
    (student) => student.house === "Hufflepuff"
  ).length;
  const ravenclawStudents = allStudents.filter(
    (student) => student.house === "Ravenclaw"
  ).length;
  const slytherinStudents = allStudents.filter(
    (student) => student.house === "Slytherin"
  ).length;
  const expelledStudentsLength = expelledStudents.length;

  const totalParagraph = document.querySelector("p.numberOfTotalStudents");
  totalParagraph.textContent = `Number of enrolled students is: ${totalStudents}`;

  const gryffindorParagraph = document.querySelector(
    "p.numberOfGryffindorStudents"
  );
  gryffindorParagraph.textContent = `Number of Gryffindor students is: ${gryffindorStudents}`;

  const hufflepuffParagraph = document.querySelector(
    "p.numberOfHufflepuffStudents"
  );
  hufflepuffParagraph.textContent = `Number of Hufflepuff students is: ${hufflepuffStudents}`;

  const ravenclawParagraph = document.querySelector(
    "p.numberOfRavenclawStudents"
  );
  ravenclawParagraph.textContent = `Number of Ravenclaw students is: ${ravenclawStudents}`;

  const slytherinParagraph = document.querySelector(
    "p.numberOfSlytherinStudents"
  );
  slytherinParagraph.textContent = `Number of Slytherin students is: ${slytherinStudents}`;

  const expelledParagraph = document.querySelector(
    "p.numberOfExpelledStudents"
  );
  expelledParagraph.textContent = `Number of expelled students is: ${expelledStudentsLength}`;

  const currentLength = student.length;
  const paragraph = document.querySelector("p.numberOfCurrentStudents");
  paragraph.textContent = `Current number of students is: ${currentLength}`;

  // CLEAR LIST
  document.querySelector("#list tbody").innerHTML = "";

  // BUILD NEW LIST
  student.forEach(displayStudent);
}

// ------------------------------------DISPLAY EACH STUDENT IN POPUP---------------------------
function showPopUp(student) {
  const popUp = document.querySelector("#popup");
  const popUpContent = document.querySelector("#popup");
  popUp.classList.remove("hidden");

  document.querySelector(".closePopUp").addEventListener("click", closePopUp);

  function closePopUp() {
    popUp.classList.add("hidden");
  }
  // WHAT IS IN THE POP UP
  popUp.querySelector("[data-field=image]").src = student.image;
  popUp.querySelector("[data-field=firstName]").textContent = student.firstName;
  popUp.querySelector("[data-field=middleName]").textContent =
    student.middleName;
  popUp.querySelector("[data-field=nickName]").textContent = student.nickName;
  popUp.querySelector("[data-field=lastName]").textContent = student.lastName;
  popUp.querySelector("[data-field=house]").textContent = student.house;
  popUp.querySelector("[data-field=gender]").textContent = student.gender;
  popUp.querySelector("[data-field=blood]").textContent = student.bloodStatus;

  // EXPELLED
  popUp.querySelector("[data-field=expelled]").textContent = student.expelled;

  //PREFECT
  popUp.querySelector("[data-field=winner]").textContent = student.winner;

  if (student.winner === true) {
    popUp.querySelector("[data-field=winner]").textContent = "⌛";
  } else {
    popUp.querySelector("[data-field=winner]").textContent = "-";
  }

  //INQ. SQUAD

  popUp.querySelector("[data-field=stars]").textContent = student.stars;

  if (
    ((student.house === "slytherin" && student.bloodStatus !== "Half blood") ||
      student.bloodStatus === "Pure Blood") &&
    student.stars === true
  ) {
    popUp.querySelector("[data-field=stars]").textContent = "⚡";
  } else {
    popUp.querySelector("[data-field=stars]").textContent = "-";
  }

  //COLORS BORDERS
  switch (student.house) {
    case "Gryffindor":
      popUp.querySelector("[data-field=image]").style.border =
        " 5px solid var(--gryffindor)";
      popUp.querySelector(".popup_dialog").style.border =
        " 5px solid var(--gryffindor)";
      break;
    case "Slytherin":
      popUp.querySelector("[data-field=image]").style.border =
        "5px solid var(--slytherin)";
      popUp.querySelector(".popup_dialog").style.border =
        " 5px solid var(--slytherin)";
      break;
    case "Hufflepuff":
      popUp.querySelector("[data-field=image]").style.border =
        "5px solid var(--hufflepuff)";
      popUp.querySelector(".popup_dialog").style.border =
        " 5px solid var(--hufflepuff)";
      break;
    case "Ravenclaw":
      popUp.querySelector("[data-field=image]").style.border =
        "5px solid var(--ravenclaw)";
      popUp.querySelector(".popup_dialog").style.border =
        " 5px solid var(--ravenclaw)";
      break;
    default:
      popUp.querySelector("[data-field=image]").style.border =
        "5px solid var(--default)";
      popUp.querySelector(".popup_dialog").style.border =
        " 5px solid var(--defaul)";
  }

  //---------------------------EXPELLING------------------------------
  popUp.querySelector(".expelStudent").addEventListener("click", expellStudent);

  function expellStudent() {
    if (student.firstName === "Henry" && student.lastName === "Navntoft") {
      // Show warning message that i cannot be expelled
      console.log("Henry Navntoft can't be expelled!");
    } else {
      let oneStudent = allStudents.splice(allStudents.indexOf(student), 1)[0];
      oneStudent.expelled = true;
      oneStudent.winner = false;
      oneStudent.stars = false;
      expelledStudents.push(oneStudent);
    }

    // check if the student has already been expelled and disable the "Expel Student" button
    console.log(allStudents);
    console.log(expelledStudents);
    closePopUp();
    buildList();
    popUp
      .querySelector(".expelStudent")
      .removeEventListener("click", expellStudent);
  }

  if (student.expelled === true) {
    popUp.querySelector("[data-field=expelled]").textContent = "True";
    popUp
      .querySelector(".expelStudent")
      .removeEventListener("click", expellStudent);
  } else {
    popUp.querySelector("[data-field=expelled]").textContent = "False";
  }
}

// ------------------------DISPLAYING EACH STUDENT IN THE LIST----------------------
function displayStudent(student) {
  // CREATE CLONE
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  // ----- SET CLONE DATA -----

  // -----------POPUP EVENTLISTENER-------------

  clone
    .querySelector(".student0")
    .addEventListener("click", () => showPopUp(student));
  clone
    .querySelector(".student1")
    .addEventListener("click", () => showPopUp(student));
  clone
    .querySelector(".student2")
    .addEventListener("click", () => showPopUp(student));
  clone
    .querySelector(".student3")
    .addEventListener("click", () => showPopUp(student));

  // INQ. SQUAD
  if (
    ((student.house === "slytherin" && student.bloodStatus !== "Half blood") ||
      student.bloodStatus === "Pure Blood") &&
    student.stars === true
  ) {
    clone.querySelector("[data-field=stars]").textContent = "⚡";
  } else {
    clone.querySelector("[data-field=stars]").textContent = "-";
  }

  clone
    .querySelector("[data-field=stars]")
    .addEventListener("click", toggleStars);

  function toggleStars() {
    if (
      ((student.house === "slytherin" &&
        student.bloodStatus !== "Half blood") ||
        student.bloodStatus === "Pure Blood") &&
      student.stars === true
    ) {
      student.stars = false;
    } else {
      student.stars = true;
    }
    buildList();
  }

  //-------------------------PREFECT-------------------------------
  if (student.winner === true) {
    clone.querySelector("[data-field=winner]").textContent = "⌛";
  } else {
    clone.querySelector("[data-field=winner]").textContent = "-";
  }

  clone
    .querySelector("[data-field=winner]")
    .addEventListener("click", toggleWinner);

  function toggleWinner() {
    if (student.winner === true) {
      student.winner = false;
    } else {
      makePrefect(student);
    }
    buildList();
  }

  //IMAGES
  const imageTd = clone.querySelector('td[data-field="image"]');
  const imageElement = imageTd.querySelector("img");
  imageElement.src = student.image;

  // Check which house the student belongs to and change the border color accordingly
  switch (student.house) {
    case "Gryffindor":
      imageElement.style.border = " 5px solid var(--gryffindor)";
      imageElement.style.borderradius = " 2rem";
      break;
    case "Slytherin":
      imageElement.style.border = "5px solid var(--slytherin)";
      break;
    case "Hufflepuff":
      imageElement.style.border = "5px solid var(--hufflepuff)";
      break;
    case "Ravenclaw":
      imageElement.style.border = "5px solid var(--ravenclaw)";
      break;
    default:
      imageElement.style.border = "5px solid var(--default)";
  }

  //FIRSTNAME
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;

  //LASTNAME
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;

  // //NICKNAME
  // clone.querySelector("[data-field=nickName]").textContent = student.nickName;

  //HOUSE
  clone.querySelector("[data-field=house]").textContent = student.house;

  // //EXPELLED
  // clone.querySelector("[data-field=expelled]").textContent = student.expelled;

  // //GENDER
  // clone.querySelector("[data-field=gender]").textContent = student.gender;

  // // BLOOD STATUS
  // clone.querySelector("[data-field=blood]").textContent = student.bloodStatus;

  // APPEND THE CLONE
  document.querySelector("#list tbody").appendChild(clone);
}
