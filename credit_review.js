const params = new URLSearchParams(document.location.search);
const token = params.get("token");
const DEBUG_MODE = params.get("debug");
let creditData = {};
if (DEBUG_MODE !== "0") {
  $(document).ready(function () {
    const isDev = "new-machinery-partner.webflow.io";
    function getAPIBasePath() {
      const domain = window.location.hostname;
      const baseUrlProd =
        "https://9c16-2804-1b0-1401-7463-ad98-1a21-2e2c-828.ngrok.io";
      const baseUrlDev =
        "https://9c16-2804-1b0-1401-7463-ad98-1a21-2e2c-828.ngrok.io";
      if (domain === isDev) return baseUrlDev;
      return baseUrlProd;
    }
    function getCreditApp(cb) {
      const payload = {
        token,
      };
      var xhr = new XMLHttpRequest();
      xhr.open("POST", `${getAPIBasePath()}/api/loan/security`, true);
      xhr.setRequestHeader("Authorization", "Basic d2Vic2l0ZTpmb3Jt");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(payload));
      xhr.onload = function () {
        cb(JSON.parse(this.responseText));
      };
    }
    function saveCreditApp(cb) {
      creditData["Status"] = [...creditData["Status"], "REVIEW"];
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

    getCreditApp(function (response) {
      console.log("getCreditApp", response.data);
      creditData = response.data;
    });
    let form = document.getElementById("wf-form-Finance");
    let file = document.getElementById("file");
    let fileList = [];
    // TODO: Check array concat behavior adding single and multiple files at once
    file.addEventListener(
      "change",
      function handleFiles(e) {
        fileList = [...fileList, ...this.files];
      },
      false
    );

    form.addEventListener(
      "submit",
      function (e) {
        e.preventDefault();
        const successMessage = document.querySelector("w-form-done");
        const errorMessage = document.querySelector("w-form-error");
        const formData = new FormData();
        fileList.forEach(function (file) {
          formData.append("attachments", file);
        });
        const requestOptions = {
          method: "POST",
          headers: {
            Authorization: "Basic d2Vic2l0ZTpmb3Jt",
          },
          body: formData,
        };
        fetch(`${getAPIBasePath()}/api/upload`, requestOptions)
          .then(function (response) {
            form.style.display = "none";
            successMessage.style.display = "block";
            errorMessage.style.display = "none";
            const ret = response.json();
            console.log("ret", ret);
            creditData["Documents"] = ret.attachments;
            saveCreditApp(function () {});
          })
          .catch(function (error) {
            successMessage.style.display = "none";
            errorMessage.style.display = "block";
          });
      },
      false
    );

    // END Ready
  });
} else {
  console.log(`DEBUG_MODE: ${DEBUG_MODE}`);
}
