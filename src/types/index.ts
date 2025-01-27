
// Интерфейс для описания товара
export interface IGoods {
    id: string;
    description?: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// Интерфейс для описания корзины
export interface IBasket {
    goods: string[]; // товары в корзине по id
    total_cost: number; // стоимость товаров в корзине
}

// Интерфейс для описания способа оплаты
export interface IPaymentMethod {
    payment: string;
}

// Интерфейс для описания контактных данных покупателя
export interface IContactData {
    adress: string;
    email: string;
    phone: string;
}

// Интерфейс для описания успешного оформления заказа
export interface ISuccess {
    total: number; // списанная сумма
}

// Тип оплаты
export type PaymentMethod = 'card | cash'


