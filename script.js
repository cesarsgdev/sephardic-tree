const mainContent = document.querySelector(".mainContent");
const header = document.querySelector("header");
/*
 *
 *
 * VARIABLES DECLARATION & GENERATIONS
 *
 */

let trees,
  personName,
  eventType,
  eventPlace,
  eventDay,
  eventMonth,
  eventYear,
  deathCheckbox,
  placeOfDeath,
  deathDay,
  deathMonth,
  deathYear,
  popupOverlay,
  form;

const generations = [
  "REQUERENTE",
  "PAIS",
  "AVÓS",
  "BISAVÓS",
  "TRISAVÓS",
  "TETRAVÓS",
  "PENTAVÓS",
  "HEXAVÓS",
  "HEPTAVÓS",
  "OCTAVÓS",
  "ENEAVÓS",
  "DECAVÓS",
  "UNODECAVÓS",
  "DUODECAVÓS",
  "TRIDECAVÓS",
  "TETRADECAVÓS",
  "PENTADECAVÓS",
  "HEXADECAVÓS",
  "HEPTADECAVÓS",
  "OCTADECAVÓS",
  "ENEADECAVÓS",
  "ICOSVÓS",
];
initApp();

/*
 *
 *
 * EVENT LISTENERS
 *
 */

mainContent.addEventListener("click", mainContentClick);
mainContent.addEventListener("keydown", mainContentKeyDown);
header.addEventListener("click", headerClick);
document.body.addEventListener("click", bodyClick);
document.body.addEventListener("change", bodyChange);

/*
 *
 *
 * CLICK HANDLERS
 *
 */

/*
 *
 * MAIN CONTENT CLICK HANDLER
 *
 */

