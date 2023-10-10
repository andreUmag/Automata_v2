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


// Section for the operation of word input and displaying words in the menu list
document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("input-word");
  const addButton = document.getElementById("add-word-button");
  const wordList = document.getElementById("word-list");

  addButton.addEventListener("click", function (event) {
    event.preventDefault();
    var text = inputField.value.trim();
    inputField.value = "";

    if (check_text_with_regex(text) && text != "") {
      const listItem = document.createElement("li");
      listItem.textContent = inputValue;

      if (wordList.children.length >= 5) {
        wordList.removeChild(wordList.lastChild);
      }

      wordList.insertBefore(listItem, wordList.firstChild);

    } else {
      inputField.value = "";
    }
  });
});


function check(){
    
    var text = document.getElementById("input-word").value.toLowerCase();
    var value_slider = document.getElementById("inputSlider").value;
    var speed = transformValorInput(value_slider);
    unpaint();
    if (!check_text_emptying(text)){
      if (check_text_with_regex(text)){
        check_word(text, 0, -1, speed);
      } else {
        alert("La palabra solo debe contener las letras 'a' y 'b'.");
        speak("la palabra solo debe contener las letras a y b")
      }
    } else {
      alert("No se ha ingresado ninguna cadena de texto.");
      speak("No se ha ingresado ninguna cadena de texto.")
    }
    
}

function check_word(text, index, keynode, speed) {
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
          paint_link(link[0], speed);
          return check_word(text, index+1, link[0].toNode.data.id, speed);
        }
      } else {
        check_acceptance_status(node);
      }
    }, speed);
  },speed/2);
}

function unpaint() {
  myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
}

function check_text_with_regex(text) {
  if (text.match(/^[abAB]+$/)) {
    return true;
  } else {
    return false;
  }
}

function check_text_emptying(text) {
  if (text == "") {
    return true;
  } else {
    return false;
  }
}

function transformValorInput(velocity) {
  if (velocity == 5){
    return 250;
  }else if(velocity == 4){
    return 625;
  }else if(velocity == 3){
    return 1000;
  }else if(velocity == 2){
    return 1500;
  }else{
    return 2000;
  }
}

function paint_node(node) {
  var shape = node.findObject("SHAPE");
  shape.fill = "#A5D7F4";
}

function unpaint_node(node) {
  var shape = node.findObject("SHAPE");
  shape.fill = "white";
}

function paint_link(link, speed) {
  link.path.stroke = "#A5D7F4";
  var shape = link.findObject("arrow");
  shape.fill = "#7BCAF8";
  window.setTimeout(function(){ 
    link.path.stroke = "black";
    shape.fill = "black";
  },speed);
}

function check_acceptance_status(node) {
  if(node.data.category=="accept") {
    speak("La palabra ha sido aceptada");
    alert("Cadena aceptada");
    return true;
    } else {
    speak("La palabra ha sido rechazada");
    alert("Cadena rechazada");
    return false;
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
