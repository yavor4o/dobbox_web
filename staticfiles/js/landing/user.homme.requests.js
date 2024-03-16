"use strict";


//Използва се за глобален CRF тоукън
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrfToken);
        }
    }
});

// Class definition
let KTAppTransportRequests = function () {
    // Shared letiables
    let table;
    let datatable;

    // Private functions
    let initDatatable = function () {
        // Set date data order
        const tableRows = table.querySelectorAll('tbody tr');

        tableRows.forEach(row => {
            const dateRow = row.querySelectorAll('td');
            const realDate = moment(dateRow[6].innerHTML, "MMM DD, YYYY").format();
            dateRow[6].setAttribute('data-order', realDate);
        });


        // Init datatable --- more info on datatables: https://datatables.net/manual/
        datatable = $(table).DataTable({

            responsive:false,
            "fixedColumns": {
            "leftColumns": 1 // Фиксира първата колона
        },
            "lengthMenu": [
                            [5,10, 25, 50, -1],
                            [5,10, 25, 50, "All"]
                        ],
            "serverSide": true, // Активиране на сървър-сайд обработка
            "processing": true, // Индикация за зареждане
             paging: true,



            "ajax": {
                "url": "/get-user-assets-requests", // Заменете това със URL на вашия сървърен ендпойнт
                    "type": "GET", // Метод за изпращане на заявката (може да бъде POST или GET)
                "data": function (d) {



                    d.start_date = $("#start_date_input").val(),
                    d.end_date =  $("#end_date_input").val()

                }


            },
            "columns": [
                {"data": null},
                {"data": "asset_type"},
                {"data": "serial_number"},
                {"data": "barcode"},
                {"data": "direction"},
                {"data": "asset_request_id"},
                {"data": "object_name"},
                {"data": "created_at"},
                {"data": "transport_id"},
                {"data": "transport_way"},
                {"data": "status"},
            ],

            "columnDefs": [



                {
        "targets": 0,
        "searchable": false,
        "render": function (data, type, row) {
            // Използвайте `row.asset_id` за да получите правилното ID на актива
            let assetId = row.asset_id; // Уверете се, че това е правилното име на полето, което съдържа ID на актива

            let isApproved = row.status === "потвърдена" || row.transport_id === "" ;
            let TransportRequested = row.transport_id !== "" || row.transport_id === "self transport";
            let cancelRequest = row.status === "потвърдена" || row.asset_request_status_id === 6;
            let cancelRequestButton = '';



            let approvedIconClass = isApproved ? "ki-duotone ki-check-square fs-2x text-secondary secondary-btn btn btn-link disabled" : "ki-duotone ki-check-square fs-2x text-success success-btn btn btn-link";
            let deleteIconClass = TransportRequested || cancelRequest ? "ki-duotone ki-trash-square fs-2x text-secondary secondary-btn btn btn-link disabled" : "ki-duotone ki-trash-square fs-2x text-danger delete-btn btn btn-link";

            return `
                <i class="${approvedIconClass}" data-asset-id="${assetId}"><span class="path1"></span><span class="path2"></span></i>
                <i class="${deleteIconClass}" data-asset-id="${assetId}"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></i>
            `;
        }

    },


                {
                            "targets": 7, // Индексът на колоната за датата
                            "render": function (data, type, full, meta) {
                                // Проверка дали има стойност в full.created_at и форматиране на датата
                                let createdDate = full.created_at ? new Date(full.created_at).toLocaleDateString() : ''; // Използване на български формат за дата
                                return '<span style="font-size: 8px;">' + createdDate + '</span>';
                            }

                },

                {
                            "targets": 4, // Индексът на колоната за статуса
                            "render": function (data, type, full, meta) {
                                // Тук можете да добавите различни класове в зависимост от стойността на статуса
                                let badgeClass = '';
                                switch (data) {
                                    case 'Входящо':
                                        badgeClass = 'badge badge-light-success';
                                        break;
                                    case 'Изходящо':
                                        badgeClass = 'badge badge-light-danger';
                                        break;

                                    default:
                                        badgeClass = 'badge-secondary';
                                }

                                // Връщане на форматирания HTML с бадж
                                return '<span class="badge ' + badgeClass + '">' + data + '</span>';
                            }
                        },
                {
                            "targets": 10, // Индексът на колоната за статуса
                            "render": function (data, type, full, meta) {
                                // Тук можете да добавите различни класове в зависимост от стойността на статуса
                                let badgeClass = '';
                                switch (data) {
                                    case 'потвърдена':
                                        badgeClass = 'badge badge-light-primary';
                                        break;
                                    case 'непотвърдена':
                                        badgeClass = 'badge badge-light-secondary';
                                        break;

                                    default:
                                        badgeClass = 'badge-secondary';
                                }

                                // Връщане на форматирания HTML с бадж
                                return '<span class="badge ' + badgeClass + '">' + data + '</span>';
                            }
                        },
                {
                            "targets": 8, // Индексът на колоната за статуса
                            "render": function (data, type, full, meta) {
                                // Тук можете да добавите различни класове в зависимост от стойността на статуса
                                let badgeClass = '';
                                switch (data) {
                                    case 'В изчакване':
                                        badgeClass = 'badge-light-warning';
                                        break;
                                }
                                // Връщане на форматирания HTML с бадж
                                return '<span class="badge ' + badgeClass + '">' + data + '</span>';
                            }
                        },
                {
                            "targets": 9, // Индексът на колоната за статуса
                            "render": function (data, type, full, meta) {
                                // Тук можете да добавите различни класове в зависимост от стойността на статуса
                                let badgeClass = '';
                                switch (data) {
                                    case 'self transport':
                                        badgeClass = 'badge badge-light-primary';
                                        break;


                                }

                                // Връщане на форматирания HTML с бадж
                                return '<span class="badge ' + badgeClass + '">' + data + '</span>';
                            }
                        },

            ],

            "info": true,
            'order': [],
            'pageLength': 5,
            'language': {
                'buttons': {
                    'copyTitle': 'Копиране в клипборда',
                    'copySuccess': {
                        _: 'Копирани %d реда в клипборда',
                        1: 'Копиран 1 ред в клипборда'
                    }
                },
                "sEmptyTable": "Няма налични данни в таблицата",
                "sInfo": "Показани от _START_ до _END_ от общо _TOTAL_ реда",
                "sInfoEmpty": "Показани от 0 до 0 от общо 0 реда",
                "sInfoFiltered": "(филтрирани от общо _MAX_ реда)",
                "sInfoPostFix": "",
                "sInfoThousands": ",",
                "sLengthMenu": "_MENU_",
                "sLoadingRecords": "Зареждане...",
                "sProcessing": "Обработка...",

                "sZeroRecords": "Няма намерени съвпадения",

                "oAria": {
                    "sSortAscending": ": активиране на сортиране в нарастващ ред",
                    "sSortDescending": ": активиране на сортиране в намаляващ ред"
                },
                "select": {
                    "rows": {
                        "_": "Избрани редове: %d",
                        "0": "Избрани редове: 0",
                        "1": "Избрани редове: 1"
                    }
                }
            },


        });



    }


    // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
    let handleSearchDatatable = () => {
        const filterSearch = document.querySelector('[data-kt-assets-movements-filter="search"]');
        filterSearch.addEventListener('keyup', function (e) {
            datatable.search(e.target.value).draw();
        });
    }

    // Функция за одобрение на заявката за транспорт
    function approveAsset() {
        $('#kt_assets_movements_table').on('click', '.success-btn', function () {
            let requestId = $(this).data('asset-id');

            Swal.fire({
                text: "Сигурни ли сте че искате да потвърдите позициониране?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Да, потвърди!",
                cancelButtonText: "Не, откажи",
                customClass: {
                    confirmButton: "btn fw-bold btn-success",
                    cancelButton: "btn fw-bold btn-active-light-primary"
                }
            }).then(function (result) {
                if (result.value) {
                    $.ajax({
                        url: `/update-asset-status/${requestId}`,

                        type: 'POST',
                        success: function (response) {

                            datatable.ajax.reload(null, false);
                        },
                        error: function (error) {
                            console.error('Error approving request: ', error);

                        }

                    });
                }
            });
        });
    }

    // Функция за обработка на изтриване на актив
    function deleteAsset()  {
        $('#kt_assets_movements_table').on('click', '.delete-btn', function () {
            let requestId = $(this).data('asset-id');

            // Използване на SweetAlert2 за потвърждение на действието
            Swal.fire({
                text: "Сигурни ли сте че искате да изтриете актива?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Да, изтрий!",
                cancelButtonText: "Не, назад",
                customClass: {
                    confirmButton: "btn fw-bold btn-danger",
                    cancelButton: "btn fw-bold btn-active-light-primary"
                }
            }).then(function (result) {
                if (result.value) {
                    // Ако потвърди изтриването, изпратете AJAX заявка
                    $.ajax({
                        url: '/assets/delete_asset/' + requestId,
                        type: 'DELETE',
                        success: function (response) {
                            // Успешно изтриване
                            Swal.fire({
                                text: "Актива е успешно изтрит.",
                                icon: "success",
                                buttonsStyling: false,
                                confirmButtonText: "Затвори!",
                                customClass: {
                                    confirmButton: "btn fw-bold btn-primary",
                                }
                            });

                            // Презареждане на таблицата
                            datatable.ajax.reload(null, false);
                        },
                        error: function (error) {
                            console.error('Грешка при истриване на актива: ', error);
                            Swal.fire({
                                text: "An error occurred.",
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Затвори!",
                                customClass: {
                                    confirmButton: "btn fw-bold btn-primary",
                                }
                            });
                        }
                    });
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "Актива не е изтрит.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Затвори!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    });
                }
            });
        });
    }
    window.addEventListener('refreshDataTable', function() {
    if (datatable) {
        datatable.ajax.reload(null, false); // false означава, че страницата няма да бъде ресетната към начална
    }
    });


    // Public methods
    return {
        init: function () {
            table = document.querySelector('#kt_assets_movements_table');

            if (!table) {
                return;
            }

            initDatatable();
            handleSearchDatatable();
            approveAsset();
            deleteAsset();
            // Добавяне на event listener към бутона за рефреш
            document.querySelector('#refreshDataTable').addEventListener('click', function() {
            datatable.ajax.reload(null, false); // false означава, че страницата няма да бъде ресетната към начална
        })
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTAppTransportRequests.init();
});



