import "./scss/styles.scss";
import { ProductsModel } from "./components/models/ProductsModel";
import { BasketModel } from "./components/models/BasketModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { WebLarekApi } from "./components/WebLarekApi";
import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { API_URL, CDN_URL } from "./utils/constants";
import { IProduct } from "./types";

// Компоненты представления
import { Modal } from "./components/view/Modal";
import { CardCatalog } from "./components/view/CardCatalog";
import { CardPreview } from "./components/view/CardPreview";
import { BasketCard } from "./components/view/BasketCard";
import { Basket } from "./components/Basket";
import { OrderForm } from "./components/view/OrderForm";
import { ContactsForm } from "./components/view/ContactsForm";
import { Success } from "./components/Success";
import { Page } from "./components/Page";

// Утилиты
import { cloneTemplate, ensureElement } from "./utils/utils";

// Создание экземпляров моделей данных
const events = new EventEmitter();
const productsModel = new ProductsModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

// API (композиция вместо наследования)
const baseApi = new Api(API_URL);
const api = new WebLarekApi(baseApi);

// Получение элементов DOM
const modalContainer = ensureElement<HTMLElement>("#modal-container");
const pageElement = ensureElement<HTMLElement>(".page__wrapper");

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

// Компоненты представления (создаются один раз)
const modal = new Modal(modalContainer, events);
const page = new Page(pageElement, events);
let basketComponent: Basket;
let previewCard: CardPreview;
let successComponent: Success;

// Создаем экземпляры форм один раз
const orderElement = cloneTemplate(orderTemplate);
const orderForm = new OrderForm(orderElement, events);

const contactsElement = cloneTemplate(contactsTemplate);
const contactsForm = new ContactsForm(contactsElement, events);

const successElement = cloneTemplate(successTemplate);
successComponent = new Success(successElement, events);

// Создаем экземпляр корзины один раз
const basketElement = cloneTemplate(basketTemplate);
basketComponent = new Basket(basketElement, events);

// Создаем экземпляр превью один раз с передачей events
const previewElement = cloneTemplate(cardPreviewTemplate);
previewCard = new CardPreview(previewElement, events);

// Функция для создания карточки каталога
function createCatalogCard(product: IProduct): HTMLElement {
  const cardElement = cloneTemplate(cardCatalogTemplate);
  const card = new CardCatalog(cardElement, {
    onClick: () => events.emit("card:select", product),
  });
  card.title = product.title;
  card.price = product.price;
  card.category = product.category;
  card.image = CDN_URL + product.image;
  return card.render();
}

// Функция для создания карточки корзины
function createBasketCard(product: IProduct, index: number): HTMLElement {
  const cardElement = cloneTemplate(cardBasketTemplate);
  const card = new BasketCard(cardElement, () =>
    events.emit("basket:remove", product),
  );
  card.title = product.title;
  card.price = product.price;
  card.index = index;
  return card.render();
}

// Функция обновления корзины
function updateBasketView() {
  const basketItems = basketModel.getItems();
  const total = basketModel.getTotalPrice();
  const itemsCount = basketModel.getItemCount();

  page.counter = itemsCount;

  const items = basketItems.map((item, index) =>
    createBasketCard(item, index + 1),
  );
  basketComponent.items = items;
  basketComponent.total = total;
  basketComponent.disabled = itemsCount === 0;
}

// Функция обновления данных в формах из модели
function updateFormsFromModel() {
  const buyerData = buyerModel.getData();
  orderForm.address = buyerData.address;
  // Убираем проверку, всегда устанавливаем payment (может быть null)
  orderForm.payment = buyerData.payment;
  contactsForm.email = buyerData.email;
  contactsForm.phone = buyerData.phone;

  // Обновляем валидацию
  const validationErrors = buyerModel.validate();
  const orderErrors: string[] = [];
  const contactsErrors: string[] = [];

  if (validationErrors.payment) orderErrors.push(validationErrors.payment);
  if (validationErrors.address) orderErrors.push(validationErrors.address);
  if (validationErrors.email) contactsErrors.push(validationErrors.email);
  if (validationErrors.phone) contactsErrors.push(validationErrors.phone);

  orderForm.errors = orderErrors.join(", ");
  orderForm.valid = orderErrors.length === 0;

  contactsForm.errors = contactsErrors.join(", ");
  contactsForm.valid = contactsErrors.length === 0;
}

