// src/components/view/Success.ts
import { Component } from '../base/Component';

/**
 * Компонент успешного оформления заказа
 */
export class Success extends Component<{ total: number }> {
    private _description: HTMLElement;
    private _closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, onClose: () => void) {
        super(container);
        this._description = container.querySelector('.order-success__description') as HTMLElement;
        this._closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;
        
        if (this._closeButton) {
            this._closeButton.addEventListener('click', onClose);
        }
    }

    set total(value: number) {
        if (this._description) {
            this._description.textContent = `Списано ${value} синапсов`;
        }
    }
}