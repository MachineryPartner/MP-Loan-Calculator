/*  */
$(document).ready(function () {
  let dataPayload = {};
  let statusPossibles = {
    contact: "PERSONAL_INFORMATION",
    businessAddress: "BUSINESS_ADDRESS",
    businessInfo: "BUSINESS_INFO",
    loanInfo: "LOAN_INFO",
    majorityInfo: "MAJORITY_OWNER_INFO",
    secondOwnerInfo: "SECOND_OWNER_INFO",
    submited: "COMPLETED",
  };
  let currentStatus = statusPossibles.businessAddress;
  var value = "";

  // const phoneInputField = document.getElementById("Phone-number-3");
  // const phoneInput = window.intlTelInput(phoneInputField, {
  //   separateDialCode: true,
  //   utilsScript:
  //     "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  // });

  const inputFoudingDate = document.getElementById("Founding-Date");
  inputFoudingDate.type = "date";
  const inputBirth = document.getElementById("Birth");
  inputBirth.type = "date";

  // Majority Owner
  const checkBoxOwnerAnotherNo = document.getElementById("ownerAnotherNo");
  const inputOwnerList = document.getElementById("Business-list");
  inputOwnerList.parentElement.style.display = "none";

  $("#ownerAnotherYes").change(function (event) {
    inputOwnerList.parentElement.style.display = "block";
    inputOwnerList.focus();
  });

  $("#ownerAnotherNo").change(function (event) {
    inputOwnerList.parentElement.style.display = "none";
  });

  // Second Owner
  const checkBoxSingleOwnerYes = document.getElementById("singleYes");
  const secondOwnerBlock = document.getElementById("second-owner");
  secondOwnerBlock.style.display = "none";

  $("#singleYes").change(function (event) {
    secondOwnerBlock.style.display = "none";
    const fields = creditAppState[currentState].fields;
    for (const property in fields) {
      const field = fields[property];
      field.state = false;
      field.required = false;
    }
  });

  $("#singleNo").change(function (event) {
    secondOwnerBlock.style.display = "block";
    const inputBirth2 = document.getElementById("Birth-2");
    inputBirth2.type = "date";
    const fields = creditAppState[currentState].fields;
    for (const property in fields) {
      const field = fields[property];
      field.state = false;
      field.required = field.originalRequired;
    }
  });

  const checkBox2OwnerAnotherNo = document.getElementById("2ownerNo");
  const input2OwnerList = document.getElementById("Business-list-2");
  input2OwnerList.parentElement.style.display = "none";

  $("#2ownerYes").change(function (event) {
    input2OwnerList.parentElement.style.display = "block";
    input2OwnerList.focus();
  });

  $("#2ownerNo").change(function (event) {
    input2OwnerList.parentElement.style.display = "none";
  });

  setTimeout(function () {
    checkBoxOwnerAnotherNo.click();
    checkBoxSingleOwnerYes.click();
    // checkBox2OwnerAnotherNo.click();
  }, 300);

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

  let params = new URLSearchParams(document.location.search);
  let hash = params.get("hash");
  console.log("hash: ", hash);

  function getCreditApp(cb) {
    const payload = {
      hash,
    };
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://mp-portal-git-develop-machinerypartner.vercel.app/api/credit-app/security",
      true
    );
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(payload));
    xhr.onload = function () {
      cb(JSON.parse(this.responseText));
    };
  }

  getCreditApp(function (response) {
    console.log("getCreditApp", response);
  });

  function saveCreditApp(cb) {
    const payload = getData();
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://mp-portal-git-develop-machinerypartner.vercel.app/api/credit-app/save",
      true
    );
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(payload));
    xhr.onload = function () {
      cb(this.status);
    };
  }

  function verifyCheckBoxesState() {
    const checkboxes = creditAppState[currentState].checkboxes;
    if (checkboxes) {
      for (const checkbox of checkboxes) {
        if (checkbox && checkbox.checked) checkbox.click();
      }
    }
  }

  function nextBlock(_currentState) {
    formBlocks[currentState].style.display = "none";
    currentState = _currentState;
    formBlocks[currentState - 1].style.display = "none";
    formBlocks[currentState].style.display = "block";
    const fields = creditAppState[currentState - 1].fields;
    verifyCheckBoxesState();
    validateBlockFields(fields, currentState - 1);
  }
  // Get all Form Blocks
  //finance_form_status
  const formStatus = document.getElementsByClassName("finance_form_status");
  const formBlocks = document.getElementsByClassName("finance_form_content");
  // Reset form state
  function resetBlocksState() {
    for (const block of formBlocks) {
      block.style.display = "none";
    }
  }
  resetBlocksState();
  formBlocks[0].style.display = "block";

  // Set handler for display blocks
  $(".finance_form_header").on("click", function (event) {
    const targetIndex = Number(event.currentTarget.children[0].innerText) - 1;
    currentState = targetIndex;
    resetBlocksState();
    event.currentTarget.nextSibling.style.display = handleBlockVisibility(
      event.currentTarget.nextSibling.style.display
    );
    verifyCheckBoxesState();
  });

  let submitButtonBusiness = document.getElementById("save-button-business");
  $("#save-button-business").on("click", function (event) {
    currentStatus = statusPossibles.businessAddress;
    nextBlock(1);
    saveCreditApp(function () {});
  });

  let submitButtonAmount = document.getElementById("save-button-amount");
  $("#save-button-amount").on("click", function (event) {
    currentStatus = statusPossibles.loanInfo;
    nextBlock(2);
    saveCreditApp(function () {});
  });

  let submitButtonOwner = document.getElementById("save-button-owner");
  $("#save-button-owner").on("click", function (event) {
    currentStatus = statusPossibles.majorityInfo;
    nextBlock(3);
    saveCreditApp(function () {});
  });

  let submitButton2Owner = document.getElementById("save-button-2owner");
  $("#save-button-2owner").on("click", function (event) {
    currentStatus = statusPossibles.secondOwnerInfo;
    nextBlock(4);
    saveCreditApp(function () {});
  });

  // let submitButtonContact = document.getElementById("save-button-contact");
  // $("#save-button-contact").on("click", function (event) {
  //   saveCreditApp(function () {});
  //   nextBlock(3);
  // });

  let submitButton = document.getElementById("credit-app-submit");
  submitButton.style.pointerEvents = "none";
  $("#credit-app-submit").on("click", function (event) {
    event.preventDefault();
    currentStatus = statusPossibles.submited;
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

  let creditAppState = [
    // {
    //   button: submitButtonContact,
    //   fields: {
    //     fullName: {
    //       value: "",
    //       tag: "Full-name-3",
    //       state: false,
    //       required: true,
    //       validate: function (_input) {
    //         const fields = creditAppState[currentState].fields;
    //         if (_input && _input.length >= 5) {
    //           return { status: true, message: "" };
    //         } else if (_input && _input.length < 5) {
    //           return { status: false, message: "Minimum characters 5" };
    //         }
    //         return { status: false, message: "Mandatory field" };
    //       },
    //     },
    //     email: {
    //       value: "",
    //       tag: "Email-3",
    //       state: false,
    //       required: true,
    //       validate: function (_input) {
    //         const fields = creditAppState[currentState].fields;
    //         if (!formatEmail(_input)) {
    //           return { status: false, message: "Invalid email!" };
    //         }
    //         if (_input && _input.length >= 5) {
    //           return { status: true, message: "" };
    //         } else if (_input && _input.length < 5) {
    //           return { status: false, message: "Minimum characters 5" };
    //         }
    //         return { status: false, message: "Mandatory field" };
    //       },
    //     },
    //     phone: {
    //       value: "",
    //       tag: "Phone-number-3",
    //       state: false,
    //       required: true,
    //       keyup: function () {
    //         document.getElementById("Phone-number-3").value = formatPhone(
    //           document.getElementById("Phone-number-3").value
    //         );
    //       },
    //       validate: function (_input) {
    //         const fields = creditAppState[currentState].fields;
    //         const isValid = phoneInput.isValidNumber();
    //         if (isValid) {
    //           return { status: true, message: "" };
    //         } else if (_input !== "") {
    //           return { status: false, message: "Phone invalid!" };
    //         }
    //         return { status: false, message: "Mandatory field" };
    //       },
    //     },
    //   },
    // },
    {
      button: submitButtonBusiness,
      fields: {
        companyName: {
          value: "",
          tag: "Company-name",
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
        address: {
          value: "",
          tag: "Address-3",
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
          validate: function (_input) {
            var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(_input);
            if (isValidZip) {
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
            if (_input && _input.length >= 5) {
              return { status: true, message: "" };
            } else if (_input && _input.length < 5) {
              return { status: false, message: "Minimum characters 5" };
            }
            return { status: false, message: "Mandatory field" };
          },
        },
        businessActivity: {
          value: "",
          tag: "Business-activity",
          state: false,
          required: false,
          validate: function (_input) {
            return { status: true, message: "" };
          },
        },
        foundingDate: {
          value: "",
          tag: "Founding-Date",
          state: false,
          required: true,
          validate: function (_input) {
            return { status: true, message: "" };
          },
        },
        noEmployees: {
          value: "",
          tag: "Employees",
          state: false,
          required: false,
          validate: function (_input) {
            return { status: true, message: "" };
          },
        },
        monthlyRevenue: {
          value: "",
          tag: "Monthly-Revenue",
          state: false,
          required: false,
          validate: function (_input) {
            return { status: true, message: "" };
          },
        },
        ein: {
          value: "",
          tag: "tax-id",
          state: false,
          required: false,
          validate: function (_input) {
            return { status: true, message: "" };
          },
        },
      },
    },
    {
      button: submitButtonAmount,
      fields: {
        amount: {
          value: "",
          tag: "Loan-Amount",
          state: false,
          required: false,
          keyup: function (_this) {
            formatCurrency(_this, false);
          },
          blur: function (_this) {
            const input = document.getElementById("Loan-Amount");
            if (input.value !== "") {
              document.getElementById("Loan-Amount").value = currency(
                document.getElementById("Loan-Amount").value
              ).value;
            }
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
            if (amount !== 0 && amount < 100) {
              return { status: false, message: "Minimum amount is $100" };
            }
            return { status: true, message: "" };
          },
        },
        maxDownpayment: {
          value: "",
          tag: "Max-Downpayment",
          state: false,
          required: false,
          keyup: function (_this) {
            formatCurrency(_this, false);
          },
          blur: function (_this) {
            const input = document.getElementById("Max-Downpayment");
            if (input.value !== "") {
              document.getElementById("Max-Downpayment").value = currency(
                document.getElementById("Max-Downpayment").value
              ).value;
            }
            formatCurrency(_this, true);
          },
          focus: function () {
            const input = document.getElementById("Max-Downpayment");
            if (input.value !== "") {
              document.getElementById("Max-Downpayment").value = currency(
                document.getElementById("Max-Downpayment").value
              ).value;
            }
          },
          validate: function (_input) {
            let amount = currency(_input).value;
            if (amount !== 0 && amount < 100) {
              return { status: false, message: "Minimum amount is $100" };
            }
            return { status: true, message: "" };
          },
        },
      },
    },
    {
      button: submitButtonOwner,
      checkboxes: [checkBoxOwnerAnotherNo],
      fields: {
        majorityName: {
          value: "",
          tag: "Full-name-3",
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
        majorityOwnership: {
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
            if (inputNumber && Number(inputNumber) >= 10) {
              return { status: true, message: "" };
            } else if (_input && _input.length < 10) {
              return { status: false, message: "Minimum Ownership: 10%" };
            }
            return { status: false, message: "Mandatory field" };
          },
        },
        majorityBirth: {
          value: "",
          tag: "Birth",
          state: false,
          required: true,
          validate: function (_input) {
            if (_input && _input != "") {
              return { status: true, message: "" };
            }
            return { status: false, message: "Mandatory field" };
          },
        },
        majoritySsn: {
          value: "",
          tag: "Security",
          state: false,
          required: true,
          keyup: function (input) {
            var val = input[0].value;
            transformDisplay(val, function (displayVal) {
              input.val(displayVal);
            });
            transformValue(val);
          },
          validate: validateSecury,
        },
        majorityAnotherBusiness: {
          value: "",
          tag: "ownerAnotherYes",
          state: false,
          required: false,
          change: function (event) {
            return { status: event.currentTarget.checked, message: "" };
          },
          validate: function (_input) {
            return undefined;
          },
        },
        majorityAnotherBusinessList: {
          value: "",
          tag: "Business-list",
          state: false,
          required: false,
          validate: function (_input) {
            if (_input && _input != "") {
              return { status: true, message: "" };
            }
            return { status: false, message: "Mandatory field" };
          },
        },
      },
    },
    {
      button: submitButton2Owner,
      checkboxes: [checkBoxSingleOwnerYes, checkBox2OwnerAnotherNo],
      fields: {
        singleOwner: {
          value: "",
          tag: "2singleYes",
          state: false,
          required: false,
          originalRequired: false,
          change: function (event) {
            return { status: event.currentTarget.checked, message: "" };
          },
          validate: function (_input) {
            return undefined;
          },
        },
        secOwner: {
          value: "",
          tag: "Full-name-4",
          state: true,
          required: false,
          originalRequired: true,
          validate: function (_input) {
            if (_input && _input.length >= 5) {
              return { status: true, message: "" };
            } else if (_input && _input.length < 5) {
              return { status: false, message: "Minimum characters 5" };
            }
            return { status: false, message: "Mandatory field" };
          },
        },
        secOwnership: {
          value: "",
          tag: "Ownership-2",
          state: true,
          required: false,
          originalRequired: true,
          focus: function () {
            let input = document.getElementById("Ownership-2");
            let inputValue = input.value;
            let inputNumber = currency(inputValue).value;
            if (inputNumber !== 0) {
              document.getElementById("Ownership-2").value = inputNumber;
            } else {
              document.getElementById("Ownership-2").value = "";
            }
          },
          validate: function (_input) {
            let inputNumber = currency(_input).value;
            if (inputNumber > 100) {
              _input = 100;
              inputNumber = currency(_input).value;
              document.getElementById("Ownership").value = _input;
            }
            if (inputNumber && Number(inputNumber) >= 10) {
              return { status: true, message: "" };
            } else if (_input && _input.length < 10) {
              return { status: false, message: "Minimum Ownership: 10%" };
            }
            return { status: false, message: "Mandatory field" };
          },
        },
        secBirth: {
          value: "",
          tag: "Birth-2",
          state: true,
          required: false,
          originalRequired: true,
          validate: function (_input) {
            if (_input && _input != "") {
              return { status: true, message: "" };
            }
            return { status: false, message: "Mandatory field" };
          },
        },
        secSsn: {
          value: "",
          tag: "Security-2",
          state: true,
          required: false,
          originalRequired: true,
          keyup: function (input) {
            var val = input[0].value;
            transformDisplay(val, function (displayVal) {
              input.val(displayVal);
            });
            transformValue(val);
          },
          validate: validateSecury,
        },
        secAnotherBusiness: {
          value: "",
          tag: "2ownerAnotherYes",
          state: false,
          required: false,
          originalRequired: false,
          change: function (event) {
            return { status: event.currentTarget.checked, message: "" };
          },
          validate: function (_input) {
            return undefined;
          },
        },
        secAnotherBusinessList: {
          value: "",
          tag: "Business-list-2",
          state: false,
          required: false,
          originalRequired: false,
          validate: function (_input) {
            if (_input && _input != "") {
              return { status: true, message: "" };
            }
            return { status: false, message: "Mandatory field" };
          },
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
      setIconStatusOk(formStatus[currentState]);
    } else {
      setIconStatusError(formStatus[currentState]);
    }
    // TODO
    getData();
    console.log("checkInfos: ", {
      checkRelease,
      checkShareInfo,
      checkCreditNotice,
      countRequiredFields,
      dataPayload,
    });
    if (countRequiredFields === 0) {
      submitButton.style.pointerEvents = "auto";
      submitButton.classList.remove("is-disable");
      getData();
    } else {
      submitButton.style.pointerEvents = "none";
      submitButton.classList.add("is-disable");
    }
  }

  function validateSecury(_input) {
    if (value && value.length === 9) {
      return { status: true, message: "", data: value };
    } else if (value && value.length < 9) {
      return { status: false, message: "Invalid SSN number!", data: value };
    }
    return { status: false, message: "Mandatory field", data: value };
  }

  String.prototype.replaceAt = function (index, character) {
    return (
      this.substr(0, index) + character + this.substr(index + character.length)
    );
  };

  function transformDisplay(val, cb) {
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
    // setTimeout(function () {
    displayVal = displayVal.replace(/[0-9]/g, "*");
    cb(displayVal);
    // }, 300);
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
      setIconStatusOk(formStatus[index]);
    } else {
      setIconStatusError(formStatus[index]);
    }
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
              setIconStatusOk(formStatus[currentState]);
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
            setIconStatusError(formStatus[currentState]);
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
    dataPayload["status"] = currentStatus;
    return dataPayload;
  }
});
