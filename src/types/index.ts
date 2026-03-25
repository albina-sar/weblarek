// src/types/index.ts
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Интерфейс товара
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// Интерфейс покупателя
export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

// Тип способа оплаты
export type TPayment = 'card' | 'cash';

// Интерфейс заказа для отправки на сервер
export interface IOrder {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

// Интерфейс ответа сервера при оформлении заказа
export interface IOrderResult {
    id: string;
    total: number;
}

// Интерфейс ответа сервера при получении товаров
export interface IProductsResponse {
    total: number;
    items: IProduct[];
}