// === Обработчики событий ===

// Загрузка товаров с сервера
api
  .getProducts()
  .then((data) => {
    productsModel.setItems(data.items);
  })
  .catch((err) => console.error("Ошибка загрузки товаров:", err));

// Обновление каталога
events.on("products:changed", (items: IProduct[]) => {
  const catalogItems = items.map((product) => createCatalogCard(product));
  page.catalog = catalogItems;
});

// Выбор продукта для просмотра (сохраняем в модель)
events.on("card:select", (product: IProduct) => {
  productsModel.setSelectedProduct(product);
});

// Удаление товара из корзины
events.on("basket:remove", (product: IProduct) => {
  basketModel.removeItem(product.id);
});

// Открытие превью (реагируем на изменение выбранного продукта)
events.on("products:selected", (product: IProduct) => {
  const isInBasket = basketModel.isInBasket(product.id);

  // Обновляем контент существующего экземпляра превью
  previewCard.title = product.title;
  previewCard.price = product.price;
  previewCard.category = product.category;
  previewCard.image = CDN_URL + product.image;
  previewCard.description = product.description;
  previewCard.buttonText = isInBasket
    ? "Удалить из корзины"
    : product.price === null
      ? "Недоступно"
      : "Купить";
  previewCard.disabled = product.price === null;
  modal.render({ content: previewElement });
});

// Обработчик для кнопки в превью (генерирует событие)
events.on("preview:toggle", () => {
  const product = productsModel.getSelectedProduct();
  if (product && product.price !== null) {
    if (basketModel.isInBasket(product.id)) {
      basketModel.removeItem(product.id);
    } else {
      basketModel.addItem(product);
    }
    modal.close();
  }
});

// Обновление корзины (реагируем на изменение модели корзины)
events.on("basket:changed", () => {
  updateBasketView();
});

// Открытие корзины
events.on("basket:open", () => {
  updateBasketView();
  modal.render({ content: basketElement, modalClass: "basket-modal" });
});

// Оформление заказа (переход к форме заказа)
events.on("basket:order", () => {
  updateFormsFromModel();
  modal.render({ content: orderElement, modalClass: "order-modal" });
});

// Изменение адреса в форме заказа
events.on("order:changeAddress", (data: { address: string }) => {
  buyerModel.setData({ address: data.address });
});

// Изменение способа оплаты
events.on("order:changePayment", (data: { payment: "card" | "cash" }) => {
  buyerModel.setData({ payment: data.payment });
});

// Отправка формы заказа (переход к контактам)
events.on("order:submit", () => {
  updateFormsFromModel();
  modal.render({ content: contactsElement, modalClass: "order-modal" });
});

// Изменение email
events.on("contacts:changeEmail", (data: { email: string }) => {
  buyerModel.setData({ email: data.email });
});

// Изменение телефона
events.on("contacts:changePhone", (data: { phone: string }) => {
  buyerModel.setData({ phone: data.phone });
});

// Отправка заказа
events.on("contacts:submit", async () => {
  const buyerData = buyerModel.getData();
  const basketItems = basketModel.getItems();
  const total = basketModel.getTotalPrice();

  const order = {
    payment: buyerData.payment!,
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    total: total,
    items: basketItems.map((item) => item.id),
  };

  try {
    const result = await api.postOrder(order);
    successComponent.total = result.total;

    basketModel.clear();
    buyerModel.clear();

    modal.render({ content: successElement });
  } catch (err) {
    console.error("Ошибка при оформлении заказа:", err);
  }
});

// Закрытие окна успеха
events.on("success:close", () => {
  modal.close();
});

// Обновление данных покупателя (обновляем формы и валидацию)
events.on("buyer:changed", () => {
  updateFormsFromModel();
});

// Закрытие модального окна
events.on("modal:closed", () => {
  // Дополнительная логика при закрытии, если нужна
});
