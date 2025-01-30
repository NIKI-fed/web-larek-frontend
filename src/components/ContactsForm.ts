import { Form } from "./common/Form";
import { IOrder } from "../types";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

export class ContactsForm extends Form<IOrder> {
        protected _email: HTMLInputElement; // Поле ввода адреса
        protected _phone: HTMLInputElement; // Поле ввода адреса

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._email = ensureElement<HTMLInputElement>('.form__input[name=email]', container);
        this._phone = ensureElement<HTMLInputElement>('.form__input[name=phone]', container);
    };

    // Устанавливаем email
    set email(value: string) {
        this._email.value = value;
    }

    // Устанавливаем телефон
    set phone(value: string) {
        this._phone.value = value;
    }
}