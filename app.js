window.onscroll = function () {
  myFunction();
};
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#nav-links");
const closeIcon = document.querySelector("#close-icon");
const navBar = document.querySelector(".navbar");

// This is the function to toggle the visibility of the nav links
function toggleNavLinks() {
  // To check if navLinks is currently visible by checking its right style
  if (navLinks.style.right === "0px" || navLinks.style.right === "0") {
    navLinks.style.right = "-500px";
  } else {
    navLinks.style.right = "0";
  }
}

menuToggle.addEventListener("click", toggleNavLinks);
closeIcon.addEventListener("click", toggleNavLinks);

// FOR STICKY NAVBAR..



const sticky = navBar.offsetTop;

/* Function to stick the nav bar */
function myFunction() {
  if (window.pageYOffset >= sticky) {
    navBar.classList.add("sticky");
  } else {
    navBar.classList.remove("sticky");
  }
}
