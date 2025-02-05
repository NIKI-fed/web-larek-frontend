export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
    addressRegex: /^[a-zA-Zа-яА-ЯёЁ0-9.,\-/\s]{5,}$/,
    emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phoneRegex: /^\+7?\(?\d{3}\)??\d{3}\d{2}\d{2}$/,
};

export const categories = new Map ([
    ['софт-скил', 'soft'],
    ['другое', 'other'],
    ['дополнительное', 'additional'],
    ['кнопка', 'button'],
    ['хард-скил', 'hard']
]);

export const validError = {
    setPayment: 'Выберите способ оплаты',
    setAddress: 'Необходимо указать адрес доставки',
    checkAddress: 'Некорректный адрес',
    setEmail: 'Необходимо указать email',
    checkEmail: 'Некорректный email',
    setPhone: 'Необходимо указать номер телефона',
    checkPhone: 'Введите номер телефона в формате +79993335577'
};
