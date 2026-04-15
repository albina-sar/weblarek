// src/components/view/Form.ts
import { Component } from '../base/Component';

/**
 * Базовый класс для всех форм
 */
export abstract class Form<T> extends Component<T> {
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLFormElement) {
        super(container);
        this._submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
        this._errors = container.querySelector('.form__errors') as HTMLElement;
        
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });
        
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.onSubmit();
        });
    }

    protected abstract onInputChange(field: keyof T, value: string): void;
    protected abstract onSubmit(): void;

    set valid(value: boolean) {
        if (this._submitButton) {
            if (value) {
                this._submitButton.removeAttribute('disabled');
            } else {
                this._submitButton.setAttribute('disabled', 'disabled');
            }
        }
    }

    set errors(value: string) {
        if (this._errors) this._errors.textContent = value;
    }

    render(data: Partial<T>): HTMLElement {
        Object.assign(this, data);
        return this.container;
    }
}