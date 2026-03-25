// src/components/WebLarekApi.ts
import { Api } from './base/Api';
import { IOrder, IOrderResult, IProductsResponse } from '../types';

/**
 * Класс для работы с API сервера Веб-Ларёк
 * Отвечает за получение данных с сервера и отправку заказов
 */
export class WebLarekApi extends Api {
    /**
     * Создает экземпляр класса для работы с API
     * @param baseUrl - базовый URL API
     * @param options - опциональные настройки запросов
     */
    constructor(baseUrl: string, options: RequestInit = {}) {
        super(baseUrl, options);
    }

    /**
     * Получает список всех товаров с сервера
     * @returns промис с объектом, содержащим массив товаров
     */
    getProducts(): Promise<IProductsResponse> {
        return this.get('/product');
    }

    /**
     * Отправляет заказ на сервер
     * @param order - данные заказа
     * @returns промис с результатом оформления заказа
     */
    postOrder(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order);
    }
}