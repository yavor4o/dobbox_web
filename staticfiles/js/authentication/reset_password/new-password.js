
let signInButton = document.querySelector("#kt_new_password_submit");

// Обработка на клик събитието на бутона
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



//Скрива съобщенията във страницата за нова парола

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        let errorElements = document.querySelectorAll(".alert-danger, .alert-success, .alert-warning");
        errorElements.forEach(function (element) {
            element.style.display = "none";
        });
    }, 4000); // 2 секунди (2000 милисекунди)
});
