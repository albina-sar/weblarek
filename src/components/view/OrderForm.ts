// src/components/view/OrderForm.ts
import { Form } from './Form';
import { TPayment } from '../../types';

/**
 * Форма оформления заказа (первый шаг)
 */
export class OrderForm extends Form<{ address: string; payment: TPayment }> {
    private _paymentButtons: NodeListOf<HTMLButtonElement>;
    private _addressInput: HTMLInputElement;
    private _selectedPayment: TPayment | null = null;

    constructor(container: HTMLFormElement, onSubmit: (data: { address: string; payment: TPayment }) => void) {
        super(container);
        this._paymentButtons = container.querySelectorAll('.order__buttons button');
        this._addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;
        this._onSubmit = onSubmit;
        
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const payment = button.name as TPayment;
                this._selectedPayment = payment;
                this.updatePaymentButtons(payment);
                this.checkValidity();
            });
        });
        
        if (this._addressInput) {
            this._addressInput.addEventListener('input', () => {
                this.checkValidity();
            });
        }
    }

    private updatePaymentButtons(selected: TPayment) {
        this._paymentButtons.forEach(button => {
            if (button.name === selected) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }

    private checkValidity() {
        const isValid = this._selectedPayment !== null && this._addressInput && this._addressInput.value.trim() !== '';
        this.valid = isValid;
    }

    protected onInputChange(field: keyof { address: string; payment: TPayment }, _value: string): void {
        if (field === 'address') {
            this.checkValidity();
        }
    }

    private _onSubmit: (data: { address: string; payment: TPayment }) => void;

    protected onSubmit(): void {
        if (this._selectedPayment && this._addressInput && this._addressInput.value.trim()) {
            this._onSubmit({
                address: this._addressInput.value,
                payment: this._selectedPayment
            });
        }
    }

    set address(value: string) {
        if (this._addressInput) this._addressInput.value = value;
    }

    set payment(value: TPayment) {
        this._selectedPayment = value;
        this.updatePaymentButtons(value);
        this.checkValidity();
    }
}