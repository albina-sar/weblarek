// src/components/models/BuyerModel.ts
import { IBuyer, TPayment } from '../../types';

/**
 * Модель для хранения данных покупателя
 * Отвечает за хранение и валидацию данных пользователя при оформлении заказа
 */
export class BuyerModel {
    // Приватные поля для хранения данных
    private _payment: TPayment | null = null;
    private _email: string = '';
    private _phone: string = '';
    private _address: string = '';

    /**
     * Сохраняет способ оплаты
     * @param payment - способ оплаты ('card' или 'cash')
     */
    setPayment(payment: TPayment): void {
        this._payment = payment;
    }

    /**
     * Сохраняет email
     * @param email - email пользователя
     */
    setEmail(email: string): void {
        this._email = email;
    }

    /**
     * Сохраняет телефон
     * @param phone - номер телефона
     */
    setPhone(phone: string): void {
        this._phone = phone;
    }

    /**
     * Сохраняет адрес
     * @param address - адрес доставки
     */
    setAddress(address: string): void {
        this._address = address;
    }

    /**
     * Сохраняет все данные покупателя
     * @param data - частичные данные покупателя
     */
    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this._payment = data.payment;
        if (data.email !== undefined) this._email = data.email;
        if (data.phone !== undefined) this._phone = data.phone;
        if (data.address !== undefined) this._address = data.address;
    }

    /**
     * Возвращает все данные покупателя
     * @returns объект с данными покупателя
     */
    getData(): IBuyer {
        return {
            payment: this._payment as TPayment,
            email: this._email,
            phone: this._phone,
            address: this._address
        };
    }

    /**
     * Очищает все данные покупателя
     */
    clear(): void {
        this._payment = null;
        this._email = '';
        this._phone = '';
        this._address = '';
    }

    /**
     * Проверяет валидность данных покупателя
     * @returns объект с ошибками валидации
     */
    validate(): Partial<Record<keyof IBuyer, string>> {
        const errors: Partial<Record<keyof IBuyer, string>> = {};

        if (!this._payment) {
            errors.payment = 'Не выбран способ оплаты';
        }

        if (!this._address.trim()) {
            errors.address = 'Укажите адрес доставки';
        }

        if (!this._email.trim()) {
            errors.email = 'Укажите email';
        } else if (!this._email.includes('@')) {
            errors.email = 'Некорректный email';
        }

        if (!this._phone.trim()) {
            errors.phone = 'Укажите телефон';
        }

        return errors;
    }

    /**
     * Проверяет валидность полей для первого шага оформления
     * @returns true, если поля первого шага валидны
     */
    validateFirstStep(): boolean {
        return !!(this._payment && this._address.trim());
    }

    /**
     * Проверяет валидность полей для второго шага оформления
     * @returns true, если поля второго шага валидны
     */
    validateSecondStep(): boolean {
        return !!(this._email.trim() && this._phone.trim());
    }

    /**
     * Возвращает способ оплаты
     * @returns способ оплаты или null
     */
    getPayment(): TPayment | null {
        return this._payment;
    }

    /**
     * Возвращает email
     * @returns email
     */
    getEmail(): string {
        return this._email;
    }

    /**
     * Возвращает телефон
     * @returns телефон
     */
    getPhone(): string {
        return this._phone;
    }

    /**
     * Возвращает адрес
     * @returns адрес
     */
    getAddress(): string {
        return this._address;
    }
}