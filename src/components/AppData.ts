import { IGoods, IBasket, IOrder, IContactData, PaymentMethod } from "../types";
import { IEvents } from "./base/events";

export class AppData {
    catalog: IGoods[] = []; // массив со всеми товарами
    preview: IGoods | null = null; // конкретный товар для открытия в модалке
    basket: IBasket = {
        items: [], // id товаров, которые в корзине
        total: 0, // стоимость товаров в корзине
    };
    order: IOrder = {
        payment: null, // метод оплаты по умолчанию
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
        return this.basket.items.includes(item.id);
    }

    // Добавляем товар в корзину
    addGoodsInBasket(item: IGoods) {
        this.basket.items.push(item.id);
        this.basket.total += item.price;
        this.events.emit('basket:change', this.basket);
    }

    // Удаляем товар из корзины
    removeGoodsFromBasket(item: IGoods) {
        this.basket.items = this.basket.items.filter((id) => id !== item.id);
        this.basket.total -= item.price;
        this.events.emit('basket:change', this.basket);
    }

    // Очищаем корзину
    clearBasket() {
        this.basket.items = [];
        this.basket.total = 0;
        this.events.emit('basket:change');
    }

    // Выбор способа оплаты
    setPaymentMethod(method: PaymentMethod) {
        this.order.payment = method;
    }

    // Валидация формы оплата/адрес
    validatePaymentAddressForm(): boolean {
        const errors: typeof this.formErrors = {};
        const addressRegex = /^[a-zA-Zа-яА-ЯёЁ0-9.,\-/\s]{5,}$/;

        if (!this.order.payment) {
            errors.payment = 'Выберите способ оплаты';
        } else if (!this.order.address) {
            errors.address = 'Необходимо указать адрес доставки';
        } else if (!addressRegex.test(this.order.address)) {
            errors.address = 'Некорректный адрес';
        }

        this.formErrors = errors;
        this.events.emit('orderFormErrors:change', this.formErrors);
        // Если ошибок нет, возвращаем true
        return Object.keys(errors).length === 0;
    }

    // Установка значения для формы оплата/адрес
    setPaymentAddress(field: keyof IContactData, value: string) {
        if (field === 'payment') {
            this.setPaymentMethod(value as PaymentMethod)
        } else {
        this.order[field] = value;
        }
        if (this.validatePaymentAddressForm()) {
            this.events.emit('order:ready', this.order);
        }
    }

    // Валидация формы контактов
    validateContact(): boolean {
        const errors: typeof this.formErrors = {};
        const emailRegex = /^[1]/ // /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^[1]/ // /^(\+7)\s?\(?\d{3}\)\s??\d{3}-\d{2}-\d{2}$/;

        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        } else if (!emailRegex.test(this.order.email)) {
            errors.email = 'Некорректный email';
        }

        if (!this.order.phone) {
            errors.phone = 'Необходимо указать номер телефона';
        } else if (!phoneRegex.test(this.order.phone)) {
            errors.phone = 'Введите номер телефона в формате +7 (495) 123-45-67';
        }

        this.formErrors = errors;
        this.events.emit('contactFormErrors:change', this.formErrors);
        // Если ошибок нет, возвращаем true
        return Object.keys(errors).length === 0;
    }

    // Установка значения для формы контактов
    setContact(field: keyof IContactData, value: string) {
        if (field === 'payment') {
            this.setPaymentMethod(value as PaymentMethod)
        } else {
        this.order[field] = value;
        }
        if (this.validateContact()) {
            this.events.emit('contact:ready', this.order);
        }
    }

    // Очистка данных заказа
    clearOrder() {
        this.order = {
            email: '',
            phone: '',
            address: '',
            payment: null,
        };
    }
}