function mainContentClick(e) {
  //Create tree when none available
  if (e.target.classList.contains("buttonCreateTree")) {
    mainContent.classList.remove("treesNoContent");
    mainContent.classList.add("treesGrid");
    const newTreeHtml = createTreeFromButtons();
    mainContent.innerHTML = newTreeHtml;
    header.classList.remove("headerSingleRow");
    header.classList.add("headerTwoRows");
    header.innerHTML += `<span class="headerBtn headerBtnGreen btnNewTreeHeader">New Tree</span>`;
  }

  /*
   *
   * DELETE TREE
   *
   */

  if (e.target.classList.contains("deleteTree")) {
    e.target.closest(".tree").classList.add("fadeOut");
    console.log(e.target.closest(".tree").dataset.index);
    const currentIndex = e.target.closest(".tree").dataset.index;
    setTimeout(() => {
      e.target.closest(".tree").remove();
      const treeItems = Array.from(document.querySelectorAll(".tree"));
      console.log(treeItems);

      treeItems.forEach((tree) => {
        if (tree.dataset.index > 0) {
          tree.dataset.index -= 1;
        }
      });
      if (treeItems.length === 0) {
        header.querySelector(".btnNewTreeHeader").remove();
        mainContent.classList.toggle("treesGrid");
        mainContent.classList.toggle("treesNoContent");
        mainContent.innerHTML = `<p>No trees available. Please create one.</p>
        <span id="buttonCreateTree" class="buttonCreateTree">Create Tree</span>`;
      }

      toast("Success", "Tree deleted");
    }, 480);
    trees.splice(currentIndex, 1);
    localStorage.treesSaved = JSON.stringify(trees);
  }

  /*
   *
   * LOAD TREE
   *
   */
  if (e.target.classList.contains("loadTree")) {
    treeIndex = e.target.closest(".tree").dataset.index;
    openTree(treeIndex);
  }

  /*
   *
   *
   * TREE CONTROLS EVENTS
   *
   */

  /*
   *
   * ADD PRINCIPAL
   *
   */

  if (
    e.target.classList.contains("addPerson") ||
    e.target.classList.contains("fa-user")
  ) {
    createForm(Number(e.target.dataset.index), "principal");
  }

  /*
   *
   * ADD MARRIAGE
   *
   */
  if (
    e.target.classList.contains("addMarriage") ||
    e.target.classList.contains("fa-ring")
  ) {
    const generationRows = document.querySelectorAll(".generationInfo");
    let contentString;
    if (generationRows.length > 0)
      contentString = generationRows[generationRows.length - 1].textContent;

    if (contentString && contentString.includes("casou")) {
      toast(
        "Warning",
        "You already have a marriage added. Delete or edit it to change it."
      );
    } else if (!generationRows.length > 0) {
      toast(
        "Message",
        "No generations available in tree. You need at least one generation to add a marriage."
      );
    } else {
      createForm(e.target.dataset.index, "marriage");
    }
  }

  /*
   *
   * ADD PARTNER
   *
   */

  if (
    e.target.classList.contains("addPartner") ||
    e.target.classList.contains("fa-user-group")
  ) {
    const generationRows = document.querySelectorAll(".generationInfo");
    let contentString;
    if (generationRows.length > 0)
      contentString = generationRows[generationRows.length - 1].textContent;

    if (contentString && contentString.includes("com")) {
      toast(
        "Warning",
        "You already have a partner added. Delete or edit it to change it."
      );
    } else if (!generationRows.length > 0) {
      toast(
        "Message",
        "No generations available in tree. You need at least one generation to add a partner."
      );
    } else {
      createForm(e.target.dataset.index, "partner");
    }
  }

  /*
   *
   * COPY TREE
   *
   */

  if (
    e.target.classList.contains("copyTree") ||
    e.target.classList.contains("fa-copy")
  ) {
    copyTree();
  }

  /*
   *
   * ZOOM IN
   *
   */
  if (
    e.target.classList.contains("zoomIn") ||
    e.target.classList.contains("fa-magnifying-glass-plus")
  ) {
    zoomInOut("zoomIn");
  }

  /*
   *
   * ZOOM OUT
   *
   */

  if (
    e.target.classList.contains("zoomOut") ||
    e.target.classList.contains("fa-magnifying-glass-minus")
  ) {
    zoomInOut("zoomOut");
  }

  /*
   *
   * DELETE ROW
   *
   */

  if (
    e.target.classList.contains("deleteRow") ||
    e.target.classList.contains("fa-circle-minus")
  ) {
    const generationRows = document.querySelectorAll(".wholeGeneration");
    // console.log(generationRows);
    if (generationRows.length > 0) {
      const index = generationRows.length - 1;
      const treeIndex = Number(e.target.dataset.index);
      generationRows[index].classList.add("slideDown");

      setTimeout(() => {
        generationRows[index].remove();
      }, 290);
      // generationRows[index].remove();

      setTimeout(() => {
        const table = document.getElementById("tableTree");
        trees[treeIndex].html = table.outerHTML;
        localStorage.treesSaved = JSON.stringify(trees);
        toast("Success", "Generation deleted");
      }, 300);
    } else {
      toast("Message", "No generations to delete");
    }
  }

  /*
   *
   * GET HELP
   *
   */

  if (
    e.target.classList.contains("getHelp") ||
    e.target.classList.contains("fa-circle-question")
  ) {
    console.log("Clicked help!");
    createContentOverlay();
  }

  /*
   *
   * EDITION SINGLE GENERATION CLICK
   *
   */

  if (e.target.classList.contains("generationInfo")) {
    const content = e.target.innerHTML;
    const index = Number(document.querySelector("h1").dataset.index);
    const id = e.target.id;
    createEdition(index, content, id);
  }
}

/*
 *
 *
 * MAIN CONTENT KEY DOWN HANDLER
 *
 */
function mainContentKeyDown(e) {
  /*
   *
   * CHANGE TREE TITLE
   *
   */

  if (
    e.target.classList.contains("treeSingleTitle") &&
    (e.keyCode === 13 || e.keyCode === 9)
  ) {
    e.preventDefault();
    let index = e.target.closest(".tree").dataset.index;
    e.target.blur();
    trees[index].name = e.target.textContent;
    localStorage.treesSaved = JSON.stringify(trees);
    toast("Success", "Name changed");
  }
}

/*
 *
 *
 * HEADER CLICK HANDLER
 *
 */

function headerClick(e) {
  /*
   *
   * NEW TREE HEADER BUTTON
   *
   */
  if (e.target.classList.contains("btnNewTreeHeader")) {
    const newTreeHtml = createTreeFromButtons();
    mainContent.innerHTML += newTreeHtml;
    toast("Success", "New tree created");
  }

  /*
   *
   * SAVE TREE BUTTON
   *
   */
  if (e.target.classList.contains("btnHeaderSave")) {
    saveTree(e.target.dataset.index);
  }

  if (e.target.classList.contains("btnHeaderBack")) {
    initApp();
  }
}

