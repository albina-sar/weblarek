export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
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

// Интерфейс покупателя (исправлен: payment может быть null)
export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

// Тип способа оплаты
export type TPayment = "card" | "cash";

// Тип для ошибок валидации
export type TValidationErrors = Partial<Record<keyof IBuyer, string>>;

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

// Тип для базовой карточки (общие поля для всех карточек)
export type TBaseCard = Pick<
  IProduct,
  "title" | "price" | "category" | "image" | "description"
>;
