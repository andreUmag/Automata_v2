let listelement = document.querySelectorAll(".list_button--click");

listelement.forEach((listelement) => {
  listelement.addEventListener("click", () => {
    listelement.classList.toggle("arrow");

    let height = 0;
    let menu = listelement.nextElementSibling;

    if (menu.clientHeight == "0") {
      height = menu.scrollHeight;
    }
    menu.style.height = `${height}px`;
  });
});

const slideValue = document.querySelector("span");
const inputSlider = document.querySelector("input");
inputSlider.oninput = () => {
  let value = inputSlider.value;
  slideValue.textContent = value;
  slideValue.style.left = value + "%";
  slideValue.classList.add("show");
};
inputSlider.onblur = () => {
  slideValue.classList.remove("show");
};

document.addEventListener("DOMContentLoaded", function() {
  const inputField = document.getElementById("input-word");
  const addButton = document.getElementById("add-word-button");
  const wordList = document.getElementById("word-list");

  console.log(inputField); // Verifica si inputField es null
  console.log(addButton); // Verifica si addButton es null
  console.log(wordList);  // Verifica si wordList es null

  addButton.addEventListener("click", function(event) {
    event.preventDefault();

    const inputValue = inputField.value.trim();

    if (inputValue !== "") {
      const listItem = document.createElement("li");
      listItem.textContent = inputValue;

      wordList.appendChild(listItem);

      inputField.value = "";
    }
  });
});



