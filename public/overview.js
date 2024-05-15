document.addEventListener("DOMContentLoaded", function () {
  var toggleButton1 = document.getElementById("toggleButton");
  var elementToToggle1 = document.getElementById("toggle-element");

  var toggleButton2 = document.getElementById("toggleButton2");
  var elementToToggle2 = document.getElementById("toggle-element2");
  toggleButton1.addEventListener("click", function () {
    elementToToggle1.classList.toggle("hidden");
  });

  toggleButton2.addEventListener("click", function () {
    elementToToggle2.classList.toggle("hidden");
  });
});
