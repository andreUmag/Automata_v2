// Section for the operation of the side menu
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

// Section for the speed slider functionality
const slideValue = document.querySelector("span");
const inputSlider = document.querySelector("input");
var valorInput = "";

function transformValorInput(value) {
  result = (value - 10) / 90 * 1750 + 250
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


// Section for the operation of word input and displaying words in the menu list
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
      speak("Cadena escrita incorrectamente, la palabra solo debe contener las letras 'a' y 'b'.")
    }
  });
});


function check(){

  var text = document.getElementById("input-word").value.toLowerCase();
    unpaint();
    check_word(text, 0, -1);

    function check_word(text, index, keynode) {
    node= myDiagram.findNodeForKey(keynode);
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
            unpaint_node(node);
            paint_link(link[0]);
            return check_word(text, index+1, link[0].toNode.data.id);
          }
        } else {
          check_acceptance_status(node);
        }
      }, 500);
    },500);
  }
  
  function unpaint() {
    myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
  }
  
  
  function paint_node(node) {
    var shape = node.findObject("SHAPE");
    shape.fill = "#A5D7F4";
  }
  
  function unpaint_node(node) {
    var shape = node.findObject("SHAPE");
    shape.fill = "white";
  }
  
  function paint_link(link) {
    link.path.stroke = "#A5D7F4";
    var shape = link.findObject("arrow");
    shape.fill = "#7BCAF8";
    window.setTimeout(function(){ 
      link.path.stroke = "black";
      shape.fill = "black";
    },1000);
  }
  
  function check_acceptance_status(node) {
    if (text.match(/^[abAB]+$/)) {
        if(node.data.category=="accept") {
        alert("Cadena aceptada");
        speak("La palabra ha sido aceptada");
        return true;
        } else {
        alert("Cadena rechazada");
        speak("La palabra ha sido rechazada");
        return false;
        }
    }
  }
}

function speak(text) {
  if ('speechSynthesis' in window) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = 'es-ES';
    speechSynthesis.speak(speech);
  } else {
    console.log("La síntesis de voz no es compatible con este navegador.");
  }
}