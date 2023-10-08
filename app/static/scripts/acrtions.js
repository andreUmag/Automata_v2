// seccion para el funcionamiento del menu lateral
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

// seccion para el funcionamiento del slider de velocidad
const slideValue = document.querySelector("span");
const inputSlider = document.querySelector("input");
let valorInput = ""; //variable que registra el valor de la velocidad

function transformarValorInput(value) {
  // Convierte el valor de 10 a 100 a un valor entre 1 y 2
  return 1 + (value - 10) / 90;
}
inputSlider.oninput = () => {
  let value = inputSlider.value;
  slideValue.textContent = value;
  slideValue.style.left = value + "%";
  slideValue.classList.add("show");
  valorInput = transformarValorInput(value);
};
inputSlider.onblur = () => {
  slideValue.classList.remove("show");
};


// seccion para elfuncionamiento de la entrada de palabras y mostrar las palabras en la lista del menu
document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("input-word");
  const addButton = document.getElementById("add-word-button");
  const wordList = document.getElementById("word-list");

  addButton.addEventListener("click", function (event) {
    event.preventDefault();

    const inputValue = inputField.value.trim();

    const regex = /^[abAB]+$/;

    if (regex.test(inputValue)) {
      const listItem = document.createElement("li");
      listItem.textContent = inputValue;

      if (wordList.children.length >= 5) {
        wordList.removeChild(wordList.lastChild);
      }

      wordList.insertBefore(listItem, wordList.firstChild);

      inputField.value = "";
    } else {
      alert("La palabra solo debe contener las letras 'a' y 'b'.");
    }
  });
});
