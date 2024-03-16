    "use strict";
    
    // Функция за асинхронно зареждане на Google Maps API
    window.onGoogleMapsApiLoaded = function() {
        // Сигнализира, че Google Maps API е зареден.
    };
    
    
    //Използва се за глобален CRF тоукън
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrfToken);
            }
        }
    });
    
    //Използва се за асинхронно зареждане на Google Maps JavaScript API
    function loadGoogleMapsApi() {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?key=' + window.googleMapsApiKey + '&loading=async&callback&callback=onGoogleMapsApiLoaded';
        document.body.appendChild(script);
    }
    
    //Генерира карта маршрут за транспортната фирма по обекти във вид на маршрут.
    function initMap(start_coordinates, coordinates, mapContainerId) {
    var startLat = parseFloat(start_coordinates[0]);
    var startLng = parseFloat(start_coordinates[1]);
    console.log(start_coordinates);

    // Инициализация на картата
    var map = new google.maps.Map(document.getElementById(mapContainerId), {
        zoom: 12,
        center: {lat: startLat, lng: startLng}
    });

    // Добавяне на маркер за началната точка
    new google.maps.Marker({ position: {lat: startLat, lng: startLng}, map: map });

    if (!coordinates || coordinates.length === 0) {
        console.error('Няма предоставени допълнителни координати за картата');
        return;
    }

    // Подготовка на waypoints от предоставените координати
    var waypoints = coordinates.map(function(coord) {
        return {
            location: coord,
            stopover: true
        };
    });

    // Създаване и конфигуриране на DirectionsService и DirectionsRenderer
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    var request = {
        origin: start_coordinates,
        destination: start_coordinates,
        waypoints: waypoints, // Добавяне на waypoints
        optimizeWaypoints: true, // Оптимизация на реда на waypoints, ако е необходимо
        travelMode: 'DRIVING'
    };

    directionsService.route(request, function(result, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(result);
        } else {
            console.error('Неуспешно изчисляване на маршрута: ' + status);
        }
    });
}

    
    // Class definition
    var TransportRequest = function () {
        // Define shared variables
        var datatable;
        var table;
        // Това е функцията за подтаблицата с активите към основната таблица със заявките
        var formatSubTable = function (rowData) {
            var subTableId = 'child_data_ajax_' + rowData.id;
            var div = $('<div/>').attr('id', subTableId);
    
            // Изпращане на AJAX заявка към сървъра
            $.ajax({
                url: '/assets/sub-asset-request',
                type: 'POST',
                data: {assetRequestId: rowData.id},
                success: function (response) {
                    var assets = response.assets;
                    var status = response.status;
    
                    // Инициализирайте DataTable
                    var subTable = $('<table ></table>').attr('id', subTableId).addClass('table align-middle table-row-dashed fs-9 text-dark gy-5').appendTo(div);
    
                    // Инициализирайте DataTable с настройки за сортиране
                    subTable.DataTable({
                        info: false,
                        lengthChange: false,
                        paging: false,
                        data: assets,
                        columns: [
                            {
                                title: '   ',
                                render: function (data, type, row) {
                                    return ' ';
                                }
                            },
                            {data: "id", title: "ID"},
                            {data: "serial_number", title: "Сериен номер"},
                            {data: "barcode", title: "Баркод"},
                            {data: "asset_type", title: "Тип на актива"},
                            {data: "asset_direction", title: "Посока на актива"},
                            {
                                title: "Действия",
                                render: function (data, type, row) {
                                    var isApproved = status === "Заявен транспорт" || status === "Анулирана" || status === "Изпълнена";
                                    var checkIconClass = isApproved ? "ki-duotone ki-trash-square fs-2x text-secondary secondary-btn btn btn-link disabled" : "ki-duotone ki-trash-square fs-2x text-danger delete-btn btn btn-link";
    
                                    return `
                                               
                                       <i class="${checkIconClass}" data-asset-id="${row.id}"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span> `
                                },
    
    
                            }
    
                        ],
    
                        "order": [[5, "asc"]],
                        columnDefs: [
                            // {targets: [0, 1, 2, 3, 5], orderable: false}, // Изключва сортирането за колона с индекс 4 (посока на актива)
                            {
                                "targets": 5, // Индексът на колоната за статуса
                                "render": function (data, type, full, meta) {
                                    // Тук можете да добавите различни класове в зависимост от стойността на статуса
                                    var badgeClass = '';
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
                            {targets: [0, 1, 2, 3, 4, 6], orderable: false}, // Изключва сортирането за колона с индекс 4 (посока на актива)
    
    
                        ],
    
    
                    });
                },
                error: function (error) {
                    console.error('Грешка при извличане на данни за активите:', error);
                    subTable.closest('tr').addClass('table-dark text-white')
                },
    
            });
            return div;
        };
    
            // Помощна функцис за извличане на статусите на самата заявка Одобрена , В изчакване ...
            $(document).ready(function () {
                // Зареждане на статусите
                $.ajax({
                    url: '/assets/asset-statuses',
                    type: 'GET',
                    success: function (statuses) {
                        var filterSelect = $('#deliveryFilter');
                        $.each(statuses, function (index, status) {
                            filterSelect.append($('<option>', {
                                value: status,
                                text: status
                            }));
                        });
                    }
                });
            })
    
        // Функция за основната таблица със заявките
        var initTransportRequestData = function () {

                    // Определяне на текущия рут
            var currentPath = window.location.pathname;

            // Задаване на различен брой редове за показване в таблицата в зависимост от рута
            var pageLength;
            if (currentPath === "/assets/transport-request") {
                pageLength = 10; // Стандартен брой редове за /assets/transport-request
            } else if (currentPath === "/console/dashboard") {
                pageLength = 3; // Намален брой редове за /console/dashboard
            } else {
                pageLength = 10; // Стандартен брой редове за всички останали рутове
            }

            // Set date data order
            const tableRows = table.querySelectorAll('tbody tr');
    
            tableRows.forEach(row => {
                const dateRow = row.querySelectorAll('td');
                const realDate = moment(dateRow[8].innerHTML, "DD MMM YYYY, LT").format(); // select date from 5th column in table
                dateRow[8].setAttribute('data-order', realDate);
            });
    
            datatable = $(table).DataTable({
                buttons: [
                    {
                        extend: 'excel',
                        exportOptions: {
                            columns: [3, 4, 5, 6, 7]
                        }
                    }
                ],
                detail: {
                    title: 'Load sub table',
                    content: formatSubTable,
                },
                "lengthMenu": [
                            [3, 10, 25, 50,500],
                            [3, 10, 25, 50,500]
                        ],
                fixedColumns: {
            leftColumns: 3 // Фиксира първите три колони
        },
                "processing": true,
                "pageLength": pageLength,
                "serverSide": true,
                "ajax": {
                    "url": "/assets/asset-requests",
                        "data": function (d) {
                                    // Проверка на текущия рут и задаване на филтри
                                    if (window.location.pathname === '/console/dashboard') {
                                        d.filterStatusName = 'В изчакване,Одобрена'; // Задаване на начални филтри
                                    } else {
                                        // Запазване на съществуващата логика за филтриране
                                        const filterStatusValue = $('#deliveryFilter').val().trim();
                                        const filterDeliveryType = $('input[name="transport_type"]:checked').val();
                                        if (filterStatusValue) {
                                            d.filterStatusName = filterStatusValue;
                                        }
                                        if (filterDeliveryType && filterDeliveryType !== 'all') {
                                            d.filterDeliveryType = filterDeliveryType;
                                        }
                                    }
                                }
                },
    
    
                "columns": [
                    {"data": null},
                    {"data": null},
                    {"data": null},
                    {"data": "status_name"},
                    {"data": "movement_type_name"},
                    {"data": "object_name"},
                    {"data": "object_city"},
                    {"data": "created_at"},
                    {"data": "estimated_request_cost"},
    
    
                ],

                responsive: false,
                "order": [[7, "asc"]],
                "columnDefs": [
                    {
                        "targets": 0,
                        "orderable": false,
                        "className": 'details-control', // Добавяне на клас за стилизиране
                        "render": function () {
                            // Връщане на HTML за иконата/бутона за разширяване
                            return '<button type="button" class="btn btn-sm btn-icon btn-light btn-active-light-primary toggle h-25px w-25px"\n' +
                                '\t\t\t\t\tdata-kt-docs-datatable-subtable="expand_row">\n' +
                                '\t\t\t\t\t<span class="svg-icon fs-3 m-0 toggle-off">+</span>\n' +
                                '\t\t\t\t\t<span class="svg-icon fs-3 m-0 toggle-on">-</span>\n' +
                                '\t\t\t\t</button>';
                        }
                    },
                    {
                        "targets": 1, // Колона за чекбоксове
                        "searchable": false,
                        "width": 15,
                        "className": 'dt-body-center',
                        "render": function (data, type, full, meta) {
                            // Проверка на статуса и решение дали да показваме чекбокса
                            if (full.status_name === "Одобрена") {
                                return '<div class="form-check form-check-sm form-check-custom form-check-solid">' +
                                    '<input type="checkbox" class="form-check-input" value="' + $('<div/>').text(data).html() + '">' +
                                    '</div>';
                            } else {
                                return ''; // Връща празен стринг за редове, които не са със статус "Одобрена"
                            }
                        }
                    },
    
    
                    {
                        "targets": 2,
    
                        "searchable": false,
                        render: function (data, type, row) {
                            var isApproved = row.status_name === "Одобрена" || row.status_name === "ТранспортSR" || row.status_name === "Заявен транспорт" || row.status_name === "Анулирана" || row.status_name === "Изпълнена";
                            var TransportRequested = row.status_name === "Заявен транспорт";
                            var cancelRequest = row.status_name === "Анулирана" || row.status_name === "Изпълнена";
                            var cancelRequestButton = '';
    
                            if (TransportRequested) {
                                cancelRequestButton = '<i class="ki-duotone ki-cross-square fs-2x text-danger cancel-btn btn btn-link" data-asset-id="' + row.id + '"><span class="path1"></span><span class="path2"></span></i>';
                            }
    
                            var approvedIconClass = isApproved ? "ki-duotone ki-check-square fs-2x text-secondary secondary-btn btn btn-link disabled" : "ki-duotone ki-check-square fs-2x text-success success-btn btn btn-link";
                            var deleteIconClass = TransportRequested || cancelRequest ? "ki-duotone ki-trash-square fs-2x text-secondary secondary-btn btn btn-link disabled" : "ki-duotone ki-trash-square fs-2x text-danger request-delete-btn btn btn-link";
    
                            return `
                                <i class="${approvedIconClass}" data-asset-id="${row.id}"><span class="path1"></span><span class="path2"></span></i>
                                <i class="ki-duotone ki-eye fs-2x text-warning warning-btn btn btn-link" data-asset-id="${row.id}"><span class="path1"></span> <span class="path2"></span> <span class="path3"></span> </i>
                                <i class="ki-duotone ki-map fs-2x text-primary primary-btn btn btn-link" data-asset-id="${row.id}"> <span class="path1"></span> <span class="path2"></span> <span class="path3"></span> </i>
                                <i class="${deleteIconClass}" data-asset-id="${row.id}"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></i>
                                ${cancelRequestButton}
                            `;
                                            }
    
    
                    },
                    {
                        "targets": 7, // Индексът на комбинираната колона
                        "render": function (data, type, full, meta) {
                            var username = full.username ? full.username : ''; // Проверка за username
                            var createdDate = full.created_at ? new Date(full.created_at).toLocaleString() : ''; // Проверка и форматиране на датата
                            return '<span style="font-size: 10px;">' + createdDate + "<br>" + username + '</span>';
                        }
                    },
                    {
                        "targets": 8, // Индексът на комбинираната колона
                        "render": function (data, type, full, meta) {
                            if (type === 'display') {
                                var cost = parseFloat(data) || 0; // Преобразува данните в число, ако не са валидни, връща 0
                                return cost.toFixed(2) + ' лв.'; // Форматира числото до два десетични знака и добавя 'лв.'
                            }
    
    
                            return data; // За другите типове връща оригиналните данни
                        }
                    },
                    {
                        "targets": 3, // Индексът на колоната за статуса и транспорта
                        "render": function (data, type, full, meta) {
                            var badgeClass = '';
                            var transportBadgeClass = full.self_transport === 'Yes' ? 'badge badge-light-success' : ' badge badge-light-dark';
                            var transportInfo = full.self_transport === 'Yes' ? 'Транспорт Девин' : 'Транспортна фирма';
    
    
                            switch (full.status_name) {
                                case 'Одобрена':
                                    badgeClass = 'badge badge-light-success';
                                    break;
                                case 'В изчакване':
                                    badgeClass = 'badge badge-light-warning';
                                    break;
                                case 'ТранспортSR':
                                    badgeClass = 'badge badge-light-info';
                                    break;
                                case 'Заявен транспорт':
                                    badgeClass = 'badge badge-light-primary';
                                    break;
                                case 'Анулирана':
                                    badgeClass = 'badge badge-light-danger';
                                    break;
    
                                case 'Изпълнена':
                                    badgeClass = ' badge badge-light-dark';
                                    break;
                                // Добавете допълнителни случаи за различни статуси
                                default:
                                    badgeClass = 'badge badge-secondary';
                            }
    
                            return '<span class="' + badgeClass + '">' + full.status_name + '</span><br>' +
                                '<span class="' + transportBadgeClass + '" style="font-size: 9px;">' + transportInfo + '</span>';
                        }
                    },
    
    
                    {targets: [0, 1, 2, 3, 5, 6, 7], orderable: false} // Изключва сортирането за колона с индекс 4 (посока на актива)
                ],
                language: {
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
                }
    
    
            });
    
            // Инициализиране на tooltips
    
    
            datatable.on('draw', function () {
                initToggleToolbar(); // Re-initialize your toggle toolbar
                handleDeleteAsset();// Re-initialize your delete rows functionality
                handleDeleteRequest();
                toggleToolbars();    // Update the state of your toolbars based on checkboxes
                KTMenu.init(); // Reinitialize KTMenu instances
                approveAsset();
                cancelRequest()
                handleHistoryAsset();
    
    
            });
        };
    
    // Оригинален обработчик за бутона за разтягане на реда
        $('#kt_assets_table tbody').on('click', 'td.details-control button', function () {
            toggleRow($(this).closest('tr'));
        });
    
            // За рута /assets/transport-request
        $('#export-button').on('click', function () {
            datatable.button('.buttons-excel').trigger();
        });

        // За рута /console/dashboard
        $('#export-button-dashboard').on('click', function () {
            datatable.button('.buttons-excel').trigger();
        });

    // Функция за превключване на редовете
        function toggleRow(tr) {
            var row = datatable.row(tr);
    
            if (row.child.isShown()) {
                // Свиване на реда
                row.child.hide();
                tr.removeClass('shown');
                tr.removeClass('table-active');
                tr.find('.toggle-on').hide();
                tr.find('.toggle-off').show();
            } else {
                // Разтягане на реда
                var rowData = row.data();
                row.child(formatSubTable(rowData)).show();
                tr.addClass('shown');
                tr.addClass('table-active');
                tr.find('.toggle-off').hide();
                tr.find('.toggle-on').show();
            }
        }
    
    // Функция за одобрение на заявката за транспорт
        function approveAsset() {
            $('#kt_assets_table tbody').on('click', '.success-btn', function () {
                var requestId = $(this).data('asset-id');
                console.log(requestId)
                var action = 'success'
    
                Swal.fire({
                    text: "Сигурни ли сте че искате да одобрите заявката?",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Да, одобри!",
                    cancelButtonText: "Не, откажи",
                    customClass: {
                        confirmButton: "btn fw-bold btn-success",
                        cancelButton: "btn fw-bold btn-active-light-primary"
                    }
                }).then(function (result) {
                    if (result.value) {
                        $.ajax({
                            url: `/assets/handle_asset_request/${action}/${requestId}`,
                            type: 'POST',
                            success: function (response) {
    
                                datatable.ajax.reload(null, false);
                                window.dispatchEvent(new CustomEvent('refreshDataTable'));
                            },
                            error: function (error) {
                                console.error('Error approving request: ', error);
    
                            }
                        });
                    }
                });
            });
        }
    // Функция за анулиране на заявката за транспорт
        function cancelRequest() {
            $('#kt_assets_table tbody').on('click', '.cancel-btn', function () {
                var requestId = $(this).data('asset-id');
                var action = 'cancel'
    
                Swal.fire({
                    text: "Сигурни ли сте че искате да анулирате заявката?",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Да, анулирай!",
                    cancelButtonText: "Не, откажи",
                    customClass: {
                        confirmButton: "btn fw-bold btn-danger",
                        cancelButton: "btn fw-bold btn-active-light-success"
                    }
                }).then(function (result) {
                    if (result.value) {
                        $.ajax({
                            url: `/assets/handle_asset_request/${action}/${requestId}`,
                            type: 'POST',
                            success: function (response) {
    
                                datatable.ajax.reload(null, false);
                            },
                            error: function (error) {
                                console.error('Error approving request: ', error);
                                console.error('Error cancelling request: ', error.responseText);
    
                            }
                        });
                    }
                });
            });
        }
    
    
        // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
        var handleSearchDatatable = () => {
            const filterSearch = document.querySelector('[data-kt-assets-table-filter="search"]');
            filterSearch.addEventListener('keyup', function (e) {
                datatable.search(e.target.value).draw();
            });
        }
    
        // Function to handle the filter operation
        var handleFilterDatatable = function () {
            const applyButton = document.querySelector('#applyFilter');
    
    
            if (applyButton) {
                applyButton.addEventListener('click', function () {
    
                    datatable.ajax.reload();
                });
            }
        }
    
        // Reset Filter
        var handleResetForm = function () {
            // Select reset button
            const resetButton = document.querySelector('[data-kt-assets-table-filter="reset"]');
            const deliveryFilterSelect = $('#deliveryFilter'); // Пременлива за филтър елемента
            const deliveryTypeRadios = $('input[name="transport_type"]'); // Пременлива за радиобутоните за тип на транспорт
    
            // Reset datatable
            resetButton.addEventListener('click', function () {
                // Reset filter
                deliveryFilterSelect.val('').trigger('change'); // Нулиране на филтъра за статус
    
                // Нулиране на радиобутоните за тип на транспорт
                deliveryTypeRadios.prop('checked', false);
                deliveryTypeRadios.filter('[value="all"]').prop('checked', true);
    
                // Презареждане на DataTables без филтри
                datatable.ajax.reload();
            });
        }
    
    
        // Функция за обработка на изтриване на цяла заявка
        var handleDeleteRequest = () => {
            $('#kt_assets_table tbody').on('click', '.request-delete-btn', function () {
                var requestId = $(this).data('asset-id');
                var row = $(this).closest('tr');
    
                // Използване на SweetAlert2 за потвърждение на действието
                Swal.fire({
                    text: "Сигурни ли сте че искате да изтриете цялата заявка заедно с активите?",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Да, изтрий!",
                    cancelButtonText: "Не, Назад",
                    customClass: {
                        confirmButton: "btn fw-bold btn-danger",
                        cancelButton: "btn fw-bold btn-active-light-primary"
                    }
                }).then(function (result) {
                    if (result.value) {
                        // Ако потвърди изтриването, изпратете AJAX заявка
                        $.ajax({
                            url: '/assets/delete_request/' + requestId,
                            type: 'DELETE',
                            success: function (response) {
                                // Успешно изтриване
    
    
                                // Презареждане на таблицата
                                datatable.ajax.reload(null, false);
                            },
                            error: function (error) {
                                console.error('Error deleting request: ', error);
    
                            }
                        });
                    }
                });
            });
        };
    
    
        // Функция за обработка на изтриване на актив
        var handleDeleteAsset = () => {
            $('#kt_assets_table tbody').on('click', '.delete-btn', function () {
                var assetId = $(this).data('asset-id');
                var subTableId = $(this).closest('.dataTable').attr('id');
                var row = $(this).closest('tr');
    
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
                            url: '/assets/delete_asset/' + assetId,
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
        };
    
    //Функция за извеждане на модала с информация за историята на одобренията.
    
        var handleHistoryAsset = () => {
            $('#kt_assets_table tbody').on('click', '.warning-btn', function () {
                var assetId = $(this).data('asset-id');
                // Актуализация на заглавието на модала с ID на заявката
                $('#modal_history_transport').text('История на заявка № ' + assetId);
    
                $.ajax({
                    url: '/assets/get-request-history/' + assetId,
                    type: 'GET',
                    success: function (response) {
                        response.sort(function (a, b) {
                            var dateA = new Date(a.updated_at), dateB = new Date(b.updated_at);
                            return dateA - dateB; // сортира възходящо
                        });
    
                        // Очистване на текущото съдържание на модала
                        var timeline = $('.timeline');
                        timeline.empty();
    
                        // Генериране и добавяне на новото съдържание
                        response.forEach(function (historyItem) {
                            var formattedDate = new Date(historyItem.updated_at).toLocaleString();
                            var badgeClass = '';
    
                            switch (historyItem.status) {
                                case 'В изчакване':
                                    badgeClass = 'badge-light-warning';
                                    break;
                                case 'Одобрена':
                                    badgeClass = 'badge-light-success';
                                    break;
                                case 'Заявен транспорт':
                                    badgeClass = 'badge-light-primary';
                                    break;
                                case 'ТранспортSR':
                                    badgeClass = 'badge-light-info';
                                    break;
                                case 'Изпълнена':
                                    badgeClass = 'badge-light-dark';
                                    break;
                                case 'Анулирана':
                                    badgeClass = 'badge-light-danger';
                                    break;
                                default:
                                    badgeClass = 'badge-secondary';
                            }
                            var timelineItem = `
                            <div class="timeline-item">
                                <div class="timeline-line w-40px"></div>
                                <div class="timeline-icon symbol symbol-circle symbol-40px me-4">
                                    <div class="symbol-label bg-light">
                                        <i class="ki-duotone ki-calendar-tick fs-2qx"> <span class="path1"></span> <span class="path2"></span> <span class="path3"></span> <span class="path4"></span> <span class="path5"></span> <span class="path6"></span> </i>
                                    </div>
                                </div>
                                <div class="timeline-content mb-10 mt-n1">
                                    <div class="pe-3 mb-5">
                                        <div class="fs-5 fw-semibold mb-2">${historyItem.comment}</div>
                                        <div class="d-flex align-items-center mt-1 fs-6">
                                            <div class="text-muted me-2 fs-7">на дата: ${formattedDate} от</div>
                                           <div class="fw-bold fs-7" title="${historyItem.updated_by}">${historyItem.updated_by}</div>    
                                           
                                        </div>
                                    </div>
                                    <div class="overflow-auto pb-2">
                                        <div class="d-flex align-items-center border border-dashed border-gray-300 rounded  px-7 py-3 mb-2">
                                        <a class="fs-5 text-primary  fw-semibold w-375px min-w-200px">Текущо състояние:</a>
                                            <span class="badge ${badgeClass}">${historyItem.status}</span>
                                    </div>
                                </div>
                            </div>`;
                            timeline.append(timelineItem);
                        });
    
                        // Показване на модала
                        $('#kt_modal_view_users').modal('show');
                    },
                    error: function (error) {
                        console.error('Error fetching request history:', error);
                    }
                });
            });
        }
    
    
    
    
        // Обработчик на събития
        var handleTransportRoute = () => {
        $('#kt_assets_table tbody').on('click', '.primary-btn', function() {
            var requestId = $(this).data('asset-id');
    
            $.ajax({
                    url: '/assets/get-object-coordinates',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ request_ids: [requestId] }),
                success: function(response) {
                    // Инициализация на картата
                    initMap(response.start_coordinates, response.coordinates, 'map1');
    
    
                    // Показване на допълнителната информация в стилизирани блокчета
                    var additionalInfoHtml = `
                        <div id="additional-info" class="d-flex flex-wrap justify-content-center mt-4">
                            <div class="border border-gray-300 border-dashed rounded min-w-50px py-3 px-4 me-7 mb-3">
                                <div class="fs-6 text-primary fw-bold">${response.estimated_request_cost.toFixed(2)} лв.</div>
                                <div class="fs-8 fw-semibold text-gray-500">Обща цена</div>
                            </div>
                            <div class="border border-gray-300 border-dashed rounded min-w-50px py-3 px-4 me-7 mb-3">
                                <div class="fs-6 text-primary fw-bold">${response.total_distance_km.toFixed(2)} км</div>
                                <div class="fs-8 fw-semibold text-gray-500">Разстояние</div>
                            </div>
                            <div class="border border-gray-300 border-dashed rounded min-w-50px py-3 px-4 me-7 mb-3">
                                <div class="fs-6 text-primary fw-bold">${response.transport_price_per_km.toFixed(2)} лв.</div>
                                <div class="fs-8 fw-semibold text-gray-500">За километри</div>
                            </div>
                            <div class="border border-gray-300 border-dashed rounded min-w-50px py-3 px-4 mb-3">
                                <div class="fs-6 text-primary fw-bold">${response.price_for_assets.toFixed(2)} лв.</div>
                                <div class="fs-8 fw-semibold text-gray-500">За съоръжения</div>
                            </div>
                        </div>
                    `;
                    $('#header_map').after(additionalInfoHtml);
    
                    // Показване на модала
                    $('#kt_modal_view_map').modal('show');
                },
                error: function(error) {
                    console.error('Грешка при получаване на координатите на обектите:', error);
                }
            });
        });
    
        // Обработчик на събитието 'hidden.bs.modal' за изчистване на допълнителната информация
        $('#kt_modal_view_map').on('hidden.bs.modal', function() {
            $('#additional-info').remove();
        });
    };
    
    
    
    
    
    
    
        // Init toggle toolbar Тук на база тази функция с чекбоксовете се обработва и логиката за пускане на заявка за транспорт от множество заявки
        var initToggleToolbar = () => {
            // Select all checkboxes
            const checkboxes = table.querySelectorAll('[type="checkbox"]');
    
            // Select element for setting transport
            const setTransport = document.querySelector('[data-kt-assets-table-select="set-transport"]');
    
            // Event listener for checkboxes
            checkboxes.forEach(c => {
                c.addEventListener('click', function () {
                    setTimeout(function () {
                        toggleToolbars();
                    }, 50);
                });
            });
    
            // Enable checkboxes only for approved requests
            checkboxes.forEach(c => {
                if (c.closest('td')) {
                    const row = datatable.row($(c.closest('tr'))).data();
                    if (row && row.status_name === "Одобрена") {
                        c.disabled = false;
                    } else {
                        c.disabled = true;
                    }
                }
            });
    
            // Handle setting transport for selected requests
    
            setTransport.addEventListener('click', function () {
                let selectedIds = Array.from(checkboxes)
                    .filter(c => c.checked)
                    .map(c => {
                        let row = datatable.row($(c).closest('tr'));
                        return row.data() && row.data().id;
                    })
                    .filter(id => id);
    
                if (selectedIds.length > 0) {
                    $.ajax({
                        url: '/assets/get-assets-info',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify({assetIds: selectedIds}),
                        success: function (response) {
                            var totalAssetsCount = response.total_assets_count; // Общ брой активи
                            var requests = response.requests; // Информация за заявките
                            var costInfo = response.cost_info; // Информация за цените
    
                            var assetsInfoHtml = requests.map(request => {
                                var assetsDetails = request.assets.map(asset =>
                                    `<div class="d-flex flex-stack py-5 border-bottom border-gray-300 border-bottom-dashed">
                                <div class="d-flex align-items-start">
                                    <div>
                                        <a class="d-flex align-items-start text-start fs-9 fw-bold text-primary text-hover-primary">${request.object_name}
                                        <span class="${asset.direction === 'Входящо' ? 'badge-light-success' : 'badge-light-danger'} fs-9 ms-2 fw-semibold ">${asset.direction}</span></a>
                                        <div class="fw-semibold text-start text-muted fs-10 mt-0">${request.object_city}, ${request.object_address}</div>
                                        <div class="fw-semibold text-start text-muted fs-9 mt-0">${asset.asset_type}</div>
                                    </div>
                                </div>
                                <div class="d-flex">
                                    <div class="text-end">
                                        <div class="fs-9 fw-bold text-dark3 m-2">ID:${request.request_id}</div>
                                    </div>
                                </div>
                            </div>`
                                ).join('');
    
                                return `<div>${assetsDetails}</div>`;
                            }).join('');
    
                            // Генериране на HTML за допълнителната информация от cost_info
                            var costInfoHtml = `
                            <div id="additional-info" class="d-flex flex-wrap justify-content-center mb-5">
                                <div class="border border-gray-300 border-dashed rounded min-w-10px py-1 px-1 me-2 mb-3">
                                    <div class="fs-7 text-primary fw-bold">${costInfo.total_cost.toFixed(2)} лв.</div>
                                    <div class="fs-9 fw-semibold text-gray-500">Обща цена</div>
                                </div>
                                <div class="border border-gray-300 border-dashed rounded min-w-10px py-1 px-1 me-2 mb-3">
                                    <div class="fs-7 text-primary fw-bold">${costInfo.total_distance_km.toFixed(2)} км</div>
                                    <div class="fs-9 fw-semibold text-gray-500">Разстояние</div>
                                </div>
                                <div class="border border-gray-300 border-dashed rounded min-w-10px py-1 px-1 me-2 mb-3">
                                    <div class="fs-7 text-primary fw-bold">${costInfo.transport_costs.toFixed(2)} лв.</div>
                                    <div class="fs-9 fw-semibold text-gray-500">За километри</div>  
                                </div>
                                <div class="border border-gray-300 border-dashed rounded min-w-10px py-1 px-1 me-2 mb-3">
                                    <div class="fs-7 text-primary fw-bold">${costInfo.asset_costs.toFixed(2)} лв.</div>
                                    <div class="fs-9 fw-semibold text-gray-500">За съоръжения</div>
                                </div>
                                
                            </div>
                                `;
    
                            Swal.fire({
                                title: `<strong>Заявка за транспорт<strong><br><a class="text-primary mt-1">Общ брой активи: ${totalAssetsCount}<br><div class="mt-1" id="map" style="height: 150px; width:100%;"></div></a></strong>`,
                                html: `${assetsInfoHtml}`,
                                footer: `${costInfoHtml}`,
                                showCancelButton: true,
                                confirmButtonText: "Да, заяви!",
                                cancelButtonText: "Не, откажи",
                                customClass: {
                                    confirmButton: "btn fw-bold btn-primary",
                                    cancelButton: "btn fw-bold btn-active-light-primary"
                                },
                                didOpen: () => {
                                    // Инициализация на картата в контейнера "map"
                                    initMap(response.cost_info.start_end_coordinates, response.cost_info.sorted_gps_coordinates, 'map');
    
    
                                },
    
    
                                preConfirm: () => {
                                    Swal.showLoading(); // Показване на индикатора за зареждане
                                    const requestData = {
                                                                requestIds: selectedIds,
                                                                totalCost: costInfo.total_cost,
                                                                totalDistanceKm: costInfo.total_distance_km,
                                                                transportCosts: costInfo.transport_costs,
                                                                assetCosts: costInfo.asset_costs
                                                            };
                                    return new Promise((resolve, reject) => {
                                        setTimeout(function() {
                                        $.ajax({
                                            url: '/assets/set-transport',
                                            type: 'POST',
                                            contentType: 'application/json',
                                            data: JSON.stringify(requestData),
    
                                            success: resolve,
                                            error: reject
                                        });
                                        }, 3000);
                                    });
    
                                }
    
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    Swal.fire({
                                        text: "Транспортът е успешно заявен.",
                                        icon: "success",
                                        confirmButtonText: "ОК",
                                        customClass: {
                                            confirmButton: "btn fw-bold btn-primary",
                                        }
                                    });
                                    datatable.ajax.reload(null, false);
                                } else if (result.isDismissed) {
                                    Swal.fire({
                                        text: "Заявяването на транспорт беше отменено.",
                                        icon: "info",
                                        confirmButtonText: "ОК",
                                        customClass: {
                                            confirmButton: "btn fw-bold btn-primary",
                                        }
                                    });
                                }
                            }).catch(error => {
                                Swal.fire({
                                    text: "Възникна грешка при заявяване на транспорт.",
                                    icon: "error",
                                    confirmButtonText: "ОК",
                                    customClass: {
                                        confirmButton: "btn fw-bold btn-primary",
                                    }
                                });
                            });
                        },
                        error: function (error) {
                            console.error('Error fetching asset info: ', error);
                        }
                    });
                }
            });
        }
    
    // Toggle toolbars
        const toggleToolbars = () => {
            // Define variables
            const toolbarBase = document.querySelector('[data-kt-assets-table-toolbar="base"]');
            const toolbarSelected = document.querySelector('[data-kt-assets-table-toolbar="selected"]');
            const selectedCount = document.querySelector('[data-kt-assets-table-select="selected_count"]');
    
            // Select refreshed checkbox DOM elements
            const allCheckboxes = table.querySelectorAll('tbody [type="checkbox"]');
    
            // Detect checkboxes state & count
            let checkedState = false;
            let count = 0;
    
            // Count checked boxes and determine if any checkbox is checked
            allCheckboxes.forEach(c => {
                const row = datatable.row($(c.closest('tr'))).data();
                if (row && row.status_name === "Одобрена" && c.checked) {
                    checkedState = true;
                    count++;
                }
            });
    
            // Toggle toolbars based on checkedState
            if (checkedState) {
                selectedCount.innerHTML = count;
                toolbarBase.classList.add('d-none');
                toolbarSelected.classList.remove('d-none');
            } else {
                toolbarBase.classList.remove('d-none');
                toolbarSelected.classList.add('d-none');
            }
        }
        // Функция за избор на транспортна компания
    function loadTransportCompanies() {
        $.ajax({
            url: '/assets/get-transport-companies',
            type: 'GET',
            success: function(companies_data) {
                var select = $('#floatingSelect');
                select.empty();
                select.append($('<option>', {
                    value: '',
                    text : 'Изберете транспортна фирма'
                }));
    
                companies_data.forEach(function(company) {
                    select.append($('<option>', {
                        value: company.id,
                        text : company.name
                    }));
                });
            },
            error: function(error) {
                console.log('Error loading transport companies:', error);
            }
        });
    }
    // Добавяне на event listener за клик събитието
        // Public methods
        return {
            init: function () {
                table = document.querySelector('#kt_assets_table');
                if (!table) {
                    console.error('Table element not found');
                    return;
                }
    
                initTransportRequestData();
                handleFilterDatatable();
                handleSearchDatatable();
                handleResetForm();
                initToggleToolbar();
                handleDeleteAsset();
                handleDeleteRequest();
                approveAsset();
                cancelRequest()
                handleHistoryAsset();
                handleTransportRoute();
                loadTransportCompanies()
    
    
            }
        };
    
    
    }();
    
    // On document ready
    KTUtil.onDOMContentLoaded(function () {
        loadGoogleMapsApi();
        TransportRequest.init();
    });
    