/*
 *
 *
 * BODY CLICK HANDLER
 *
 */

function bodyClick(e) {
  // console.log(e);

  /*
   *
   * CLOSE POPUP
   *
   */
  if (
    e.target.classList.contains("popupOverlay") &&
    !e.target.classList.contains("editionOverlay")
  ) {
    e.target.classList.add("fadeOut");
    setTimeout(() => {
      e.target.remove();
    }, 480);
  }

  /*
   *
   * PRINCIPAL SUBMIT FORM
   *
   */
  if (e.target.id === "principalSubmit") {
    e.preventDefault();
    const index = Number(e.target.closest("form").dataset.index);
    console.log(index);
    // console.log("Submited");
    getFormValues("principal");
    //Add Row with data
    const tableBody = document.querySelector("tbody");
    const generationsTotal = document.querySelectorAll(".generation");
    const generationNumber = generationsTotal.length;
    const str = `<tr class="slideUp wholeGeneration">
    <td class="generation">${generations[generationNumber]}</td>
    <td id=${
      generations.length > generationsTotal.length
        ? generations[generationNumber].toLowerCase()
        : ""
    } class="generationInfo"><strong>*${personName}</strong> (${eventType}. ${eventDay}/${eventMonth}/${eventYear}, ${eventPlace}${
      deathCheckbox === "alive" || deathCheckbox === "nodetails"
        ? ``
        : `, m. ${deathDay}/${deathMonth}/${deathYear}, ${placeOfDeath}`
    }${deathCheckbox === "nodetails" ? "m. [sem-dados]" : ""})</td></tr>`;

    // - casou (sem dados) com Juana de Treviño (n. ca. 1558, Mexico City, m. ca. 1610, Monterrey, Nuevo Reino de León)

    tableBody.insertAdjacentHTML("beforeend", str);
    document.querySelector(".popupOverlay").click();
    const table = document.getElementById("tableTree");
    trees[index].html = table.outerHTML;
    localStorage.treesSaved = JSON.stringify(trees);

    console.log(deathCheckbox);
  }

  /*
   *
   * MARRIAGE SUBMIT FORM
   *
   */

  if (e.target.id === "addMarriageSubmit") {
    e.preventDefault();
    const generationTarget = document.querySelectorAll(".generationInfo");
    const generationTargetIndex = generationTarget.length - 1;
    const index = Number(e.target.closest("form").dataset.index);
    const marriagePlace = document.getElementById("marriagePlace").value.trim();
    const marriageDay = document.getElementById("marriageDay").value.trim();
    const marriageMonth = document.getElementById("marriageMonth").value.trim();
    const marriageYear = document.getElementById("marriageYear").value.trim();
    // console.log("Marriage added");

    // console.log(
    //   `Married: ${marriageDay}/${marriageMonth}/${marriageYear} in ${marriagePlace}`
    // );

    const str = ` - <strong>casou</strong> (${marriageDay}/${marriageMonth}/${marriageYear}, ${marriagePlace})`;

    generationTarget[generationTargetIndex].innerHTML += str;
    document.querySelector(".popupOverlay").click();
    const table = document.getElementById("tableTree");
    trees[index].html = table.outerHTML;
    localStorage.treesSaved = JSON.stringify(trees);
  }

  /*
   *
   * PARTNER SUBMIT FORM
   *
   */

  if (e.target.id === "partnerSubmit") {
    e.preventDefault();
    const generationTarget = document.querySelectorAll(".generationInfo");
    const generationTargetIndex = generationTarget.length - 1;
    const index = Number(e.target.closest("form").dataset.index);
    getFormValues("partner");

    const str = ` <strong>com</strong> ${personName} (${eventType}. ${eventDay}/${eventMonth}/${eventYear}, ${eventPlace}${
      deathCheckbox === "alive" || deathCheckbox === "nodetails"
        ? ""
        : `, m. ${deathDay}/${deathMonth}/${deathYear}, ${placeOfDeath}`
    }${deathCheckbox === "nodetails" ? "m. [sem-dados]" : ""})`;

    generationTarget[generationTargetIndex].innerHTML += str;
    document.querySelector(".popupOverlay").click();
    const table = document.getElementById("tableTree");
    trees[index].html = table.outerHTML;
    localStorage.treesSaved = JSON.stringify(trees);
  }
  /*
   *
   * SAVE EDITION
   *
   */
  if (e.target.classList.contains("saveEdition")) {
    console.log("Edition Saved");
    const editionDiv = document.querySelector(".editionDiv");
    const generationID = document.getElementById(e.target.dataset.generation);
    const popup = document.querySelector(".popupOverlay");
    const index = Number(e.target.dataset.index);
    generationID.innerHTML = editionDiv.innerHTML;
    const table = document.getElementById("tableTree");
    trees[index].html = table.outerHTML;
    localStorage.treesSaved = JSON.stringify(trees);
    popup.classList.remove("editionOverlay");
    popup.click();
    setTimeout(() => {
      toast(
        "Success",
        `Generation ${e.target.dataset.generation.toUpperCase()} edited.`
      );
    }, 1500);
  }

  if (e.target.classList.contains("cancelEdition")) {
    const popup = document.querySelector(".popupOverlay");
    popup.classList.remove("editionOverlay");
    popup.click();
  }
}

