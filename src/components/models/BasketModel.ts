// src/components/models/BasketModel.ts
import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

/**
 * Модель для хранения корзины покупок
 * Отвечает за хранение и управление товарами, добавленными в корзину
 */
export class BasketModel {
    private items: IProduct[] = [];
    private events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(product: IProduct): void {
        if (!this.isInBasket(product.id) && product.price !== null) {
            this.items.push(product);
            this.emitChange();
        }
    }

    removeItem(productId: string): void {
        this.items = this.items.filter(item => item.id !== productId);
        this.emitChange();
    }

    clear(): void {
        this.items = [];
        this.emitChange();
    }

    getTotalPrice(): number {
        return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    getItemCount(): number {
        return this.items.length;
    }

    isInBasket(productId: string): boolean {
        return this.items.some(item => item.id === productId);
    }

    private emitChange(): void {
        this.events.emit('basket:changed', {
            items: this.items,
            total: this.getTotalPrice(),
            count: this.getItemCount()
        });
    }
}