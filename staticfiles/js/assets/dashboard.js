
"use strict";

// Class definition
let KTTablesWidget5 = function () {
    let table;
    let datatable;

    // Private methods
    const initDatatable = () => {
        // Set date data order
        const tableRows = table.querySelectorAll('tbody tr');

        // tableRows.forEach(row => {
        //     const dateRow = row.querySelectorAll('td');
        //     const realDate = moment(dateRow[2].innerHTML, "MMM DD, YYYY").format(); // select date from 3rd column in table
        //     dateRow[2].setAttribute('data-order', realDate);
        // });

        // Init datatable --- more info on datatables: https://datatables.net/manual/
        datatable = $(table).DataTable({
            "serverSide": true, // Активиране на сървър-сайд обработка
            "processing": true,
            "info": false,
            'order': [],
            "lengthChange": false,
            'pageLength': 6,
            'paging': true,
            "ajax": {
                "url": "/console/get-user-request-value",
                "type": "GET",


            },
            "columns": [
                {"data":  "username"},
                {"data": "total_requests"},
                {"data": "total_spent"},
                {"data": "total_assets"},
                {"data": "manager_name"},


            ],
            'columnDefs': [
                { orderable: false, targets: 1 }, // Disable ordering on column 1 (product id)
                {
                    "targets": 2,
                    "render": function (data, type, full, meta) {
                        if (type === 'display') {
                            let cost = parseFloat(data) || 0; // Преобразува данните в число, ако не са валидни, връща 0
                            return cost.toFixed(2) + ' лв.'; // Форматира числото до два десетични знака и добавя 'лв.'
                        }


                        return data; // За другите типове връща оригиналните данни
                    }
                },
            ]
        });
    }

    // Handle status filter
    const handleStatusFilter = () => {
        const select = document.querySelector('[data-kt-table-widget-5="filter_status"]');

        $(select).on('select2:select', function (e) {
            const value = $(this).val();
            if (value === 'Show All') {
                datatable.search('').draw();
            } else {
                datatable.search(value).draw();
            }
        });
    }

    // Public methods
    return {
        init: function () {
            table = document.querySelector('#kt_table_widget_5_table');

            if (!table) {
                return;
            }

            initDatatable();
            handleStatusFilter();
        }
    }
}();

// Webpack support
if (typeof module !== 'undefined') {
    module.exports = KTTablesWidget5;
}

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTTablesWidget5.init();
});


"use strict";

