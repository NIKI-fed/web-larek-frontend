import {Component} from "../base/Component";
import {IEvents} from "../base/events";
import {ensureElement} from "../../utils/utils";

interface IFormState {
    valid: boolean, // Является ли форма валидной
    errors: string[] // Массив ошибок
}

export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
        
        // Добавляем слушатель для отслеживания изменений в форме
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement; // Элемент, вызвавший событие
            const field = target.name as keyof T; // Имя поля, в котором произошло событие
            const value = target.value; // Значение поля
            this.onInputChange(field, value); // Вызываем метод для обработки изменений в форме
        });

        // Добавляем слушатель для отслеживания отправки формы
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault(); // Отключаем стандартное поведение
            this.events.emit(`${this.container.name}:submit`); // Инициируем событие с данными
        });
    }

    // Метод для обработки изменений в форме
    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    // Сеттер для установки валидности формы true/false
    set valid(value: boolean) {
        // Если форма валидна, кнопка отправки активна
        this._submit.disabled = !value;
    }

    // Сеттер для отображения ошибок
    set errors(value: string) {
        this.setText(this._errors, value);
    }

    render(state: Partial<T> & IFormState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;
    }
}