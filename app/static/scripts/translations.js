const translations = {
  historial: {
    espanol: "Historial",
    ingles: "History",
  },
  idiomas: {
    espanol: "Idiomas",
    ingles: "Languages",
  },
  espanol: {
    espanol: "Español",
    ingles: "Spanish",
  },
  ingles: {
    espanol: "Inglés",
    ingles: "English",
  },
  titulo: {
    espanol: "Automata Finito",
    ingles: "Finite Automaton",
  },
  palabra: {
    espanol: "Palabra",
    ingles: "Word",
  },
};

function changeLanguage(lang) {
  const elementsToTranslate = document.querySelectorAll("[data-translate]");

  elementsToTranslate.forEach((element) => {
    const translationKey = element.getAttribute("data-translate");
    const translation = translations[translationKey][lang];
    if (translation) {
      element.textContent = translation;
    }
  });
}

document.querySelectorAll(".nav_link--inside").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const lang = link.getAttribute("data-translate");
    changeLanguage(lang);
  });
});

changeLanguage("espanol");

const supertitulo = document.querySelector(".supertitulo h2");

document.querySelectorAll('[data-translate]').forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault();

    const selectedLanguage = this.getAttribute('data-translate');

    const translations = {
      espanol: 'Automata Finito',
      ingles: 'Finite Automaton',
    };

    if (translations[selectedLanguage]) {
      supertitulo.textContent = translations[selectedLanguage];
    }
  });
});