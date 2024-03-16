// Функция за обработка на избора на контрагент пру пускане на за явка за транспорт Стъпка 3 ( Данни за Клиент)

document.querySelector('[name="outlet_code"]').addEventListener('input', function () {
    var query = this.value;
    var inputField = this;

    // Премахване на стария контейнер за предложения, ако съществува
    var existingSuggestionsContainer = document.querySelector('.suggestions-container');
    if (existingSuggestionsContainer) {
        existingSuggestionsContainer.remove();
    }

    // Създаване на нов контейнер за предложения
    var suggestionsContainer = document.createElement('div');
    suggestionsContainer.classList.add('suggestions-container');

    if (query.length >= 2) {
        fetch('/assets/autocomplete-object-code?query=' + encodeURIComponent(query))
            .then(response => response.json())
            .then(suggestions => {
                suggestionsContainer.innerHTML = ''; // Изчистете старите предложения
                suggestionsContainer.classList.add('list-group'); // Добавяне на Bootstrap клас за списък

                suggestions.forEach(suggestion => {
                    var suggestionDiv = document.createElement('div');
                    suggestionDiv.textContent = suggestion.code + ' - ' + suggestion.name;
                    suggestionDiv.classList.add('list-group-item', 'list-group-item-action', 'suggestion-item'); // Добавяне на Bootstrap класове
                    suggestionDiv.addEventListener('click', function () {
                        inputField.value = suggestion.code;
                        suggestionsContainer.remove(); // Премахване на контейнера при избор
                        // suggestionsContainer.appendChild(suggestionDiv);

                        // Скриване на контейнера за предложения
                        var existingSuggestionsContainer = document.querySelector('.suggestions-container');
                        if (existingSuggestionsContainer) {
                            existingSuggestionsContainer.remove();
                        }

                        // Изпращане на AJAX заявка за пълна информация
                        fetch('/assets/get-object-info?code=' + encodeURIComponent(suggestion.code))
                            .then(response => response.json())
                            .then(data => {
                                // Попълване на информацията в HTML елементите
                                document.querySelector('.object-code-display').textContent = data.code || '-';
                                document.querySelector('.object-name-display').textContent = data.name || '-';
                                document.querySelector('.object-city-display').textContent = data.city || '-';
                                document.querySelector('.object-address-display').textContent = data.address || '-';
                                document.querySelector('.object-telephone-display').textContent = data.telephone || '-';
                                // Актуализирайте стойността на скритото поле
                                var objectNumber = data.code || '-';
                                document.querySelector('input[name="object_number"]').value = objectNumber !== '-' ? objectNumber : '';
                                // Добавете код за другите полета, ако е необходимо
                            });
                    });
                    suggestionsContainer.appendChild(suggestionDiv);
                });

                if (suggestions.length > 0) {
                    // Показване на suggestionsContainer под полето за въвеждане
                    inputField.parentNode.insertBefore(suggestionsContainer, inputField.nextSibling);
                }
            });
    }
});


document.querySelector('.edit-telephone').addEventListener('click', function (event) {
    event.preventDefault();

    var telephoneDisplay = document.querySelector('.object-telephone-display');
    var editInput = document.querySelector('.edit-telephone-input');

    telephoneDisplay.style.display = 'none';
    this.style.display = 'none';
    editInput.style.display = 'block';
    editInput.value = telephoneDisplay.textContent;

    // Добавяне на обработчик на събития при излизане от текстовото поле
    editInput.addEventListener('blur', function () {
        telephoneDisplay.textContent = editInput.value;
        telephoneDisplay.style.display = 'block';
        editInput.style.display = 'none';
        document.querySelector('.edit-telephone').style.display = 'block';
    });
});


