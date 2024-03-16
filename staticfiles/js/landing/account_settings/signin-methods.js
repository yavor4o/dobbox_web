"use strict";
 var csrftoken = getCookie('csrftoken');

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        document.cookie.split(';').forEach(function(cookie) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            }
        });
    }
    return cookieValue;
}


// Class definition
var KTAccountSettingsSigninMethods = function () {
    var signInForm;
    var signInMainEl;
    var signInEditEl;
    var passwordMainEl;
    var passwordEditEl;
    var signInChangeEmail;
    var signInCancelEmail;
    var passwordChange;
    var passwordCancel;

    var toggleChangeEmail = function () {
        signInMainEl.classList.toggle('d-none');
        signInChangeEmail.classList.toggle('d-none');
        signInEditEl.classList.toggle('d-none');
    }

    var toggleChangePassword = function () {
        passwordMainEl.classList.toggle('d-none');
        passwordChange.classList.toggle('d-none');
        passwordEditEl.classList.toggle('d-none');
    }

    // Private functions
    var initSettings = function () {  
        if (!signInMainEl) {
            return;
        }        

        // toggle UI
        signInChangeEmail.querySelector('button').addEventListener('click', function () {
            toggleChangeEmail();
        });

        signInCancelEmail.addEventListener('click', function () {
            toggleChangeEmail();
        });

        passwordChange.querySelector('button').addEventListener('click', function () {
            toggleChangePassword();
        });

        passwordCancel.addEventListener('click', function () {
            toggleChangePassword();
        });
    }

    let handleChangeEmail = function () {
    if (!signInForm) {
        return;
    }

    var validation = FormValidation.formValidation(
    signInForm,
    {
        fields: {
            email: {
                validators: {
                    notEmpty: {
                        message: 'Имейлът е задължителен.'
                    },
                    emailAddress: {
                            message: 'Това не е валиден имейл адрес.'
                        }

                }
            },
            confirmemailpassword: {
                validators: {
                    notEmpty: {
                        message: 'Паролата е задължителна'
                    }
                }
            }
        },
        plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap: new FormValidation.plugins.Bootstrap5({
                rowSelector: '.fv-row'
            })
        }
    }
);


    signInForm.querySelector('#kt_signin_submit').addEventListener('click', function (e) {
        e.preventDefault();
        validation.validate().then(function (status) {
            if (status === 'Valid') {
                let formData = new FormData(signInForm);
                fetch('/update-email/', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRFToken': csrftoken,
                    },
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        Swal.fire({
                            text: data.message,
                            icon: "success",
                            confirmButtonText: "Добре!",
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light-primary"
                            }
                        });
                       var newEmail = data.newEmail;


                        var emailDisplay1 = document.querySelector('#kt_signin_email div.fw-semibold.text-gray-600');
                        if(emailDisplay1) emailDisplay1.textContent = newEmail;


                        var emailIconParent = document.querySelector('#email-user').parentNode;
                        if(emailIconParent) {

                            emailIconParent.innerHTML = '<i class="ki-outline ki-sms fs-4" id="email-user"></i> ' + newEmail;
                        }

                        signInForm.reset();
                        validation.resetForm(true);
                        toggleChangeEmail();
                    }  else if (data.status === 'error') {

        let errorMessages = Object.values(data.errors).map((errorList) => errorList.join(' ')).join('<br>');

        Swal.fire({
            html: errorMessages,
            icon: "error",
            confirmButtonText: "Добре!",
            customClass: {
                confirmButton: "btn font-weight-bold btn-light-primary"
            }
        });
    }
})
                .catch(error => console.error('Error:', error));
            } else {

                Swal.fire({
                    text: "Съжаляваме, изглежда бяха открити някои грешки, моля опитайте отново.",
                    icon: "error",
                    confirmButtonText: "Добре!",
                    customClass: {
                        confirmButton: "btn font-weight-bold btn-light-primary"
                    }
                });
            }
        });
    });
};


    var handleChangePassword = function () {
    var passwordForm = document.getElementById('kt_signin_change_password');
    if (!passwordForm) {
        return;
    }

    var validation = FormValidation.formValidation(
        passwordForm,
        {
            fields: {
                old_password: {
                    validators: {
                        notEmpty: {
                            message: 'Текущата парола е задължителна'
                        }
                    }
                },
                new_password1: {
                    validators: {
                        notEmpty: {
                            message: 'Новата парола е задължителна'
                        }
                    }
                },
                new_password2: {
                    validators: {
                        notEmpty: {
                            message: 'Моле въведете новата парола'
                        },
                        identical: {
                            compare: function() {
                                return passwordForm.querySelector('[name="newpassword"]').value;
                            },
                            message: 'Двете пароли не са идентични'
                        }
                    }
                }
            },
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap5({
                    rowSelector: '.fv-row'
                })
            }
        }
    );

    passwordForm.querySelector('#kt_password_submit').addEventListener('click', function (e) {
        e.preventDefault();

        validation.validate().then(function (status) {
            if (status === 'Valid') {
                var formData = new FormData(passwordForm);
                fetch('/change-password/', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRFToken': csrftoken
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        Swal.fire({
                            text: data.message,
                            icon: "success",
                            confirmButtonText: "Добре!",
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light-primary"
                            }
                        }).then(function(){
                            passwordForm.reset();
                            validation.resetForm();
                            toggleChangePassword();
                        });
                    } else if (data.status === 'error') {
                        let errorMessages = Object.values(data.errors).map((errorList) => errorList.join(' ')).join('<br>');
                        Swal.fire({
                            html: errorMessages,
                            icon: "error",
                            confirmButtonText: "Добре!",
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light-primary"
                            }
                        });
                    }
                })
                .catch(error => console.error('Error:', error));
            } else {
                Swal.fire({
                    text: "Съжаляваме, изглежда бяха открити някои грешки, моля опитайте отново.",
                    icon: "error",
                    confirmButtonText: "Добре!",
                    customClass: {
                        confirmButton: "btn font-weight-bold btn-light-primary"
                    }
                });
            }
        });
    });
};




    // Public methods
    return {
        init: function () {
            signInForm = document.getElementById('kt_signin_change_email');
            signInMainEl = document.getElementById('kt_signin_email');
            signInEditEl = document.getElementById('kt_signin_email_edit');
            passwordMainEl = document.getElementById('kt_signin_password');
            passwordEditEl = document.getElementById('kt_signin_password_edit');
            signInChangeEmail = document.getElementById('kt_signin_email_button');
            signInCancelEmail = document.getElementById('kt_signin_cancel');
            passwordChange = document.getElementById('kt_signin_password_button');
            passwordCancel = document.getElementById('kt_password_cancel');

            initSettings();
            handleChangeEmail();
            handleChangePassword();
        }
    }
}();

// On document ready
KTUtil.onDOMContentLoaded(function() {
    KTAccountSettingsSigninMethods.init();
});
