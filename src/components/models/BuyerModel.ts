import { IBuyer, TPayment, TValidationErrors } from '../../types';

/**
 * Модель для хранения данных покупателя
 * Отвечает за хранение и валидацию данных пользователя при оформлении заказа
 */
export class BuyerModel {
    // Приватные поля для хранения данных
    private payment: TPayment | null = null;
    private email: string = '';
    private phone: string = '';
    private address: string = '';

    /**
     * Сохраняет данные покупателя
     * @param data - частичные данные покупателя
     */
    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.address !== undefined) this.address = data.address;
    }

    /**
     * Возвращает все данные покупателя
     * @returns объект с данными покупателя
     */
    getData(): IBuyer {
        return {
            payment: this.payment as TPayment,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }

    /**
     * Очищает все данные покупателя
     */
    clear(): void {
        this.payment = null;
        this.email = '';
        this.phone = '';
        this.address = '';
    }

    /**
     * Проверяет валидность данных покупателя
     * @returns объект с ошибками валидации
     */
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