// Обединен клас за графики и карти
let KTChartsAndCardsWidgetDashboard = function () {
    let chart1 = {
        self: null,
        rendered: false
    };
    let chart2 = {
        canvas: null,
        ctx: null
    };

    let chart5 = {
        self: null,
        rendered: false
    };


    // Инициализация на графиката за KTChartsWidget18
        let initChart3 = function(data) {
            if (!data || !Array.isArray(data.monthlyData)) {
                console.error("Data is not provided or monthlyData is not an array.");
                return;
            }


    // Тук дефинираме element, така че да можем да го използваме за създаване на графиката
    let element = document.getElementById("kt_charts_widget_100_chart");
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
    let totalEstimateCosts = data.monthlyData.map(item => `${item.totalEstimateCost.toFixed(2)}`);

    let monthNames = data.monthlyData.map(item => monthNumberToName(parseInt(item.month)));

        let height = parseInt(KTUtil.css(element, 'height'));
        let labelColor = KTUtil.getCssletiableValue('--bs-gray-900');
        let borderColor = KTUtil.getCssletiableValue('--bs-border-dashed-color');

        let options = {
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
                        colors: KTUtil.getCssletiableValue('--bs-gray-500'),
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
                        colors: KTUtil.getCssletiableValue('--bs-gray-500'),
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
            colors: [KTUtil.getCssletiableValue('--bs-primary'), KTUtil.getCssletiableValue('--bs-primary-light')],
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



        let initChart4 = function(data) {
            if (!data) {
                console.error('No data provided for chart2.');
                return;
            }

            let currentDate = new Date();
            let currentMonth = currentDate.toLocaleString('default', {month: 'long'}).charAt(0).toUpperCase() + currentDate.toLocaleString('default', {month: 'long'}).slice(1);
            let currentYear = currentDate.getFullYear();

            // // Актуализация на текста с данните
            document.querySelector('#totalEstimateCost').innerHTML = `Общ разход <strong class=" fs-4 text-primary">${data.totalEstimateCost.toFixed(2).toLocaleString()} лв</strong>`;
            document.querySelector('#totalAssetPrice').textContent = `${data.totalAssetsPrice.toFixed(2).toLocaleString()} лв`;
            document.querySelector('#totalPricePerKilometer').textContent = `${data.totalPricePerKm.toFixed(2).toLocaleString()} лв`;
            document.querySelector('#totalAssetCount').textContent = `Съоръжения ${data.totalAssetsCount} бр.`;
            // document.querySelector('#monthText').textContent = `Разходи за месец ${currentMonth} ${currentYear} година`;

            let el = document.getElementById('kt_card_widget_101_chart');
            if (!el) {
                console.error('Element not found');
                return;
            }

            // Тук дефинираме 'options' преди да го използваме
            let options = {
                size: parseInt(el.getAttribute('data-kt-size') || '70'),
                lineWidth: parseInt(el.getAttribute('data-kt-line') || '11'),
                rotate: parseInt(el.getAttribute('data-kt-rotate') || '145'),
            };



    // Намиране на canvas елемента в дива
    let canvas = document.querySelector('#kt_card_widget_101_chart canvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    let ctx = canvas.getContext('2d');
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


    let initChart5 = function(data) {
    if (!data) { // Променете тук value_by_asm на valueByAsm
        console.error("Data is not provided or value by asm is not an array.");
        return;
    }

    let element = document.getElementById("kt_charts_widget_5");

    if (!element) {
        return;
    }
    


    let borderColor = KTUtil.getCssletiableValue('--bs-border-dashed-color');
    let chartData = data.valueByAsm.map(item => parseFloat(item.total_estimated_cost).toFixed(2));
    let categories = data.valueByAsm.map(item => {
        let names = item.manager_name.split(' ');
        return names.length > 1 ? names[0] + ' ' + names[names.length - 1] : item.manager_name;
    });
    // Променете опциите за графиката, използвайки данните от сървъра
    let options = {
    series: [{
        data: chartData,
        show: true
    }],
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: true,

            }
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
                distributed: true,
                barHeight: 20
            }
        },
        dataLabels: {
            enabled: true
        },
        legend: {
            show: false
        },
        colors: ['#3E97FF', '#F1416C', '#50CD89', '#FFC700', '#7239EA', '#50CDCD', '#3F4254'],
        xaxis: {
            categories: categories,
            labels: {
                formatter: function (val) {
                    return val
                },
                style: {
                    colors: KTUtil.getCssletiableValue('--bs-gray-400'),
                    fontSize: '9px',
                    fontWeight: '200',
                    align: 'right'
                }
            },
            axisBorder: {
                show: false
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: KTUtil.getCssletiableValue('--bs-gray-800'),
                    fontSize: '10px',
                    fontWeight: '600'
                },
                offsetY: 5,
                align: 'left'
            }
        },
        grid: {
            borderColor: borderColor,
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: false
                }
            },
            strokeDashArray: 4
        }
    };
        if (chart5.self) {
            chart5.self.destroy();
        }
        chart5.self = new ApexCharts(element, options);

