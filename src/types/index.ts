
// Интерфейс для описания товара
export interface IGoods {
    id: string;
    description?: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    buttonText?: string;
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
    address: string;
    email: string;
    phone: string;
}

// Интерфейс для описания заказа
export interface IOrder {
    payment: PaymentMethod;
    address: string;
    email: string;
    phone: string;
    goods?: string[];
    total_cost?: number;
}

// Интерфейс для описания успешного оформления заказа
export interface ISuccess {
    total: number; // списанная сумма
}

// Тип оплаты
export type PaymentMethod = 'card' | 'cash' | null


export type FormErrors = Partial<Record<keyof IOrder, string>>;