/*
 *
 *
 * BODY CHANGE HANDLER
 *
 */

function bodyChange(e) {
  /*
   *
   * ADD PEOPLE CHECKBOXES
   *
   */
  if (e.target.name === "addPersonDeathDetails" && e.target.checked) {
    const deathInputs = document.querySelectorAll(".leadPersonDeathDetails");
    const allCheckboxes = document.getElementsByName("addPersonDeathDetails");
    allCheckboxes.forEach((input) => (input.checked = false));
    e.target.checked = true;
    deathInputs.forEach((input) => input.setAttribute("readonly", true));
  } else if (e.target.name === "partnerDeathDetails" && e.target.checked) {
    const deathInputs = document.querySelectorAll(".leadPersonDeathDetails");
    const allCheckboxes = document.getElementsByName("partnerDeathDetails");
    allCheckboxes.forEach((input) => (input.checked = false));
    e.target.checked = true;
    deathInputs.forEach((input) => input.setAttribute("readonly", true));
  } else {
    const deathInputs = document.querySelectorAll(".leadPersonDeathDetails");
    deathInputs.forEach((input) => input.removeAttribute("readonly"));
  }
}

/*
 *
 *
 * FUNCTIONS
 *
 */

/*
 *
 * APP START
 *
 */

function initApp() {
  bodyFadeIn();
  if (
    JSON.parse(localStorage.getItem("treesSaved")) &&
    JSON.parse(localStorage.getItem("treesSaved")).length !== 0
  ) {
    let html = "";
    trees = JSON.parse(localStorage.getItem("treesSaved"));
    mainContent.classList.add("treesGrid");
    trees.forEach((tree, i) => {
      date = new Date(tree.created);
      htmlstring = `<div class="tree" data-index="${i}">
        <h2 class="treeSingleTitle" contenteditable="true">${tree.name}</h2>
        <span class="date dateCreated">Created: ${
          date.getMonth() + 1
        }/ ${date.getDate()}/${date.getFullYear()}</span>
        <div class="treeControls">
          <i class="fa-solid deleteTree fa-trash"></i>
          <i class="fa-solid loadTree fa-arrow-right-to-bracket"></i>
        </div>
      </div>`;
      html += htmlstring;
      if (!document.querySelector(".btnNewTreeHeader")) {
        header.innerHTML += `<span class="headerBtn headerBtnGreen btnNewTreeHeader">New Tree</span>`;
      }
    });
    mainContent.innerHTML = html;
    header.classList.remove("headerSingleRow");
    header.classList.add("headerTwoRows");
    if (header.querySelector(".openTreeActionBtns"))
      header.querySelector(".openTreeActionBtns").remove();
    if (header.querySelector("h1")) header.querySelector("h1").remove();
    //   alert(trees);
  } else {
    trees = [];
    mainContent.classList.toggle("treesNoContent");
    mainContent.innerHTML = `      <p>No trees available. Please create one.</p>
    <span id="buttonCreateTree" class="buttonCreateTree">Create Tree</span>`;
  }
}

