import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";
import { CDN_URL } from '../utils/constants';
import { IGoods } from "../types";

export class Card {
    protected itemElement: HTMLElement;
    protected category: HTMLElement;
    protected title: HTMLElement;
    protected img: HTMLImageElement;
    protected price: HTMLElement;

    constructor (template: HTMLTemplateElement) {
        this.itemElement = template.content.querySelector('.gallery__item').cloneNode(true)as HTMLElement;
        
        this.category = this.itemElement.querySelector('.card__category');
        this.title = this.itemElement.querySelector('.card__title');
        this.img = this.itemElement.querySelector('.card__image');
        this.price = this.itemElement.querySelector('.card__price');
    }

    render(cards: IGoods) {
        this.title.textContent = cards.title;
        this.img.src = CDN_URL + cards.image;
        this.img.alt = cards.title;

        // Устанвливаем категорию
        this.category.textContent = cards.category;
        if (cards.category === 'софт-скилл') {
            this.category.classList.add('card__category_soft')
        } else if (cards.category === 'другое') {
            this.category.classList.add('card__category_other')
        } else if (cards.category === 'дополнительное') {
            this.category.classList.add('card__category_additional')
        } else if (cards.category === 'кнопка') {
            this.category.classList.add('card__category_button')
        } else if (cards.category === 'хард-скил') {
            this.category.classList.add('card__category_hard')
        }

        //Устанавливаем цену
        if (cards.price) {
            this.price.textContent = cards.price + ' синапсов';
        } else {
            this.price.textContent = 'Бесценно';
        }

        return this.itemElement;
    }
}