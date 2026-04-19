import { IApi } from "../types";
import { IOrder, IOrderResult, IProductsResponse } from "../types";

/**
 * Класс для работы с API сервера Веб-Ларёк
 * Отвечает за получение данных с сервера и отправку заказов
 */
export class WebLarekApi {
  constructor(private api: IApi) {}

  /**
   * Получает список всех товаров с сервера
   * @returns промис с объектом, содержащим массив товаров
   */
  getProducts(): Promise<IProductsResponse> {
    return this.api.get("/product");
  }

  /**
   * Отправляет заказ на сервер
   * @param order - данные заказа
   * @returns промис с результатом оформления заказа
   */
  postOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post("/order", order);
  }
}
