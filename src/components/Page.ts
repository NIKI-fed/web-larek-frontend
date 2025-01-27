import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

// Интерфейс для данных на странице:
// 1. Количество товаров в корзине
// 2. Каталог товаров
// 3. Блокировка прокрутки страницы

interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;


    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = ensureElement<HTMLElement>('.header__basket-counter'); // счётчик товаров в корзине
        this._catalog = ensureElement<HTMLElement>('.gallery'); // каталог товаров на странице
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper'); // Header и main на странице
        this._basket = ensureElement<HTMLElement>('.header__basket'); // кнопка корзины на странице

        // Добавляем обработчик клика на корзину
        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }
// Устанавливаем количество товара в корзине
    set counter(value: number) {
        this.setText(this._counter, String(value));
    }
// Обновляем каталог товаров на странице
    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }
// Блокировка страницы
    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}