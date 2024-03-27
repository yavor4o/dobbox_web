"use strict";


// Class definition
let KTAccountSettingsDeactivateAccount = function () {
    // Private letiables
    let form;
    let validation;
    let submitButton;

    // Private functions
    let initValidation = function () {

        validation = FormValidation.formValidation(
            form,
            {
                fields: {
                    deactivate: {
                        validators: {
                            notEmpty: {
                                message: 'Моля поствете отметка за деактивиране на акаунта ви.'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    submitButton: new FormValidation.plugins.SubmitButton(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',
                        eleValidClass: ''
                    })
                }
            }
        );
    }

    let handleForm = function () {
    submitButton.addEventListener('click', function (e) {
        e.preventDefault();

        validation.validate().then(function (status) {
            if (status == 'Valid') {
                swal.fire({
                    text: "Наистина ли желаете да деактивирате вашият акаунт?Процесът е необратим и вие ще загубите всички данни!",
                    icon: "warning",
                    buttonsStyling: false,
                    showDenyButton: true,
                    confirmButtonText: "Да",
                    denyButtonText: 'Отказ',
                    customClass: {
                        confirmButton: "btn btn-light-primary",
                        denyButton: "btn btn-danger"
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            title: 'Моля въведете вашата парола за валидация!',
                            text: "Това е последната стъпка в която все още може да се откажете.",
                            input: 'password',
                            inputAttributes: {
                                autocapitalize: 'off',
                                autocorrect: 'off'
                            },
                            showCancelButton: true,
                            cancelButtonText: 'Отказвам се',
                            confirmButtonText: 'Потвърди',
                            showLoaderOnConfirm: true,
                            preConfirm: (password) => {
                                return fetch('/validate-password-and-deactivate/', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                        'X-CSRFToken': csrftoken,
                                    },
                                    body: `password=${encodeURIComponent(password)}`
                                })
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Паролата е невалидна.');
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    if (data.status === 'success') {
                                        Swal.fire({
                                            title: 'Деактивиран!',
                                            text: 'Вашият акаунт беше деактивиран заедно със всички ваши данни.',
                                            icon: 'success',
                                            confirmButtonText: 'ОК'
                                        }).then((result) => {
                                            if (result.isConfirmed || result.isDismissed) {
                                                window.location.href = '/';
                                            }
                                        });
                                    } else {
                                        throw new Error(data.message ? data.message : 'Възникна грешка.');
                                    }
                                })
                                .catch(error => {
                                    Swal.showValidationMessage(
                                        `Request failed: ${error}`
                                    );
                                });
                            },
                            allowOutsideClick: () => !Swal.isLoading()
                        })
                    } else if (result.isDenied) {
                        Swal.fire({
                            text: 'Деактивацията е прекратена.',
                            icon: 'info',
                            confirmButtonText: "Ok",
                            buttonsStyling: false,
                            customClass: {
                                confirmButton: "btn btn-light-primary"
                            }
                        })
                    }
                });
            } else {
                swal.fire({
                    text: "Извинявайте, системата има някакви проблеми, моля свържете се с нас.",
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "OK!",
                    customClass: {
                        confirmButton: "btn btn-light-primary"
                    }
                });
            }
        });
    });
}


    // Public methods
    return {
        init: function () {
            form = document.querySelector('#kt_account_deactivate_form');

            if (!form) {
                return;
            }
            
            submitButton = document.querySelector('#kt_account_deactivate_account_submit');

            initValidation();
            handleForm();
        }
    }
}();

// On document ready
KTUtil.onDOMContentLoaded(function() {
    KTAccountSettingsDeactivateAccount.init();
});
