import { IProduct } from '../../types';

/**
 * Модель для хранения корзины покупок
 * Отвечает за хранение и управление товарами, добавленными в корзину
 */
export class BasketModel {
    // Массив товаров в корзине
    private items: IProduct[] = [];

    /**
     * Возвращает массив товаров в корзине
     * @returns массив товаров
     */
    getItems(): IProduct[] {
        return this.items;
    }

    /**
     * Добавляет товар в корзину
     * @param product - товар для добавления
     */
    addItem(product: IProduct): void {
        // Проверяем, что товар с таким id еще не добавлен
        if (!this.isInBasket(product.id)) {
            this.items.push(product);
        }
    }

    /**
     * Удаляет товар из корзины по id
     * @param productId - идентификатор товара для удаления
     */
    removeItem(productId: string): void {
        this.items = this.items.filter(item => item.id !== productId);
    }

    /**
     * Очищает корзину полностью
     */
    clear(): void {
        this.items = [];
    }

    /**
     * Возвращает общую стоимость всех товаров в корзине
     * @returns общая сумма
     */
    getTotalPrice(): number {
        return this.items.reduce((sum, item) => {
            // Если цена товара null, считаем как 0
            return sum + (item.price || 0);
        }, 0);
    }

    /**
     * Возвращает количество товаров в корзине
     * @returns количество товаров
     */
    getItemCount(): number {
        return this.items.length;
    }

    /**
     * Проверяет наличие товара в корзине по id
     * @param productId - идентификатор товара
     * @returns true, если товар есть в корзине
     */
    isInBasket(productId: string): boolean {
        return this.items.some(item => item.id === productId);
    }
}