/*
 *
 * CREATE TREES FROM BODY & HEADER BUTTON
 *
 */

function createTreeFromButtons() {
  let treesInDom = document.querySelectorAll(".tree");
  if (treesInDom.length > 0) {
    treesInDom.forEach((tree) => tree.classList.remove("fadeIn"));
  }
  const treesNewLength =
    trees.push({
      name: "No title",
      created: new Date().toISOString(),
      updated: "",
      html: `<table id="tableTree">
      <tbody class="tableBody"></tbody>
    </table>`,
    }) - 1;

  date = new Date(trees[treesNewLength].created);
  // day = date.getDate();
  // month = date.getMonth();
  // year = date.gateYear();
  const newTreeHtml = `<div class="tree fadeIn" data-index="${treesNewLength}">
  <h2 class="treeSingleTitle" contenteditable="true">${
    trees[treesNewLength].name
  }</h2>
  <span class="date dateCreated">Created: ${
    date.getMonth() + 1
  }/ ${date.getDate()}/${date.getFullYear()}</span>
  <div class="treeControls">
    <i class="fa-solid deleteTree fa-trash"></i>
    <i class="fa-solid loadTree fa-arrow-right-to-bracket"></i>
  </div>
</div>`;
  localStorage.treesSaved = JSON.stringify(trees);

  return newTreeHtml;
}

/*
 *
 * OPEN INDIVIDUAL TREE
 *
 */

function openTree(index) {
  bodyFadeIn();
  mainContent.classList.remove("treesGrid");
  mainContent.classList.add("mainContentOpenTree");
  const htmlTitle = `<h1 data-index=${index}>${trees[index].name}</h1>`;
  const htmlButtons = `<div class="openTreeActionBtns"><span class="headerBtn headerBtnRed btnHeaderBack" data-index="${index}">Exit</span><span class="headerBtn headerBtnGreen btnHeaderSave" data-index="${index}">Save</span></div>`;
  header.querySelector(".btnNewTreeHeader").remove();
  mainContent.innerHTML = `<section class="treeControlOptions">
  <ul class="openTreeControls">
    
    <li class="addPerson" data-index="${index}"><i data-index="${index}" class="fa-solid fa-user"></i>Add Person</li>
    <li class="addMarriage" data-index="${index}">
      <i data-index="${index}" class="fa-solid fa-ring"></i>Add Marriage
    </li>
    <li class="addPartner" data-index="${index}">
      <i data-index="${index}" class="fa-solid fa-user-group"></i>Add Partner
    </li>
    <li class="copyTree"><i class="fa-solid fa-copy"></i>Copy Tree</li>
    <li class="zoomIn"><i class="fa-solid fa-magnifying-glass-plus"></i>Zoom In</li>
    <li class="zoomOut"><i class="fa-solid fa-magnifying-glass-minus"></i>Zoom Out</li>
    <li class="deleteRow" data-index="${index}"><i data-index="${index}" class="fa-solid fa-circle-minus"></i>Delete Row</li>
    <li class="getHelp"><i class="fa-solid fa-circle-question"></i>Help</li>
  </ul>
</section>
</section>`;
  mainContent.innerHTML += trees[index].html;
  document.getElementById("tableTree").removeAttribute("style");
  header.insertAdjacentHTML("beforeend", htmlTitle);
  header.insertAdjacentHTML("beforeend", htmlButtons);
}

/*
 *
 * ZOOM IN OUT HANDLER
 *
 */

let translate = 0;
function zoomInOut(action) {
  const generationsRows = document.querySelectorAll(".generation");

  if (generationsRows.length > 0) {
    const table = document.getElementById("tableTree");
    const currentSize = window
      .getComputedStyle(table)
      .getPropertyValue("transform")
      .replace("(", "")
      .replace(")", "")
      .replace("matrix", "")
      .replaceAll(",", "")
      .split(" ");
    console.log(currentSize[0]);
    if (currentSize[0] < 1.4 && action === "zoomIn") {
      table.style.transform = `scale(${
        Number(currentSize[0]) + 0.04
      }) translateY(${(translate += 10)}px)`;
      // table.style.transform = `translateY(${Number(currentSize[0]) + 0.04})`;
    } else if (currentSize[0] == 1.4 && action === "zoomIn") {
      toast("Message", "Maximum zoom in.");
    }

    if (currentSize[0] > 1 && action === "zoomOut") {
      table.style.transform = `scale(${
        Number(currentSize[0]) - 0.04
      }) translateY(${(translate -= 10)}px)`;
    } else if (currentSize[0] == 1 && action === "zoomOut") {
      toast("Message", "Maximum zoom out.");
    }
  } else {
    toast("Message", "No tree available, add one generation at least.");
  }
}

