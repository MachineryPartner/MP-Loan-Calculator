document.addEventListener("DOMContentLoaded", () => {
  const appendElements = document.querySelectorAll("[fs-append-element]");
  appendElements.forEach((appendElement) => {
    const appendValue = appendElement.getAttribute("fs-append-element");
    const appendTargets = document.querySelectorAll(
      `[fs-append-target="${appendValue}"]`
    );
    appendTargets.forEach((appendTarget) => {
      appendTarget.appendChild(appendElement.cloneNode(true));
    });
  });

  // Call the second script function after the first script finishes
  secondScriptFunction();
});

// Wait for the DOM to be fully loaded
function secondScriptFunction() {
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
            // parentElement.parentNode.removeChild(parentElement);
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

    // At the end of handleRichGenWrapper function
    const dataSources = document.querySelectorAll(`[${DATA_SOURCE_ATTR}]`);
    const uniqueValues = new Set();

    dataSources.forEach((sourceElement) => {
      const value = sourceElement.getAttribute(DATA_SOURCE_ATTR);
      uniqueValues.add(value);
    });

    uniqueValues.forEach((value) => {
      const specificDataSources = document.querySelectorAll(
        `[${DATA_SOURCE_ATTR}="${value}"]`
      );
      const allEmpty = [...specificDataSources].every(
        (elem) => !elem.textContent.trim()
      );

      if (allEmpty) {
        const targetsToRemoveParentsOf = document.querySelectorAll(
          `[${DATA_TARGET_ATTR}="${value}"]`
        );
        targetsToRemoveParentsOf.forEach((targetElement) => {
          const parentElement = targetElement.closest(
            `[${TARGET_PARENT_ATTR}]`
          );
          if (parentElement) {
            parentElement.remove();
          }
        });
      }
    });

    // Remove parent elements where there are no corresponding source elements
    const orphanedTargets = document.querySelectorAll(`[${DATA_TARGET_ATTR}]`);
    orphanedTargets.forEach((targetElement) => {
      const targetValue = targetElement.getAttribute(DATA_TARGET_ATTR);
      const correspondingSourceElement = document.querySelector(
        `[${DATA_SOURCE_ATTR}="${targetValue}"]`
      );

      if (!correspondingSourceElement) {
        const parentElement = targetElement.closest(`[${TARGET_PARENT_ATTR}]`);
        if (parentElement) {
          parentElement.remove();
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
}