// Set timeout to properly get the parent elements width
setTimeout(function() {
    chart5.self.render();
    chart5.rendered = true;
}, 200);
    }


    // Обединена функция за инициализация
    return {
        init: function () {
            fetch('/console/chart-data-dashboard')
                .then(response => response.json())
                .then(data => {
                    if (data && data.currentMonth && data.valueByAsm) {
                    initChart3(data); // Инициализация на първата графика
                    initChart4(data.currentMonth); // Инициализация на втората графика с данни
                    initChart5(data); // Подаване на data.valueByAsm вместо само data
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
    KTChartsAndCardsWidgetDashboard.init();
});

$(document).ready(function() {
    $.ajax({
        url: '/console/transport_budget',
        type: 'GET',
        success: function(data) {
            data.forEach(function(budget) {
                let managerId = budget.manager_id;

                // Обновяване на елемента за общия бюджет
                let budgetElementId = 'budget_' + managerId;
                let budgetElement = document.getElementById(budgetElementId);
                if (budgetElement) {
                budgetElement.innerHTML = '<i class="ki-duotone ki-bank me-1 fs-4"> <span class="path1"></span> <span class="path2"></span> </i> <span class="text-dark fs-8">' + budget.budget.toFixed(0) + ' лв.</span>';
            }


                // Обновяване на елемента за изразходван бюджет
                let spent_budgetElementId = 'spent_budget_' + managerId;
                let spent_budgetElement = document.getElementById(spent_budgetElementId);
                if (spent_budgetElement) {
                    spent_budgetElement.innerHTML = '<i class="ki-duotone ki-courier-express me-1 fs-4"> <span class="path1"></span> <span class="path2"></span> <span class="path3"></span> <span class="path4"></span> <span class="path5"></span> <span class="path6"></span> <span class="path7"></span> </i> <span class="text-dark fs-8">' + budget.spent_amount.toFixed(0) + ' лв.</span>';
                }

                // Обновяване на елемента за остатъка от бюджета
                let leftBudgetElementId = 'left_budget_' + managerId;
                let leftBudgetElement = document.getElementById(leftBudgetElementId);
                if (leftBudgetElement) {
                    let leftBudget = budget.budget - budget.spent_amount;
                    let leftBudgetFormatted = leftBudget.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    leftBudgetElement.innerHTML = '<span class="fw-bolder fs-6 text-gray-900">' + leftBudgetFormatted + ' лв. остатък</span>';
                }
                // Изчисляване на процента на изпълнение на бюджета
                let percentExecuted = (budget.spent_amount / budget.budget) * 100;
                let percentFormatted = percentExecuted.toFixed(0);

                // Обновяване на елемента за процента
                let percentElementId = 'percent_' + managerId;
                let percentElement = document.getElementById(percentElementId);
                if (percentElement) {
                    percentElement.innerHTML = '<span class="fw-bold fs-6 text-gray-500">' + percentFormatted + '%</span>';
                }




                // Обновяване на прогресбара
                let progressBarId = 'progresbar_' + managerId;
                let progressBar = document.getElementById(progressBarId);
                if (progressBar) {


                    progressBar.style.width = percentFormatted + '%';
                    progressBar.style.backgroundImage = getProgressGradient(percentExecuted);


                    progressBar.setAttribute('aria-valuenow', percentFormatted);

                    // Премахваме Bootstrap класове за фонов цвят
                    progressBar.classList.remove('bg-success', 'bg-info', 'bg-warning', 'bg-danger');
                }
            });
        },
        error: function(error) {
            console.log(error);
        }
    });
});

   function getProgressGradient(percent) {
    let color;
    if (percent <= 35) {
        // Зелен до 35%
        color = `linear-gradient(to right, green, yellow ${percent / 35 * 100}%)`;
    } else if (percent <= 50) {
        // Жълт до 50%
        let greenToYellowPercent = (percent - 35) / (50 - 35) * 100;
        color = `linear-gradient(to right, green, yellow ${greenToYellowPercent}%, yellow)`;
    } else if (percent <= 80) {
        // Оранжево до 80%
        let yellowToOrangePercent = (percent - 50) / (80 - 50) * 100;
        color = `linear-gradient(to right, green, yellow 50%, orange ${yellowToOrangePercent}%, orange)`;
    } else {
        // Червено от 80% до 100%
        let orangeToRedPercent = (percent - 80) / (100 - 80) * 100;
        color = `linear-gradient(to right, green, yellow 50%, orange 80%, red ${orangeToRedPercent}%, red)`;
    }
    return color;
}

