const params = new URLSearchParams(document.location.search);
const token = params.get("token");
const DEBUG_MODE = params.get("debug");
if (DEBUG_MODE !== "0") {
  const priceInput = document.getElementById("price");
  const price = parseInt(
    priceInput ? document.getElementById("price").innerHTML : "0"
  );
  if (price == 0) {
    document.getElementById("full-price").value =
      document.getElementById("full-price").placeholder;
  } else if (!isNaN(price)) {
    document.getElementById("full-price").value = currency(price).format();
  }
  // formatCurrency($(this));
  $("#Term").change(function () {
    calculate_price();
  });

  $("#Interest-rate").change(function () {
    calculate_price();
  });

  $("#Interest-rate").on({
    keyup: function () {
      // document.getElementById("Interest-rate").value = formatNumber(
      //   document.getElementById("Interest-rate").value
      // );
    },
    focus: function () {
      document.getElementById("Interest-rate").value = currency(
        document.getElementById("Interest-rate").value
      ).value;
      if (document.getElementById("Interest-rate").value === "0")
        document.getElementById("Interest-rate").value = "";
    },
    blur: function () {
      document.getElementById("Interest-rate").value = `${
        currency(document.getElementById("Interest-rate").value).value
      }%`;
    },
  });

  $("#Salex-tax").change(function () {
    calculate_price();
  });

  $("#Salex-tax").on({
    keyup: function () {
      // document.getElementById("#Salex-tax").value = formatNumber(
      //   document.getElementById("#Salex-tax").value
      // );
    },
    focus: function () {
      document.getElementById("Salex-tax").value = currency(
        document.getElementById("Salex-tax").value
      ).value;
      if (document.getElementById("Salex-tax").value === "0")
        document.getElementById("Salex-tax").value = "";
    },
    blur: function () {
      document.getElementById("Salex-tax").value = `${
        currency(document.getElementById("Salex-tax").value).value
      }%`;
    },
  });

  $("input[data-type='currency']").on({
    keyup: function () {
      formatCurrency($(this));
    },
    blur: function () {
      // formatCurrency($(this), "blur");
    },
  });

  function calculate_price() {
    AMOUNT = currency(document.getElementById("full-price").value).value;
    if (AMOUNT == 0) {
      AMOUNT = currency(document.getElementById("full-price").value).value;
    }
    down_payment = currency(document.getElementById("Payment").value).value;
    term = currency(document.getElementById("Term").value).value;
    interest_rate =
      currency(document.getElementById("Interest-rate").value).value / 100;
    sales_tax =
      currency(document.getElementById("Salex-tax").value).value / 100;

    if (interest_rate !== 0) {
      document.getElementById("Interest-rate").value = `${
        currency(document.getElementById("Interest-rate").value).value
      }%`;
    }

    if (sales_tax !== 0) {
      document.getElementById("Salex-tax").value = `${
        currency(document.getElementById("Salex-tax").value).value
      }%`;
    }

    // console.log({ AMOUNT, down_payment, term, interest_rate, sales_tax });
    if (term === 0) {
      document.getElementById("total-monthly").innerHTML = 0;
      return;
    }

    principal = (1 + sales_tax) * AMOUNT - down_payment;

    r = interest_rate / 12;

    M = (principal * r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1);

    if (!isNaN(principal)) {
      document.getElementById("total-financed").innerHTML =
        Math.round(principal).toLocaleString("en-US");
      document.getElementById("total-taxes").innerHTML = Math.round(
        sales_tax * AMOUNT
      ).toLocaleString("en-US");
    }

    if (!isNaN(M) & isFinite(M)) {
      document.getElementById("total-monthly").innerHTML =
        Math.round(M).toLocaleString("en-US");
    }
  }

  function formatNumber(n) {
    // format number 1000000 to 1,234,567
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function formatCurrency(input, blur) {
    calculate_price();
    // appends $ to value, validates decimal side
    // and puts cursor back in right position.

    // get input value
    let input_val = input.val();
    // don't validate empty input
    if (input_val === "") {
      return;
    }

    // original length
    const original_len = input_val.length;

    // initial caret position
    let caret_pos = input.prop("selectionStart");

    // check for decimal
    if (input_val.indexOf(".") >= 0) {
      // get position of first decimal
      // this prevents multiple decimals from
      // being entered
      const decimal_pos = input_val.indexOf(".");

      // split number by decimal point
      let left_side = input_val.substring(0, decimal_pos);
      let right_side = input_val.substring(decimal_pos);

      // add commas to left side of number
      left_side = formatNumber(left_side);

      // validate right side
      right_side = formatNumber(right_side);

      // Limit decimal to only 2 digits
      right_side = right_side.substring(0, 2);

      // join number by .
      input_val = "$" + left_side + "." + right_side;
    } else {
      // no decimal entered
      // add commas to number
      // remove all non-digits
      input_val = formatNumber(input_val);
      input_val = "$" + input_val;
    }

    // send updated string to input
    input.val(input_val);

    // put caret back in the right position
    const updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input[0].setSelectionRange(caret_pos, caret_pos);
  }
} else {
  console.log(`DEBUG_MODE: ${DEBUG_MODE}`);
}
