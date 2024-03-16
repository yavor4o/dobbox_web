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
var KTTablesTransport = function () {
    var parentTable;
    var childTable;


    // Function to load data into the child table
    var loadAssetRequests = function (transportRequestId) {
        $.ajax({
            url: '/assets/get-assets-requests/' + transportRequestId,
            method: 'GET',
            success: function (data) {
                childTable.clear().rows.add(data).draw();
            },
            error: function (error) {
                console.error("Error loading AssetRequests: ", error);
            }
        });
    };

    // Private methods
    const initParentDatatable = () => {
        // Init datatable --- more info on datatables: https://datatables.net/manual/
        parentTable = $('#kt_table_transport_table').DataTable({
            "lengthMenu": [
                            [6, 10, 25, 50, -1],
                            [6, 10, 25, 50, "All"]
                        ],
            "serverSide": true, // Активиране на сървър-сайд обработка
            "processing": true, // Индикация за зареждане
             paging: true,
            'pageLength': 6,
            "ajax": {
    "url": "/assets/get-assets-transport",
    "type": "GET",
    "data": function (d) {
        d.start_date = $("#start_date_input").val();
        d.end_date = $("#end_date_input").val();
        // Използване на стойността от 'transportCompanies' <select>
        // Извлечение на стойността чрез метода 'data' или jQuery селектор
        d.transport_company_id = $('#selectedTransportCompany').val();

    }

            },
            "columns": [
                {"data":  "id"},
                {"data": "company_name"},
                {"data": "timestamp"},
                {"data": "estimated_transport_cost"},
                {"data": "transport_price_per_km"},
                {"data": "price_for_assets"},
                {"data": "total_distance_km"},

            ],

            select: {
                    style: 'single'
                },
            "columnDefs": [
                {
                    "targets": 2, // Индексът на датата
                    "render": function (data, type, full, meta) {
                        var createdDate = full.timestamp ? new Date(full.timestamp).toLocaleString() : ''; // Проверка и форматиране на датата
                        return '<span style="font-size: 10px;">' + createdDate + '</span>';
                    }
                },
                {
                    "targets": 3,
                    "render": function (data, type, full, meta) {
                        if (type === 'display') {
                            var cost = parseFloat(data) || 0; // Преобразува данните в число, ако не са валидни, връща 0
                            return cost.toFixed(2) + ' лв.'; // Форматира числото до два десетични знака и добавя 'лв.'
                        }


                        return data; // За другите типове връща оригиналните данни
                    }
                },
                {
                    "targets": 4,
                    "render": function (data, type, full, meta) {
                        if (type === 'display') {
                            var cost = parseFloat(data) || 0; // Преобразува данните в число, ако не са валидни, връща 0
                            return cost.toFixed(2) + ' лв.'; // Форматира числото до два десетични знака и добавя 'лв.'
                        }


                        return data; // За другите типове връща оригиналните данни
                    }
                },
                {
                    "targets": 5,
                    "render": function (data, type, full, meta) {
                        if (type === 'display') {
                            var cost = parseFloat(data) || 0; // Преобразува данните в число, ако не са валидни, връща 0
                            return cost.toFixed(2) + ' лв.'; // Форматира числото до два десетични знака и добавя 'лв.'
                        }


                        return data; // За другите типове връща оригиналните данни
                    }
                },
                {
                    "targets": 6,
                    "render": function (data, type, full, meta) {
                        if (type === 'display') {
                            var cost = parseFloat(data) || 0; // Преобразува данните в число, ако не са валидни, връща 0
                            return cost.toFixed(1 ) ; // Форматира числото до два десетични знака
                        }

                        return data; // За другите типове връща оригиналните данни
                    }
                },


            ],

            'language': {
                'buttons': {
                    'copyTitle': 'Копиране в клипборда',
                    'copySuccess': {
                        _: 'Копирани %d реда в клипборда',
                        1: 'Копиран 1 ред в клипборда'
                    }
                },
                "sEmptyTable": "Няма налични данни в таблицата",
                "sInfo": "_START_ до _END_ от общо _TOTAL_ реда",
                "sInfoEmpty": "0 до 0 от общо 0 реда",
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

        parentTable.on('select', function (e, dt, type, indexes) {
            if (type === 'row') {
                var data = dt.row({ selected: true }).data();
                var transportRequestId = data.id;
                loadAssetRequests(transportRequestId);
            }
        }).on('deselect', function () {
            childTable.clear().draw();
        });


    }
    const initChildDatatable = () => {
        childTable = $('#kt_table_transport_requests_table').DataTable({
            // Initialize the child table without any data
            // Define the columns and other DataTable options for the child table
            "columns": [
                {"data": null},
                    {"data":  "number"},
                {"data":  "status"},
                {"data": "movement_type"},
                {"data": "object_name"},
                {"data": "object_city"},
                {"data": "created_at"},
                {"data": "user_name"},
            ],
            "order": [[6, "desc"]],

            "columnDefs": [
               { "orderable": false, "targets": [0,1, 2, 3, 4, 5,6,7] },
                {
                    "targets": 6, // Индексът на датата
                    "render": function (data, type, full, meta) {
                        var createdDate = full.created_at ? new Date(full.created_at).toLocaleString() : ''; // Проверка и форматиране на датата
                        return '<span style="font-size: 9px;">' + createdDate + '</span>';
                    }
                },
                {
                    "targets": 0,

                    "className": 'details-control', // Добавяне на клас за стилизиране
                    "render": function () {
                        // Връщане на HTML за иконата/бутона за разширяване
                        return '<i class="ki-duotone ki-eye fs-2x text-warning warning-btn btn btn-link"><span class="path1"></span> <span class="path2"></span> <span class="path3"></span></i>';

                    }
                },
            ],
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
            paging: false,
            info: false,
        });
    };

    // Handle status filter
    const handleStatusFilter = () => {
        const select = document.querySelector('[data-kt-table-transport="filter_status"]');

        $(select).on('select2:select', function (e) {
            const value = $(this).val();
            if (value === 'Show All') {
                datatable.search('').draw();
            } else {
                datatable.search(value).draw();
            }
        });
    }

    var handleSearchDatatable = () => {
        const filterSearch = document.querySelector('[data-kt-transport-filter="search"]');
        filterSearch.addEventListener('keyup', function (e) {
            parentTable.search(e.target.value).draw();
        });
    }


$('#kt_table_transport_requests_table tbody').on('click', '.details-control', function () {
    var data = childTable.row($(this).closest('tr')).data();
    var transportId = data ? data.number : null; // Използвайте 'number' за да вземете ID-то

});


    var initDaterangepicker = () => {
    var input = $("#kt_ecommerce_report_sales_daterangepicker");

    function cb(start, end) {
    var displayFormat = 'DD-MM-YYYY';
    if (start.isValid() && end.isValid()) {
        var formattedStart = start.format(displayFormat);
        var formattedEnd = end.format(displayFormat);
        input.val(formattedStart + ' - ' + formattedEnd);

        var startInUTC = start.utc().format('YYYY-MM-DD');
        var endInUTC = end.utc().format('YYYY-MM-DD');

        $('#start_date_input').val(startInUTC);
        $('#end_date_input').val(endInUTC);

        parentTable.ajax.reload();
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
        parentTable.ajax.reload(); // Релоад, ако потребителят изчисти датите
    });
};

var exportButtons = () => {
        const documentTitle = 'Справка за заявен транспорт';
        var buttons = new $.fn.DataTable.Buttons(parentTable, {
            buttons: [
                {
                    extend: 'copyHtml5',
                    title: documentTitle
                },

                
                 {
                extend: 'excelHtml5',
                title: documentTitle,
                exportOptions: {
                    format: {
                        body: function (data, row, column, node) {
                            // Извличаме само текста от HTML елемента, за да премахнем span тага
                            return column === 2 ? node.textContent.trim() : // за колона с датата
                                (column === 3 || column === 4 || column === 5) ?
                                parseFloat(data.replace(/\s*лв\.\s*/, '').replace(',', '.')) :
                                data;
                        }
                    }
                }
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

    function TransportCompanies() {
    $.ajax({
        url: '/assets/get-transport-companies',
        type: 'GET',
        success: function (companies_data) {
            var select = $('#transportCompanies');
            select.empty();
            select.append($('<option>', {
                value: '',
                text: 'Всички'
            }));

            companies_data.forEach(function (company) {
                select.append($('<option>', {
                    value: company.id,
                    text: company.name
                }));
            });
            console.log(companies_data);

            // Инициализация на Select2 (ако все още не е било направено)
            select.select2({
                dropdownCssClass: "w-200px", // Пример за добавяне на стил към dropdown
                allowClear: false
            });
        },
        error: function (error) {
            console.log('Error loading transport companies:', error);
        }
    });
}


$('#transportCompanies').on('change', function() {
    var selectedId = $(this).val(); // Вземете избраната стойност
                $('#selectedTransportCompany').val(selectedId); // Актуализирайте скритото поле
                parentTable.ajax.reload();
});



//Функция за извеждане на модала с информация за AКТИВИТЕ по заявките.

    var handleAssetsRequests = () => {
        $('#kt_table_transport_requests_table').on('click', '.details-control', function () {
            var data = childTable.row($(this).closest('tr')).data();
            var assetRequestId = data ? data.number : null; // Използвайте 'number' за да вземете ID-то


            $.ajax({
                url: '/assets/sub-asset-request',
                type: 'POST',
                data: { assetRequestId: assetRequestId },
                success: function (response) {
                    var assets = response.assets;
                    var timeline = $('.timeline');
                    timeline.empty();

                    // Генериране и добавяне на новото съдържание
                    assets.forEach(function (asset) {
                        var badgeClass = '';
                        switch (asset.asset_direction) {
                            case 'Изходящо':
                                badgeClass = 'badge-light-danger';
                                break;
                            case 'Входящо':
                                badgeClass = 'badge-light-success';
                                break;

                            default:
                                badgeClass = 'badge-secondary';
                        }
                        var assetHTML = ` <div class="d-flex flex-stack py-5 border-bottom border-gray-300 border-bottom-dashed">
									<!--begin::Details-->
									<div class="d-flex align-items-center">

										<!--begin::Details-->
										<div class="ms-6">
											<!--begin::Name-->
											<a  class="d-flex align-items-center fs-5 fw-bold text-dark text-hover-primary">Тип ${asset.asset_type}
											<span class="badge ${badgeClass} fs-8 fw-semibold ms-2">${asset.asset_direction}</span></a>
											<!--end::Name-->
											<!--begin::Email-->
											<div class="fw-semibold text-muted fs-8 mt-3">SN: ${asset.serial_number}  <br>  BC: ${asset.barcode}</div>
											<!--end::Email-->
										</div>
										<!--end::Details-->
									</div>
									<!--end::Details-->
									<!--begin::Stats-->
									<div class="d-flex">
										<!--begin::Sales-->
										<div class="text-end">
											<div class="fs-7 fw-bold text-dark">Статус:</div>
											<span class="${asset.asset_status === 'Потвърдена' ? 'badge-light-primary' : 'badge-light-danger'} fs-9 ">${asset.asset_status}</span>
										</div>
										<!--end::Sales-->
									</div>
									<!--end::Stats-->
								</div>
            `;
            timeline.append(assetHTML);
                    });

                    // Показване на модала
                    $('#kt_modal_view_assets').modal('show');
                },
                error: function (error) {
                    console.error('Error fetching request history:', error);
                }
            });
        });
    }


    // Public methods
    return {
        init: function () {

            initParentDatatable();
            initChildDatatable();
            handleStatusFilter();
            handleSearchDatatable();
            handleAssetsRequests();
            initDaterangepicker();
            TransportCompanies();
            exportButtons();
        }
    }
}();

// Webpack support
if (typeof module !== 'undefined') {
    module.exports = KTTablesTransport;
}

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTTablesTransport.init();
});
