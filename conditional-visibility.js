function mainFunction() {
  var cards = $('.product_card-component');
  
  cards.each(function() {
    var card = $(this);
    var brandName = card.find('#brand-name').text();
    var fsShowElements = card.find('[fs-show]');
    var fsHideElements = card.find('[fs-hide]');

    fsShowElements.hide(); // hide all elements with fs-show attribute by default
    fsHideElements.show(); // show all elements with fs-hide attribute by default

    fsShowElements.each(function() {
      var fsShowText = $(this).attr('fs-show');
      if (fsShowText && fsShowText.includes(brandName)) {
        $(this).show(); // show only the elements with matching fs-show attribute value
      } else {
        $(this).hide(); // hide the elements that don't match
      }
    });

    fsHideElements.each(function() {
      var fsHideText = $(this).attr('fs-hide');
      if (fsHideText && fsHideText.includes(brandName)) {
        $(this).hide(); // hide only the elements with matching fs-hide attribute value
      }
    });
  });
}

window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsload',
  (listInstances) => {
    console.log('CMSLoad Successfully loaded!');

    // The callback passes a `listInstances` array with all the `CMSList` instances on the page.
    const [listInstance] = listInstances;

    // The `renderitems` event runs whenever the list renders items after switching pages.
    listInstance.on('renderitems', (renderedItems) => {
    // Call the main function here
    mainFunction();      
    });
  },
]);

window.fsAttributes.push([
  'cmsfilter',
  (filterInstances) => {
    console.log('CMSFilter Successfully loaded!');

    // The callback passes a `filterInstances` array with all the `CMSFilters` instances on the page.
    const [filterInstance] = filterInstances;

    // The `renderitems` event runs whenever the list renders items after filtering.
    filterInstance.listInstance.on('renderitems', (renderedItems) => {
      // Call the main function here
      mainFunction();
    });
  },
]);
