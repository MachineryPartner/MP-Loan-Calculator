const params = new URLSearchParams(document.location.search);
const token = params.get("token");
const DEBUG_MODE = params.get("debug");
let creditData = {};
if (DEBUG_MODE !== "0") {
  $(document).ready(function () {
    const upload = Upload({ apiKey: "public_FW25axZ42W9SnxbXHqBDp6LLrqDT" });
    const isDev = "new-machinery-partner.webflow.io";
    dayjs.extend(dayjs_plugin_relativeTime);
    let formFormLoading = document.getElementById("form_form_loading");
    // let formWrapper = document.getElementById("form-wrapper");
    let toastMessage = document.getElementById("toast-message");
    let companyName = document.getElementById("company-name");
    let appId = document.getElementById("App-Id");
    let submitButton = document.getElementById("credit-app-submit");
    let plaidButton = document.getElementById("Connect-Plaid");
    let goPlaidButton = document.getElementById("Go-Plaid");
    let uploadManuallyButton = document.getElementById("Upload-Manually");
    let fileInput = document.getElementById("uploadInput");
    let dropBox = document.getElementById("upload-area");
    let uploadPage = document.getElementById("Upload");
    let sucessPage = document.getElementById("Review");
    let plaidPage = document.getElementById("Plaid");

    formFormLoading.style.display = "block";
    appId.style.display = "none";
    companyName.style.display = "none";
    sucessPage.style.display = "none";
    plaidPage.style.display = "none";
    uploadPage.style.display = "none";

    function showUploadPage() {
      uploadPage.style.display = "block";
      sucessPage.style.display = "none";
      plaidPage.style.display = "none";
    }

    function showPlaidPage() {
      sucessPage.style.display = "none";
      plaidPage.style.display = "block";
      uploadPage.style.display = "none";
    }

    function showSuccessPage() {
      sucessPage.style.display = "block";
      plaidPage.style.display = "none";
      uploadPage.style.display = "none";
      submitButton.style.display = "none";
      toastMessage.innerHTML =
        "<b>Your application is now in review!</b> Congrats! Will be touch when your offers are ready - usually in 2-4 days.";
    }

    function getAPIBasePath() {
      const domain = window.location.hostname;
      const baseUrlProd = "https://mp-loan-application.vercel.app";
      const baseUrlDev = "https://mp-loan-application.vercel.app";
      if (domain === isDev) return baseUrlDev;
      return baseUrlProd;
    }
    function getCreditApp(cb) {
      const payload = {
        token,
        source: "CREDIT_REVIEW",
      };
      var xhr = new XMLHttpRequest();
      xhr.open("POST", `${getAPIBasePath()}/api/loan/security`, true);
      xhr.setRequestHeader("Authorization", "Basic d2Vic2l0ZTpmb3Jt");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(payload));
      xhr.onload = function () {
        formFormLoading.style.display = "none";
        // formWrapper.style.display = "block";
        cb(JSON.parse(this.responseText));
      };
    }
    function saveCreditApp(status, _payload, cb) {
      creditData["Status"] = [...creditData["Status"], status];
      creditData["Token"] = token;
      const payload = {
        token,
        ..._payload,
        ...creditData,
      };
      var xhr = new XMLHttpRequest();
      xhr.open("POST", `${getAPIBasePath()}/api/loan/save`, true);
      xhr.setRequestHeader("Authorization", "Basic d2Vic2l0ZTpmb3Jt");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(payload));
      xhr.onload = function () {
        cb(JSON.parse(this.responseText));
      };
    }

    async function uploadFiles(file, cb) {
      try {
        const { fileUrl } = await upload.uploadFile(file, {
          tags: ["Expire-It"],
        });
        cb([
          {
            filename: file.name,
            url: fileUrl,
          },
        ]);
      } catch (e) {
        console.log(e);
        cb();
      }
    }

    getCreditApp(function (response) {
      creditData = response.data;
      // if (creditData["Plaid Access Token"]) {
      //   plaidButton.style.pointerEvents = "none";
      //   plaidButton.classList.add("is-disable");
      //   plaidButton.innerHTML = "Connected to Plaid.";
      // }
      companyName.innerHTML = creditData["Business Name"] || "    ";
      appId.innerHTML = `Application ID: #${creditData["Deal Id"]}`;
      companyName.style.display = "block";
      appId.style.display = "block";
      console.log(
        "getCreditApp",
        response.data,
        creditData["Status"],
        creditData["Status"].includes("REVIEW")
      );
      if (creditData["Status"].includes("REVIEW")) {
        showSuccessPage();
      } else {
        showUploadPage();
        // showPlaidPage();
      }
      if (creditData["Documents"]) {
        creditData["Documents"].forEach(function (file) {
          addFile(file);
        });
      } else {
        creditData["Documents"] = [];
      }
    });

    function prevDefault(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    dropBox.addEventListener("dragenter", prevDefault, false);
    dropBox.addEventListener("dragover", prevDefault, false);
    dropBox.addEventListener("dragleave", prevDefault, false);
    dropBox.addEventListener("drop", prevDefault, false);

    function hover(e) {
      dropBox.classList.add("hover");
    }
    function unhover(e) {
      dropBox.classList.remove("hover");
    }
    dropBox.addEventListener("dragenter", hover, false);
    dropBox.addEventListener("dragover", hover, false);
    dropBox.addEventListener("dragleave", unhover, false);
    dropBox.addEventListener("drop", unhover, false);
    dropBox.addEventListener("drop", mngDrop, false);
    function mngDrop(e) {
      let dataTrans = e.dataTransfer;
      let files = dataTrans.files;
      filesManager(files);
    }

    plaidButton.addEventListener(
      "click",
      async function (e) {
        e.preventDefault();
        e.stopPropagation();
        plaidButton.style.pointerEvents = "none";
        plaidButton.classList.add("is-disable");
        console.log("Connect Plaid");
        const fetchLinkToken = async () => {
          const response = await fetch(
            `${getAPIBasePath()}/api/loan/plaid/create-link-token`
          );
          const { linkToken } = await response.json();
          return linkToken;
        };
        const handler = Plaid.create({
          token: await fetchLinkToken(),
          onSuccess: async (publicToken, metadata) => {
            console.log("onSuccess->publicToken: ", publicToken);
            console.log("onSuccess->metadata: ", metadata);
            const response = await fetch(
              `${getAPIBasePath()}/api/loan/plaid/token-exchange`,
              {
                method: "POST",
                body: JSON.stringify({ publicToken, metadata, token }),
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            const { message } = await response.json();
            console.log("onSuccess->response: ", message);
            if (message === "PLAID_CONNECTED") {
              plaidButton.innerHTML = "Connected to Plaid.";
              // saveCreditApp("REVIEW", {}, function () {
              showSuccessPage();
              // });
            }
          },
          onEvent: (metadata) => {
            console.log("onEvent: ", metadata);
          },
          onExit: (error, metadata) => {
            console.log("onExit: ", error, metadata);
            plaidButton.style.pointerEvents = "auto";
            plaidButton.classList.remove("is-disable");
          },
        });
        handler.open();
      },
      false
    );
    // goPlaidButton.addEventListener(
    //   "click",
    //   function (e) {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     showPlaidPage();
    //   },
    //   false
    // );

    uploadManuallyButton.addEventListener(
      "click",
      function (e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("uploadManuallyButton");
        showUploadPage();
      },
      false
    );

    submitButton.addEventListener(
      "click",
      function (e) {
        e.preventDefault();
        e.stopPropagation();
        submitButton.style.pointerEvents = "none";
        submitButton.classList.add("is-disable");
        submitButton.value = "Sending your Application for Review...";
        saveCreditApp("REVIEW", {}, function () {
          showSuccessPage();
          submitButton.style.pointerEvents = "block";
          submitButton.classList.remove("is-disable");
          submitButton.value = "Submit for Review";
        });
      },
      false
    );

    fileInput.addEventListener(
      "change",
      function (e) {
        filesManager(this.files);
      },
      false
    );

    function upFile(file) {
      let imageType = /image.*/;
      let pdfType = /pdf/;
      let excelType = /excel/;
      if (
        file.type.match(imageType) ||
        file.type.match(pdfType) ||
        file.type.match(excelType)
      ) {
        const formData = new FormData();
        formData.append("attachments", file);
        try {
          previewFile(file);
        } catch (e) {
          console.log("Error Preview File", e);
        }
        try {
          uploadFiles(file, function (response) {
            if (!response) {
              let pendingDiv = document.getElementById(`wrap-${file.name}`);
              pendingDiv.remove();
              let wrap = document.createElement("div");
              let imgCapt = document.createElement("p");
              let errorHtml = `
          <div class="uploaded_file-error"><img loading="lazy" src="https://assets-global.website-files.com/624c19a34c30c75b84ab76d9/63695bc9988cdc483b9cfd62_alert-triangle.svg" alt=""><div><div>${file.name}</div><div class="text-size-small text-color-grey-light w-file-upload-error-msg">
          Upload failed. Something went wrong. Please retry.</div></div></div>`;
              imgCapt.innerHTML = errorHtml;
              files.appendChild(wrap).appendChild(imgCapt);
            } else {
              creditData["Documents"] = [
                ...creditData["Documents"],
                ...response,
              ];
              saveCreditApp("DOCUMENTS", {}, function () {
                let statusDiv = document.getElementById(file.name);
                statusDiv.className = "text-size-small text-color-grey-light";
              });
            }
          });
        } catch (e) {
          console.log("Error Uploading", e);
        }
      } else {
        console.error("Only images are allowed!", file);
      }
    }

    function addFile(file) {
      let wrap = document.createElement("div");
      let imgCapt = document.createElement("p");
      let sucessHtml = `
          <div class="uploaded_file-done w-file-upload-file"><img loading="lazy" src="https://assets-global.website-files.com/624c19a34c30c75b84ab76d9/636954644576e06e2e0c15e4_file-text.svg" alt="" class="upload-file-icon"><div class="div-block"><div class="text-block w-file-upload-file-name">${
            file.filename
          }</div><div class="text-size-small text-color-grey-light">Uploaded ${dayjs(
        creditData["Updated At"] || new Date()
      ).fromNow()}</div></div><div tabindex="0" aria-label="Remove file" role="button" class="link-2 w-file-remove-link"><div class="w-icon-file-upload-remove"></div></div></div>`;
      imgCapt.innerHTML = sucessHtml;
      files.appendChild(wrap).appendChild(imgCapt);
    }

    function previewFile(file) {
      let imageType = /image.*/;
      let pdfType = /pdf/;
      let excelType = /excel/;
      if (
        file.type.match(imageType) ||
        file.type.match(pdfType) ||
        file.type.match(excelType)
      ) {
        let fReader = new FileReader();
        const files = document.getElementById("files");
        fReader.readAsDataURL(file);
        fReader.onloadend = function () {
          let wrap = document.createElement("div");
          let imgCapt = document.createElement("p");
          let sucessHtml = `
          <div id="wrap-${
            file.name
          }"class="uploaded_file-done w-file-upload-file">
          <div id="${
            file.name
          }" class="small progress"><img loading="lazy" src="https://assets-global.website-files.com/624c19a34c30c75b84ab76d9/636954644576e06e2e0c15e4_file-text.svg" alt="" class="upload-file-icon"></div>
          <div class="div-block"><div class="text-block w-file-upload-file-name">${
            file.name
          }</div><div class="text-size-small text-color-grey-light">Uploaded ${dayjs(
            new Date()
          ).fromNow()}</div></div><div tabindex="0" aria-label="Remove file" role="button" class="link-2 w-file-remove-link"><div class="w-icon-file-upload-remove"></div></div></div>`;
          imgCapt.innerHTML = sucessHtml;
          files.appendChild(wrap).appendChild(imgCapt);
        };
      } else {
        console.error("Only images are allowed!", file);
      }
    }
    function filesManager(files) {
      files = [...files];
      files.forEach(upFile);
    }

    // END Ready
  });
} else {
  console.log(`DEBUG_MODE: ${DEBUG_MODE}`);
}
