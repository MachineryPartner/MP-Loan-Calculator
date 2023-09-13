// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const RICH_GEN_WRAPPER_ATTR = "fs-richgen-wrapper";
  const DATA_SOURCE_ATTR = "fs-data-source";
  const DATA_TARGET_ATTR = "fs-data-target";
  const TARGET_PARENT_ATTR = "fs-target-parent";
  const RICH_ADDED_ATTR = "fs-rich-added";
  const POLLING_INTERVAL = 1000; // 1 second for polling interval

  // Function to manage individual rich-gen wrappers
  const handleRichGenWrapper = (wrapperElement) => {
    let richAdded = false; // Flag to check if the attribute needs to be added

    // Populate target elements using the corresponding source elements
    const sourceElements = wrapperElement.querySelectorAll(
      `[${DATA_SOURCE_ATTR}]`
    );
    sourceElements.forEach((sourceElement) => {
      const sourceValue = sourceElement.getAttribute(DATA_SOURCE_ATTR);
      const textContent = sourceElement.textContent.trim();
      const targetElements = wrapperElement.querySelectorAll(
        `[${DATA_TARGET_ATTR}=${sourceValue}]`
      );

      targetElements.forEach((targetElement) => {
        const parentElement = targetElement.closest(`[${TARGET_PARENT_ATTR}]`);
        if (textContent === "") {
          if (parentElement) {
            parentElement.parentNode.removeChild(parentElement);
          }
        } else {
          targetElement.textContent = textContent;
          if (parentElement) {
            parentElement.style.display = "flex";
          }
          richAdded = true;
        }
      });
    });

    // Remove target elements that do not have a corresponding source element
    const allTargetElements = wrapperElement.querySelectorAll(
      `[${DATA_TARGET_ATTR}]`
    );
    allTargetElements.forEach((targetElement) => {
      const targetValue = targetElement.getAttribute(DATA_TARGET_ATTR);
      const correspondingSourceElement = wrapperElement.querySelector(
        `[${DATA_SOURCE_ATTR}=${targetValue}]`
      );

      if (
        !correspondingSourceElement ||
        correspondingSourceElement.textContent.trim() === ""
      ) {
        const parentElement = targetElement.closest(`[${TARGET_PARENT_ATTR}]`);
        if (parentElement) {
          parentElement.parentNode.removeChild(parentElement);
        }
      }
    });

    // At the end of handleRichGenWrapper function
    wrapperElement.setAttribute(RICH_ADDED_ATTR, "true");
  };

  // Function to poll for new rich-gen wrapper elements
  const pollForNewRichGenWrapperElements = () => {
    setInterval(() => {
      const unprocessedRichGenWrappers = document.querySelectorAll(
        `[${RICH_GEN_WRAPPER_ATTR}]:not([${RICH_ADDED_ATTR}])`
      );

      unprocessedRichGenWrappers.forEach(handleRichGenWrapper);
    }, POLLING_INTERVAL);
  };

  // Get all rich-gen wrapper elements and apply the handleRichGenWrapper function to each
  const richGenWrapperElements = document.querySelectorAll(
    `[${RICH_GEN_WRAPPER_ATTR}]`
  );
  richGenWrapperElements.forEach(handleRichGenWrapper);

  // Start polling for new rich-gen wrapper elements
  pollForNewRichGenWrapperElements();

  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    "cmsload",
    (listInstances) => {
      console.log("cmsload Successfully loaded!");

      // The callback passes a `listInstances` array with all the `CMSList` instances on the page.
      const [listInstance] = listInstances;

      // The `renderitems` event runs whenever the list renders items after switching pages.
      listInstance.on("renderitems", (renderedItems) => {
        // console.log(renderedItems);

        // Fetching rich-gen wrappers again within the callback to make sure we have the latest elements.
        const updatedRichGenWrapperElements = document.querySelectorAll(
          `[${RICH_GEN_WRAPPER_ATTR}]`
        );

        // Call handleRichGenWrapper for each updated rich-gen wrapper element.
        updatedRichGenWrapperElements.forEach(handleRichGenWrapper);
      });
    }
  ]);
});
