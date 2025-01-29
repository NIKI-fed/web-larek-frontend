import { Component } from "../base/Component";
import { createElement, ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";

interface IBasketView {
    items: HTMLElement[]; // список товаров в корзине
    total: number; // общая стоимость
    selected: string[]; //список id товаров
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container); // список товаров
        this._total = this.container.querySelector('.basket__price'); // общая стоимость
        this._button = this.container.querySelector('.basket__button'); // кнопка "оформить"

        // если есть кнопка, то добаляем событие "клик" и инициируем событие
        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = [];
    }

    // сеттер для обнолвения списка товаров в корзине
    set items(items: HTMLElement[]) {

        // Если корзина не пуста...
        if (items.length) {
            this._list.replaceChildren(...items);
            // делаем кнопку активной
            this.toggleButton(true);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            // делаем кнопку неактивной
            this.toggleButton(false);
        }
    }

    // сеттер для обновления общей стоимости товаров в корзине
    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }

    // метод переключения состояния кнопки "оформить" активна/неактивна
    toggleButton(state: boolean) {
        this.setDisabled(this._button, !state)
    }

}