/*
 *
 * CREATE OVERLAY
 *
 */

function createOverlay() {
  popupOverlay = document.createElement("section");
  popupOverlay.classList.add("popupOverlay");
}

/*
 *
 * INSERT OVERLAY
 *
 */

function insertOverlay() {
  document.body.insertAdjacentElement("beforeend", popupOverlay);
}

/*
 *
 * CREATE FORMS
 *
 */

function createForm(index, formType, formClass = "addPersonForm") {
  createOverlay();
  form = document.createElement("form");
  form.classList.add(formClass);
  form.setAttribute("autocomplete", "off");
  form.dataset.index = index;
  popupOverlay.insertAdjacentElement("beforeend", form);
  form.innerHTML = formsHtml(
    formType,
    `${formType === "marriage" ? true : ""}`
  );
  insertOverlay();
}

/*
 *
 * CREATE EDITION
 *
 */

function createEdition(index, content, id) {
  createOverlay();
  popupOverlay.classList.add("editionOverlay");
  const title = document.createElement("h1");
  title.classList.add("editionTitle");
  title.innerHTML = `<span>Editing:</span> ${id.toUpperCase()}`;
  const overlayContainer = document.createElement("div");
  overlayContainer.classList.add("overlayContainer");
  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("editionBtnsContainer");
  const editionDiv = document.createElement("div");
  editionDiv.classList.add("editionDiv");
  editionDiv.setAttribute("contenteditable", true);
  editionDiv.innerHTML = content;
  const saveButton = document.createElement("span");
  saveButton.classList.add("headerBtn", "headerBtnGreen", "saveEdition");
  saveButton.textContent = "Save";
  saveButton.dataset.generation = id;
  saveButton.dataset.index = index;
  const cancelButton = document.createElement("span");
  cancelButton.classList.add("headerBtn", "headerBtnRed", "cancelEdition");
  cancelButton.textContent = "Cancel";
  cancelButton.dataset.generation = id;
  cancelButton.dataset.index = index;
  popupOverlay.insertAdjacentElement("beforeend", overlayContainer);
  overlayContainer.insertAdjacentElement("beforeend", title);
  overlayContainer.insertAdjacentElement("beforeend", editionDiv);
  overlayContainer.insertAdjacentElement("beforeend", buttonsContainer);
  buttonsContainer.insertAdjacentElement("beforeend", cancelButton);
  buttonsContainer.insertAdjacentElement("beforeend", saveButton);
  insertOverlay();
  const element = document.querySelector(".editionDiv");
  const range = document.createRange();
  const set = window.getSelection();
  const childNodesLength = element.childNodes.length - 1;
  const nodeLength = element.childNodes[childNodesLength].length;
  range.setStart(element.childNodes[childNodesLength], nodeLength);
  range.collapse(true);
  set.removeAllRanges();
  set.addRange(range);
  element.focus();
}

/*
 *
 * CREATE CONTENT OVERLAY
 *
 */

function createContentOverlay() {
  createOverlay();
  const contentSection = document.createElement("section");
  contentSection.classList.add("appHelp", "appInstructions", "contentSection");
  popupOverlay.insertAdjacentElement("beforeend", contentSection);
  contentSection.appendChild(helpContent());
  insertOverlay();
}

/*
 *
 * HELP SECTION CONTENT
 *
 */

function helpContent() {
  const instructions = [
    "Every tree created is saved in the local storage. In order to see the saved trees everytime the website is visited, the same browser and computer must be used. If the computer and/or browser is changed, the trees available could be different. ",
    "Every action available can be found in the controls at the bottom, the name is self-explanatory.",
    'Whenever a tree is ready to be exported, the "Copy Tree" option can be clicked and then pasted in a Google Document or Microsoft Word.',
    'If "Delete Generation" is clicked, it will delete the last row in the table, meaning the last generation added.',
    "If the generation info is clicked, a window to edit that generation will open.",
    "The limit of generations is 20",
  ];
  const instructionsList = document.createElement("ul");
  instructions.forEach((element, i) => {
    const li = document.createElement("li");
    li.textContent = element;
    instructionsList.appendChild(li);
  });
  return instructionsList;
}

