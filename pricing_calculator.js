
document.onload = function() {
    var price = parseInt(document.getElementById('price').innerHTML);
    document.getElementById('full-price').placeholder = price;
  };
  
  
  
function calculate_price(){
    AMOUNT =  document.getElementById("full-price").value;
    if (AMOUNT == 0){
        AMOUNT =  document.getElementById("full-price").placeholder;
    }
    down_payment = document.getElementById("Payment").value;
    term = document.getElementById('Term').value;
    interest_rate = document.getElementById("Interest-rate").value / 100;
    sales_tax = document.getElementById("Salex-tax").value / 100;
  
    console.log(AMOUNT, down_payment, term, interest_rate, sales_tax)
      
    principal = (1 + sales_tax) * AMOUNT - down_payment;
      
    r = interest_rate / (12);
      
    M = principal * r * Math.pow((1+r), term) / ( Math.pow((1+r), term) - 1 )
      
    if (!isNaN(principal)){
        document.getElementById("total-financed").innerHTML = Math.round(principal).toLocaleString("en-US");
        document.getElementById("total-taxes").innerHTML = Math.round((sales_tax) * AMOUNT).toLocaleString("en-US");
    }
  
    if (!isNaN(M) & isFinite(M)){
        document.getElementById("total-monthly").innerHTML = Math.round(M).toLocaleString("en-US");
    }
  };
  
