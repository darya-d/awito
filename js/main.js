'use strict'; // включаем строгий режим 

const modalAdd = document.querySelector('.modal__add');
const addAd = document.querySelector('.add__ad');
const modalBtnSubmit = document.querySelector('.modal__btn-submit');
const modalSubmit = document.querySelector('.modal__submit');
const catalog = document.querySelector('.catalog');
const modalItem = document.querySelector('.modal__item');
const keyCodeEsc = 27;


// 1 вариант - Функция закрытия модального окна через стрелочную функцию
// const closeModal = event => { 
//     const target = event.target;
    // 1 вариант
    // if (target.classList.contains('modal__close') || target === modalAdd) {
    //     modalAdd.classList.add('hide'); // прячем модалку объявлений
    //     modalSubmit.reset(); // встроенный метод очищения формы (только для тега form)
    // }
    // 2 вариант - метод closest проверяет наличие у кликаемого элемента класса modal__close
//     if (target.closest('.modal__close') || target === modalAdd || target === modalItem) { // target.keyCode === keyCodeEsc ?
//         modalAdd.classList.add('hide'); // прячем модалку объявлений
//         modalItem.classList.add('hide'); // прячем модалку карточки
//         modalSubmit.reset(); // встроенный метод очищения формы (только для тега form)
//     }
// };

// *Функция закрытия модального окна через this
const closeModal = function(event) { 
    const target = event.target;
    if (target.closest('.modal__close') || target === this) { // target.keyCode === keyCodeEsc ?
        this.classList.add('hide');                           // прячем модалку объявлений
        if (this === modalAdd) {
            modalSubmit.reset();                              // встроенный метод очищения формы (только для тега form)
        }
    }
};

// *Функция закрытия формы нажатием esc
const closeModalEsc = event => {
    if (event.code === 'Escape') {
        modalAdd.classList.add('hide');
        modalItem.classList.add('hide');                       // прячем модалку объявлений
        modalSubmit.reset();                                  // встроенный метод очищения формы (только для тега form)
    }
};

addAd.addEventListener('click', () => {                       // () => - callback функция, срабатываемая при клике
    modalAdd.classList.remove('hide');                        // открываем модалку
    modalBtnSubmit.disabled = true;                           // блокируем кнопку отправить
});


modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);
document.addEventListener('keydown', closeModalEsc);


catalog.addEventListener('click', event => {
    const target = event.target;
    
    if (target.closest('.card')) {                            // если у target родитель с классом .card
        modalItem.classList.remove('hide');                   // открывает карточку
    }
});