/*
 *
 * HTML TO INSERT INTO FORMS
 *
 */

function formsHtml(typeOfForm, isMarriage = false) {
  const generationsRows = document.querySelectorAll(".generation");
  // console.log(generationsRows);
  let generationIndex =
    typeOfForm === "marriage" ||
    (typeOfForm === "partner" && generationsRows.length > 0)
      ? generationsRows.length - 1
      : generationsRows.length;
  // console.log(generationIndex);
  const type = typeOfForm;
  const marriage = isMarriage;
  if (marriage) {
    return `<h1><i class="fa-solid fa-ring"></i>Add marriage (${generations[generationIndex]})</h1>
    <div class="inputContainerSingle">
      <h2>Marriage Details</h2>
      
      <label for="marriagePlace">Place of marriage</label>
      <input type="text" name="marriagePlace" id="marriagePlace">
    </div>
    <div class="inputContainerSingle">
      <div class="inputContainerDate">
        <div>
          <label for="marriageDay">Day</label>
          <input type="text" name="marriageDay" id="marriageDay">
        </div>
        <div>
          <label for="marriageMonth">Month</label>
          <input type="text" name="marriageMonth" id="marriageMonth">
        </div>
        <div>
          <label for="marriageYear">Year</label>
          <input type="text" name="marriageYear" id="marriageYear">
        </div>
      </div>
      
  
    </div>
    <input class="submitMarriageButton" id="addMarriageSubmit" type="submit" value="Add Marriage">`;
  } else {
    return `<h1><i class="fa-solid fa-${
      type === "principal" ? "user" : "user-group"
    }"></i>Add ${
      type === "principal"
        ? `person (${generations[generationIndex]})`
        : `partner (${generations[generationIndex]})`
    }</h1>
  <div class="inputContainerSingle">
    <label for="${type}Name">Name</label>
    <input type="text" name="${type}Name" id="${type}Name">
  </div>
  <div class="inputContainerSingle">
    <label for="${type}EventType">Event type</label>
    <select name="${type}EventType" id="${type}EventType">
      <option value="n">Birth</option>
      <option value="b">Baptism</option>
    </select>
  </div>
  
  <div class="inputContainerSingle">
  <h2>Event Details</h2>
  
  <label for="${type}EventPlace">Place of event</label>
  <input type="text" name="${type}EventPlace" id="${type}EventPlace">
</div>
<div class="inputContainerSingle">
  <div class="inputContainerDate">
    <div>
      <label for="${type}EventDay">Day</label>
      <input type="text" name="${type}EventDay" id="${type}EventDay">
    </div>
    <div>
      <label for="${type}EventMonth">Month</label>
      <input type="text" name="${type}EventMonth" id="${type}EventMonth">
    </div>
    <div>
      <label for="${type}EventYear">Year</label>
      <input type="text" name="${type}EventYear" id="${type}EventYear">
    </div>
  </div>
  

</div>

<div class="inputContainerSingle">
    <h2>Death Details</h2>
    <div class="checkMarks">
      <input class="deathDetailsCheckbox" type="checkbox" name="addPersonDeathDetails" id="${type}Alive" value="alive">
      <label for="${type}Alive">Person still alive</label>
      <input class="deathDetailsCheckbox" type="checkbox" name="addPersonDeathDetails" id="${type}DeathDateNotKnown" value="nodetails">
      <label for="${type}DeathDateNotKnown">Death details unknwon</label>
    </div>
    <label for="${type}DeathPlace">Place of death</label>
    <input class="leadPersonDeathDetails" type="text" name="${type}DeathPlace" id="${type}DeathPlace">
  </div>
  
  <div class="inputContainerSingle">
    <div class="inputContainerDate">
      <div>
        <label for="${type}DeathDay">Day</label>
        <input class="leadPersonDeathDetails" type="text" name="${type}DeathDay" id="${type}DeathDay">
      </div>
      <div>
        <label for="${type}DeathMonth">Month</label>
        <input class="leadPersonDeathDetails" type="text" name="${type}DeathMonth" id="${type}DeathMonth">
      </div>
      <div>
        <label for="${type}DeathYear">Year</label>
        <input class="leadPersonDeathDetails" type="text" name="${type}DeathYear" id="${type}DeathYear">
      </div>
    </div>
    

  </div>
  <input class="submitDataButton" id="${type}Submit" type="submit" value="Add ${type}">`;
  }
}

