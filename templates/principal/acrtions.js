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
