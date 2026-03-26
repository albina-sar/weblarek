import { IProduct } from '../../types';

/**
 * Модель для хранения каталога товаров
 * Отвечает за хранение и управление данными о товарах в каталоге
 */
export class ProductsModel {
    // Массив всех товаров в каталоге
    private items: IProduct[] = [];
    // Товар, выбранный для подробного просмотра
    private selectedProduct: IProduct | null = null;

    /**
     * Сохраняет массив товаров в модель
     * @param items - массив товаров для сохранения
     */
    setItems(items: IProduct[]): void {
        this.items = items;
    }

    /**
     * Возвращает массив всех товаров
     * @returns массив товаров
     */
    getItems(): IProduct[] {
        return this.items;
    }

    /**
     * Возвращает товар по его id
     * @param id - идентификатор товара
     * @returns найденный товар или undefined
     */
    getProductById(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    /**
     * Сохраняет товар для подробного отображения
     * @param product - выбранный товар
     */
    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
    }

    /**
     * Возвращает товар для подробного отображения
     * @returns выбранный товар или null
     */
    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}