/*
 *
 * GET VALUES FROM FORMS
 *
 */

function getFormValues(type) {
  personName =
    type === "principal"
      ? document.getElementById(`${type}Name`).value.trim().toUpperCase()
      : document.getElementById(`${type}Name`).value.trim();
  eventType = document.getElementById(`${type}EventType`).value.trim();
  eventPlace = document.getElementById(`${type}EventPlace`).value.trim();
  eventDay = document.getElementById(`${type}EventDay`).value.trim();
  eventMonth = document.getElementById(`${type}EventMonth`).value.trim();
  eventYear = document.getElementById(`${type}EventYear`).value.trim();
  deathCheckbox = document.querySelector(".deathDetailsCheckbox:checked")
    ? document.querySelector(".deathDetailsCheckbox:checked").value.trim()
    : "";
  placeOfDeath = document.getElementById(`${type}DeathPlace`).value.trim();
  deathDay = document.getElementById(`${type}DeathDay`).value.trim();
  deathMonth = document.getElementById(`${type}DeathMonth`).value.trim();
  deathYear = document.getElementById(`${type}DeathYear`).value.trim();
}

/*
 *
 * COPY TREE
 *
 */

function copyTree() {
  const generationsRows = document.querySelectorAll(".generation");

  if (generationsRows.length > 0) {
    let copyTable = document.getElementById("tableTree");
    //   console.log(copyTable);
    //   console.log(copyTable.rows);

    //   console.log(navigator.clipboard.readText());

    let range = document.createRange();
    let sel = window.getSelection();
    // unselect any element in the page
    range = document.createRange();
    sel = window.getSelection();
    // unselect any element in the page
    sel.removeAllRanges();

    try {
      range.selectNodeContents(copyTable);
      sel.addRange(range);
    } catch (e) {
      range.selectNode(copyTable);
      sel.addRange(range);
    }

    document.execCommand("copy");
    sel.removeAllRanges();
    console.log("Element Copied! Paste it in a file");
    toast("Success", "Tree copied");
  } else {
    toast("Message", "No tree available, add one generation at least.");
  }
}

/*
 *
 * TOAST GENERATOR
 *
 */

function toast(status, message) {
  // const container =
  // if(){}

  let container;
  if (!document.querySelector(".toastContainer")) {
    container = document.createElement("div");
    container.classList.add("toastContainer");
    mainContent.insertAdjacentElement("beforeend", container);
  } else {
    container = document.querySelector(".toastContainer");
  }

  if (container) {
    const html = `<div class="toast toast${status} fadeIn"><i class="fa-solid fa-circle-${
      status === "Success" ? "check" : "exclamation"
    }"></i><span>${message}</span></div>`;
    container.insertAdjacentHTML("beforeend", html);

    setTimeout(() => {
      document.querySelector(".toast").classList.add("fadeOut");
    }, 3500);
  }

  setTimeout(() => {
    document.querySelector(".toast").remove();
  }, 3990);

  setTimeout(() => {
    if (container && container.innerHTML.trim().length == 0) {
      container.remove();
    }
  }, 4200);
}

/*
 *
 * SAVE TREE
 *
 */

function saveTree(treeIndex) {
  const table = document.getElementById("tableTree");
  const generationsRows = document.querySelectorAll(".generation");
  const index = Number(treeIndex);
  if (generationsRows.length > 0) {
    trees[index].html = table.outerHTML;
    localStorage.treesSaved = JSON.stringify(trees);
    toast("Success", "Tree saved");
  } else {
    toast("Warning", "No tree available, add a generation first");
  }
}

/*
 *
 * BODY FADE IN
 *
 */

function bodyFadeIn() {
  document.body.classList.add("fadeIn");
  setTimeout(() => {
    document.body.classList.remove("fadeIn");
  }, 990);
}
