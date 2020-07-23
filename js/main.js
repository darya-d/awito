'use strict'; // включаем строгий режим 

const dataBase = JSON.parse(localStorage.getItem('awito')) || [];    // получаем данные из localstorage и методом .parse преобразуем json строку в массив. Если данных нет, то получаем пустой массив (в противном случае - null).

const modalAdd = document.querySelector('.modal__add');
const addAd = document.querySelector('.add__ad');
const modalBtnSubmit = document.querySelector('.modal__btn-submit');
const modalSubmit = document.querySelector('.modal__submit');
const catalog = document.querySelector('.catalog');
const modalItem = document.querySelector('.modal__item');
const modalBtnWarning = document.querySelector('.modal__btn-warning');
const modalFileInput = document.querySelector('.modal__file-input');
const modalFileBtn = document.querySelector('.modal__file-btn'); 
const modalImageAdd = document.querySelector('.modal__image-add');
const modalImageItem = document.querySelector('.modal__image-item');
const modalHeaderItem = document.querySelector('.modal__header-item');
const modalStatusItem = document.querySelector('.modal__status-item');
const modalDescriptionItem = document.querySelector('.modal__description-item');
const modalCostItem = document.querySelector('.modal__cost-item');

const searchInput = document.querySelector('.search__input');
const menuContainer = document.querySelector('.menu__container');

const srcModalImageAdd = modalImageAdd.src;                         // путь картинки по умолч в объявлении
const textModalFileBtn = modalFileBtn.textContent;                  // текст кнопки "Добавить фото"

const elementsModalSubmit = [...modalSubmit.elements]               // ... - оператор спред spread - всё, что итерируется, он записывает через запятую. Спред как масло. размазваем.
    .filter(elem => elem.tagName !== 'BUTTON'                       // выбираем все элементы, кроме тега button или типа submit.
                    && elem.type !== 'submit');                   

const infoPhoto = {};

let counter = dataBase.length;                                      // счетчик количества объявлений, итерируемый в событии modalSubmit. Если объявлений нет, он равен нулю.

// *Функция отправки нового товара через подачу объявления из БД dataBase в local storage
const saveDataBase = () => 
    localStorage.setItem('awito', JSON.stringify(dataBase));            // метод setItem отправиляет данные в нашу БД.
                                                                        // метод stringify переводит объект dataBase в строку формата json.

// *Функция проверки заполнения всех полей формы
const checkForm = () => {
    const validForm = elementsModalSubmit.every(elem => elem.value);    // методом every проверяем все элементы в массиве. 
                                                                        // если все элементы вернут true - значение переменной будет true. Если хоть одно вернет false - будет false.  
    modalBtnSubmit.disabled = !validForm;                               // разблокируем кнопку отправки при значении !true (то есть false) переменной validForm.
    modalBtnWarning.style.display = validForm ? 'none' : '';            // тернарный оператор. Если validForm true - присваиваем display = 'none'.
}

// *Функция закрытия модального окна по клику на крестик, вне формы или нажатием esc
const closeModal = event => { 
    const target = event.target;

    if (target.closest('.modal__close') || 
        target.classList.contains('modal-js') || 
        event.code === 'Escape') { 
            modalAdd.classList.add('hide');  
            modalItem.classList.add('hide');                            // прячем модалку объявлений.
            document.removeEventListener('keydown', closeModal);        // удаляем обработчик нажатия esc.
            modalSubmit.reset();                                        // встроенный метод очищения формы (только для тега form).
            modalImageAdd.src = srcModalImageAdd;                       // сбрасываем загруженную ранее картинку к той, что по умолч.
            modalFileBtn.textContent = textModalFileBtn;                // сбрасываем текст кнопки к "Добавить фото"
            checkForm();
        }
};

// *Функция рендера карточки с введенными данными
const renderCard = (DB = dataBase) => {                                 // если фцкция будет вызываться пустой, то ей присвоится dataBase     
    catalog.textContent= '';                                            // очищаем каталог 
    
    DB.forEach(item => {                                           // метод forEach принимает callback функцию; добавляем новую li карточку в начале каталога
        catalog.insertAdjacentHTML('beforeend', `                      
            <li class="card" data-id="${item.id}">
                <img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="test">
                <div class="card__description">
                    <h3 class="card__header">${item.nameItem}</h3>
                    <div class="card__price">${item.costItem} ₽</div>
                </div>
            </li>
        `);                   
    });
};

