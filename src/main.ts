import "./scss/styles.scss";
import { ProductsModel } from "./components/models/ProductsModel";
import { BasketModel } from "./components/models/BasketModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { WebLarekApi } from "./components/WebLarekApi";
import { EventEmitter } from "./components/base/Events";
import { API_URL, CDN_URL } from "./utils/constants";

// Компоненты представления
import { Modal } from "./components/view/Modal";
import { Card } from "./components/view/Card";
import { Basket } from "./components/view/Basket";
import { OrderForm } from "./components/view/OrderForm";
import { ContactsForm } from "./components/view/ContactsForm";
import { Success } from "./components/view/Success";
import { Page } from "./components/view/Page";

// Утилиты
import { cloneTemplate, ensureElement } from "./utils/utils";

// Создание экземпляров моделей данных
const events = new EventEmitter();
const productsModel = new ProductsModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

// API
const api = new WebLarekApi(API_URL);

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

// Компоненты представления
const modal = new Modal(modalContainer, events);
const page = new Page(pageElement, events);
let basketComponent: Basket;
let orderForm: OrderForm;
let contactsForm: ContactsForm;

// Функция для создания карточки каталога
function createCatalogCard(product: any): HTMLElement {
  const cardElement = cloneTemplate(cardCatalogTemplate);
  const card = new Card(cardElement, events, "catalog");
  card.id = product.id;
  card.title = product.title;
  card.price = product.price;
  card.category = product.category;
  card.image = CDN_URL + product.image;
  return card.render();
}

// Функция для создания карточки превью
function createPreviewCard(product: any): HTMLElement {
  const cardElement = cloneTemplate(cardPreviewTemplate);
  const card = new Card(cardElement, events, "preview");
  const isInBasket = basketModel.isInBasket(product.id);

  card.id = product.id;
  card.title = product.title;
  card.price = product.price;
  card.category = product.category;
  card.image = CDN_URL + product.image;
  card.description = product.description;
  card.buttonText = isInBasket
    ? "Удалить из корзины"
    : product.price === null
      ? "Недоступно"
      : "Купить";

  if (product.price === null) {
    card.disableButton(true);
  }

  return card.render();
}

// Функция для создания карточки корзины
function createBasketCard(product: any, index: number): HTMLElement {
  const cardElement = cloneTemplate(cardBasketTemplate);
  const card = new Card(cardElement, events, "basket");
  card.id = product.id;
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

  if (basketComponent) {
    const items = basketItems.map((item, index) =>
      createBasketCard(item, index + 1),
    );
    basketComponent.items = items;
    basketComponent.total = total;
    basketComponent.disabled = itemsCount === 0;
  }
}

// Функция обновления валидации форм
function updateOrderValidation() {
  if (orderForm) {
    const validation = buyerModel.validateOrder();
    orderForm.valid = validation.valid;
    orderForm.errors = validation.errors;
  }
}

function updateContactsValidation() {
  if (contactsForm) {
    const validation = buyerModel.validateContacts();
    contactsForm.valid = validation.valid;
    contactsForm.errors = validation.errors;
  }
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
events.on("products:changed", (items: any[]) => {
  const catalogItems = items.map((product) => createCatalogCard(product));
  page.catalog = catalogItems;
});

// Выбор карточки для просмотра
events.on("card:select", (data: { id: string }) => {
  const product = productsModel.getProductById(data.id);
  if (product) {
    const previewCard = createPreviewCard(product);
    modal.render({ content: previewCard });
  }
});

// Добавление/удаление товара в корзину
events.on("card:toggleBasket", (data: { id: string }) => {
  const product = productsModel.getProductById(data.id);
  if (product && product.price !== null) {
    if (basketModel.isInBasket(product.id)) {
      basketModel.removeItem(product.id);
    } else {
      basketModel.addItem(product);
    }
    updateBasketView();
    modal.close();
  }
});

// Удаление товара из корзины
events.on("basket:remove", (data: { id: string }) => {
  basketModel.removeItem(data.id);
  updateBasketView();
});

// Открытие корзины
events.on("basket:open", () => {
  const basketElement = cloneTemplate(basketTemplate);
  basketComponent = new Basket(basketElement, events);
  updateBasketView();
  modal.render({ content: basketElement, modalClass: "basket-modal" });
});

// Оформление заказа (переход к форме заказа)
events.on("basket:order", () => {
  const orderElement = cloneTemplate(orderTemplate);
  orderForm = new OrderForm(orderElement, events);

  const buyerData = buyerModel.getData();
  orderForm.address = buyerData.address;
  if (buyerData.payment) {
    orderForm.payment = buyerData.payment;
  }
  updateOrderValidation();

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
  const contactsElement = cloneTemplate(contactsTemplate);
  contactsForm = new ContactsForm(contactsElement, events);

  const buyerData = buyerModel.getData();
  contactsForm.email = buyerData.email;
  contactsForm.phone = buyerData.phone;
  updateContactsValidation();

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
    payment: buyerData.payment,
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    total: total,
    items: basketItems.map((item) => item.id),
  };

  try {
    await api.postOrder(order);
    const successElement = cloneTemplate(successTemplate);
    const success = new Success(successElement, events);
    success.total = total;

    basketModel.clear();
    buyerModel.clear();
    updateBasketView();

    modal.render({ content: successElement });
  } catch (err) {
    console.error("Ошибка при оформлении заказа:", err);
  }
});

// Закрытие окна успеха
events.on("success:close", () => {
  modal.close();
});

// Обновление данных покупателя (для валидации)
events.on("buyer:changed", () => {
  updateOrderValidation();
  updateContactsValidation();
});
