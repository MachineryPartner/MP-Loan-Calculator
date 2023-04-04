
const startPopUp = document.getElementById("contact-form-initiatior");
const section1 = document.getElementById("contact-form-section-1");
const section2 = document.getElementById("contact-form-section-2");
const section3 = document.getElementById("contact-form-section-3");
const nextBtn1 = document.getElementById("contact-form-to-section-2");
const nextBtn2 = document.getElementById("contact-form-to-section-3");
const backBtn2 = document.getElementById("contact-form-back-to-section-1");
const backBtn3 = document.getElementById("contact-form-back-to-section-2");

/* const errorDiv = emailForm.parentElement.querySelector(
    '[data-form=error]')

console.log('errorDiv', errorDiv) */

startPopUp.addEventListener("click", function() {
    section1.style.display = "none";
    section1.style.display = "block";
    section1.style.height = "auto";
    section2.style.display = "none";
    section3.style.display = "none";
    console.log("starting")
    
});

nextBtn1.addEventListener("click", function() {
    validateSection1(); 

});

nextBtn2.addEventListener("click", function() {
      section2.style.display = "none";
      section3.style.display = "block";
      section3.style.height = "auto";
    console.log("step2")
});

backBtn2.addEventListener("click", function() {
    section2.style.display = "none";
    section1.style.display = "block";
    section1.style.height = "auto";
    console.log("backstep1")
});

backBtn3.addEventListener("click", function() {
    section3.style.display = "none";
    section2.style.display = "block";
    section2.style.height = "auto";
    console.log("backstep2")
});

/* function validateSection(section) {
    const requiredFields = section.querySelectorAll("input[required]")
    let isValid = true;
    requiredFields.forEach(function(field) {
        if (field.value.trim() === "") {
            alert("Please fill out all fields");
            isValid = false;
        }
    });
}; */

function validateSection1() {
    const selectFields = document.querySelectorAll('select');
    let isValid = true

    selectFields.forEach(e => {
        var selectedOption = e.options[e.selectedIndex];
        if (selectedOption.value === '' || selectedOption.value === "Please select") {
            isValid = false;
            alert("Please select something")
        }
        else {
            section1.style.display = "none";
            section2.style.display = "block";
            section2.style.height = "auto";
            console.log("step1")
        }
      });
      console.log(isValid)
}