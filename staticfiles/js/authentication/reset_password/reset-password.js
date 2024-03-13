// Елемент за индикация
var signInButton = document.querySelector("#kt_password_reset_submit");

// Обработка на клик събитието на бутона
signInButton.addEventListener("click", function() {
    // Активиране на индикатора
    signInButton.setAttribute("data-kt-indicator", "on");

    // Показване на спинъра и текста за зареждане
    var indicatorProgress = signInButton.nextElementSibling;
    indicatorProgress.style.display = 'inline-block';

    // Деактивиране на индикатора след 3 секунди
    setTimeout(function() {
        signInButton.removeAttribute("data-kt-indicator");

        // Скриване на спинъра и текста
        indicatorProgress.style.display = 'none';
    }, 3000);
});
