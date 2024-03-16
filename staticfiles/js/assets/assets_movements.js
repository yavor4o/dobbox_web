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
            "lengthMenu": [
                            [10, 25, 50, -1],
                            [10, 25, 50, "All"]
                        ],
            "serverSide": true, // Активиране на сървър-сайд обработка
            "processing": true, // Индикация за зареждане
             paging: true,


            "ajax": {
                "url": "/assets/get-assets-movements",
                    "type": "GET",
                "data": function (d) {

                    d.start_date = $("#start_date_input").val(),
                    d.end_date =  $("#end_date_input").val()

                }


            },
            "columns": [
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
                    "targets": 6, // Индексът на датата
                    "render": function (data, type, full, meta) {
                        let createdDate = full.created_at ? new Date(full.created_at).toLocaleString() : ''; // Проверка и форматиране на датата
                        return '<span style="font-size: 10px;">' + createdDate + '</span>';
                    }
                },
                {
                            "targets": 3, // Индексът на колоната за статуса
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
                            "targets": 9, // Индексът на колоната за статуса
                            "render": function (data, type, full, meta) {
                                // Тук можете да добавите различни класове в зависимост от стойността на статуса
                                let badgeClass = '';
                                switch (data) {
                                    case 'Потвърдена':
                                        badgeClass = 'badge badge-light-primary';
                                        break;
                                    case 'Непотвърдена':
                                        badgeClass = 'badge badge-light-secondary';
                                        break;
                                    case 'Анулирана':
                                        badgeClass = 'badge badge-light-danger';
                                        break;


                                }

                                // Връщане на форматирания HTML с бадж
                                return '<span class="badge ' + badgeClass + '">' + data + '</span>';
                            }
                        },
                {
                            "targets": 7, // Индексът на колоната за статуса
                            "render": function (data, type, full, meta) {
                                // Тук можете да добавите различни класове в зависимост от стойността на статуса
                                let badgeClass = '';
                                switch (data) {
                                    case 'няма транспорт ID':
                                        badgeClass = 'badge badge-light-secondary';
                                        break;
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
            'pageLength': 10,
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

    // Init daterangepicker
let initDaterangepicker = () => {
    let input = $("#kt_ecommerce_report_sales_daterangepicker");

    function cb(start, end) {
    let displayFormat = 'DD-MM-YYYY';
    if (start.isValid() && end.isValid()) {
        let formattedStart = start.format(displayFormat);
        let formattedEnd = end.format(displayFormat);
        input.val(formattedStart + ' - ' + formattedEnd);

        let startInUTC = start.utc().format('YYYY-MM-DD');
        let endInUTC = end.utc().format('YYYY-MM-DD');

        $('#start_date_input').val(startInUTC);
        $('#end_date_input').val(endInUTC);

        datatable.ajax.reload();
    } else {
        input.val('Изберете период');
        $('#start_date_input').val('');
        $('#end_date_input').val('');
    }
}


    input.daterangepicker({
        alwaysShowCalendars: true,
        autoUpdateInput: false,
        ranges: {
            "Днес": [moment(), moment()],
            "Вчера": [moment().subtract(1, "days"), moment().subtract(1, "days")],
            "За 7 дни": [moment().subtract(6, "days"), moment()],
            "За 30 дни": [moment().subtract(29, "days"), moment()],
            "Този Месец": [moment().startOf("month"), moment().endOf("month")],
            "Миналия Месец": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")]
        },
        locale: {
            format: 'DD/MM/YYYY',
            customRangeLabel: "Период",
            firstDay: 1,
            applyLabel: 'Приложи',
            cancelLabel: 'Изчисти',
            daysOfWeek: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            monthNames: ['Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември']
        }
    }, cb);

    input.on('apply.daterangepicker', function(ev, picker) {
        cb(picker.startDate, picker.endDate);
    });

    input.on('cancel.daterangepicker', function() {
        input.val(''); // Изчистване на input полето
        $('#start_date_input').val('');
        $('#end_date_input').val('');
        datatable.ajax.reload(); // Релоад, ако потребителят изчисти датите
    });
};

// При готовност на документа, извикайте функцията за инициализация
$(document).ready(function () {
    initDaterangepicker();
});


    // Hook export buttons
    let exportButtons = () => {
        const documentTitle = 'Движение на съоръжения';
        let buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                {
                    extend: 'copyHtml5',
                    title: documentTitle
                },
                {
                    extend: 'excelHtml5',
                    title: documentTitle,
                    exportOptions: {
                        modifier: {
                            page: 'all',
                            search: 'none'
                        }
                    },
                },
                {
                    extend: 'csvHtml5',
                    title: documentTitle
                },
                {
                    extend: 'pdfHtml5',
                    title: documentTitle
                }
            ],

        }).container().appendTo($('#kt_ecommerce_report_sales_export'));

        // Hook dropdown menu click event to datatable export buttons
        const exportButtons = document.querySelectorAll('#kt_ecommerce_report_sales_export_menu [data-kt-ecommerce-export]');
        exportButtons.forEach(exportButton => {
            exportButton.addEventListener('click', e => {
                e.preventDefault();

                // Get clicked export value
                const exportValue = e.target.getAttribute('data-kt-ecommerce-export');
                const target = document.querySelector('.dt-buttons .buttons-' + exportValue);

                // Trigger click event on hidden datatable export buttons
                target.click();
            });
        });
    }


    // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
    let handleSearchDatatable = () => {
        const filterSearch = document.querySelector('[data-kt-assets-movements-filter="search"]');
        filterSearch.addEventListener('keyup', function (e) {
            datatable.search(e.target.value).draw();
        });
    }

    // Public methods
    return {
        init: function () {
            table = document.querySelector('#kt_assets_movements_table');

            if (!table) {
                return;
            }

            initDatatable();
            initDaterangepicker();
            exportButtons();
            handleSearchDatatable();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTAppTransportRequests.init();
});


