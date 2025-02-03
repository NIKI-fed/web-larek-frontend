import { Component } from './base/Component';
import { IGoods } from "../types";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IGoods> {
    protected _title: HTMLElement;
    protected _category?: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _index?: HTMLElement;

    constructor (container: HTMLElement, actions?: ICardActions) {
        super(container)

        this._title = container.querySelector('.card__title');
        this._category = container.querySelector('.card__category');
        this._image = container.querySelector('.card__image');
        this._description = container.querySelector('.card__description');
        this._price = container.querySelector('.card__price');
        this._button = container.querySelector('.card__button');
        this._index = container.querySelector('.basket__item-index');

        // Привязываем обработчик к кнопке, если он подключен
        if (actions?.onClick) {
            // Если кнопка есть, привязываем обработчик к ней
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            // Если кнопки нет, обработчик привязываем к контейнеру
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    // Сеттер и геттер для id товара
    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    // Сеттер и геттер для названия товара
    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set index(value: string) {
        this._index.textContent = value;
    }

    // Сеттер и геттер для категориия товара
    // с учётом разных цветов плашек
    set category(value: string) {
        this.setText(this._category, value);

        // Устанвливаем цвет плашки категории, если она присутствует в разметке
        if(this._category) {
            if (this._category.textContent === 'софт-скил') {
                this._category.classList.add('card__category_soft')
            } else if (this._category.textContent === 'другое') {
                this._category.classList.add('card__category_other')
            } else if (this._category.textContent === 'дополнительное') {
                this._category.classList.add('card__category_additional')
            } else if (this._category.textContent === 'кнопка') {
                this._category.classList.add('card__category_button')
            } else if (this._category.textContent === 'хард-скил') {
                this._category.classList.add('card__category_hard')
            }
        }
    }

    get category(): string {
        return this._category.textContent || '';
    }

    // Сеттер для картинки товара
    set image(src: string) {
        this.setImage(this._image, src, this.title)
    }

    // Сеттер для описания товара
    set description(value: string) {
        this.setText(this._description, value);
    }

    // Сеттер и геттер для цены товара
    set price(value: number | null) {
        if (value) {
            this.setText(this._price, `${value} синапсов`);
            } else {
            this.setText(this._price, 'Бесценно');
        }
    }

    // Установливаем надпись на кнопке
    button(value: boolean) {
        if (value) {
            this.setText(this._button, 'Удалить из корзины');
            } else {
            this.setText(this._button, 'Добавить в корзину');
        }
    }
}