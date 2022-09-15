/*  */
$(document).ready(function () {
  let dataPayload = {};
  let statusPossibles = {
    contact: "PERSONAL_INFORMATION",
  };
  let currentStatus = statusPossibles.contact;

  const sendConfirmationMessage = document.getElementById("send-confirmation");
  sendConfirmationMessage.style.display = "none";

  const phoneInputField = document.getElementById("phone-number");
  const phoneInput = window.intlTelInput(phoneInputField, {
    separateDialCode: true,
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  });

  function formatPhone(n) {
    return n.replace(/\D/g, "");
  }

  function formatEmail(email) {
    let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    return regex.test(email);
  }

  let currentState = 0;

  function saveCreditApp(cb) {
    const payload = getData();
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://mp-portal-git-develop-machinerypartner.vercel.app/api/credit-app/start",
      true
    );
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(payload));
    xhr.onload = function () {
      cb(this.status);
    };
  }

  let submitButton = document.getElementById("credit-app-start");
  submitButton.style.pointerEvents = "none";
  $("#credit-app-submit").on("click", function (event) {
    event.preventDefault();
    currentStatus = statusPossibles.submited;
    saveCreditApp(function () {});
    $(this).submit();
    // formConfirmation.style.display = "block";
  });

  function checkInfos() {
    let countRequiredFields = 0;
    for (const step of creditAppState) {
      const { fields } = step;
      countRequiredFields += checkRequirements(fields);
    }
    if (countRequiredFields === 0) {
      submitButton.style.pointerEvents = "auto";
      submitButton.classList.remove("is-disable");
      getData();
    } else {
      submitButton.style.pointerEvents = "none";
      submitButton.classList.add("is-disable");
    }
  }

  let creditAppState = [
    {
      button: submitButton,
      fields: {
        fullName: {
          value: "",
          tag: "Name",
          state: false,
          required: true,
          validate: function (_input) {
            if (_input && _input.length >= 5) {
              return { status: true, message: "" };
            } else if (_input && _input.length < 5) {
              return { status: false, message: "Minimum characters 5" };
            }
            return { status: false, message: "Mandatory field" };
          },
        },
        email: {
          value: "",
          tag: "Email-3",
          state: false,
          required: true,
          validate: function (_input) {
            if (!formatEmail(_input)) {
              return { status: false, message: "Invalid email!" };
            }
            if (_input && _input.length >= 5) {
              return { status: true, message: "" };
            } else if (_input && _input.length < 5) {
              return { status: false, message: "Minimum characters 5" };
            }
            return { status: false, message: "Mandatory field" };
          },
        },
        phone: {
          value: "",
          tag: "phone-number",
          state: false,
          required: true,
          keyup: function () {
            document.getElementById("phone-number").value = formatPhone(
              document.getElementById("phone-number").value
            );
          },
          validate: function (_input) {
            const isValid = phoneInput.isValidNumber();
            if (isValid) {
              return { status: true, message: "" };
            } else if (_input !== "") {
              return { status: false, message: "Phone invalid!" };
            }
            return { status: false, message: "Mandatory field" };
          },
        },
      },
    },
  ];

  function checkRequirements(fields) {
    let count = 0;
    for (const name in fields) {
      const inputData = fields[name];
      if (inputData.required && inputData.value === "" && !inputData.state) {
        count += 1;
      }
    }
    return count;
  }

  function validateBlockFields(fields, index) {
    for (const property in fields) {
      const field = fields[property];
      const input = document.getElementById(field.tag);
      if (input) {
        const ret = field.validate(input.value);
        if (ret) {
          field.state = ret.status;
          if (input.nextSibling)
            input.nextSibling.innerHTML = ret.message || "";
        }
      }
    }
    let countRequiredFields = checkRequirements(fields);
    if (countRequiredFields === 0) {
      // setIconStatusOk(formStatus[index]);
    } else {
      // setIconStatusError(formStatus[index]);
    }
  }

  for (const step of creditAppState) {
    const { fields } = step;
    for (const name in fields) {
      const inputData = fields[name];
      $(`#${inputData.tag}`).on({
        change: function (event) {
          if (inputData.change) {
            const resp = inputData.change(event);
            inputData.value = resp.status;
            inputData.state = inputData.value;
          }
        },
        keyup: function (event) {
          if (inputData.keyup) inputData.keyup($(this));
        },
        focus: function (event) {
          if (inputData.focus) inputData.focus($(this));
        },
        blur: function (event) {
          const fields = creditAppState[currentState].fields;
          validateBlockFields(fields, currentState);
          if (inputData.blur) inputData.blur($(this));
          let inputValue = event.currentTarget.value;
          if (!inputData.validate) {
            inputData.state = true;
            return;
          }

          const isValid = inputData.validate(inputValue);

          if (!isValid) {
            return;
          }
          inputData.value = inputValue;
          if (isValid.data) {
            inputData.value = isValid.data;
          }
          if (isValid.status) {
            let countRequiredFields = checkRequirements(fields);
            if (countRequiredFields === 0) {
              // setIconStatusOk(formStatus[currentState]);
            }
            if (!inputData.state) {
              inputData.state = true;
              inputData.value = inputValue;
              if (event.currentTarget.nextSibling) {
                event.currentTarget.nextSibling.innerHTML = "";
              } else if (event.currentTarget.offsetParent.nextSibling) {
                event.currentTarget.offsetParent.nextSibling.innerHTML = "";
              }
            }
          } else {
            if (inputData.state) {
              inputData.state = false;
            }
            // setIconStatusError(formStatus[currentState]);
            if (event.currentTarget.nextSibling) {
              event.currentTarget.nextSibling.innerHTML = isValid.message;
            } else if (event.currentTarget.offsetParent.nextSibling) {
              event.currentTarget.offsetParent.nextSibling.innerHTML =
                isValid.message;
            }
          }
          checkInfos(); //
        },
      });
    }
  }

  checkInfos();

  function getData() {
    creditAppState.forEach(function (row) {
      for (const property in row.fields) {
        dataPayload[property] = row.fields[property].value;
      }
    });
    dataPayload["status"] = currentStatus;
    return dataPayload;
  }
});
