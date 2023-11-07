// Function to start the countdown timer
function startCountdown() {
    // Set the countdown date
    var countdownDate = new Date("December 31, 2023 23:59:59").getTime();

    // Update the countdown every second
    var countdownTimer = setInterval(function() {
        var now = new Date().getTime();
        var distance = countdownDate - now;

        // Calculate the days, hours, minutes and seconds left
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the countdown
        document.getElementById("countdown").innerHTML =
            days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

        // If the countdown is finished, display a message
        if (distance < 0) {
            clearInterval(countdownTimer);
            document.getElementById("countdown").innerHTML = "EXPIRED";
        }
    }, 1000);
}

// Check if the DOM has fully loaded
document.addEventListener("DOMContentLoaded", function() {
    startCountdown();
});
