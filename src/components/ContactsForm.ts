import { Form } from "./common/Form";
import { IContactData } from "../types";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

export class ContactsForm extends Form<IContactData> {
        protected _email: HTMLInputElement; // Поле ввода email
        protected _phone: HTMLInputElement; // Поле ввода телефона

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