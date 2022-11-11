const params = new URLSearchParams(document.location.search);
const token = params.get("token");
const DEBUG_MODE = params.get("debug");
let creditData = {};
if (DEBUG_MODE !== "0") {
  $(document).ready(function () {
    const upload = Upload({ apiKey: "public_FW25axZ42W9SnxbXHqBDp6LLrqDT" });

    const isDev = "new-machinery-partner.webflow.io";
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
        wrapper.style.display = "block";
        wrapper.classList.remove("small");
        wrapper.classList.remove("progress");
        cb(JSON.parse(this.responseText));
      };
    }
    function saveCreditApp(status, cb) {
      creditData["Status"] = [...creditData["Status"], status];
      creditData["Token"] = token;
      const payload = {
        token,
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
        // const res = await axios.post(
        //   // `https://os.machinerypartner.com/api/upload`,
        //   "https://9c16-2804-1b0-1401-7463-ad98-1a21-2e2c-828.ngrok.io/api/upload",
        //   file,
        //   {
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //     },
        //   }
        // );
        // console.log("response: ", res);
        // cb(res.data.attachments);

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
      console.log("getCreditApp", response.data);
      creditData = response.data;
      if (creditData["Documents"]) {
        creditData["Documents"].forEach(function (file) {
          addFile(file);
        });
      } else {
        creditData["Documents"] = [];
      }
      companyName.innerHTML = creditData["Business Name"];
      appId.innerHTML = `Application ID: #${creditData["Deal Id"]}`;
    });

    dayjs.extend(dayjs_plugin_relativeTime);

    let companyName = document.getElementById("Company-Name");
    let appId = document.getElementById("App-Id");
    let submitButton = document.getElementById("credit-app-submit");
    let fileInput = document.getElementById("uploadInput");
    let dropBox = document.getElementById("dropBox");
    let wrapper = document.getElementById("wrapper");
    // wrapper.style.display = "none";
    wrapper.classList.add("small");
    wrapper.classList.add("progress");
    [("dragenter", "dragover", "dragleave", "drop")].forEach((evt) => {
      dropBox.addEventListener(evt, prevDefault, false);
    });
    function prevDefault(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    ["dragenter", "dragover"].forEach((evt) => {
      dropBox.addEventListener(evt, hover, false);
    });
    ["dragleave", "drop"].forEach((evt) => {
      dropBox.addEventListener(evt, unhover, false);
    });
    function hover(e) {
      dropBox.classList.add("hover");
    }
    function unhover(e) {
      dropBox.classList.remove("hover");
    }

    dropBox.addEventListener("drop", mngDrop, false);
    function mngDrop(e) {
      let dataTrans = e.dataTransfer;
      let files = dataTrans.files;
      filesManager(files);
    }

    submitButton.addEventListener(
      "click",
      function (e) {
        e.preventDefault();
        e.stopPropagation();
        submitButton.style.pointerEvents = "none";
        submitButton.classList.add("is-disable");
        submitButton.value = "Sending your Application for Review...";
        saveCreditApp("REVIEW", function () {
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
              saveCreditApp("DOCUMENTS", function () {
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
