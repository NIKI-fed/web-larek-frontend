import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { LarekAPI } from './components/LarekAPI';
import { EventEmitter } from './components/base/events';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { Basket } from './components/common/Basket';
import { AppData } from './components/AppData';
import { Card } from './components/Card';
import { IGoods, IContactData, IPaymentMethod } from './types';
import { PaymentAddress } from './components/PaymentAddressForm';
import { ContactsForm } from './components/ContactsForm';
import { Success } from './components/Success';


// Создание объекта событий
const events = new EventEmitter();

// Создание объекта API
const api = new LarekAPI(API_URL, CDN_URL);
const appData = new AppData(events);

// Загрузка данных с сревера и отображение карточки при загрузке страницы
api.getGoodsList()
    .then (appData.updateCatalog.bind(appData))
    .catch(console.error);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Создание шаблонов из DOM
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const itemBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const modalTemplate = ensureElement<HTMLElement>('#modal-container');
const paymentAddress = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Создание экземпляров классов
const page = new Page(document.body, events);
const modal = new Modal(modalTemplate, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const paymentAddressForm = new PaymentAddress(cloneTemplate(paymentAddress), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
    onClick: () => modal.close(),
})

// Событие: изменились элементы каталога и отрисовка на странице
events.on('items:change', () => {
    page.catalog = appData.catalog.map((item) => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render(item);
    });
});

// Событие: открытие модального окна
events.on('modal:open', () => {
    page.locked = true;
});

// Событие: закрытие модального окна
events.on('modal:close', () => {
    page.locked = false;
});

// Событие: выбор товара для модального окна (превью)
events.on('card:select', (item: IGoods) => {
    appData.goodsPreview(item);
});

// Событие: отрисовка выбранного товара в модальном окне
events.on('preview:change', (item: IGoods) => {
    // Создаём новую карточку товара
    const card = new Card(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (appData.goodsInBasket(item)) {
                appData.removeGoodsFromBasket(item);
                card.button(appData.goodsInBasket(item));
            } else {
                appData.addGoodsInBasket(item);
                card.button(appData.goodsInBasket(item));
            }
        }
    });
    // Отрисовываем карточку
    modal.render({content: card.render(item)});
    // Устанавливаем текст на кнопке в момент открытия в зависимости от того, добавлен ли товар в корзину
    card.button(appData.goodsInBasket(item));
});

// Событие: открыте корзины
events.on('basket:open', () => {
    modal.render({
        content: basket.render(),
    });
});

// Событие: изменение состава корзины
events.on('basket:change', () => {
    // Обновление счётчика
    page.counter = appData.basket.items.length;
    basket.items = appData.basket.items.map((id) => {
        const item = appData.catalog.find((item) => item.id === id);
        const card = new Card(cloneTemplate(itemBasketTemplate), {
            onClick: () => {
                appData.removeGoodsFromBasket(item)
            }
        });
        return card.render(item);
    });
    basket.total = appData.basket.total;
});

// Событие: открытие формы оплата/адрес
events.on('order:open', () => {
    modal.render({
        content: paymentAddressForm.render({
            payment: null,
            address: '',
            valid: false,
            errors: []
        })
    })
})

// Изменение полей формы оплата/адрес
events.on(/^order\..*:change/, (data: {field: keyof IContactData, value: string}) => {
    appData.setPaymentAddress(data.field, data.value);
    //appData.validatePaymentAddressForm();
});

// Обработка ошибок формы оплаты/адрес
events.on('orderFormErrors:change', (errors: Partial<IContactData>) => {
    const { payment, address } = errors;
    paymentAddressForm.valid = !payment && !address;
    paymentAddressForm.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
});

// Событие: submit формы оплаты/адрес и открытие формы контактов
events.on('order:submit', () => {
    modal.render({content: contacts.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
    })
    console.log(appData.basket)
})

// Изменение полей формы контактов
events.on(/^contacts\..*:change/, (data: {field: keyof IContactData, value: string}) => {
    appData.setContact(data.field, data.value);
    //appData.validateContact();
    console.log('change')
});

// Обработка ошибок формы контактов
events.on('contactFormErrors:change', (errors: Partial<IContactData>) => {
    const { email, phone } = errors;
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

// Submit формы контактов и отправка на сервер
events.on('contacts:submit', () => {
    console.log(appData.order, appData.basket);
    // Если стоимость корзины не равна 0, то отправляем заказ на сервер
    if ((appData.basket.total != 0)) {
        api.postOrder({
        ...appData.order,
        ...appData.basket
        })
        .then((data) => {
            modal.render({
                content: success.render(),
            });
            success.total = data.total;
            appData.clearBasket();
            appData.clearOrder();
        })
        .catch(console.error);
    } else {
        alert('Товар бесценен!')
    }
});

// // Submit формы контактов и отправка на сервер
// events.on('contacts:submit', () => {
//     console.log(appData.order, appData.basket);
//     // Если стоимость корзины не равна 0, то отправляем заказ на сервер
//     if ((appData.basket.total != 0)) {
//         if (appData.basket.includes() ) {

        
//             api.postOrder({
//             ...appData.order,
//             ...appData.basket
//             })
//             .then((data) => {
//                 modal.render({
//                     content: success.render(),
//                 });
//                 success.total = data.total;
//                 appData.clearBasket();
//                 appData.clearOrder();
//             })
//             .catch(console.error);
//         }
//     } else {
//         alert('Товар бесценен!')
//     }
// });