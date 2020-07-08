'use strict'; // включаем строгий режим специальной директивой, весь последующий сценарий работает в «современном» режиме

const modalAdd = document.querySelector('.modal__add');
const addAd = document.querySelector('.add__ad');
const modalBtnSubmit = document.querySelector('.modal__btn-submit');
const modalSubmit = document.querySelector('.modal__submit');


addAd.addEventListener('click', () => { // () => - callback функция, срабатываемая при клике
    modalAdd.classList.remove('hide'); // открывает модалку
    modalBtnSubmit.disabled = true; // блокируем кнопку отправить
});

modalAdd.addEventListener('click', (event) => { 
    const target = event.target;

    if (target.classList.contains('modal__close') || target === modalAdd) {
        modalAdd.classList.add('hide'); // прячем модалку
        modalSubmit.reset(); // встроенный метод очищения формы (только для тега form)
    }
});

// ДОМАШКА - выход по ESC - на документ вешается события нажатия на клавиатуру, проверяем была ли эта кнопка ESC - если да, то добавляет класс hide
