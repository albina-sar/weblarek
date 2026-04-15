// src/components/view/Page.ts
import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { CatalogCard } from './CatalogCard';
import { cloneTemplate } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';

/**
 * Компонент главной страницы
 */
export class Page extends Component<{ products: IProduct[]; counter: number }> {
    private _gallery: HTMLElement;
    private _counter: HTMLElement;
    private _basketButton: HTMLButtonElement;
    private onProductSelect?: (id: string) => void;
    private onProductAdd?: (product: IProduct) => void;
    private onBasketOpen?: () => void;

    constructor(
        container: HTMLElement,
        onProductSelect?: (id: string) => void,
        onProductAdd?: (product: IProduct) => void,
        onBasketOpen?: () => void
    ) {
        super(container);
        this._gallery = container.querySelector('.gallery') as HTMLElement;
        this._counter = container.querySelector('.header__basket-counter') as HTMLElement;
        this._basketButton = container.querySelector('.header__basket') as HTMLButtonElement;
        this.onProductSelect = onProductSelect;
        this.onProductAdd = onProductAdd;
        this.onBasketOpen = onBasketOpen;
        
        if (this._basketButton && this.onBasketOpen) {
            this._basketButton.addEventListener('click', this.onBasketOpen);
        }
    }

    set products(products: IProduct[]) {
        if (this._gallery) {
            this._gallery.innerHTML = '';
            products.forEach(product => {
                const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
                const cardElement = cloneTemplate(cardTemplate);
                const card = new CatalogCard(cardElement, () => {
                    if (this.onProductSelect) this.onProductSelect(product.id);
                });
                card.title = product.title;
                card.category = product.category;
                card.image = CDN_URL + product.image;
                card.price = product.price;
                card.disabled = product.price === null;
                
                if (product.price !== null && this.onProductAdd) {
                    card.buttonHandler = () => {
                        if (this.onProductAdd) this.onProductAdd(product);
                    };
                } else if (product.price === null) {
                    card.buttonText = 'Недоступно';
                }
                
                this._gallery.appendChild(card.render());
            });
        }
    }

    set counter(value: number) {
        if (this._counter) this._counter.textContent = String(value);
    }

    render(data: { products: IProduct[]; counter: number }): HTMLElement {
        this.products = data.products;
        this.counter = data.counter;
        return this.container;
    }
}