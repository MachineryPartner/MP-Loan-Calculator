/*  */
$(document).ready(function () {
  let dataPayload = {};
  let checkRelease = false;
  let checkShareInfo = false;
  let checkCreditNotice = false;
  let value = "";
  let currentState = 0;
  let blockStates = {
    block: "none",
    none: "block",
  };
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
  let params = new URLSearchParams(document.location.search);
  let hash = params.get("hash");
  console.log("hash: ", hash);

  // Force Date Input Types
  const inputFoudingDate = document.getElementById("Founding-Date");
  inputFoudingDate.type = "date";
  const inputBirth = document.getElementById("Birth");
  inputBirth.type = "date";

  // Majority Owner
  const checkBoxOwnerAnotherYes = document.getElementById("ownerAnotherYes");
  const checkBoxOwnerAnotherNo = document.getElementById("ownerAnotherNo");
  const inputOwnerList = document.getElementById("Business-list");
  inputOwnerList.parentElement.style.display = "none";

  // Second Owner
  const checkBoxSingleOwnerYes = document.getElementById("singleYes");
  const checkBoxSingleOwnerNo = document.getElementById("singleNo");
  const secondOwnerBlock = document.getElementById("second-owner");
  const checkBox2OwnerAnotherYes = document.getElementById("2ownerYes");
  const checkBox2OwnerAnotherNo = document.getElementById("2ownerNo");
  const input2OwnerList = document.getElementById("Business-list-2");

  $("#ownerAnotherYes").change(function (event) {
    inputOwnerList.parentElement.style.display = "block";
    inputOwnerList.focus();
  });

  $("#ownerAnotherNo").change(function (event) {
    inputOwnerList.parentElement.style.display = "none";
  });

  function formatNumber(n) {
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

  function handleBlockVisibility(currentState) {
    return blockStates[currentState];
  }

  function getData() {
    creditAppState.forEach(function (row) {
      for (const property in row.fields) {
        dataPayload[property] = row.fields[property].value;
      }
    });
    dataPayload["status"] = currentStatus;
    dataPayload["hash"] = hash;
    return dataPayload;
  }

  function getCreditApp(cb) {
    const payload = {
      hash,
    };
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://65d0-2804-1b0-1402-47a6-d5a4-2f05-72f8-e8b.ngrok.io/api/credit-app/security",
      true
    );
    // xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(payload));
    xhr.onload = function () {
      cb(JSON.parse(this.responseText));
    };
  }

  let mockResponse = {};
  // let mockResponse = {
  //   "Majority Owner SSN": "1234567890",
  //   "Loan Amount": "100000",
  //   "Majority Owner Name": "Daniel Henrique",
  //   "Business Street Address": "Av. Pedra Branca, 216",
  //   "Business City": "Palhoca",
  //   "Business Name": "Liglu Brasil",
  //   "Contact Phone": "12345678900",
  //   "Business Zip-Code": "12345",
  //   "Business Street Complement": "apt 1001",
  //   "Contact Name": "Daniel Henrique",
  //   "Majority Owner Ownership": "60",
  //   "Business State": "Florida",
  //   "Hash Expire At": "2022-10-15T17:45:59.988Z",
  //   "Updated At": "2022-09-15T17:46:26.629Z",
  //   "Business No. of Employees": "1",
  //   "Business Main Activity": "Landscaping",
  //   "Business Founding Date": "2022-09-30",
  //   "Business Monthly Revenue": "200k",
  //   "Business EIN": "1234567890",
  //   "Max Downpayment": "10000",
  //   "Majority Owner Birth Date": "1985-03-30",
  //   "Second Owner SSN": "1234567890",
  //   "Second Owner Name": "Henrique Jr.",
  //   "Second Owner Ownership": "40",
  //   "Second Owner Birth Date": "1985-03-15",
  //   "Second Owner Business List": "",
  //   "Majority Owner Business List": "",
  //   "Majority Owner Another Business": false,
  //   "Single Owner": false,
  //   "Second Owner Another Business": false,
  // };

  function saveCreditApp(cb) {
    const payload = getData();
    console.log("saveCreditApp: ", payload);
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://65d0-2804-1b0-1402-47a6-d5a4-2f05-72f8-e8b.ngrok.io/api/credit-app/save",
      true
    );
    // xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(payload));
    xhr.onload = function () {
      cb(this.status);
    };
  }

  function verifyCheckBoxesState() {
    const checkboxes = creditAppState[currentState].checkboxes;
    if (checkboxes) {
      for (const checkbox of checkboxes) {
        const inputInstance = document.getElementById(checkbox.tag);
        const index = inputInstance.value === "" ? "No" : inputInstance.value;
        checkbox.input[index].click();
        // console.log("verifyCheckBoxesState: ", checkbox.tag, index);
      }
    }
  }

  function forceFieldsBlur(index) {
    const fields = creditAppState[currentState].fields;
    for (const property in fields) {
      const field = fields[property];
      $(`#${field.tag}`).keyup();
      $(`#${field.tag}`).blur();
    }
  }

  function nextBlock(_currentState) {
    formBlocks[currentState].style.display = "none";
    currentState = _currentState;
    formBlocks[currentState - 1].style.display = "none";
    formBlocks[currentState].style.display = "block";
    const fields = creditAppState[currentState - 1].fields;
    forceFieldsBlur();
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
    forceFieldsBlur();
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

  let submitButton = document.getElementById("credit-app-submit");
  submitButton.style.pointerEvents = "none";
  $("#credit-app-submit").on("click", function (event) {
    event.preventDefault();
    currentStatus = statusPossibles.submited;
    const form = $(this);
    saveCreditApp(function () {
      form.submit();
    });
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
    // console.log("checkInfos: ", {
    //   checkRelease,
    //   checkShareInfo,
    //   checkCreditNotice,
    //   countRequiredFields,
    //   dataPayload,
    // });
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
    var displayVal = val.replace(/[^0-9|\\*]/g, "");
    displayVal = displayVal.substr(0, 9);
    if (displayVal.length >= 4) {
      displayVal = displayVal.slice(0, 3) + "-" + displayVal.slice(3);
    }
    if (displayVal.length >= 7) {
      displayVal = displayVal.slice(0, 6) + "-" + displayVal.slice(6);
    }
    displayVal = displayVal.replace(/[0-9]/g, "*");
    cb(displayVal);
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
    // console.log("validateBlockFields: ", {
    //   countRequiredFields,
    //   creditAppState,
    // });
    if (countRequiredFields === 0) {
      setIconStatusOk(formStatus[index]);
    } else {
      setIconStatusError(formStatus[index]);
    }
  }

  let creditAppState = [
    {
      button: submitButtonBusiness,
      fields: {
        companyName: {
          value: "",
          tag: "Company-name",
          airtable: "Business Name",
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
          airtable: "Business Street Address",
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
          airtable: "Business Street Complement",
          state: false,
          required: false,
          validate: function (_input) {
            return { status: true, message: "" };
          },
        },
        city: {
          value: "",
          tag: "City",
          airtable: "Business City",
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
          airtable: "Business Zip-Code",
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
          airtable: "Business State",
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
          airtable: "Business Main Activity",
          state: false,
          required: false,
          validate: function (_input) {
            return { status: true, message: "" };
          },
        },
        foundingDate: {
          value: "",
          tag: "Founding-Date",
          airtable: "Business Founding Date",
          state: false,
          required: true,
          validate: function (_input) {
            return { status: true, message: "" };
          },
        },
        noEmployees: {
          value: "",
          tag: "Employees",
          airtable: "Business No. of Employees",
          state: false,
          required: false,
          validate: function (_input) {
            return { status: true, message: "" };
          },
        },
        monthlyRevenue: {
          value: "",
          tag: "Monthly-Revenue",
          airtable: "Business Monthly Revenue",
          state: false,
          required: false,
          validate: function (_input) {
            return { status: true, message: "" };
          },
        },
        ein: {
          value: "",
          tag: "tax-id",
          airtable: "Business EIN",
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
          airtable: "Loan Amount",
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
          airtable: "Max Downpayment",
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
      checkboxes: [
        {
          input: { Yes: checkBoxOwnerAnotherYes, No: checkBoxOwnerAnotherNo },
          tag: "ownerAnotherYes",
        },
      ],
      fields: {
        majorityName: {
          value: "",
          tag: "Full-name-3",
          airtable: "Majority Owner Name",
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
          airtable: "Majority Owner Ownership",
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
          airtable: "Majority Owner Birth Date",
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
          airtable: "Majority Owner SSN",
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
          value: false,
          tag: "ownerAnotherYes",
          airtable: "Majority Owner Another Business",
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
          airtable: "Majority Owner Business List",
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
      checkboxes: [
        {
          input: { Yes: checkBoxSingleOwnerYes, No: checkBoxSingleOwnerNo },
          tag: "singleNo",
        },
        {
          input: { Yes: checkBox2OwnerAnotherYes, No: checkBox2OwnerAnotherNo },
          tag: "2ownerNo",
        },
      ],
      fields: {
        singleOwner: {
          value: false,
          tag: "singleNo",
          airtable: "Single Owner",
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
          airtable: "Second Owner Name",
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
          airtable: "Second Owner Ownership",
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
          airtable: "Second Owner Birth Date",
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
          airtable: "Second Owner SSN",
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
          value: false,
          tag: "2ownerNo",
          airtable: "Second Owner Another Business",
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
          airtable: "Second Owner Business List",
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

  // Second Owner
  secondOwnerBlock.style.display = "none";

  $("#singleYes").change(function (event) {
    secondOwnerBlock.style.display = "none";
    const fields = creditAppState[currentState].fields;
    for (const property in fields) {
      const field = fields[property];
      field.state = false;
      if (field.originalRequired) field.required = false;
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
      if (field.originalRequired) field.originalRequired;
    }
  });

  input2OwnerList.parentElement.style.display = "none";

  $("#2ownerYes").change(function (event) {
    input2OwnerList.parentElement.style.display = "block";
    input2OwnerList.focus();
  });

  $("#2ownerNo").change(function (event) {
    input2OwnerList.parentElement.style.display = "none";
  });

  function loadForms() {
    for (const step of creditAppState) {
      const { fields } = step;
      for (const name in fields) {
        const inputData = fields[name];
        // Pre-fill inputs from AirTable

        const dataSaved = mockResponse[inputData.airtable]
          ? mockResponse[inputData.airtable]
          : "";
        if (typeof dataSaved === "boolean") {
          const input = document.getElementById(inputData.tag);
          if (input && dataSaved) {
            input.checked = true;
            input.value = "Yes";
            inputData.value = true;
          } else {
            input.checked = false;
            input.value = "No";
            inputData.value = false;
          }
          console.log(
            "typeof dataSaved: ",
            inputData.tag,
            typeof dataSaved,
            dataSaved
          );
        } else {
          inputData.value = dataSaved;
          $(`#${inputData.tag}`).val(inputData.value);
        }

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
                } else if (
                  event.currentTarget.offsetParent &&
                  event.currentTarget.offsetParent.nextSibling
                ) {
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
              } else if (
                event.currentTarget.offsetParent &&
                event.currentTarget.offsetParent.nextSibling
              ) {
                event.currentTarget.offsetParent.nextSibling.innerHTML =
                  isValid.message;
              }
            }
          },
        });
      }
    }
  }

  getCreditApp(function (response) {
    console.log("getCreditApp", response.data);
    mockResponse = response.data;
    loadForms();
  });

  console.log("creditAppState: ", {
    creditAppState,
  });
});
