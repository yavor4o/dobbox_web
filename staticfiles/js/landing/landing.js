"use strict";

// Class definition
let KTLandingPage = function () {
    // Private methods
    let initTyped = function() {
        let typed = new Typed("#kt_landing_hero_text", {
            strings: ["The Best Theme Ever", "The Most Trusted Theme", "#1 Selling Theme"],
            typeSpeed: 50
        });
    }

    // Public methods
    return {
        init: function () {
            //initTyped();
        }   
    }
}();

// Webpack support
if (typeof module !== 'undefined') {
    module.exports = KTLandingPage;
}

// On document ready
KTUtil.onDOMContentLoaded(function() {
    KTLandingPage.init();
});
