"use strict";

// Class definition
let KTPricingGeneral = function () {
    // Private letiables
    let element;
	let planPeriodMonthButton;
	let planPeriodAnnualButton;

	let changePlanPrices = function(type) {
		let items = [].slice.call(element.querySelectorAll('[data-kt-plan-price-month]'));

		items.map(function (item) {
			let monthPrice = item.getAttribute('data-kt-plan-price-month');
			let annualPrice = item.getAttribute('data-kt-plan-price-annual');

			if ( type === 'month' ) {
				item.innerHTML = monthPrice;
			} else if ( type === 'annual' ) {
				item.innerHTML = annualPrice;
			}
		});
	}

    let handlePlanPeriodSelection = function(e) {

        // Handle period change
        planPeriodMonthButton.addEventListener('click', function (e) {
            e.preventDefault();

            planPeriodMonthButton.classList.add('active');
            planPeriodAnnualButton.classList.remove('active');

            changePlanPrices('month');
        });

		planPeriodAnnualButton.addEventListener('click', function (e) {
            e.preventDefault();

            planPeriodMonthButton.classList.remove('active');
            planPeriodAnnualButton.classList.add('active');

            changePlanPrices('annual');
        });
    }

    // Public methods
    return {
        init: function () {
            element = document.querySelector('#kt_pricing');
			planPeriodMonthButton = element.querySelector('[data-kt-plan="month"]');
			planPeriodAnnualButton = element.querySelector('[data-kt-plan="annual"]');

            // Handlers
            handlePlanPeriodSelection();
        }
    }
}();

// On document ready
KTUtil.onDOMContentLoaded(function() {
    KTPricingGeneral.init();
});
