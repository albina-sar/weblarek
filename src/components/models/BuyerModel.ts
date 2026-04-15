// src/components/models/BuyerModel.ts
import { IBuyer, TPayment, TValidationErrors } from '../../types';
import { EventEmitter } from '../base/Events';

/**
 * Модель для хранения данных покупателя
 * Отвечает за хранение и валидацию данных пользователя при оформлении заказа
 */
export class BuyerModel {
    private payment: TPayment | null = null;
    private email: string = '';
    private phone: string = '';
    private address: string = '';
    private events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.address !== undefined) this.address = data.address;
        this.events.emit('buyer:changed', { buyer: this.getData() });
    }

    getData(): IBuyer {
        return {
            payment: this.payment as TPayment,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }

    clear(): void {
        this.payment = null;
        this.email = '';
        this.phone = '';
        this.address = '';
        this.events.emit('buyer:changed', { buyer: this.getData() });
    }

    validate(): TValidationErrors {
        const errors: TValidationErrors = {};

        if (!this.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }

        if (!this.address.trim()) {
            errors.address = 'Укажите адрес доставки';
        }

        if (!this.email.trim()) {
            errors.email = 'Укажите email';
        }

        if (!this.phone.trim()) {
            errors.phone = 'Укажите телефон';
        }

        return errors;
    }
}