$('#userRequestHistory').on('click', function () {
    // Показване на индикатора преди изпращането на заявката
    var timeline = $('#kt_modal_history_asset_request .timeline'); // Селектор към елемента на времевата линия в модала
    timeline.addClass('d-flex justify-content-center align-items-center').css('min-height', '100px'); // Добавете минимална височина, за да се види ефекта
    var loadingIndicator = $('<div class="loading-indicator spinner-border text-primary text-center d-flex justify-content-center align-items-center" role="status"><span class="visually-hidden">Зареждане...</span></div>');

    timeline.append(loadingIndicator);

    $('#loading-indicator').show();

    // Изчакване на 2 секунди преди да изпратим AJAX заявката
    setTimeout(function () {
        var searchInput = $('#searchInput'); // Селектор към инпут полето за търсене

        searchInput.on('keyup', function (e) {
        var searchTerm = e.target.value;
        console.log(e.target.value)


            // Изпращане на AJAX заявка за извличане на активите на текущия потребител
            $.ajax({
                url: '/get-user-assets', // URL адресът за извличане на активите
                type: 'GET', // Методът на заявката
                data: {search_term: searchTerm,}, // Подаване на стойността на търсенето като параметър

                success: function (response) {


                    var assets = response; // Предполага се, че отговорът съдържа масив с активи
                    // Преди добавянето на динамично съдържание, премахнете класовете за центриране
                    timeline.removeClass('d-flex justify-content-center align-items-center').css('min-height', '0'); // Връщане на оригиналното състояние
                    timeline.empty(); // Изчистване на съществуващото съдържание на времевата линия

                    // Проверка дали има върнати активи
                    if (assets && assets.length > 0) {


                        // Ако има активи, генериране на HTML за всеки актив и добавянето му към времевата линия
                        assets.forEach(function (asset) {
                            var localDate = new Date(asset.created_at).toLocaleString();
                            var badgeClass = asset.asset_direction === 'Изходящо' ? 'badge-light-danger' : 'badge-light-success';
                            var assetHTML = `
                            <div class="d-flex flex-stack py-5 border-bottom border-gray-300 border-bottom-dashed">
                                <div class="d-flex align-items-center">
                                <div class="ms-6">
                                    <a class="d-flex align-items-center fs-5 fw-bold text-dark text-hover-primary">Тип ${asset.asset_type}
                                    <span class="badge ${badgeClass} fs-8 fw-semibold ms-2">${asset.asset_direction} </span></a>
                                    <div class="fw-semibold text-muted fs-8 mt-1 ms-2"><strong>Дата</strong>: ${localDate} <br> <strong>SN</strong>: ${asset.serial_number} <br> <strong>BC</strong>: ${asset.barcode} <br> Обект: ${asset.object_name}</div>
                                </div>
                            </div>
                            <div class="d-flex">
                                <div class="text-end">
                                    <div class="fs-7 fw-bold text-dark">Статус:</div>
                                    <span class="${asset.asset_status === 'потвърдена' ? 'badge-light-primary' : 'badge-light-danger'} fs-9 ">${asset.asset_status}</span>
                                    <div class="fs-7 fw-bold text-dark">Начин:</div>
                                    <span class="${asset.transport_way === 'self transport' ? 'badge-light-primary' : 'badge-light-dark'} fs-9 ">${asset.transport_way}</span>
                                </div>
                            </div>
                            </div>
                        `;
                            timeline.append(assetHTML); // Добавяне на HTML на актива към времевата линия
                        });
                    } else {
                        // Ако няма активи, показване на съобщение за това
                        timeline.append('<div class="text-center">Няма намерени активи</div>');
                    }

                    // Скриване на индикатора след успешното извличане на данните
                    $('#loading-indicator').hide();

                    // Показване на модала след като данните са заредени
                    $('#kt_modal_history_asset_request').modal('show');
                },
                error: function (error) {
                    // Обработка на възникнала грешка при AJAX заявката
                    console.error('Error fetching request history:', error);
                    // Скриване на индикатора при грешка
                    $('#loading-indicator').hide();
                    // Преди добавянето на динамично съдържание, премахнете класовете за центриране
                    timeline.removeClass('d-flex justify-content-center align-items-center').css('min-height', '0'); // Връщане на оригиналното състояние
                }
            });

        }).trigger('keyup');
        }, 1000);// Изчакване на 2 секунди
});

$('#kt_modal_history_asset_request').on('hidden.bs.modal', function () {
    // Изчистване на времевата линия при затваряне на модала
    var timeline = $('#kt_modal_history_asset_request .timeline');
    timeline.empty(); // Изчиства всичко от времевата линия, включително индикатора за зареждане

    // Премахване на стиловете, добавени за центриране, и връщане на оригиналния стил, ако е необходимо
    timeline.removeClass('d-flex justify-content-center align-items-center').css('min-height', '');

    // Изчистване на текста в полето за търсене
    $('#searchInput').val('');
});


