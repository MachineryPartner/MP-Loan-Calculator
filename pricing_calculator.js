function calculate_price (){

    AMOUNT =  document.getElementById("full-price").value;
    down_payment = document.getElementById("Payment").value;
    term = document.getElementById('Term').value;
    interest_rate = document.getElementById("Interest-rate").value / 100;
    sales_tax = document.getElementById("Salex-tax").value / 100;
    
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
}

document.getElementById("fullprice").addEventListener('load', {
    document.getElementById("fullprice").placeholder = parseInt(document.getElementById("price").innerHTML);
} )

document.getElementById("Down-payment").addEventListener('change', calculate_price);
document.getElementById("Term").addEventListener('change', calculate_price);
document.getElementById("Interest-rate").addEventListener('change', calculate_price);
document.getElementById("Salex-tax").addEventListener('change', calculate_price);