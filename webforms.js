
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
let section1IsValid = true
let section2IsValid = true

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
    if (section1IsValid === true) {
        section1.style.display = "none";
        section2.style.display = "block";
        section2.style.height = "auto";
    }

});

nextBtn2.addEventListener("click", function() {
    validateSection2()
    if (section2IsValid === true) {
      section2.style.display = "none";
      section3.style.display = "block";
      section3.style.height = "auto";
    }
});

backBtn2.addEventListener("click", function() {
    section2.style.display = "none";
    section1.style.display = "block";
    section1.style.height = "auto";
    validateSection1();
});

backBtn3.addEventListener("click", function() {
    section3.style.display = "none";
    section2.style.display = "block";
    section2.style.height = "auto";
});

function validateSection1() {
    const selectFields = section1.querySelectorAll('select');

    selectFields.forEach(e => {
        var selectedOption = e.options[e.selectedIndex]
        var selectedOptionText = selectedOption.text;
        if (selectedOptionText === "Please select") {
            selectedOption.setAttribute('disabled', '');
        }
        if (selectedOptionText === "Please select") {
            section1IsValid = false;
            throw BreakException;
        }
        else {
            section1IsValid = true;
        }
      });
}

function validateSection2() {
    const inputFields = section2.querySelectorAll('input[type="text"]');
    const emailInput = document.getElementById("contact-form-email");
    
    inputFields.forEach(function(inputFields) {
        const inputValue = inputFields.value.trim();
        if (inputValue === '') {
            section2IsValid = false;
            throw BreakException;
        }
        else {
            section2IsValid = true;
        }
        console.log(inputValue)
      });

}