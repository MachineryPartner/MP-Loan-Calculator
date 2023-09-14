document.addEventListener("DOMContentLoaded", () => {
  function mainFunction() {
    let interval = setInterval(() => {
      const cards = document.querySelectorAll(
        ".product_card-component:not([fs-brand-visibility='done'])"
      );

      if (cards.length === 0) {
        clearInterval(interval);
        return;
      }

      cards.forEach((card) => {
        const brandName = card.querySelector("[fs-brands-name]").textContent;
        const fsShowElements = card.querySelectorAll("[fs-brands-show]");
        const fsHideElements = card.querySelectorAll("[fs-brands-hide]");

        fsShowElements.forEach((el) => (el.style.display = "none"));
        fsHideElements.forEach((el) => (el.style.display = ""));

        fsShowElements.forEach((el) => {
          const fsShowText = el.getAttribute("fs-brands-show");
          if (fsShowText && fsShowText.includes(brandName)) {
            el.style.display = "";
          } else {
            el.style.display = "none";
          }
          el.setAttribute("fs-brand-visibility", "done");
        });

        fsHideElements.forEach((el) => {
          const fsHideText = el.getAttribute("fs-brands-hide");
          if (fsHideText && fsHideText.includes(brandName)) {
            el.style.display = "none";
          }
          el.setAttribute("fs-brand-visibility", "done");
        });

        card.setAttribute("fs-brand-visibility", "done");
      });
    }, 200);
  }

  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    "cmsload",
    (listInstances) => {
      console.log("CMSLoad Successfully loaded!");
      mainFunction();

      const [listInstance] = listInstances;

      listInstance.on("renderitems", () => {
        mainFunction();
      });
    }
  ]);

  window.fsAttributes.push([
    "cmsfilter",
    (filterInstances) => {
      console.log("CMSFilter Successfully loaded!");
      mainFunction();

      const [filterInstance] = filterInstances;

      filterInstance.listInstance.on("renderitems", () => {
        mainFunction();
      });
    }
  ]);

  mainFunction();
});
