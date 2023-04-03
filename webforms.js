

const section1 = document.getElementById("contact-form-section-1");
const section2 = document.getElementById("contact-form-section-2");
const section3 = document.getElementById("contact-form-section-3");
const nextBtn1 = document.getElementById("next-btn-1");
const nextBtn2 = document.getElementById("next-btn-2");
const backBtn2 = document.getElementById("back-btn-2");
const backBtn3 = document.getElementById("back-btn-3");

const errorDiv = emailForm.parentElement.querySelector(
    '[data-form=error]')

console.log('errorDiv', errorDiv)

nextBtn1.addEventListener("click", function() {
        section1.style.display = "none";
        section2.style.display = "block";
        section2.style.height = "auto";
});

nextBtn2.addEventListener("click", function() {
      section2.style.display = "none";
      section3.style.display = "block";
      section3.style.height = "auto";
});

backBtn2.addEventListener("click", function() {
    section2.style.display = "block";
    section2.style.display = "auto";
    section3.style.display = "none";
});

backBtn3.addEventListener("click", function() {
    section3.style.display = "none";
    section2.style.display = "block";
    section2.style.height = "auto";
});