// Хорошая практика даже простые типы выносить в алиасы
// Зато когда захотите поменять это достаточно сделать в одном месте
type EventName = string | RegExp; // имя события - строка либо регулярное выражение
type Subscriber = Function; // функция-обработчик события
type EmitterEvent = { //объект, который содержит имя события и данные, передаваемые вместе с событием.
    eventName: string,
    data: unknown
};

/**
 * Интерфейс определяет методы, которые должны реализовываться любым объектом,
 * поддерживающим работу с событиями
 */ 
export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

/**
 * Класс EventEmitter реализует паттерн "Наблюдатель" (Observer Pattern).
 * Этот паттерн позволяет объектам (наблюдателям) подписываться на события других объектов, инициировать эти события и удалять подписки.
 * Брокер событий, классическая реализация
 * В расширенных вариантах есть возможность подписаться на все события
 * или слушать события по шаблону например
 */
export class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }

    /**
     * Установить обработчик на событие
     * Если для данного имени события еще нет подписчиков,
     * создается новое множество подписчиков.
     * Затем обработчик добавляется в это множество.
     */
    on<T extends object>(eventName: EventName, callback: (event: T) => void) {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        this._events.get(eventName)?.add(callback);
    }

    /**
     * Снять обработчик с события
     * Если после удаления обработчиков список становится пустым,
     * то само событие удаляется из карты событий.
     */
    off(eventName: EventName, callback: Subscriber) {
        if (this._events.has(eventName)) {
            this._events.get(eventName)!.delete(callback);
            if (this._events.get(eventName)?.size === 0) {
                this._events.delete(eventName);
            }
        }
    }

    /**
     * Инициировать событие с данными
     * Инициирует событие и вызывает всех подписчиков этого события.
     * Если имя события совпадает со звездочкой '*', то вызов происходит
     * для всех подписчиков. Также поддерживается сопоставление имен событий
     * с помощью регулярных выражений.
     */
    emit<T extends object>(eventName: string, data?: T) {
        this._events.forEach((subscribers, name) => {
            if (name === '*') subscribers.forEach(callback => callback({
                eventName,
                data
            }));
            if (name instanceof RegExp && name.test(eventName) || name === eventName) {
                subscribers.forEach(callback => callback(data));
            }
        });
    }

    /**
     * Подписаться на все события
     */
    onAll(callback: (event: EmitterEvent) => void) {
        this.on("*", callback);
    }

    /**
     * Сбросить все активные подписки на события
     * Все обработчики будут удалены
     */
    offAll() {
        this._events = new Map<string, Set<Subscriber>>();
    }

    /**
     * Сделать коллбек триггер, генерирующий событие при вызове
     */
    trigger<T extends object>(eventName: string, context?: Partial<T>) {
        return (event: object = {}) => {
            this.emit(eventName, {
                ...(event || {}),
                ...(context || {})
            });
        };
    }
}

