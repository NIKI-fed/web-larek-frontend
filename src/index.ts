import './scss/styles.scss';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ensureElement } from './utils/utils';
import { Page } from './components/Page';

import { Api, ApiListResponse } from './components/base/api';
import { IGoods } from './types';
import { Card } from './components/Card';
import { Modal } from './components/Modal';


// Создание объекта API
const api = new Api(API_URL);

// Создание объекта событий
const events = new EventEmitter();

// Присваиваем константам 
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
// const appData = new AppState({}, events);
// const formData = new AppForm({}, events)

// Создание объектов глобальных контейнеров:
// 1. странца
// 2. модалка
// 3. корзина
// 4. способ оплаты/адрес
// 5. контактные данные
// 6. Успех!

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
// const basket = 
// const paymentMethod = 
// const contactData = 
// const success =

// События модального окна
events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});



api
    .get(settings.product)
    .then((res: ApiListResponse<IGoods>) => {
        
        const cards = res.items

        const cardCatalog = document.querySelector('.gallery')
        
            // Выводим все карточки
        cards.forEach(item => {
            const cardItem = new Card(cardCatalogTemplate);
            const itemElement = cardItem.render(item);
            cardCatalog.prepend(itemElement);
        });
    })

    .catch(console.error);



    
// // Блокируем прокрутку страницы если открыта модалка
// events.on('modal:open', () => {
//     page.locked = true;
// });

// // ... и разблокируем
// events.on('modal:close', () => {
//     page.locked = false;
// });


