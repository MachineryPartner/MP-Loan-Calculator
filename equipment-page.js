// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const richGenWrapperAttribute = "fs-richgen-wrapper";
  const dataSourceAttribute = "fs-data-source";
  const dataTargetAttribute = "fs-data-target";
  const targetParentAttribute = "fs-target-parent";

  // Function to manage individual rich-gen wrappers
  const handleRichGenWrapper = (wrapperElement) => {
    // Populate target elements using the corresponding source elements
    const sourceElements = wrapperElement.querySelectorAll(
      `[${dataSourceAttribute}]`
    );
    sourceElements.forEach((sourceElement) => {
      const sourceValue = sourceElement.getAttribute(dataSourceAttribute);
      const textContent = sourceElement.textContent.trim();
      const targetElements = wrapperElement.querySelectorAll(
        `[${dataTargetAttribute}=${sourceValue}]`
      );

      targetElements.forEach((targetElement) => {
        const parentElement = targetElement.closest(
          `[${targetParentAttribute}]`
        );
        if (textContent === "") {
          if (parentElement) {
            parentElement.parentNode.removeChild(parentElement);
          }
        } else {
          targetElement.textContent = textContent;
          if (parentElement) {
            parentElement.style.display = "flex";
          }
        }
      });
    });

    // Remove target elements that do not have a corresponding source element
    const allTargetElements = wrapperElement.querySelectorAll(
      `[${dataTargetAttribute}]`
    );
    allTargetElements.forEach((targetElement) => {
      const targetValue = targetElement.getAttribute(dataTargetAttribute);
      const correspondingSourceElement = wrapperElement.querySelector(
        `[${dataSourceAttribute}=${targetValue}]`
      );

      if (
        !correspondingSourceElement ||
        correspondingSourceElement.textContent.trim() === ""
      ) {
        const parentElement = targetElement.closest(
          `[${targetParentAttribute}]`
        );
        if (parentElement) {
          parentElement.parentNode.removeChild(parentElement);
        }
      }
    });
  };

  // Get all rich-gen wrapper elements and apply the handleRichGenWrapper function to each
  const richGenWrapperElements = document.querySelectorAll(
    `[${richGenWrapperAttribute}]`
  );
  richGenWrapperElements.forEach(handleRichGenWrapper);
});

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
