/*  */
const params = new URLSearchParams(document.location.search);
const token = params.get("token");
const DEBUG_MODE = params.get("debug");
if (DEBUG_MODE !== "0") {
  $(document).ready(function () {
    $.getScript(
      "https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.16/jquery.mask.min.js",
      function () {
        $("#Security").mask("999-99-9999");
        $("#Security-2").mask("999-99-9999");
        $("#tax-id-2").mask("99-9999999");
        $("#Founding-Date").mask("9999");
        $("#Zip-Code").mask("99999-9999");
      }
    );
    let dataPayload = {};
    let currentState = 0;
    let majorityAnotherBusiness = false;
    let singleOwner = true;
    let secAnotherBusiness = false;
    let blockStates = {
      block: "none",
      none: "block",
    };
    let statusPossibles = [
      "BUSINESS_ADDRESS",
      "BUSINESS_INFO",
      "LOAN_INFO",
      "MAJORITY_OWNER_INFO",
      "SECOND_OWNER_INFO",
      "COMPLETED",
    ];

    let currentStatus = new Set([statusPossibles[0]]);
    const inputOwnerList = document.getElementById("Business-list");
    const secondOwnerBlock = document.getElementById("second-owner");
    const input2OwnerList = document.getElementById("Business-list-2");

    secondOwnerBlock.style.display = "none";

    let formFormLoading = document.getElementById("form_form_loading");
    let formSubmitArea = document.getElementById("finance-form-submit");
    formFormLoading.style.display = "block";
    let formSectionBusiness = document.getElementById("form_section_business");
    let formSectionInfo = document.getElementById("form_section_info");
    let formSectionLoan = document.getElementById("form_section_loan");
    let formSectionMajority = document.getElementById("form_section_majority");
    let formSectionSecond = document.getElementById("form_section_second");
    formSectionBusiness.style.display = "none";
    formSectionInfo.style.display = "none";
    formSectionLoan.style.display = "none";
    formSectionMajority.style.display = "none";
    formSectionSecond.style.display = "none";
    formSubmitArea.style.display = "none";

    const isDev = "new-machinery-partner.webflow.io";

    function getAPIBasePath() {
      const domain = window.location.hostname;
      const baseUrlProd = "https://mp-loan-application.vercel.app";
      const baseUrlDev = "https://mp-loan-application.vercel.app";
      if (domain === isDev) return baseUrlDev;
      return baseUrlProd;
    }

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

    function isMobile() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        return true;
      } else {
        return false;
      }
    }

    function getData() {
      creditAppState.forEach(function (row) {
        for (const property in row.fields) {
          dataPayload[property] = row.fields[property].value;
        }
      });
      dataPayload["majorityAnotherBusiness"] = majorityAnotherBusiness;
      dataPayload["singleOwner"] = singleOwner;
      dataPayload["secAnotherBusiness"] = secAnotherBusiness;
      dataPayload["Status"] = [...currentStatus];
      dataPayload["token"] = token;
      dataPayload["isMobile"] = isMobile();
      return dataPayload;
    }

    function getCreditApp(cb) {
      const payload = {
        token,
        source: "CREDIT_APP",
      };
      var xhr = new XMLHttpRequest();
      xhr.open("POST", `${getAPIBasePath()}/api/loan/security`, true);
      xhr.setRequestHeader("Authorization", "Basic d2Vic2l0ZTpmb3Jt");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(payload));
      xhr.onload = function () {
        formFormLoading.style.display = "none";
        formSectionBusiness.style.display = "block";
        formSectionInfo.style.display = "block";
        formSectionLoan.style.display = "block";
        formSectionMajority.style.display = "block";
        formSectionSecond.style.display = "block";
        formSubmitArea.style.display = "block";
        cb(JSON.parse(this.responseText));
      };
    }

    let mockResponse = {
      "Majority Owner SSN": "123-45-6789",
      "Loan Amount": "100000",
      "Majority Owner Name": "Daniel Henrique",
      "Business Street Address": "Av. Pedra Branca, 216",
      "Business City": "Palhoca",
      "Business Name": "Liglu Brasil",
      "Contact Phone": "12345678900",
      "Business Zip-Code": "12345",
      "Business Street Complement": "apt 1001",
      "Contact Name": "Daniel Henrique",
      "Majority Owner Ownership": "60",
      "Business State": "Florida",
      "Token Expire At": "2022-10-15T17:45:59.988Z",
      "Updated At": "2022-09-15T17:46:26.629Z",
      "Business No. of Employees": "1",
      "Business Main Activity": "Landscaping",
      "Business Founding Date": "2022-09-30",
      "Business Monthly Revenue": "200k",
      "Business EIN": "70707070",
      "Max Downpayment": "10000",
      "Majority Owner Birth Date": "1985-03-30",
      "Second Owner SSN": "123-45-6789",
      "Second Owner Name": "Henrique Junior",
      "Second Owner Ownership": "40",
      "Second Owner Birth Date": "1985-03-15",
      "Second Owner Business List": "",
      "Majority Owner Business List": "Some another company name",
      "Majority Owner Another Business": true,
      "Single Owner": false,
      "Second Owner Another Business": false,
      "Business Main Use": "Both",
    };

    function saveCreditApp(cb) {
      const payload = getData();
      var xhr = new XMLHttpRequest();
      xhr.open("POST", `${getAPIBasePath()}/api/loan/save`, true);
      xhr.setRequestHeader("Authorization", "Basic d2Vic2l0ZTpmb3Jt");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(payload));
      xhr.onload = function () {
        cb(JSON.parse(this.responseText));
      };
    }

    function forceFieldsBlur() {
      if (creditAppState[currentState]) {
        const fields = creditAppState[currentState].fields;
        for (const property in fields) {
          const field = fields[property];
          $(`${field.tag}`).focus();
          $(`${field.tag}`).keyup();
          $(`${field.tag}`).blur();
        }
      }
    }

    function forceFormFieldsBlur() {
      for (const block of creditAppState) {
        const fields = block.fields;
        for (const property in fields) {
          const field = fields[property];
          $(`${field.tag}`).focus();
          $(`${field.tag}`).keyup();
          $(`${field.tag}`).blur();
        }
      }
    }

    function nextBlock(_currentState) {
      currentState = _currentState;
      const lastBlock = formBlocks[currentState - 1];
      const currentBlock = formBlocks[currentState];
      if (lastBlock) {
        lastBlock.style.height = "0px";
        // setTimeout(function () {
        currentBlock.style.height = "auto";
        // }, 500);
      }
      forceFieldsBlur();
      const fields = creditAppState[currentState - 1].fields;
      validateBlockFields(fields, currentState - 1, true);
    }
    // Get all Form Blocks
    //finance_form_status
    const formHeaders = document.getElementsByClassName("finance_form_header");
    const formStatus = document.getElementsByClassName("finance_form_status");
    const formBlocks = document.getElementsByClassName("finance_form_content");
    // Reset form state
    // function resetBlocksState() {
    //   for (const block of formBlocks) {
    //     block.style.display = "none";
    //   }
    // }
    // resetBlocksState();
    // formBlocks[0].style.display = "block";

    function resetBlocksState() {
      for (const block of formBlocks) {
        block.style.height = "0px";
        block.style.transition = "all 500ms ease";
      }
    }
    resetBlocksState();
    formBlocks[0].style.height = "auto";

    // Set handler for display blocks
    $(".finance_form_header").on("click", function (event) {
      const lastBlock = formBlocks[currentState];
      const targetIndex = Number(event.currentTarget.children[0].innerText) - 1;
      const sameBlock = currentState == targetIndex;
      currentState = targetIndex;
      const currentBlock = formBlocks[currentState];
      const openCollapse = currentBlock.style.height !== "auto";
      // console.log(
      //   "openCollapse: ",
      //   openCollapse,
      //   currentBlock.style.height,
      //   currentBlock.style.transition
      // );
      if (openCollapse) {
        lastBlock.style.height = "0";
        // setTimeout(function () {
        currentBlock.style.height = "auto";
        // }, 500);
      } else {
        currentBlock.style.height = "0px";
      }
      if (currentBlock) {
        if (sameBlock) {
        } else {
          if (lastBlock) {
            // lastBlock.style.height = "0";
          }
          // currentBlock.classList.remove("content-hide");
          // currentBlock.style.display = "block";
          // currentBlock.style.height = "auto";
          setTimeout(function () {
            if (currentBlock.offsetTop) {
              // window.scrollTo({
              //   behavior: "smooth",
              //   left: 0,
              //   top: currentBlock.offsetTop - 100,
              // });
            }
          }, 200);
          const fields =
            creditAppState[currentState > 0 ? currentState - 1 : 0].fields;
          validateBlockFields(
            fields,
            currentState > 0 ? currentState - 1 : 0,
            true
          );
        }
      }
      // forceFieldsBlur();
    });

    let submitButtonBusinessAddress = document.getElementById(
      "save-button-business-address"
    );
    $("#save-button-business-address").on("click", function (event) {
      nextBlock(1);
      checkFormRequirements();
      saveCreditApp(function () {});
    });

    let submitButtonBusinessInfo = document.getElementById(
      "save-button-business-info"
    );
    $("#save-button-business-info").on("click", function (event) {
      nextBlock(2);
      checkFormRequirements();
      saveCreditApp(function () {});
    });

    let submitButtonAmount = document.getElementById("save-button-amount");
    $("#save-button-amount").on("click", function (event) {
      nextBlock(3);
      checkFormRequirements();
      saveCreditApp(function () {});
    });

    let submitButtonOwner = document.getElementById("save-button-owner");
    $("#save-button-owner").on("click", function (event) {
      nextBlock(4);
      checkFormRequirements();
      saveCreditApp(function () {});
    });

    let submitButton2Owner = document.getElementById("save-button-2owner");
    $("#save-button-2owner").on("click", function (event) {
      nextBlock(5);
      checkFormRequirements();
      saveCreditApp(function () {});
    });

    let submitButton = document.getElementById("credit-app-submit");
    submitButton.style.pointerEvents = "none";
    $("#credit-app-submit").on("click", function (event) {
      event.preventDefault();
      currentStatus.add(statusPossibles[statusPossibles.length - 1]);
      const form = $(this);
      submitButton.style.pointerEvents = "none";
      submitButton.classList.add("is-disable");
      submitButton.value = "Saving your credit application...";

      saveCreditApp(function (response) {
        submitButton.value = "Creating your contract...";
        console.log("saveCreditApp->Submit: ", response);
        if (response.signature) {
          // HelloSign Flow
          // const client = new window.HelloSign({
          //   clientId: "c736633d45c53925cb3ec2c622e5bf99",
          // });
          // client.on("finish", () => {
          //   console.log("Signature finished");
          //   form.submit();
          // });
          // client.open(response.data, {
          //   skipDomainVerification: false,
          //   uxVersion: 2,
          // });

          // DocuSign Flow
          location.replace(response.data);
          // submitButton.style.pointerEvents = "auto";
          // submitButton.classList.remove("is-disable");
          // submitButton.value = "Sign & Send";
        } else {
          form.submit();
        }
      });
    });

    function setIconStatusReset(form) {
      form.children[1].style.display = "none";
      form.children[2].style.display = "none";
    }

    function setIconStatusOk(form) {
      form.children[1].style.display = "block";
      form.children[2].style.display = "none";
    }

    function setIconStatusError(form) {
      form.children[1].style.display = "none";
      form.children[2].style.display = "block";
    }

    function formatEmail(email) {
      let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
      return regex.test(email);
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

    function checkFormRequirements() {
      let countRequiredFields = 0;
      let blockIndex = 0;
      for (const step of creditAppState) {
        const { fields } = step;
        const countCurrentRequiredFields = checkBlockRequirements(fields);
        countRequiredFields += countCurrentRequiredFields;
        // validateBlockFields(fields, blockIndex);
        // if (countCurrentRequiredFields === 0) {
        //   formHeaders[blockIndex].classList.remove("is-error");
        //   if (blockIndex === currentState) {
        //     setIconStatusReset(formStatus[blockIndex]);
        //   } else {
        //     setIconStatusOk(formStatus[blockIndex]);
        //   }
        // } else {
        //   if (blockIndex !== currentState) {
        //     setIconStatusError(formStatus[blockIndex]);
        //     formHeaders[blockIndex].classList.add("is-error");
        //   } else {
        //     formHeaders[blockIndex].classList.remove("is-error");
        //     setIconStatusReset(formStatus[blockIndex]);
        //   }
        // }
        blockIndex += 1;
      }
      // console.log("currentStatus: ", currentStatus);
      if (countRequiredFields === 0) {
        submitButton.style.pointerEvents = "auto";
        submitButton.classList.remove("is-disable");
        // getData();
        // console.log("checkFormRequirements: ", {
        //   countRequiredFields,
        //   dataPayload,
        //   creditAppState,
        // });
      } else {
        submitButton.style.pointerEvents = "none";
        submitButton.classList.add("is-disable");
      }
    }

    String.prototype.replaceAt = function (index, character) {
      return (
        this.substr(0, index) +
        character +
        this.substr(index + character.length)
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

    function showSSN(input, dataName) {
      // Get ssn from jQuery object
      var val = input.data(dataName);
      if (val) input.val(val);
    }

    function hideSSN(input, dataName) {
      // Save ssn to jQuery object
      input.data(dataName, input.val());
      transformDisplay(input.val(), function (displayVal) {
        input.val(displayVal);
      });
    }

    function checkBlockRequirements(fields) {
      let count = 0;
      for (const name in fields) {
        const inputData = fields[name];
        if (inputData.value !== "" && inputData.state === false) {
          // console.log("1checkBlockRequirements->Field Name: ", name);
          count += 1;
        } else if (inputData.required && inputData.state === false) {
          // console.log("2checkBlockRequirements->Field Name: ", name);
          count += 1;
        }
      }
      return count;
    }

    function validateBlockFields(fields, index, updateHeaders = true) {
      for (const property in fields) {
        const field = fields[property];
        const input = document.getElementById(field.tag.replace("#", ""));
        if (input) {
          const ret = field.validate(input.value);
          if (ret) {
            field.state = ret.status;
            if (field.state === false) {
              input.classList.add("is-error");
            } else {
              input.classList.remove("is-error");
            }
            if (input.nextSibling) {
              if (input.nextSibling.className === "form_error-message") {
                input.nextSibling.innerHTML = ret.message || "";
              } else if (input.offsetParent && input.offsetParent.nextSibling) {
                input.offsetParent.nextSibling.innerHTML = ret.message || "";
              }
            }
          }
        }
      }
      let countRequiredFields = checkBlockRequirements(fields);
      //console.log("validateBlockFields: ", {
      //  index,
      //  countRequiredFields,
      //  creditAppState,
      //});
      if (countRequiredFields === 0) {
        currentStatus.add(statusPossibles[index]);
        if (updateHeaders) {
          setIconStatusOk(formStatus[index]);
          formHeaders[index].classList.remove("is-error");
        }
      } else {
        currentStatus.delete(statusPossibles[index]);
        if (updateHeaders) {
          formHeaders[index].classList.add("is-error");
          setIconStatusError(formStatus[index]);
        }
      }
    }

    function removeRequeriments(fields) {
      for (const property in fields) {
        const field = fields[property];
        field.required = false;
      }
    }

    function addRequeriments(fields) {
      for (const property in fields) {
        const field = fields[property];
        field.required = field.originalRequired || false;
      }
    }

    let creditAppState = [
      {
        button: submitButtonBusinessAddress,
        fields: {
          companyName: {
            value: "",
            tag: "#Business-Name",
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
            tag: "#BusinessAddress",
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
            tag: "#AddressAlternative",
            airtable: "Business Street Complement",
            state: false,
            required: false,
            validate: function (_input) {
              return { status: true, message: "" };
            },
          },
          city: {
            value: "",
            tag: "#City",
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
            tag: "#Zip-Code",
            airtable: "Business Zip-Code",
            state: false,
            required: true,
            validate: function (_input) {
              var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(_input);
              if (isValidZip) {
                return { status: true, message: "" };
              } else if (_input && _input.length < 11) {
                return {
                  status: false,
                  message: "Please enter a 5 digit US Zip Code",
                };
              }
              return { status: false, message: "Mandatory field" };
            },
          },
          state: {
            value: "",
            tag: "#State",
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
        },
      },
      {
        button: submitButtonBusinessInfo,
        fields: {
          businessActivity: {
            value: "",
            tag: "#Business-activity",
            airtable: "Business Main Activity",
            state: false,
            required: false,
            validate: function (_input) {
              return { status: true, message: "" };
            },
          },
          foundingDate: {
            value: "",
            tag: "#Founding-Date",
            airtable: "Business Founding Date",
            state: false,
            required: false,
            validate: function (_input) {
              return { status: true, message: "" };
            },
          },
          noEmployees: {
            value: "",
            tag: "#Employees",
            airtable: "Business No. of Employees",
            state: false,
            required: false,
            validate: function (_input) {
              return { status: true, message: "" };
            },
          },
          monthlyRevenue: {
            value: "",
            tag: "#Monthly-Revenue",
            airtable: "Business Monthly Revenue",
            state: false,
            required: false,
            keyup: function (_this) {
              formatCurrency(_this, false);
            },
            blur: function (_this) {
              const input = document.getElementById("Monthly-Revenue");
              if (input.value !== "") {
                document.getElementById("Monthly-Revenue").value = currency(
                  document.getElementById("Monthly-Revenue").value
                ).value;
              }
              formatCurrency(_this, true);
            },
            focus: function () {
              const input = document.getElementById("Monthly-Revenue");
              if (input.value !== "") {
                document.getElementById("Monthly-Revenue").value = currency(
                  document.getElementById("Monthly-Revenue").value
                ).value;
              }
            },
            validate: function (_input) {
              return { status: true, message: "" };
            },
          },
          ein: {
            value: "",
            tag: "#tax-id-2",
            airtable: "Business EIN",
            state: false,
            required: true,
            validate: function (_input) {
              if (_input && _input.length == 10) {
                return { status: true, message: "" };
              } else if (_input && _input.length < 10) {
                return { status: false, message: "Please enter a valid EIN" };
              }
              return { status: false, message: "Mandatory field" };
            },
          },
        },
      },
      {
        button: submitButtonAmount,
        fields: {
          amount: {
            value: "",
            tag: "#Loan-Amount",
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
            tag: "#Max-Downpayment",
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
          // mainUse: {
          //   value: "",
          //   tag: "#Main-Use",
          //   airtable: "Business Main Use",
          //   state: false,
          //   required: false,
          //   validate: function (_input) {
          //     return { status: true, message: "" };
          //   },
          // },
        },
      },
      {
        button: submitButtonOwner,
        fields: {
          majorityName: {
            value: "",
            tag: "#Full-name-3",
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
          majorityEmail: {
            value: "",
            tag: "#Majority-Owner-Email",
            airtable: "Majority Owner Email",
            state: false,
            required: false,
            originalRequired: true,
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
          majorityOwnership: {
            value: "",
            tag: "#Ownership",
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
            tag: "#Birth",
            airtable: "Majority Owner Birth Date",
            state: false,
            required: true,
            init: function (_input) {
              _input.type = "date";
            },
            validate: function (_input) {
              if (_input && _input != "") {
                return { status: true, message: "" };
              }
              return { status: false, message: "Mandatory field" };
            },
          },
          majoritySsn: {
            value: "",
            tag: "#Security",
            airtable: "Majority Owner SSN",
            state: false,
            required: true,
            // focus: function () {
            //   showSSN($("#Security"), "majoritySsn");
            //   console.log("showSSN");
            // },
            // blur: function () {
            //   hideSSN($("#Security"), "majoritySsn");
            //   console.log("hideSSN");
            // },
            // validate: function validateSecury(value) {
            //   var val = $("#Security").data("majoritySsn");
            //   if (val && val.length === 11) {
            //     return { status: true, message: "", data: val };
            //   } else if (val && val.length < 11) {
            //     return {
            //       status: false,
            //       message: "Invalid SSN number!",
            //       data: val,
            //     };
            //   }
            //   return {
            //     status: false,
            //     message: "Mandatory field",
            //     data: val,
            //   };
            // },
            validate: function (_input) {
              if (_input && _input != "" && _input.length === 11) {
                return { status: true, message: "" };
              }
              return { status: false, message: "Mandatory field" };
            },
          },
          majorityAnotherBusiness: {
            value: false,
            tag: "input[name=Owner-of-business]",
            airtable: "Majority Owner Another Business",
            state: true,
            required: true,
            originalRequired: true,
            isRadio: true,
            change: function (event) {
              if (event.currentTarget.value === "ownerAnotherYes") {
                majorityAnotherBusiness = true;
                document.getElementById("ownerAnotherYes").click();
                inputOwnerList.parentElement.style.display = "block";
                inputOwnerList.focus();
              } else {
                majorityAnotherBusiness = false;
                document.getElementById("ownerAnotherNo").click();
                inputOwnerList.value = "";
                inputOwnerList.parentElement.style.display = "none";
              }
            },
            init: function (_input, field) {
              if (field.value) {
                majorityAnotherBusiness = true;
                document.getElementById("ownerAnotherYes").click();
                document.getElementById("ownerAnotherYes").value =
                  "ownerAnotherYes";
                document.getElementById("ownerAnotherNo").value =
                  "ownerAnotherNo";
                setTimeout(function () {
                  inputOwnerList.parentElement.style.display = "block";
                  inputOwnerList.focus();
                }, 500);
              } else {
                majorityAnotherBusiness = false;
                document.getElementById("ownerAnotherNo").click();
                document.getElementById("ownerAnotherNo").value =
                  "ownerAnotherNo";
                document.getElementById("ownerAnotherYes").value =
                  "ownerAnotherYes";
                setTimeout(function () {
                  inputOwnerList.parentElement.style.display = "none";
                }, 500);
              }
            },
            validate: function (_input) {
              return undefined;
            },
          },
          majorityAnotherBusinessList: {
            value: "",
            tag: "#Business-list",
            airtable: "Majority Owner Business List",
            state: false,
            required: false,
            originalRequired: false,
            init: function (_input) {
              _input.parentElement.style.display = "none";
            },
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
        fields: {
          secOwner: {
            value: "",
            tag: "#Sec-Owner-Name",
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
          singleOwner: {
            value: true,
            tag: "input[name=Owned-by-single-person]", //Owner of business
            airtable: "Single Owner",
            state: true,
            required: true,
            originalRequired: true,
            isRadio: true,
            change: function (event) {
              const fields = creditAppState[currentState].fields;
              if (event.currentTarget.value === "singleYes") {
                secondOwnerBlock.style.display = "none";
                singleOwner = true;
                fields.secOwner.value = "";
                fields.secEmail.value = "";
                fields.secOwnership.value = "";
                fields.secBirth.value = "";
                fields.secSsn.value = "";
                removeRequeriments(fields);
              } else {
                secondOwnerBlock.style.display = "block";
                singleOwner = false;
                addRequeriments(fields);
              }
            },
            init: function (_input, field) {
              const fields = creditAppState[4].fields;
              if (
                (field.value === "" && fields["secOwner"].value === "") ||
                (field.value && fields["secOwner"].value === "")
              ) {
                singleOwner = true;
                document.getElementById("singleYes").click();
                document.getElementById("singleYes").value = "singleYes";
                document.getElementById("singleNo").value = "singleNo";
                setTimeout(function () {
                  secondOwnerBlock.style.display = "none";
                }, 500);
                removeRequeriments(fields);
              } else {
                singleOwner = false;
                document.getElementById("singleNo").click();
                document.getElementById("singleNo").value = "singleNo";
                document.getElementById("singleYes").value = "singleYes";
                setTimeout(function () {
                  secondOwnerBlock.style.display = "block";
                }, 500);
                addRequeriments(fields);
              }
            },
            validate: function (_input) {
              return undefined;
            },
          },
          secEmail: {
            value: "",
            tag: "#Sec-Owner-Email",
            airtable: "Second Owner Email",
            state: false,
            required: false,
            originalRequired: true,
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
          secOwnership: {
            value: "",
            tag: "#Ownership-2",
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
            tag: "#Birth-2",
            airtable: "Second Owner Birth Date",
            state: false,
            required: true,
            originalRequired: true,
            init: function (_input) {
              _input.type = "date";
            },
            validate: function (_input) {
              if (_input && _input != "") {
                return { status: true, message: "" };
              }
              return { status: false, message: "Mandatory field" };
            },
          },
          secSsn: {
            value: "",
            tag: "#Security-2",
            airtable: "Second Owner SSN",
            state: false,
            required: true,
            // focus: function () {
            //   showSSN($("#Security-2"), "secSsn");
            // },
            // blur: function () {
            //   hideSSN($("#Security-2"), "secSsn");
            // },
            // validate: function validateSecury(value) {
            //   var val = $("#Security-2").data("secSsn");
            //   if (val && val.length === 11) {
            //     return { status: true, message: "", data: val };
            //   } else if (val && val.length < 11) {
            //     return {
            //       status: false,
            //       message: "Invalid SSN number!",
            //       data: val,
            //     };
            //   }
            //   return {
            //     status: false,
            //     message: "Mandatory field",
            //     data: val,
            //   };
            // },
            validate: function (_input) {
              if (_input && _input != "" && _input.length === 11) {
                return { status: true, message: "" };
              }
              return { status: false, message: "Mandatory field" };
            },
          },
          secAnotherBusiness: {
            value: false,
            tag: "input[name=2Owner-of-business]",
            airtable: "Second Owner Another Business",
            state: true,
            required: true,
            originalRequired: true,
            isRadio: true,
            change: function (event) {
              if (event.currentTarget.value === "2ownerYes") {
                secAnotherBusiness = true;
                document.getElementById("2ownerYes").click();
                input2OwnerList.parentElement.style.display = "block";
                input2OwnerList.focus();
              } else {
                secAnotherBusiness = false;
                input2OwnerList.value = "";
                document.getElementById("2ownerNo").click();
                input2OwnerList.parentElement.style.display = "none";
              }
            },
            init: function (_input, field) {
              if (field.value) {
                secAnotherBusiness = true;
                document.getElementById("2ownerYes").click();
                document.getElementById("2ownerYes").value = "2ownerYes";
                document.getElementById("2ownerNo").value = "2ownerNo";
                setTimeout(function () {
                  input2OwnerList.parentElement.style.display = "block";
                  input2OwnerList.focus();
                }, 500);
              } else {
                secAnotherBusiness = false;
                document.getElementById("2ownerNo").click();
                document.getElementById("2ownerNo").value = "2ownerNo";
                document.getElementById("2ownerYes").value = "2ownerYes";
                setTimeout(function () {
                  input2OwnerList.parentElement.style.display = "none";
                }, 500);
              }
            },
            validate: function (_input) {
              return undefined;
            },
          },
          secAnotherBusinessList: {
            value: "",
            tag: "#Business-list-2",
            airtable: "Second Owner Business List",
            state: false,
            required: false,
            originalRequired: false,
            init: function (_input) {
              _input.parentElement.style.display = "none";
            },
            validate: function (_input) {
              if (_input && _input != "") {
                return { status: true, message: "" };
              }
              return { status: false, message: "Mandatory field" };
            },
          },
        },
      },
    ];

    function loadForms() {
      for (const step of creditAppState) {
        const { fields } = step;
        for (const name in fields) {
          const inputData = fields[name];
          const input = document.getElementById(inputData.tag.replace("#", ""));
          // Pre-fill inputs from AirTable

          const dataSaved = mockResponse[inputData.airtable]
            ? mockResponse[inputData.airtable]
            : "";
          if (typeof dataSaved === "boolean" && input) {
            input.checked = dataSaved;
          } else {
            inputData.value = dataSaved;
            $(`${inputData.tag}`).val(inputData.value);
          }

          // End Pre-fill

          const domExist = $(`${inputData.tag}`);

          if (domExist.length > 0) {
            if (inputData.init) inputData.init(input, inputData);
            $(`${inputData.tag}`).on({
              change: function (event) {
                if (inputData.change) inputData.change(event);
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
                  // checkFormRequirements();
                  validateBlockFields(fields, currentState, false);
                  return;
                }

                const isValid = inputData.validate(inputValue);
                if (!isValid) {
                  // checkFormRequirements();
                  validateBlockFields(fields, currentState, false);
                  return;
                }

                if (!inputData.isRadio) inputData.value = inputValue;
                if (isValid.data) {
                  inputData.value = isValid.data;
                }

                if (isValid.status) {
                  if (!inputData.state) {
                    inputData.state = true;
                    if (!inputData.isRadio) inputData.value = inputValue;
                    if (event.currentTarget.nextSibling) {
                      if (
                        event.currentTarget.nextSibling.className ===
                        "form_error-message"
                      )
                        event.currentTarget.nextSibling.innerHTML = "";
                    } else if (
                      event.currentTarget.offsetParent &&
                      event.currentTarget.offsetParent.nextSibling
                    ) {
                      if (
                        event.currentTarget.offsetParent.nextSibling
                          .className === "form_error-message"
                      )
                        event.currentTarget.offsetParent.nextSibling.innerHTML =
                          "";
                    }
                  }
                } else {
                  if (inputData.state) {
                    inputData.state = false;
                  }
                  if (event.currentTarget.nextSibling) {
                    if (
                      event.currentTarget.nextSibling.className ===
                      "form_error-message"
                    )
                      event.currentTarget.nextSibling.innerHTML =
                        isValid.message;
                  } else if (
                    event.currentTarget.offsetParent &&
                    event.currentTarget.offsetParent.nextSibling
                  ) {
                    if (
                      event.currentTarget.offsetParent.nextSibling.className ===
                      "form_error-message"
                    )
                      event.currentTarget.offsetParent.nextSibling.innerHTML =
                        isValid.message;
                  }
                }
                // checkFormRequirements();
                validateBlockFields(fields, currentState, false);
              },
            });
          }
          // forceFormFieldsBlur();
        }
      }
    }

    if (DEBUG_MODE === "1") {
      loadForms();
      console.log(`DEBUG_MODE: ${DEBUG_MODE}`, {
        creditAppState,
      });
    } else {
      getCreditApp(function (response) {
        console.log("getCreditApp", response.data);
        // Already signed, redirect to review page
        if (response.signature) {
          location.replace(response.data);
        } else {
          mockResponse = response.data;
          loadForms();
        }
      });
    }
  });
} else {
  console.log(`DEBUG_MODE: ${DEBUG_MODE}`);
}
