//header-right-res

const header = document.querySelector(".header");
const hamburger = document.querySelector(".hamburger");
const hamburgerIcon = document.querySelector(".fa-bars");
const closeIcon = document.querySelector(".fa-xmark");
const headerRight = document.querySelector(".header-right");
hamburger.addEventListener("click", function() {
console.log("Ham Clicked")
headerRight.classList.toggle("header-right-res");
closeIcon.classList.toggle("none");
hamburgerIcon.classList.toggle("none");
headerRight.classList.toggle("none");
header.classList.toggle("h-full");
header.classList.toggle("h-normal");

logo.classList.toggle("none");

})