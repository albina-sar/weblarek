// src/components/view/BaseCard.ts
import { Component } from '../base/Component';
import { IProduct } from '../../types';

/**
 * Базовый класс для всех карточек товара
 */
export abstract class BaseCard extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _category?: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        this._title = container.querySelector('.card__title') as HTMLElement;
        this._price = container.querySelector('.card__price') as HTMLElement;
        this._category = container.querySelector('.card__category') as HTMLElement;
        this._image = container.querySelector('.card__image') as HTMLImageElement;
        this._description = container.querySelector('.card__text') as HTMLElement;
        this._button = container.querySelector('.card__button') as HTMLButtonElement;
    }

    set title(value: string) {
        if (this._title) this._title.textContent = value;
    }

    set price(value: number | null) {
        if (this._price) {
            if (value === null) {
                this._price.textContent = 'Недоступно';
            } else {
                this._price.textContent = `${value} синапсов`;
            }
        }
    }

    set category(value: string) {
        if (this._category) {
            this._category.textContent = value;
            const categoryClass = this.getCategoryClass(value);
            this._category.className = `card__category ${categoryClass}`;
        }
    }

    set image(value: string) {
        if (this._image && value) {
            this._image.src = value;
            this._image.alt = this._title?.textContent || 'Товар';
        }
    }

    set description(value: string) {
        if (this._description) this._description.textContent = value;
    }

    set buttonText(value: string) {
        if (this._button) this._button.textContent = value;
    }

    set disabled(value: boolean) {
        if (this._button) {
            if (value) {
                this._button.setAttribute('disabled', 'disabled');
            } else {
                this._button.removeAttribute('disabled');
            }
        }
    }

    private getCategoryClass(category: string): string {
        const categoryMap: Record<string, string> = {
            'софт-скил': 'card__category_soft',
            'хард-скил': 'card__category_hard',
            'кнопка': 'card__category_button',
            'дополнительное': 'card__category_additional',
            'другое': 'card__category_other'
        };
        return categoryMap[category] || 'card__category_other';
    }

    abstract set buttonHandler(handler: () => void);
}