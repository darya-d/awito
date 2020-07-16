'use strict'; // включаем строгий режим 

const dataBase = JSON.parse(localStorage.getItem('awito')) || [];    // получаем данные из localstorage и методом .parse преобразуем json строку в массив. Если данных нет, то получаем пустой массив (в противном случае - null)

const modalAdd = document.querySelector('.modal__add');
const addAd = document.querySelector('.add__ad');
const modalBtnSubmit = document.querySelector('.modal__btn-submit');
const modalSubmit = document.querySelector('.modal__submit');
const catalog = document.querySelector('.catalog');
const modalItem = document.querySelector('.modal__item');
const modalBtnWarning = document.querySelector('.modal__btn-warning');
const elementsModalSubmit = [...modalSubmit.elements]               // ... - оператор спред spread - всё, что итерируется, он записывает через запятую. Спред как масло размазваем.
    .filter(elem => elem.tagName !== 'BUTTON'                       // выбираем все элементы, кроме тега button или типа submit 
                    && elem.type !== 'submit');                   

// *Функция отправки нового товара через подачу объявления из БД dataBase в local storage
const saveDataBase = () => 
    localStorage.setItem('awito', JSON.stringify(dataBase));            // метод setItem отправиляет данные в нашу БД
                                                                        // метод stringify переводит объект dataBase в строку формата json

// *Функция проверки заполнения всех полей формы
const checkForm = () => {
    const validForm = elementsModalSubmit.every(elem => elem.value);    // методом every проверяем все элементы в массиве. 
                                                                        // если все элементы вернут true - значение переменной будет true. Если хоть одно вернет false - будет false.  
    modalBtnSubmit.disabled = !validForm;                               // разблокируем кнопку отправки при значении !true (то есть false) переменной validForm
    modalBtnWarning.style.display = validForm ? 'none' : '';            // тернарный оператор. Если validForm true - присваиваем display = 'none';
}

// *Функция закрытия модального окна по клику на крестик, вне формы или нажатием esc
const closeModal = event => { 
    const target = event.target;

    if (target.closest('.modal__close') || 
        target.classList.contains('modal-js') || 
        event.code === 'Escape') { 
            modalAdd.classList.add('hide');  
            modalItem.classList.add('hide');                            // прячем модалку объявлений
            document.removeEventListener('keydown', closeModal);        // удаляем обработчик нажатия esc
            modalSubmit.reset();                                        // встроенный метод очищения формы (только для тега form)
            checkForm();
        }
};


// * Событие - убираем надпись "Заполните все поля" и разблокируем кнопку отправки при внесения данных в поля input, textarea, select
modalSubmit.addEventListener('input', checkForm);

// * Событие - отключаем обновление страницы, создаем новый объект в локальной БД после отправки формы Подачи объявления
modalSubmit.addEventListener('submit', () => {  
    event.preventDefault(); 
    const itemObject = {};

    for (const elem of elementsModalSubmit) {                           // цикл for of перебираем элементы формы, каждый раз создавая новую переменную (поэтому объявляется const)
        itemObject[elem.name] = elem.value;                             // значение из name возьмется и сохранится как свойство объекта
    } 
    
    dataBase.push(itemObject);                                          // добавляем новое объявление - объект - в массив dataBase
    modalSubmit.reset();                                                // очищаем форму после отправки
    closeModal({target: modalAdd});                                     // закрываем модалку с назначением объекту target 
    saveDataBase();                                                     // отправляем созданное объявление в LS
});

// * Событие отрытия модалки при клике на кнопку "Подать объявление"
addAd.addEventListener('click', () => {                             // () => - callback функция, срабатываемая при клике
    modalAdd.classList.remove('hide');                              // открываем модалку
    modalBtnSubmit.disabled = true;                                 // блокируем кнопку отправить
    document.addEventListener('keydown', closeModal);               // событие закрытия модалки нажатием esc                   
});

// * Событие отрытия модалки при клике на любую карточку из каталога
catalog.addEventListener('click', event => {
    const target = event.target;                                    // определяем target (в будущем - карточку)
    
    if (target.closest('.card')) {                                  // выясняем, если у target родитель с классом .card
        modalItem.classList.remove('hide');                         // открываем карточку
        document.addEventListener('keydown', closeModal);        // событие закрытия модалки нажатием esc  
    }
});


modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);