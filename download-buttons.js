/* Download Buttons Generator*/
document.addEventListener("DOMContentLoaded", () => {
  initDownloadButtons();
});

function initDownloadButtons() {
  const downloadButtonTemplate = document.querySelector(
    '[fs-download-element="button-template"]'
  );
  if (!downloadButtonTemplate) return;

  const downloadButtonsList = document.querySelector(
    '[fs-download-element="list"]'
  );
  if (!downloadButtonsList) return;

  const downloadSources = document.querySelectorAll(
    '[fs-download-element="rich-text"] [fs-download-element="source"]'
  );

  // Use a document fragment to minimize DOM manipulations
  const fragment = document.createDocumentFragment();

  downloadSources.forEach((source) => {
    const clonedButton = createDownloadButtonFromSource(
      downloadButtonTemplate,
      source
    );
    if (clonedButton) {
      fragment.appendChild(clonedButton);
    }
  });

  // Append all at once to minimize DOM manipulations
  downloadButtonsList.appendChild(fragment);
}

function createDownloadButtonFromSource(template, source) {
  const clonedButton = template.cloneNode(true);

  const fileUrl = source.getAttribute("fs-download-fileurl");
  const fileName = source.getAttribute("fs-download-filename");
  if (!fileUrl || !fileName) return;

  clonedButton.href = fileUrl;

  const downloadFilename = clonedButton.querySelector(
    '[fs-download-element="filename"]'
  );
  if (downloadFilename) {
    downloadFilename.textContent = fileName;
  }

  updateAttributesFromSource(clonedButton, source);

  return clonedButton;
}

function updateAttributesFromSource(button, source) {
  const sourceAttributes = source.querySelectorAll("[fs-download-text]");

  sourceAttributes.forEach((attr) => {
    const attributeName = attr.getAttribute("fs-download-text");
    const targetElement = button.querySelector(
      `[fs-download-text="${attributeName}"]`
    );

    if (targetElement) {
      targetElement.textContent = attr.textContent;
    }
  });
}
