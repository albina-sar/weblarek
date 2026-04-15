// src/components/view/Modal.ts
import { Component } from '../base/Component';

/**
 * Модальное окно
 */
export class Modal extends Component<{ content: HTMLElement }> {
    private _closeButton: HTMLButtonElement;
    private _content: HTMLElement;
    private onClose?: () => void;

    constructor(container: HTMLElement, onClose?: () => void) {
        super(container);
        this.onClose = onClose;
        this._closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
        this._content = container.querySelector('.modal__content') as HTMLElement;
        
        if (this._closeButton) {
            this._closeButton.addEventListener('click', () => this.close());
        }
        
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) this.close();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.close();
        });
    }

    set content(value: HTMLElement) {
        if (this._content) {
            this._content.innerHTML = '';
            this._content.appendChild(value);
        }
    }

    open() {
        this.container.classList.add('modal_active');
        document.body.classList.add('modal-open');
    }

    close() {
        this.container.classList.remove('modal_active');
        document.body.classList.remove('modal-open');
        if (this._content) this._content.innerHTML = '';
        if (this.onClose) this.onClose();
    }

    get isOpen(): boolean {
        return this.container.classList.contains('modal_active');
    }

    render(data: { content: HTMLElement }): HTMLElement {
        this.content = data.content;
        this.open();
        return this.container;
    }
}