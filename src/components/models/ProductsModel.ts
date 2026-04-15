// src/components/models/ProductsModel.ts
import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

/**
 * Модель для хранения каталога товаров
 * Отвечает за хранение и управление данными о товарах в каталоге
 */
export class ProductsModel {
    private items: IProduct[] = [];
    private selectedProduct: IProduct | null = null;
    private events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit('products:changed', { products: this.items });
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getProductById(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
        this.events.emit('selectedProduct:changed', { product: this.selectedProduct });
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}