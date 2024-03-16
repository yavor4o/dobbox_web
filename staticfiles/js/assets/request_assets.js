"use strict";

//Използва се за глобален CRF тоукън
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrfToken);
        }
    }
});


// Class definition - Тук са функциите които отговарят за саото пускане на заявка в модалния прозорец.
var CreateRequest = function () {
    // Elements
    var modal;
    var modalEl;
    var stepper;
    var form;
    var formSubmitButton;
    var formContinueButton;
    var stepperObj;
    var validations = [];


    // Private Functions
    var initStepper = function () {
        // Initialize Stepper
        stepperObj = new KTStepper(stepper);


        // Stepper change event
        stepperObj.on('kt.stepper.changed', function (stepper) {
            if (stepperObj.getCurrentStepIndex() === 4) {
                formSubmitButton.classList.remove('d-none');
                formSubmitButton.classList.add('d-inline-block');
                formContinueButton.classList.add('d-none');
            } else if (stepperObj.getCurrentStepIndex() === 5) {
                formSubmitButton.classList.add('d-none');
                formContinueButton.classList.add('d-none');
                document.querySelector('[data-kt-stepper-action="previous"]').style.display = 'none';
                document.getElementById('closeButtonContainer').style.display = 'block';


            } else if (stepperObj.getCurrentStepIndex() === 1) {
                formSubmitButton.classList.add('d-none');
                formContinueButton.classList.remove('d-none');
                document.querySelector('[data-kt-stepper-action="previous"]').style.display = 'none';
                document.getElementById('closeButtonContainer').style.display = 'none';


            } else if (stepperObj.getCurrentStepIndex() === 2) {
                formSubmitButton.classList.add('d-none');
                formContinueButton.classList.remove('d-none');
                document.querySelector('[data-kt-stepper-action="previous"]').style.display = 'block';
                document.getElementById('closeButtonContainer').style.display = 'none';


            } else if (stepperObj.getCurrentStepIndex() === 3) {
                formSubmitButton.classList.add('d-none');
                formContinueButton.classList.remove('d-none');
                document.querySelector('[data-kt-stepper-action="previous"]').style.display = 'block';
                document.getElementById('closeButtonContainer').style.display = 'none';


            } else {
                formSubmitButton.classList.remove('d-inline-block');
                formSubmitButton.classList.remove('d-none');
                formContinueButton.classList.remove('d-none');

                document.getElementById('closeButtonContainer').style.display = 'none';

            }
        });

        // Validation before going to next page
        stepperObj.on('kt.stepper.next', function (stepper) {
            console.log('stepper.next');
            updateOutgoingAssetsValidation()
            updateIncomingAssetsValidation()

            // Validate form before change stepper step
            var validator = validations[stepper.getCurrentStepIndex() - 1]; // get validator for currnt step

            if (validator) {
                validator.validate().then(function (status) {
                    console.log('validated!');

                    if (status === 'Valid') {

                        stepper.goNext();

                        KTUtil.scrollTop();
                    } else {
                        Swal.fire({
                            text: "Има непопълнени задължителни полета.Моля огледайте внимателно формата.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Добре!",
                            customClass: {
                                confirmButton: "btn btn-light"
                            }
                        }).then(function () {
                            KTUtil.scrollTop();
                        });
                    }
                });
            } else {
                stepper.goNext();

                KTUtil.scrollTop();
            }
        });

        // Prev event
        stepperObj.on('kt.stepper.previous', function (stepper) {


            stepper.goPrevious();
            KTUtil.scrollTop();
        });
    }

    var handleForm = function () {
        formSubmitButton.addEventListener('click', function (e) {
            e.preventDefault();
            // Проверете валидността на всички стъпки
            Promise.all(validations.map(validation => validation.validate())).then(function (validationResults) {
                if (validationResults.every(result => result === 'Valid')) {
                    // Активиране на индикатора за зареждане и деактивиране на бутона
                    formSubmitButton.setAttribute('data-kt-indicator', 'on');
                    formSubmitButton.disabled = true;

                    // Събиране на данните от формата
                    var formData = {
                        movementType: null,
                        actions: [],
                        objectInfo: {
                            objectNumber: document.querySelector(".row.mb-7 .col-lg-8 span").textContent,
                            objectName: document.querySelectorAll(".row.mb-7 .col-lg-8 span")[1].textContent,
                            city: document.querySelectorAll(".row.mb-7 .col-lg-8 span")[2].textContent,
                            address: document.querySelectorAll(".row.mb-7 .col-lg-8 span")[3].textContent,
                            phone: document.querySelectorAll(".row.mb-7 .col-lg-8 span")[4].textContent
                        },
                        movementTypes: []
                    };

                    var selectedMovementType = document.querySelector('input[name="transport_direction"]:checked');
                    if (selectedMovementType) {
                        formData.movementType = selectedMovementType.value;
                    }

                    // Добавяне на избраната транспортна фирма към formData
                    formData.transportCompanyId = document.getElementById('floatingSelect').value;

                    document.querySelectorAll('input[name="answer_question"]:checked').forEach(function (checkbox) {
                        formData.actions.push(checkbox.value);
                    });

                    $('#kt_docs_advanced .form-group.row').each(function () {
                        var movementType = $(this).find('input[type="radio"]:checked').val();
                        var tagifyFieldId = $(this).find('[data-kt-repeater="tagify"]').attr('id');
                        var tags = tagifyData[tagifyFieldId] || []; // Използване на данните от tagifyData
                        formData.movementTypes.push({
                            movement: movementType,
                            tags: tags
                        });
                    });
                    // Добавяне на брой бурета и стелажи
                    var barrelCount = document.querySelector('[data-kt-dialer="true"][data-barrel="true"] input').value;
                    var rackCount = document.querySelector('[data-kt-dialer="true"][data-rack="true"] input').value;

                    // Добавяне на броя бурета и стелажи към formData
                    formData.barrelCount = barrelCount;
                    formData.rackCount = rackCount;



                    // Изкуствено забавяне преди изпращане на формата
                    setTimeout(function () {
                        // Изпратете данните
                        $.ajax({
                            url: '/assets/add-asset-request',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(formData),
                            success: function (response) {
                                console.log("Success:", response);
                                stepperObj.goNext();
                                // Изпращане на събитие за обновяване на графиките в user-home
                                window.dispatchEvent(new CustomEvent('updateCharts'));
                                // Изпращане на събитие за обновяване на datatable в user-home
                                window.dispatchEvent(new CustomEvent('refreshDataTable'));
                            },
                            error: function (xhr, status, error) {
                                // Обработка на грешка от сървъра
                                var errorMessage = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : "Възникна грешка при обработка на заявката.";
                                console.error("Error occurred:", errorMessage);

                                // Показване на съобщение за грешка на клиента
                                Swal.fire({
                                    text: errorMessage,
                                    icon: "error",
                                    buttonsStyling: false,
                                    confirmButtonText: "Опитай отново",
                                    customClass: {
                                        confirmButton: "btn btn-primary"
                                    }
                                });
                            },
                            complete: function () {
                                // Деактивиране на индикатора за зареждане и реактивиране на бутона
                                formSubmitButton.removeAttribute('data-kt-indicator');
                                formSubmitButton.disabled = false;
                            }
                        });
                    }, 2000); // Забавяне с 2000 милисекунди (2 секунди)

                } else {
                    // Поне една стъпка не е валидна
                    Swal.fire({
                        text: "Има невъведени задължителни полета.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Добре!",
                        customClass: {
                            confirmButton: "btn btn-light"
                        }
                    }).then(function () {
                        KTUtil.scrollTop();
                    });
                }
            });
        });
    };


    var initValidation = function () {
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/

        // Step 1
        validations.push(FormValidation.formValidation(
            form,
            {
                fields: {
                    'transport_direction': {
                        validators: {
                            notEmpty: {
                                message: 'Моля изберете тип движение'
                            }
                        }
                    },
                    'transport_company': { // Предполагам, че 'transport_company' е името на полето за транспортната фирма
                validators: {
                    notEmpty: {
                        message: 'Моля изберете транспортна фирма'
                    }
                }
            }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',
                        eleValidClass: ''
                    })
                }
            }
        ));

        // Step 2
        validations.push(FormValidation.formValidation(
            form,
            {
                fields: {

                    '': {
                        validators: {
                            notEmpty: {
                                message: 'Account plan is required'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    // Bootstrap Framework Integration
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',
                        eleValidClass: ''
                    })
                }
            }
        ));

        // Step 3
        validations.push(FormValidation.formValidation(
            form,
            {
                fields: {
                    'outlet_code': {
                        validators: {
                            notEmpty: {
                                message: 'Моля въведете номер на обект'
                            }
                        }
                    },

                    'object_number': {
                        validators: {
                            notEmpty: {
                                message: 'Моля въведете валиден номер в полето'
                            },
                            callback: {
                                message: 'Не сте въвели съществуващ номер на обект',
                                callback: function (input) {
                                    var objectNumber = document.querySelector(".object-code-display").textContent;
                                    return objectNumber !== '-';
                                }
                            }
                        }
                    },
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    // Bootstrap Framework Integration
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',
                        eleValidClass: ''
                    })
                }
            }
        ));

        // Step 4
        validations.push(FormValidation.formValidation(
            form,
            {





                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    // Bootstrap Framework Integration
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.row',
                        eleInvalidClass: '',
                        eleValidClass: ''
                    })
                }
            }
        ));
    }

    function tagTemplate(tagData) {
        // Форматиране на тага
        return `<tag title="${tagData.BC} ${tagData.SN} ${tagData.Type}"
                contenteditable='false'
                spellcheck='false'
                tabIndex="-1"
                class="${this.settings.classNames.tag} ${tagData.class ? tagData.class : ""}"
                ${this.getAttributes(tagData)}>
                <x title='' class='tagify__tag__removeBtn' role='button' aria-label='remove tag'></x>
                <div>
                    <span class='tagify__tag-text'>${tagData.BC} - ${tagData.Type}</span>
                </div>
            </tag>`;
    }

    function suggestionItemTemplate(tagData) {
        // Форматиране на предложенията за търсене
        return `<div ${this.getAttributes(tagData)}
                class='tagify__dropdown__item d-flex align-items-center'
                tabindex="0"
                role="option">
                <div class="d-flex flex-column">
                    <strong>${tagData.BC}</strong>
                    <span>Type: ${tagData.Type}, SN: ${tagData.SN}</span>
                </div>
            </div>`;
    }


    var tagifyData = {}; // Глобална променлива за съхранение на таговете

    function handleTagChange(e) {
        var tagifyInstance = e.detail.tagify;
        var tags = tagifyInstance.value.map(tag => tag.value);
        console.log("Tagify Change: ", tags);
        tagifyData[tagifyInstance.DOM.originalInput.id] = tags; // Запазване на таговете в tagifyData
    }


    // Функция за инициализация на Tagify
    var initTagify = function () {
        // Инициализация на Tagify за всеки елемент
        document.querySelectorAll('[data-kt-repeater="tagify"]').forEach(function (tagifyInput) {
            var tagify = new Tagify(tagifyInput, {
                tagTextProp: 'BC',
                placeholder: "Моля въвведете BC/SN",
                enforceWhitelist: true,
                dropdown: {
                    enabled: 1, // ще започне да търси след първия въведен символ
                    searchKeys: ['BC', 'SN'],
                    maxItems: 5, // Максимален брой елементи показани в dropdown
                    closeOnSelect: false // Дали dropdown да се затваря при избор на елемент
                },
                templates: {
                    tag: tagTemplate,
                    dropdownItem: suggestionItemTemplate
                },
                whitelist: [],

            });
            // Динамично зареждане на данни при въвеждане на текст
            tagify.on('input', function (e) {
                var value = e.detail.value;
                tagify.settings.whitelist.length = 0; // ресетиране на текущия whitelist

                // AJAX заявка към сървъра с търсената стойност
                fetch(`/assets/get-adverts?search=${value}`)
                    .then(response => response.json())
                    .then(data => {
                        // подготовка на данните за whitelist
                        tagify.settings.whitelist = data.map(item => ({
                            value: `${item.A_Serial}|${item.A_Barcode}|${item.A_Name}`,
                            BC: item.A_Barcode,
                            SN: item.A_Serial,
                            Type: item.A_Name
                        }));
                        // извикване на метода, за да се покажат резултатите
                        tagify.dropdown.show.call(tagify, value);
                    });
            });

            tagify.on('change', handleTagChange);
        });
    };


    // Функция за ресетиране на формата и компонентите
    function resetFormAndComponents() {
        // Ресетиране на самата форма
        form.reset();


         // Скриване на секцията за изходящи активи и допълнителните опции
        $('#outgoing_movement').hide();
        $('.additional-options').hide();

    // Ресетиране на останалите компоне
        // Изчистване на чекбоксовете

        $('#kt_docs_repeater_advanced [data-repeater-item]:not(:first)').remove();
        $('#select2-data-kt_docs_repeater_advanced').val(null).trigger('change');

        // Премахване на чекмарка и клас 'active' от всички радиобутони
        $('input[type="radio"][name="transport_direction"]').prop('checked', false).closest('.btn').removeClass('active');

        // Задаване на радиобутона със стойност '1' като чекнат и добавяне на клас 'active' към съответния бутон
        $('input[type="radio"][name="transport_direction"][value="1"]').prop('checked', true).closest('.btn').addClass('active');



        $('#kt_assets_table').DataTable().ajax.reload();

        // Ресетиране на stepper до първата стъпка
        stepperObj.goFirst();


        // Ресетиране на информационните полета за обекта
        document.querySelector('.object-code-display').textContent = '-'; // Номер на обекта
        document.querySelector('.object-name-display').textContent = '-'; // Наименование на обекта
        document.querySelector('.object-city-display').textContent = '-'; // Град
        document.querySelector('.object-address-display').textContent = '-'; // Адрес
        document.querySelector('.object-telephone-display').textContent = ''; // Телефон


        // Изчистване на глобалната променлива tagifyData
        tagifyData = {};


        // Псевдокод за ресетиране на stepper

        stepperObj.goFirst();

    }


