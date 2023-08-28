// Global attribute constants for Feature 2
const dataSourceAttribute = "fs-data-source";
const dataTargetAttribute = "fs-data-target";
const targetParentAttribute = "fs-target-parent";

// Feature 1: DOM Injection
const injectSourceIntoTargetElement = (sourceElement, targetElement) => {
  const clonedElement = sourceElement.cloneNode(true);
  clonedElement.removeAttribute("fs-nest-element");
  targetElement.appendChild(clonedElement);
  targetElement.setAttribute("data-nested-inserted", "true");
};

const scanAndInjectElements = () => {
  const elementsToBeInjected = document.querySelectorAll("[fs-nest-element]");
  let allElementsInjected = true;

  elementsToBeInjected.forEach((sourceElement) => {
    const matchingValue = sourceElement.getAttribute("fs-nest-element");
    const matchingTargets = document.querySelectorAll(
      `[fs-nest-target="${matchingValue}"]:not([data-nested-inserted="true"])`
    );

    if (matchingTargets.length > 0) {
      allElementsInjected = false;
      matchingTargets.forEach((targetElement) => {
        injectSourceIntoTargetElement(sourceElement, targetElement);
      });
    }
  });

  return allElementsInjected;
};

const executeDomInjectionAtIntervals = () => {
  const periodicScanIntervalId = setInterval(() => {
    const allElementsInjected = scanAndInjectElements();
    if (allElementsInjected) {
      clearInterval(periodicScanIntervalId);
    }
  }, 1000);
};

// Feature 2: Rich Generation Wrapper Handling
const manageIndividualRichGenWrapper = (wrapperElement) => {
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
      const parentElement = targetElement.closest(`[${targetParentAttribute}]`);
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
      const parentElement = targetElement.closest(`[${targetParentAttribute}]`);
      if (parentElement) {
        parentElement.parentNode.removeChild(parentElement);
      }
    }
  });
};

const applyRichGenWrapperToElements = () => {
  const richGenWrapperAttribute = "fs-richgen-wrapper";
  const richGenWrapperElements = document.querySelectorAll(
    `[${richGenWrapperAttribute}]`
  );
  richGenWrapperElements.forEach(manageIndividualRichGenWrapper);
};

// Main function to initialize DOM manipulations
const initializeDomManipulations = () => {
  // Run DOM Injection Feature (Feature 1)
  scanAndInjectElements();
  executeDomInjectionAtIntervals();

  // Run Rich Generation Wrapper Handling Feature (Feature 2)
  applyRichGenWrapperToElements();
};

// Initialize the main function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeDomManipulations);

// CMS Load API
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  "cmsload",
  (listInstances) => {
    console.log("cmsload Successfully loaded!");

    // The callback passes a `listInstances` array with all the `CMSList` instances on the page.
    const [listInstance] = listInstances;

    // The `renderitems` event runs whenever the list renders items after switching pages.
    listInstance.on("renderitems", (renderedItems) => {
      console.log(renderedItems);

      // Re-initialize your DOM manipulations
      initializeDomManipulations();
    });
  },
]);
