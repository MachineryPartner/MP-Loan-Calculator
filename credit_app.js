/*  */
$(document).ready(function () {
  const checkBoxOwnerYes = document.getElementById("ownerYes");
  checkBoxOwnerYes.click();
  let dataPayload = {};
  var value = "";

  const inputOwner = document.getElementById("Primary-Owner");
  inputOwner.parentElement.style.display = "none";

  const phoneInputField = document.getElementById("Phone-number-3");
  const phoneInput = window.intlTelInput(phoneInputField, {
    separateDialCode: true,
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  });
  function formatNumber(n) {
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function formatPhone(n) {
    return n.replace(/\D/g, "");
  }

  function formatEmail(email) {
    let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    return regex.test(email);
  }

  function formatCurrency(input, blur) {
    let currencyTag = blur ? "$" : "";
    let input_val = input.val();
    if (input_val === "") {
      return;
    }
    const original_len = input_val.length;
    let caret_pos = input.prop("selectionStart");
    if (input_val.indexOf(".") >= 0) {
      const decimal_pos = input_val.indexOf(".");
      let left_side = input_val.substring(0, decimal_pos);
      let right_side = input_val.substring(decimal_pos);
      left_side = formatNumber(left_side);
      right_side = formatNumber(right_side);
      right_side = right_side.substring(0, 2);
      input_val = currencyTag + left_side + "." + right_side;
    } else {
      input_val = formatNumber(input_val);
      input_val = currencyTag + input_val;
    }
    input.val(input_val);
    const updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input[0].setSelectionRange(caret_pos, caret_pos);
  }
  let currentState = 0;

  let blockStates = {
    block: "none",
    none: "block",
  };
  function handleBlockVisibility(currentState) {
    return blockStates[currentState];
  }

  function saveCreditApp(cb) {
    const payload = getData();
    $.ajax({
      url: "localhost:3000/api/credit-app/create",
      type: "post",
      data: payload,
    })
      .done(function (msg) {
        // console.log("response: ", msg);
        cb(true);
      })
      .fail(function (jqXHR, textStatus, msg) {
        cb(false);
      });
  }

  function nextBlock(_currentState) {
    currentState = _currentState;
    currentStage = _currentState;
    formBlocks[currentState - 1].style.display = "none";
    formBlocks[currentState].style.display = "block";
  }
  // Get all Form Blocks
  //finance_form_status
  const formStatus = document.getElementsByClassName("finance_form_status");
  const formBlocks = document.getElementsByClassName("finance_form_content");
  // Reset form state
  for (const block of formBlocks) {
    block.style.display = "none";
    // block.style.pointerEvents = "none"; TODO DEBUG MODE
  }
  formBlocks[0].style.display = "block";
  formBlocks[0].style.pointerEvents = "auto";

  // Set handler for display blocks
  $(".finance_form_header").on("click", function (event) {
    const targetIndex = Number(event.currentTarget.children[0].innerText) - 1;
    currentStage = targetIndex;
    event.currentTarget.nextSibling.style.display = handleBlockVisibility(
      event.currentTarget.nextSibling.style.display
    );
  });

  let submitButtonAmount = document.getElementById("save-button-amount");
  submitButtonAmount.style.pointerEvents = "none";
  $("#save-button-amount").on("click", function (event) {
    nextBlock(1);
  });

  let submitButtonBusiness = document.getElementById("save-button-business");
  submitButtonBusiness.style.pointerEvents = "none";
  $("#save-button-business").on("click", function (event) {
    nextBlock(2);
  });

  let submitButtonContact = document.getElementById("save-button-contact");
  submitButtonContact.style.pointerEvents = "none";
  $("#save-button-contact").on("click", function (event) {
    saveCreditApp(function () {});
    nextBlock(3);
  });

  let submitButtonOwner = document.getElementById("save-button-owner");
  submitButtonOwner.style.pointerEvents = "none";
  $("#save-button-owner").on("click", function (event) {
    saveCreditApp(function () {});
    nextBlock(4);
  });

  let submitButton = document.getElementById("credit-app-submit");
  submitButton.style.pointerEvents = "none";
  $("#credit-app-submit").on("click", function (event) {
    event.preventDefault();
    saveCreditApp(function () {});
    $(this).submit();
  });

  function validateInput(rule, event, value) {
    const isValid = rule(value);
    if (isValid.status) {
      event.currentTarget.nextSibling.innerHTML = "";
    } else {
      event.currentTarget.nextSibling.innerHTML = isValid.message;
    }
  }

  function setIconStatusOk(form) {
    form.children[1].style.display = "block";
    form.children[2].style.display = "none";
  }

  function setIconStatusError(form) {
    form.children[1].style.display = "none";
    form.children[2].style.display = "block";
  }

  function doSetCaretPosition(oField, iCaretPos) {
    // IE Support
    if (document.selection) {
      // Set focus on the element
      oField.focus();
      // Create empty selection range
      var oSel = document.selection.createRange();

      // Move selection start and end to 0 position
      oSel.moveStart("character", -oField.value.length);

      // Move selection start and end to desired position
      oSel.moveStart("character", iCaretPos);
      oSel.moveEnd("character", 0);
      oSel.select();
    }
    // Firefox support
    else if (oField.selectionStart || oField.selectionStart == "0") {
      oField.selectionStart = iCaretPos;
      oField.selectionEnd = iCaretPos;
      oField.focus();
    }
  }

  function formatZipCode() {
    var zipcode = document.getElementById("Zip-Code").value; // here you get what the end-user typed
    if (zipcode != "") {
      document.getElementById("Zip-Code").value = zipcode.replace(/[^\d]/g, ""); // then you strip off all the spaces

      var zipcode1 = document.getElementById("Zip-Code").value;
      document.getElementById("Zip-Code").value =
        zipcode1.substring(0, 5) + "-" + zipcode1.substring(5, 10);
    }
  }

  let currentStage = 0;
  let creditAppState = [
    {
      button: submitButtonAmount,
      fields: {
        amount: {
          value: "",
          tag: "Loan-Amount",
          state: false,
          required: true,
          keyup: function (_this) {
            formatCurrency(_this, false);
          },
          blur: function (_this) {
            formatCurrency(_this, true);
          },
          focus: function () {
            const input = document.getElementById("Loan-Amount");
            if (input.value !== "") {
              document.getElementById("Loan-Amount").value = currency(
                document.getElementById("Loan-Amount").value
              ).value;
            }
          },
          validate: function (_input) {
            let amount = currency(_input).value;
            if (amount >= 100) {
              return { status: true, message: "" };
            } else if (amount !== 0 && amount < 100) {
              return { status: false, message: "Minimum amount is $100" };
            }
            return { status: false, message: "Mandatory field" };
          },
        },
      },
    },
    {
      button: submitButtonBusiness,
      fields: {
        companyName: {
          value: "",
          tag: "Company-name",
          state: false,
          required: true,
          validate: function (_input) {
            const fields = creditAppState[currentStage].fields;
            if (_input && _input.length >= 5) {
              return { status: true, message: "" };
            } else if (_input && _input.length < 5) {
              return { status: false, message: "Minimum characters 5" };
            }
            return { status: false, message: "Mandatory field" };
          },
        },
        address: {
          value: "",
          tag: "Address-3",
          state: false,
          required: true,
          validate: function (_input) {
            let message = "";
            const fields = creditAppState[currentStage].fields;
            if (_input && _input.length >= 5) {
              return { status: true, message: "" };
            } else if (_input && _input.length < 5) {
              return { status: false, message: "Minimum characters 5" };
            }
            return { status: false, message: "Mandatory field" };
          },
        },
        addressComplement: {
          value: "",
          tag: "Address-4",
          state: false,
          required: false,
          validate: function (_input) {
            return { status: true, message: "" };
          },
        },
        city: {
          value: "",
          tag: "City",
          state: false,
          required: true,
          validate: function (_input) {
            const fields = creditAppState[currentStage].fields;
            if (_input && _input.length >= 3) {
              return { status: true, message: "" };
            } else if (_input && _input.length < 3) {
              return { status: false, message: "Minimum characters 3" };
            }
            return { status: false, message: "Mandatory field" };
          },
        },
        zipCode: {
          value: "",
          tag: "Zip-Code",
          state: false,
          required: true,
          keyup: formatZipCode,
          validate: function (_input) {
            const fields = creditAppState[currentStage].fields;
            if (_input && _input.length === 11) {
              return { status: true, message: "" };
            } else if (_input && _input.length < 11) {
              return { status: false, message: "Zip-code invalid!" };
            }
            return { status: false, message: "Mandatory field" };
          },
        },
        state: {
          value: "",
          tag: "State",
          state: false,
          required: true,
          validate: function (_input) {
            const fields = creditAppState[currentStage].fields;
            if (_input && _input.length >= 5) {
              return { status: true, message: "" };
            } else if (_input && _input.length < 5) {
              return { status: false, message: "Minimum characters 5" };
            }
            return { status: false, message: "Mandatory field" };
          },
        },
      },
    },
    {
      button: submitButtonContact,
      fields: {
        fullName: {
          value: "",
          tag: "Full-name-3",
          state: false,
          required: true,
          validate: function (_input) {
            const fields = creditAppState[currentStage].fields;
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
            const fields = creditAppState[currentStage].fields;
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
          tag: "Phone-number-3",
          state: false,
          required: true,
          keyup: function () {
            document.getElementById("Phone-number-3").value = formatPhone(
              document.getElementById("Phone-number-3").value
            );
          },
          validate: function (_input) {
            const fields = creditAppState[currentStage].fields;
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
    {
      button: submitButtonOwner,
      fields: {
        owner: {
          value: "",
          tag: "Primary-Owner",
          state: false,
          required: false,
          validate: function (_input) {
            const fields = creditAppState[currentStage].fields;
            if (_input && _input.length >= 5) {
              return { status: true, message: "" };
            } else if (_input && _input.length < 5) {
              return { status: false, message: "Minimum characters 5" };
            }
            return { status: false, message: "Mandatory field" };
          },
        },
        ownership: {
          value: "",
          tag: "Ownership",
          state: false,
          required: true,
          focus: function () {
            let input = document.getElementById("Ownership");
            let inputValue = input.value;
            let inputNumber = currency(inputValue).value;
            if (inputNumber !== 0) {
              document.getElementById("Ownership").value = inputNumber;
            } else {
              document.getElementById("Ownership").value = "";
            }
          },
          validate: function (_input) {
            let inputNumber = currency(_input).value;
            if (inputNumber > 100) {
              _input = 100;
              inputNumber = currency(_input).value;
              document.getElementById("Ownership").value = _input;
            }
            const fields = creditAppState[currentStage].fields;
            if (inputNumber && Number(inputNumber) >= 10) {
              return { status: true, message: "" };
            } else if (_input && _input.length < 10) {
              return { status: false, message: "Minimum Ownership: 10%" };
            }
            return { status: false, message: "Mandatory field" };
          },
        },
        ssn: {
          value: "",
          tag: "Security",
          state: false,
          required: true,
          keyup: function () {
            const displayVal = transformDisplay(
              document.getElementById("Security").value
            );
            document.getElementById("Security").value = displayVal;
            transformValue(document.getElementById("Security").value);
          },
          validate: validateSecury,
        },
      },
    },
    {
      button: submitButton,
      fields: {
        releaseCheck: {
          value: "",
          tag: "Release-Information",
          state: false,
          required: true,
          change: function (event) {
            checkRelease = event.currentTarget.checked;
            let responseObj = {};
            if (!checkRelease) {
              responseObj = {
                status: false,
                message: "I authorize (Required)",
              };
            } else {
              responseObj = { status: true, message: "I authorize" };
            }
            setTimeout(function () {
              checkInfos();
            }, 250);
            return responseObj;
          },
          validate: function (_input) {
            checkInfos();
            return undefined;
          },
        },
        shareInfoCheck: {
          value: "",
          tag: "Share-Information",
          state: false,
          required: true,
          change: function (event) {
            checkShareInfo = event.currentTarget.checked;
            let responseObj = {};
            if (!checkShareInfo) {
              responseObj = {
                status: false,
                message: "I authorize (Required)",
              };
            } else {
              responseObj = { status: true, message: "I authorize" };
            }
            setTimeout(function () {
              checkInfos();
            }, 250);
            return responseObj;
          },
          validate: function (_input) {
            checkInfos();
            return undefined;
          },
        },
        creditNoticeCheck: {
          value: "",
          tag: "Credit-Act-Notice",
          state: false,
          required: true,
          change: function (event) {
            checkCreditNotice = event.currentTarget.checked;
            let responseObj = {};
            if (!checkCreditNotice) {
              responseObj = {
                status: false,
                message: "I authorize (Required)",
              };
            } else {
              responseObj = { status: true, message: "I authorize" };
            }
            setTimeout(function () {
              checkInfos();
            }, 250);
            return responseObj;
          },
          validate: function (_input) {
            checkInfos();
            return undefined;
          },
        },
      },
    },
  ];

  function checkInfos() {
    let countRequiredFields = 0;
    for (const step of creditAppState) {
      const { fields } = step;
      countRequiredFields += checkRequirements(fields);
    }

    if (checkRelease && checkShareInfo && checkCreditNotice) {
      setIconStatusOk(formStatus[currentStage]);
    } else {
      setIconStatusError(formStatus[currentStage]);
    }
    if (countRequiredFields === 0) {
      submitButton.style.pointerEvents = "auto";
      submitButton.classList.remove("is-disable");
      getData();
      // console.log("checkInfos: ", {
      //   checkRelease,
      //   checkShareInfo,
      //   checkCreditNotice,
      //   countRequiredFields,
      //   dataPayload,
      // });
    } else {
      submitButton.style.pointerEvents = "none";
      submitButton.classList.add("is-disable");
    }
  }

  function validateSecury(_input) {
    const fields = creditAppState[currentStage].fields;
    const displayVal = transformDisplay(_input);
    transformValue(_input);
    document.getElementById("Security").value = displayVal;
    if (value && value.length === 9) {
      return { status: true, message: "", data: value };
    } else if (value && value.length < 9) {
      return { status: false, message: "Invalid SSN number!", data: value };
    }
    return { status: false, message: "Mandatory field", data: value };
  }

  function transformDisplay(val) {
    // Strip all non numbers
    var displayVal = val.replace(/[^0-9|\\*]/g, "");
    displayVal = displayVal.substr(0, 9);
    // Inject dashes
    if (displayVal.length >= 4) {
      displayVal = displayVal.slice(0, 3) + "-" + displayVal.slice(3);
    }
    if (displayVal.length >= 7) {
      displayVal = displayVal.slice(0, 6) + "-" + displayVal.slice(6);
    }
    // Replace all numbers with astericks
    // displayVal = displayVal.replace(/[0-9]/g, "*");
    return displayVal;
  }

  function transformValue(val) {
    if (typeof value !== "string") {
      value = "";
    }
    if (!val) {
      value = null;
      return;
    }
    var cleanVal = val.replace(/[^0-9|\\*]/g, "");
    cleanVal = cleanVal.substr(0, 9);
    for (i = 0, l = cleanVal.length; i < l; i++) {
      if (/[0-9]/g.exec(cleanVal[i])) {
        value = value.replaceAt(i, cleanVal[i]);
      }
    }
    value = value.substr(0, cleanVal.length);
  }

  function checkRequirements(fields) {
    let count = 0;
    for (const name in fields) {
      const inputData = fields[name];
      if (inputData.required && !inputData.state) {
        count += 1;
      }
    }
    return count;
  }

  for (const step of creditAppState) {
    const { fields } = step;
    for (const name in fields) {
      const button = step.button;
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
            if (!inputData.state) {
              inputData.state = true;
              inputData.value = inputValue;
              if (event.currentTarget.nextSibling) {
                event.currentTarget.nextSibling.innerHTML = "";
              } else if (event.currentTarget.offsetParent.nextSibling) {
                event.currentTarget.offsetParent.nextSibling.innerHTML = "";
              }
              const totalRequiredFields = checkRequirements(fields);
              if (totalRequiredFields === 0) {
                button.style.pointerEvents = "auto";
                button.classList.remove("is-disable");
                setIconStatusOk(formStatus[currentStage]);
                formBlocks[currentStage + 1].style.pointerEvents = "auto";
              }
            }
          } else {
            if (inputData.state) {
              inputData.state = false;
            }
            button.style.pointerEvents = "none";
            button.classList.add("is-disable");
            setIconStatusError(formStatus[currentStage]);
            if (event.currentTarget.nextSibling) {
              event.currentTarget.nextSibling.innerHTML = isValid.message;
            } else if (event.currentTarget.offsetParent.nextSibling) {
              event.currentTarget.offsetParent.nextSibling.innerHTML =
                isValid.message;
            }
          }
        },
      });
    }
  }

  $("#ownerYes").change(function (event) {
    inputOwner.parentElement.style.display = "none";
    let inputSSN = document.getElementById("Security");
    inputSSN.focus();
    let inputPrimaryOwner = document.getElementById("Primary-Owner");
    inputPrimaryOwner.value = "";
  });

  $("#ownerNo").change(function (event) {
    inputOwner.parentElement.style.display = "block";
    let inputPrimaryOwner = document.getElementById("Primary-Owner");
    inputPrimaryOwner.focus();
  });

  String.prototype.replaceAt = function (index, character) {
    return (
      this.substr(0, index) + character + this.substr(index + character.length)
    );
  };

  let checkRelease = false;
  let checkShareInfo = false;
  let checkCreditNotice = false;

  function getData() {
    creditAppState.forEach(function (row) {
      for (const property in row.fields) {
        dataPayload[property] = row.fields[property].value;
      }
    });
    return dataPayload;
  }
});
