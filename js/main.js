'use strict'; // включаем строгий режим 

const modalAdd = document.querySelector('.modal__add');
const addAd = document.querySelector('.add__ad');
const modalBtnSubmit = document.querySelector('.modal__btn-submit');
const modalSubmit = document.querySelector('.modal__submit');
const catalog = document.querySelector('.catalog');
const modalItem = document.querySelector('.modal__item');
const keyCodeEsc = 27;
const modalBtnWarning = document.querySelector('.modal__btn-warning');
const elementsModalSubmit = [...modalSubmit.elements]               // ... - оператор спред spread - всё, что итерируется, он записывает через запятую. Спред как масло  размазваем.
    .filter(elem => elem.tagName !== 'BUTTON'                       // выбираем все элементы, кроме тега button или типа submit 
                    && elem.type !== 'submit');                   

// *Функция закрытия модального окна через this
const closeModal = function(event) { 
    const target = event.target;
    if (target.closest('.modal__close') || target === this) {       // target.keyCode === keyCodeEsc ?
        this.classList.add('hide');                                 // прячем модалку объявлений
        if (this === modalAdd) {
            modalSubmit.reset();                                    // встроенный метод очищения формы (только для тега form)
        }
    }
};

// *Функция закрытия формы нажатием esc
const closeModalEsc = event => {
    if (event.code === 'Escape') {
        modalAdd.classList.add('hide');
        modalItem.classList.add('hide');                            // прячем модалку объявлений
        modalSubmit.reset();                                        // встроенный метод очищения формы (только для тега form)
        document.removeEventListener('keydown', closeModalEsc);     // удаляем событие закрытия модалки нажатием esc  
    }
};

// * Событие - убираем надпись "Заполните все поля" и разблокируем кнопку отправки при внесения данных в поля input, textarea, select
modalSubmit.addEventListener('input', () => {                           // событие input - отрабатывает при внесении изменений в value у тегов input, select или textarea
    const validForm = elementsModalSubmit.every(elem => elem.value);    // методом every проверяем все элементы в массиве. 
                                                                        // Если все элементы вернут true - значение переменной будет true. Если хоть одно вернет false - будет false.  
    modalBtnSubmit.disabled = !validForm;                               // Разблокируем кнопку отправки при значении !true (то есть false) переменной validForm
    modalBtnWarning.style.display = validForm ? 'none' : '';            // Тернарный оператор. Если validForm true - присваиваем display = 'none';
})

// * Событие отрытия модалки при клике на кнопку "Подать объявление"
addAd.addEventListener('click', () => {                             // () => - callback функция, срабатываемая при клике
    modalAdd.classList.remove('hide');                              // открываем модалку
    modalBtnSubmit.disabled = true;                                 // блокируем кнопку отправить
    document.addEventListener('keydown', closeModalEsc);            // событие закрытия модалки нажатием esc                   
});

// * Событие отрытия модалки при клике на любую карточку из каталога
catalog.addEventListener('click', event => {
    const target = event.target;                                    // определяем target (в будущем - карточку)
    
    if (target.closest('.card')) {                                  // выясняем, если у target родитель с классом .card
        modalItem.classList.remove('hide');                         // открываем карточку
        document.addEventListener('keydown', closeModalEsc);        // событие закрытия модалки нажатием esc  
    }
});


modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);