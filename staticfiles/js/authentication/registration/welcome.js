document.addEventListener('DOMContentLoaded', function() {
    const regionsSelect = document.getElementById('id_regions');
    const citiesSelect = document.getElementById('id_provincial_city');

    function fetchCities(regionId) {
        // Проверете дали regionId не е празно или null
        if (!regionId) {
            return;
        }

        // Стартиране на AJAX заявка
        fetch(`authentication/get-offices/?region_id=${regionId}`)
            .then(response => response.json())
            .then(data => {
                // Изчистване на съществуващите опции
                citiesSelect.innerHTML = '';
                // Добавяне на празна опция
                citiesSelect.add(new Option('Изберете областен град след избор на регион', ''));
                // Попълване с новите опции
                data.offices.forEach(function(city) {
                    citiesSelect.add(new Option(city.name, city.id));
                });
            })
            .catch(error => {
                console.error('Error fetching cities:', error);
                // В случай на грешка, добавете подходящо съобщение или логика за обработка
            });
    }

    // Събитие за промяна на региона
    regionsSelect.addEventListener('change', function() {
        const regionId = this.value;
        fetchCities(regionId);
    });
});
