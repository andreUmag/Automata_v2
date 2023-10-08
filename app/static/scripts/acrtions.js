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



document.addEventListener("DOMContentLoaded", function () {
let check = document.getElementById("add-word-button");

check.onclick = function () {
  var text = document.getElementById("input-word").value;
  var speed = document.getElementById("speed").value;
  unpaint(myDiagram);
  check_word(text, 0, myDiagram.findNodeForKey(0));


}

function check_word(text, index, node) {
  window.setTimeout(function () {
    paint_node(node);
    window.setTimeout(function () {
      if(index<text.length) {
        let links = node.findTreeChildrenLinks();
        let link = links.ub._dataArray.filter(function (link) {return link.data.text == text[index] && link.fromNode == node;});
        if(link.length == 0) {
          unpaint(myDiagram);
          check_acceptance_status(node);
        } else if(link[0].data.text == text[index]) {
          paint_link(link[0]);
          return check_word(text, index+1, link[0].toNode.data.id);
        }
      }
    }, 1000);

  },1000);


}

function unpaint(diagram) {
  for(var i = 0; i <=10; i++) {
    var node = diagram.findNodeForKey(i);
    var shape = node.findObject("SHAPE")
    shape.fill = "white";
  }
}

function paint_node(node) {
  var shape = node.findObject("SHAPE")
  shape.fill = "green";
}

function paint_link(link) {
  window.setTimeout(function(){ 
    link.path.stroke = "#52ce60";
  },1000);
  window.setTimeout(function(){ 
    link.path.stroke = "black";
  },1000);
}

function check_acceptance_status(node) {
  if(node.data.category=="accept") {
    return true;
  } else {
    return false;
  }
}



});