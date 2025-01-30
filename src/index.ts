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
import { IGoods } from './types';
import { PaymentAddress } from './components/PaymentAddressForm';
import { ContactsForm } from './components/ContactsForm';


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
const orderForm = new PaymentAddress(cloneTemplate(paymentAddress), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);

// 4. способ оплаты/адрес
// 5. контактные данные
// 6. Успех!

// const contactData = 
// const success =

// window.addEventListener('scroll', function () {
//     const scrollPosition = window.scrollY;
//     console.log(scrollPosition);
// })

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
                //card.button = 'Удалить из корзины';
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

// Событие: изменение корзины
events.on('basket:change', () => {
    // Обновление счётчика
    page.counter = appData.basket.goods.length;
    basket.items = appData.basket.goods.map((id) => {
        const item = appData.catalog.find((item) => item.id === id);
        const card = new Card(cloneTemplate(itemBasketTemplate), {
            onClick: () => {
                appData.removeGoodsFromBasket(item)
            }
        });
        return card.render(item);
    });
    basket.total = appData.basket.total_cost;
});

// Событие: открытие формы способ оплаты/адрес
events.on('order:open', () => {
    modal.render({content: orderForm.render({
                                                payment: null,
                                                address: '',
                                                valid: false,
                                                errors: []
                                                })
                })
    
    if (orderForm.valid) {
        console.log('sdfksd')
    }

})

// Событие: submit формы оплаты/адрес
events.on('order:submit', () => {
    modal.render({content: contacts.render({
                                                email: null,
                                                phone: '',
                                                valid: false,
                                                errors: []
                                                })
                })
    })


    /*События:
    
    именение формы оплаты/адреса
    сабмит формы оплата/адрес

    изменение формы контактов
    сабмит формы контактов
    отправка данный на сервер
    очищение корзины, сброс заказа
    */
