// src/components/view/CatalogCard.ts
import { BaseCard } from './BaseCard';

/**
 * Карточка товара для каталога
 */
export class CatalogCard extends BaseCard {
    constructor(container: HTMLElement, onClick?: (event: MouseEvent) => void) {
        super(container);
        if (onClick) {
            this.container.addEventListener('click', onClick);
        }
    }

    set buttonHandler(handler: () => void) {
        if (this._button) {
            this._button.addEventListener('click', (e) => {
                e.stopPropagation();
                handler();
            });
        }
    }
}