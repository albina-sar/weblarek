// src/components/view/Basket.ts
import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { BasketCard } from './BasketCard';

/**
 * Компонент корзины
 */
export class Basket extends Component<{ items: IProduct[]; total: number }> {
    private _list: HTMLElement;
    private _total: HTMLElement;
    private _button: HTMLButtonElement;
    private onItemDelete?: (productId: string) => void;
    private onOrder?: () => void;

    constructor(container: HTMLElement, onItemDelete?: (productId: string) => void, onOrder?: () => void) {
        super(container);
        this._list = container.querySelector('.basket__list') as HTMLElement;
        this._total = container.querySelector('.basket__price') as HTMLElement;
        this._button = container.querySelector('.basket__button') as HTMLButtonElement;
        this.onItemDelete = onItemDelete;
        this.onOrder = onOrder;
        
        if (this._button && this.onOrder) {
            this._button.addEventListener('click', this.onOrder);
        }
    }

    set items(items: IProduct[]) {
        if (this._list) {
            this._list.innerHTML = '';
            items.forEach((item, index) => {
                const cardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
                const cardElement = cloneTemplate(cardTemplate);
                const card = new BasketCard(cardElement, () => {
                    if (this.onItemDelete) this.onItemDelete(item.id);
                });
                card.index = index + 1;
                card.title = item.title;
                card.price = item.price;
                this._list.appendChild(card.render());
            });
        }
    }

    set total(value: number) {
        if (this._total) this._total.textContent = `${value} синапсов`;
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

    render(data: { items: IProduct[]; total: number }): HTMLElement {
        this.items = data.items;
        this.total = data.total;
        this.disabled = data.items.length === 0;
        return this.container;
    }
}