

// Елемент за индикация
let signInButton = document.querySelector("#kt_sign_up_submit");


signInButton.addEventListener("click", function() {
    // Активиране на индикатора
    signInButton.setAttribute("data-kt-indicator", "on");

    // Показване на спинъра и текста за зареждане
    let indicatorProgress = signInButton.nextElementSibling;
    indicatorProgress.style.display = 'inline-block';

    // Деактивиране на индикатора след 3 секунди
    setTimeout(function() {
        signInButton.removeAttribute("data-kt-indicator");

        // Скриване на спинъра и текста
        indicatorProgress.style.display = 'none';
    }, 3000);
});