// Обработчик за промяна на чекбокса
    var handleCheckboxChange = function () {

        // // Задаване на началното състояние на чекбоксовете като непроверени
        // $('input[type="checkbox"][name="answer_question"]').prop('checked', false);
        // $('select[name="transport_company"] option[value="2"]').hide();

        // Начално състояние на свързаните UI елементи
        $('#outgoing_movement').hide();
        $('.additional-options').hide();
        $('#incomming_movement').show();


        $('input[type="checkbox"][name="answer_question"]').change(function () {
            // Логика за "Ще извеждам съоръжение"
            var isEquipmentExitChecked = $('input[type="checkbox"][name="answer_question"][value="Ще извеждам съоръжение"]').is(':checked');
            if (isEquipmentExitChecked) {
                $('#outgoing_movement').show(); // Показване на секцията за изходящи активи
            } else {
                $('#outgoing_movement').hide(); // Скриване на секцията за изходящи активи
            }
        });


        $('input[type="radio"][name="transport_direction"]').change(function() {
            // Взимане на стойността на избрания радио бутон
            let selectedValue = $('input[type="radio"][name="transport_direction"]:checked').val();

            if (selectedValue === '2') {
                // Стойност '2' е избрана - показване и/или скриване на секции
                $('#incomming_movement').hide();
                $('#outgoing_movement').show();
            } else {
                // Друга стойност е избрана - показване и/или скриване на секции
                $('#incomming_movement').show();
                $('#outgoing_movement').hide();
                // Обновяване на валидацията за секцията, ако е необходимо

            }
        });


    // Инициализиране на състоянието на UI при първоначално зареждане
        $('input[type="radio"][name="transport_direction"]:checked').trigger('change');

            // Логика за "буре" и "стелаж"
            var isBarrelRackChecked = $('input[type="checkbox"][name="answer_question"][value="Ще нося стелаж/буре"]').is(':checked');
            if (isBarrelRackChecked) {
                $('.additional-options').show();
            } else {
                $('.additional-options').hide();
            }


    }

    // Функция за обновяване на валидацията
    function updateOutgoingAssetsValidation() {
        var isEquipmentExitChecked = $('input[type="checkbox"][name="answer_question"][value="Ще извеждам съоръжение"]').is(':checked');
        var isOutgoingMovementVisible = $('#outgoing_movement').is(':visible'); // Проверка дали елементът е видим

        if (isEquipmentExitChecked && isOutgoingMovementVisible) {
            // Ако полето вече не е добавено, добавете го
            if (!validations[3].fields.outgoing_assets) {
                validations[3].addField('outgoing_assets', {
                    validators: {
                        notEmpty: {
                            message: 'Моля въведете поне едно изходящо съоръжение'
                        }
                    }
                });
            }

                // Ако полето за входящи активи вече не е добавено, добавете го
                if (!validations[3].fields.incomming_assets) {
                    validations[3].addField('incomming_assets', {
                        validators: {
                            notEmpty: {
                                message: 'Моля въведете поне едно входящо съоръжение'
                            }
                        }
                    });
                }
        } else {
            // Проверете дали полето вече е добавено, преди да го премахнете
            if (validations[3].fields.outgoing_assets) {
                validations[3].removeField('outgoing_assets');
            }
        }
    }

    function updateIncomingAssetsValidation() {
        // Проверка дали радио бутонът за посоката на транспорта е избран със стойност "3"
        let isTransportDirectionOutletToOutlet = $('input[type="radio"][name="transport_direction"]:checked').val() === '2';

        // Проверка дали елементът #incomming_movement е видим
        let isIncommingMovementVisible = $('#incomming_movement').is(':visible');

        // Условие за добавяне или премахване на валидация
        if (isTransportDirectionOutletToOutlet && isIncommingMovementVisible) {
            // Премахване на валидация на входящи активи
            if (validations[3].fields.incomming_assets) {
                validations[3].removeField('incomming_assets');


            } else {
                // Добавяне на валидация за входящи активи
                if (!validations[3].fields.incomming_assets) {
                    validations[3].addField('incomming_assets', {
                        validators: {
                            notEmpty: {
                                message: 'Моля въведете поне едно входящо съоръжение'
                            }
                        }
                    });
                }

            }
        }
    }



    function loadTransportCompanies() {
        $.ajax({
            url: '/assets/get-transport-companies',
            type: 'GET',
            success: function (companies_data) {
                var select = $('#floatingSelect');
                select.empty();
                select.append($('<option>', {
                    value: '',
                    text: '-- Изберете транспортна компания --'

                }));

                companies_data.forEach(function (company) {
                    select.append($('<option>', {
                        value: company.id,
                        text: company.name
                    }));
                });

            },
            error: function (error) {
                console.log('Error loading transport companies:', error);
            }
        });
    }


    return {
        // Public Functions
        init: function () {
            // Elements
            modalEl = document.querySelector('#kt_modal_add_asset_request');

            if (modalEl) {
                modal = new bootstrap.Modal(modalEl);
            }

            stepper = document.querySelector('#kt_create_request_stepper');

            if (!stepper) {
                return;
            }

            form = stepper.querySelector('#kt_create_request_form');
            formSubmitButton = stepper.querySelector('[data-kt-stepper-action="submit"]');
            formContinueButton = stepper.querySelector('[data-kt-stepper-action="next"]');

            initStepper();
            initValidation();
            handleForm();
            initTagify();
            handleCheckboxChange();
            loadTransportCompanies();


            modalEl.addEventListener('hide.bs.modal', resetFormAndComponents,handleCheckboxChange);
        }
    };
}();


// On document ready
KTUtil.onDOMContentLoaded(function () {
    CreateRequest.init();
});