// *Событие добавления текста в поисковой input
searchInput.addEventListener('input', () => {
    const valueSearch = searchInput.value.trim().toLowerCase();           // метод trim убирает пробелы в начале и в конце у значения value; метод toLowerCase приводит весь текст в нижнему регистру

    if (valueSearch.length > 2) {
        const result = dataBase.filter(item => item.nameItem.toLowerCase().includes(valueSearch) ||
                                               item.descriptionItem.toLowerCase().includes(valueSearch));
        renderCard(result);
    };
});

// *Событие клика на input "Добавить фото"
modalFileInput.addEventListener('change', event => {                    // change срабатывает при изменении значения value у input                        
    const target = event.target;                                        // таргетом является наш input
    const reader = new FileReader();                                    // !конструктор FileReader - функция, которая при вызове возвращает объект
    const file = target.files[0];                                       // получаем наш файл - картинку

    infoPhoto.name = file.name;                                         // определяем название файла
    infoPhoto.size = file.size;                                         // определяем размер файла

    reader.readAsBinaryString(file);                                    // методом readAsBinaryString отслеживаем появления файла file и начинаем считывать его содержимого
    reader.addEventListener('load', event => {                          // событие load срабатывает когда файл file будет загружен
        if (infoPhoto.size < 2000000) {
            modalFileBtn.textContent = infoPhoto.name;                      // меняем текст "Добавить фото" на имя файла - картинки
            infoPhoto.base64 = btoa(event.target.result);                   // функция btoa() конвертирует картинку в строку
            modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`;   // изменяем картинку по умолч. в объявлении на загруженную    
        } else {
            modalFileBtn.textContent = 'Размер файла превышает 2Мб.';
            modalFileInput.value = '';
            checkForm();
        }
    });   
    
});

// * Событие - убираем надпись "Заполните все поля" и разблокируем кнопку отправки при внесения данных в поля input, textarea, select
modalSubmit.addEventListener('input', checkForm);

// * Событие - отключаем обновление страницы, создаем новый объект в локальной БД после отправки формы Подачи объявления
modalSubmit.addEventListener('submit', () => {  
    event.preventDefault(); 
    const itemObject = {};

    for (const elem of elementsModalSubmit) {                           // цикл for of перебираем элементы формы, каждый раз создавая новую переменную (поэтому объявляется const)
        itemObject[elem.name] = elem.value;                             // значение из name возьмется и сохранится как свойство объекта.
    } 
    
    itemObject.id = counter++;                                          // каждую итерацию цикла counter id будет увеличитваться на 1.
    itemObject.image = infoPhoto.base64;
    dataBase.push(itemObject);                                          // добавляем новое объявление - объект - в массив dataBase.
    modalSubmit.reset();                                                // очищаем форму после отправки.
    closeModal({target: modalAdd});                                     // закрываем модалку с назначением объекту target .
    saveDataBase();                                                     // отправляем созданное объявление в LS.
    renderCard();                                                       // добавляем новую карточку в каталог
});

// * Событие отрытия модалки при клике на кнопку "Подать объявление"
addAd.addEventListener('click', () => {                             // () => - callback функция, срабатываемая при клике.
    modalAdd.classList.remove('hide');                              // открываем модалку.
    modalBtnSubmit.disabled = true;                                 // блокируем кнопку отправить.
    document.addEventListener('keydown', closeModal);               // событие закрытия модалки нажатием esc.               
});

// * Событие отрытия модалки при клике на любую карточку из каталога
catalog.addEventListener('click', event => {
    const target = event.target;                                    // определяем target (в будущем - карточку).
    const card = target.closest('.card');

    if (card) {                                                     // выясняем, если у target родитель с классом .card
        const item = dataBase.find(obj => obj.id === +card.dataset.id);    // id у объекта obj должен быть равен card.dataset.id. Знаком + переводим строку в число.
        
        modalImageItem.src = `data:image/jpeg;base64,${item.image}`;
        modalHeaderItem.textContent = item.nameItem;
        modalStatusItem.textContent = item.status === 'new' ? 'Новый' : 'Б/У';
        modalDescriptionItem.textContent = item.descriptionItem;
        modalCostItem.textContent = item.costItem;
        
        modalItem.classList.remove('hide');                         // открываем карточку.
        document.addEventListener('keydown', closeModal);           // событие закрытия модалки нажатием esc.
    }
});

// * Событие клика по ссылкам-категориям товаров из меню
menuContainer.addEventListener('click', event => {  
    const target = event.target;

    if (target.className = 'menu__link') {
        const result = dataBase.filter(item => item.category === target.dataset.category);

        renderCard(result);
    }
});

modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);

renderCard();