// src/components/view/ContactsForm.ts
import { Form } from './Form';

/**
 * Форма контактов (второй шаг)
 */
export class ContactsForm extends Form<{ email: string; phone: string }> {
    private _emailInput: HTMLInputElement;
    private _phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, onSubmit: (data: { email: string; phone: string }) => void) {
        super(container);
        this._emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
        this._phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;
        this._onSubmit = onSubmit;
        
        if (this._emailInput) {
            this._emailInput.addEventListener('input', () => this.checkValidity());
        }
        if (this._phoneInput) {
            this._phoneInput.addEventListener('input', () => this.checkValidity());
        }
    }

    private checkValidity() {
        const isValid = this._emailInput && this._emailInput.value.trim() !== '' && 
                        this._phoneInput && this._phoneInput.value.trim() !== '';
        this.valid = isValid;
    }

    protected onInputChange(_field: keyof { email: string; phone: string }, _value: string): void {
        this.checkValidity();
    }

    private _onSubmit: (data: { email: string; phone: string }) => void;

    protected onSubmit(): void {
        if (this._emailInput && this._phoneInput && 
            this._emailInput.value.trim() && this._phoneInput.value.trim()) {
            this._onSubmit({
                email: this._emailInput.value,
                phone: this._phoneInput.value
            });
        }
    }

    set email(value: string) {
        if (this._emailInput) this._emailInput.value = value;
    }

    set phone(value: string) {
        if (this._phoneInput) this._phoneInput.value = value;
    }
}