import { Form } from "./common/Form";
import { IOrder, PaymentMethod } from "../types";
import { EventEmitter, IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

export class PaymentAddress extends Form<IOrder> {
    protected _buttonPaymentCard: HTMLButtonElement; // Кнопка выбора оплаты картой
    protected _buttonPaymentCash: HTMLButtonElement; // Кнопка выбора наличной оплаты
    protected _address: HTMLInputElement; // Поле ввода адреса

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._buttonPaymentCard = ensureElement<HTMLButtonElement>('button[name=card]', container);
        this._buttonPaymentCash = ensureElement<HTMLButtonElement>('button[name=cash]', container);
        this._address = ensureElement<HTMLInputElement>('.form__input[name=address]', container);

        // Добавляем обработчики клика на кнопки оплаты для переключения класса и вызываем событие изменения данных
        this._buttonPaymentCard.addEventListener('click', () => {
            this.payment = 'card';
            this.onInputChange('payment', 'card');
        });

        this._buttonPaymentCash.addEventListener('click', () => {
            this.payment = 'cash';
            this.onInputChange('payment', 'card');
        });
    };

    // Устанавливаем способ оплаты
    set payment(value: PaymentMethod) {
        // Переключаем класс для кнопки
        this.toggleClass(this._buttonPaymentCard, 'button_alt-active', value === 'card');
        this.toggleClass(this._buttonPaymentCash, 'button_alt-active', value === 'cash');
    }

    // Устанавливаем адрес
    set address(value: string) {
        this._address.value = value;
    }
}