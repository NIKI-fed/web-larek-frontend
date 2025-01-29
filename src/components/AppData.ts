import { IGoods, IBasket, IOrder, IPaymentMethod, PaymentMethod } from "../types";
import { IEvents } from "./base/events";

// export class GoodsItem implements IGoods {
//     id: string;
//     description?: string;
//     image: string;
//     title: string;
//     category: string;
//     price: number | null;
// }

export class AppData {
    catalog: IGoods[] = []; // массив со всеми товарами
    preview: IGoods | null = null; // конкретный товар для открытия в модалке
    basket: IBasket = {
        goods: [], // id товаров, которые в корзине
        total_cost: 0, // стоимость товаров в коризине
    };
    order: IOrder = {
        payment: 'card', // метод оплаты по умолчанию
        address: '',
        email: '',
        phone: ''
    };

    // св-во для хранения ошибок формы, связанных с IOrder
    formErrors: Partial<Record<keyof IOrder, string>> = {};

    constructor(protected events: IEvents) {};

    // Работа с каталогом и товарами
    // Обновляем каталог
    updateCatalog(catalog: IGoods[]) {
        this.catalog = catalog;
        this.events.emit('items:change', { catalog: this.catalog });
    }

    // Устанавливаем текущий товар для предпросмотра
    goodsPreview(item: IGoods) {
        this.preview = item;
        this.events.emit('preview:change', this.preview);
    }

    // Работа с корзиной
    // Проверяем, находится ли товар в корзине
    goodsInBasket(item: IGoods): boolean {
        return this.basket.goods.includes(item.id);
    }

    // Добавляем товар в корзину
    addGoodsInBasket(item: IGoods) {
        this.basket.goods.push(item.id);
        this.basket.total_cost += item.price;
        this.events.emit('basket:change', this.basket);
    }

    // Удаляем товар из корзины
    removeGoodsFromBasket(item: IGoods) {
        this.basket.goods = this.basket.goods.filter((id) => id !== item.id);
        this.basket.total_cost -= item.price;
        this.events.emit('basket:change', this.basket);
    }

    // Очищаем корзину
    clearBasket() {
        this.basket.goods = [];
        this.basket.total_cost = 0;
        this.events.emit('basket:change');
    }

    // Выбор способа оплаты
    setPayment(method: PaymentMethod) {
        this.order.payment = method;
    }


    // Валидация формы заказа
    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        this.formErrors = errors;
        this.events.emit('orderFormErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    // Валидация формы контактов
    validateContact() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        } 
        this.formErrors = errors;
        this.events.emit('contactsFormErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    // Очищает данные заказа
    clearOrder() {
        this.order = {
            email: '',
            phone: '',
            address: '',
            payment: 'card',
        };
    }
}