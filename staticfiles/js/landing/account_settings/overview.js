// Елемент за индикация
let ProfileChange = document.querySelector("#kt_account_profile_details_submit");


ProfileChange.addEventListener("click", function() {
    // Активиране на индикатора
    ProfileChange.setAttribute("data-kt-indicator", "on");

    // Показване на спинъра и текста за зареждане
    let indicatorProgress = ProfileChange.nextElementSibling;
    indicatorProgress.style.display = 'inline-block';

    // Деактивиране на индикатора след 3 секунди
    setTimeout(function() {
        ProfileChange.removeAttribute("data-kt-indicator");

        // Скриване на спинъра и текста
        indicatorProgress.style.display = 'none';
    }, 3000);
});


let EmailChange = document.querySelector("#kt_signin_submit");


EmailChange.addEventListener("click", function() {
    // Активиране на индикатора
    EmailChange.setAttribute("data-kt-indicator", "on");

    // Показване на спинъра и текста за зареждане
    let indicatorProgress = EmailChange.nextElementSibling;
    indicatorProgress.style.display = 'inline-block';

    // Деактивиране на индикатора след 3 секунди
    setTimeout(function() {
        EmailChange.removeAttribute("data-kt-indicator");

        // Скриване на спинъра и текста
        indicatorProgress.style.display = 'none';
    }, 1000);
});


let PasswordChange = document.querySelector("#kt_password_submit");




PasswordChange.addEventListener("click", function() {
    PasswordChange.setAttribute("data-kt-indicator", "on");

    // Показване на спинъра и текста за зареждане
    let indicatorProgress = PasswordChange.nextElementSibling;
    indicatorProgress.style.display = 'inline-block';

    // Деактивиране на индикатора след 3 секунди
    setTimeout(function() {
        PasswordChange.removeAttribute("data-kt-indicator");

        // Скриване на спинъра и текста
        indicatorProgress.style.display = 'none';
    }, 1000);
});