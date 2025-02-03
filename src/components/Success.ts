import { Component } from "./base/Component"; 
import { ensureElement } from "../utils/utils";
import { ISuccess } from "../types";

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected _close: HTMLButtonElement; // кнопка закрытия окна
    protected _total: HTMLElement; // элемент для поля вывода списанной суммы

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._close = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

        // Если обработчик привязан, вызываем его при клике на кнопку закрытия
        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    // Устанавливаем списанную сумму
    set total(value: number) {
        this.setText(this._total, `Списано ${value} синапсов`);
    }
}