"use strict";

// Class definition
var KTUserRequestAssets = function () {
    // Private functions
var dataTable;
    // Функция за инициализация на DataTable
    var initUserRequestAssetsTable = function() {
        dataTable = $('#kt_user_request_assets_table').DataTable({
            "processing": true,
            "serverSide": true,
            "ajax": "/get-user-requests-assets",
            "columns": [
                { "data": "id" },

                { "data": "status_name" },
                { "data": "movement_type_name" },
                { "data": "object_name" },
                { "data": "object_city" },
                { "data": "created_at" },
                { "data": "estimated_request_cost" }
            ],
            "columnDefs": [
               { "orderable": false, "targets": [0,1, 2, 3, 4, 5,6,] },
                {
                            "targets": 5, // Индексът на колоната за датата
                            "render": function (data, type, full, meta) {
                                // Проверка дали има стойност в full.created_at и форматиране на датата
                                var createdDate = full.created_at ? new Date(full.created_at).toLocaleDateString() : ''; // Използване на български формат за дата
                                return '<span style="font-size: 8px;">' + createdDate + '</span>';
                            }

                },
                {
                        "targets": 1, // Индексът на колоната за статуса и транспорта
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
                {
                        "targets": 6, // Индексът на комбинираната колона
                        "render": function (data, type, full, meta) {
                            if (type === 'display') {
                                var cost = parseFloat(data) || 0; // Преобразува данните в число, ако не са валидни, връща 0
                                return cost.toFixed(0) + ' лв.'; // Форматира числото до два десетични знака и добавя 'лв.'
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

    var handleToggle = function () {
        var link = document.querySelector('#kt_toggle_link');

        link.addEventListener('click', function (e) {
    e.preventDefault();

    if (link.innerHTML === "Детайли по заявки") {
        link.innerHTML = "Затвори";
        link.classList.remove("btn-primary"); // Премахнете оригиналния клас за цвят
        link.classList.add("btn-danger"); // Добавете клас за червен цвят
    } else {
        link.innerHTML = "Детайли по заявки";
        link.classList.remove("btn-danger"); // Премахнете червения цвят
        link.classList.add("btn-primary"); // Върнете оригиналния клас за цвят
    }
    dataTable.ajax.reload(null, false);
})

    }

    // Public methods
    return {
        init: function () {
            initUserRequestAssetsTable(); // Инициализирайте DataTable тук
            handleToggle();
        }
    }
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTUserRequestAssets.init();
});



"use strict";

// Обединен клас за графики и карти
var KTChartsAndCardsWidget = function () {
    var chart1 = {
        self: null,
        rendered: false
    };
    var chart2 = {
        canvas: null,
        ctx: null
    };


    // Инициализация на графиката за KTChartsWidget18
        var initChart1 = function(data) {
            if (!data || !Array.isArray(data.monthlyData)) {
                console.error("Data is not provided or monthlyData is not an array.");
                return;
            }

    // Тук дефинираме element, така че да можем да го използваме за създаване на графиката
    var element = document.getElementById("kt_charts_widget_18_chart");
    if (!element) {
        console.error("Element for chart1 not found.");
        return;
    }

    // Преобразуване на месеците от числа към имена
    function monthNumberToName(monthNumber) {
        const monthNames = ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"];
        return monthNames[parseInt(monthNumber) - 1];
    }

    // Извличане на данни за графиката
    var totalEstimateCosts = data.monthlyData.map(item => `${item.totalEstimateCost.toFixed(2)}`);

    var monthNames = data.monthlyData.map(item => monthNumberToName(parseInt(item.month)));

        var height = parseInt(KTUtil.css(element, 'height'));
        var labelColor = KTUtil.getCssVariableValue('--bs-gray-900');
        var borderColor = KTUtil.getCssVariableValue('--bs-border-dashed-color');

        var options = {
            series: [{
                name: 'Разход',
                data: totalEstimateCosts
            }],
            chart: {
                fontFamily: 'inherit',
                type: 'bar',
                height: height,
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: ['28%'],
                    borderRadius: 5,
                    dataLabels: {
                        position: "top"
                    },
                    startingShape: 'flat'
                }
            },
            legend: {
                show: false
            },
            dataLabels: {
                enabled: true,
                offsetY: -28,
                style: {
                    fontSize: '13px',
                    colors: [labelColor]
                },
                formatter: function(val) {
                    return val;
                }
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: monthNames,
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    style: {
                        colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                        fontSize: '13px'
                    }
                },
                crosshairs: {
                    fill: {
                        gradient: {
                            opacityFrom: 0,
                            opacityTo: 0
                        }
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                        fontSize: '13px'
                    },
                    formatter: function(val) {
                        return val + "лв";
                    }
                }
            },
            fill: {
                opacity: 1
            },
            states: {
                normal: {
                    filter: {
                        type: 'none',
                        value: 0
                    }
                },
                hover: {
                    filter: {
                        type: 'none',
                        value: 0
                    }
                },
                active: {
                    allowMultipleDataPointsSelection: false,
                    filter: {
                        type: 'none',
                        value: 0
                    }
                }
            },
            tooltip: {
                style: {
                    fontSize: '12px'
                },
                y: {
                    formatter: function (val) {
                        return val + ' лева';
                    }
                }
            },
            colors: [KTUtil.getCssVariableValue('--bs-primary'), KTUtil.getCssVariableValue('--bs-primary-light')],
            grid: {
                borderColor: borderColor,
                strokeDashArray: 4,
                yaxis: {
                    lines: {
                        show: true
                    }
                }
            }
        };

        if (chart1.self) {
            chart1.self.destroy();
        }

        chart1.self = new ApexCharts(element, options);
        chart1.self.render();
        chart1.rendered = true;

    };


    // Инициализация на карта за KTCardsWidget171
    var initChart2 = function(data) {
    if (!data) {
        console.error('No data provided for chart2.');
        return;
    }

    var currentDate = new Date();
    var currentMonth = currentDate.toLocaleString('default', { month: 'long' }).charAt(0).toUpperCase() + currentDate.toLocaleString('default', { month: 'long' }).slice(1);
    var currentYear = currentDate.getFullYear();

    // Актуализация на текста с данните
    document.querySelector('#totalEstimateCost').textContent = `${data.totalEstimateCost.toFixed(2).toLocaleString()} лв`;
    document.querySelector('#totalAssetPrice').textContent = `${data.totalAssetsPrice.toFixed(2).toLocaleString()} лв`;
    document.querySelector('#totalPricePerKilometer').textContent = `${data.totalPricePerKm.toFixed(2).toLocaleString()} лв`;
    document.querySelector('#totalAssetCount').textContent = `Съоръжения ${data.totalAssetsCount} бр.`;
    document.querySelector('#monthText').textContent = `Разходи за месец ${currentMonth} ${currentYear} година`;

    var el = document.getElementById('kt_card_widget_171_chart');
if (!el) {
    console.error('Element not found');
    return;
}

// Тук дефинираме 'options' преди да го използваме
    var options = {
        size: parseInt(el.getAttribute('data-kt-size') || '70'),
        lineWidth: parseInt(el.getAttribute('data-kt-line') || '11'),
        rotate: parseInt(el.getAttribute('data-kt-rotate') || '145'),
    };

    // Намиране на canvas елемента в дива
    var canvas = document.querySelector('#kt_card_widget_171_chart canvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    var ctx = canvas.getContext('2d');
    // Уверете се, че размерите на canvas са коректно зададени
    canvas.width = canvas.parentElement.getAttribute('data-kt-size');
    canvas.height = canvas.parentElement.getAttribute('data-kt-size');

    // Проверка дали вече има инстанция на графика и я унищожаваме, за да можем да създадем нова
    if (window.myDoughnutChart) {
        window.myDoughnutChart.destroy();
    }

    window.myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {

            datasets: [{
                data: [data.totalAssetsPrice, data.totalPricePerKm],
                backgroundColor: [
                    'rgb(80,205,137)',
                    'rgb(62,151,255)'
                ],
                borderColor: [
                    'rgb(80,205,137)',
                    'rgb(62,151,255)'
                ],
                borderRadius: 20,
                borderWidth: 1
            }]
        },
        options: {
            cutout: '70%',
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Cost Distribution'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }



});
        };


    // Обединена функция за инициализация
    return {
        init: function () {
            fetch('/chart-data-user')
                .then(response => response.json())
                .then(data => {
                    if (data && data.currentMonth && data) {
                        initChart1(data); // Инициализация на първата графика
                        initChart2(data.currentMonth); // Инициализация на втората графика с данни
                    } else {
                        console.error('Data structure is not as expected:', data);
                    }
                })
                .catch(error => console.error('Error fetching data:', error));
            // Слушане за събитие за актуализиране на графиките
        window.addEventListener('updateCharts', () => {
            this.init(); // Повторно извикване на init за обновяване на графиките
        });
        }
    }
}();

// Инициализация при зареждане на DOM
KTUtil.onDOMContentLoaded(function() {
    KTChartsAndCardsWidget.init();
});

