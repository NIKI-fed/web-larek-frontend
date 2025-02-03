export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
    addressRegex: /^[a-zA-Zа-яА-ЯёЁ0-9.,\-/\s]{5,}$/,
    emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phoneRegex: /^(\+7)\s?\(?\d{3}\)\s??\d{3}-\d{2}-\d{2}$/,
    priceless: 'b06cde61-912f-4663-9751-09956c0eed67',
};
