document.addEventListener("DOMContentLoaded", function () {
  function moveCardOnMobile() {
    if (window.innerWidth < 992) {
      const card = document.querySelector("#product-card");
      if (card) {
        const newLocation = document.querySelector(".mobile-card_location");
        const clonedCard = card.cloneNode(true);
        clonedCard.classList.add("is-no-shadow"); // Add class to cloned card element
        newLocation.appendChild(clonedCard);
      }
    }
  }

  moveCardOnMobile(); // Run on page load
});
