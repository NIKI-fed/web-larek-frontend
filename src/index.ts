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
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Создание экземпляров классов
const page = new Page(document.body, events);
const modal = new Modal(modalTemplate, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);

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
events.on('modal:close', (sc) => {
    page.locked = false;
    console.log(sc)
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

// Событие: обновление счётчика корзины
events.on('basket:change', () => {
    page.counter = appData.basket.goods.length;
})

// Событие: изменение корзины

events.on('basket:change', () => {
    basket.items = appData.basket.goods.map((id) => {

        // Для каждого товара в корзине ищем товар в каталоге по id
        const item = appData.catalog.find((item) => item.id === id);
        const card = new Card(cloneTemplate(itemBasketTemplate), {
            onClick: () => {
                appData.removeGoodsFromBasket(item)
            }
        });
        //card.i = (index + 1).toString
        return card.render(item);
    });

    basket.total = appData.basket.total_cost;
});


