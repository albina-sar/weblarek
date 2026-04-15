// src/main.ts
import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { ProductsModel } from './components/models/ProductsModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';
import { WebLarekApi } from './components/WebLarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { Modal } from './components/view/Modal';
import { Page } from './components/view/Page';
import { Basket } from './components/view/Basket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';
import { cloneTemplate } from './utils/utils';
import { IProduct, IOrder } from './types';

// Создание экземпляра брокера событий
const events = new EventEmitter();

// Создание экземпляров моделей данных
const productsModel = new ProductsModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

// Создание экземпляра API
const api = new WebLarekApi(API_URL);

// Получение DOM элементов
const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const pageContainer = document.querySelector('.page__wrapper') as HTMLElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

// Создание экземпляров компонентов представления
const modal = new Modal(modalContainer, () => {});

const page = new Page(
    pageContainer,
    (id) => events.emit('product:select', { id }),
    (product) => events.emit('basket:add', { product }),
    () => events.emit('basket:open')
);

// === ОБРАБОТЧИКИ СОБЫТИЙ ===

// Загрузка товаров с сервера
api.getProducts()
    .then(data => {
        productsModel.setItems(data.items);
    })
    .catch(error => {
        console.error('Ошибка загрузки товаров:', error);
    });

// Обновление каталога на странице
events.on('products:changed', () => {
    page.products = productsModel.getItems();
});

// Обновление счетчика корзины
events.on('basket:changed', (data: { count: number }) => {
    page.counter = data.count;
});

// Открытие корзины
events.on('basket:open', () => {
    const basketElement = cloneTemplate(basketTemplate);
    const basket = new Basket(
        basketElement,
        (productId) => events.emit('basket:remove', { productId }),
        () => events.emit('order:open')
    );
    basket.items = basketModel.getItems();
    basket.total = basketModel.getTotalPrice();
    modal.render({ content: basketElement });
});

// Добавление товара в корзину
events.on('basket:add', (data: { product: IProduct }) => {
    basketModel.addItem(data.product);
    modal.close();
});

// Удаление товара из корзины
events.on('basket:remove', (data: { productId: string }) => {
    basketModel.removeItem(data.productId);
});

// Открытие формы заказа
events.on('order:open', () => {
    const orderElement = cloneTemplate(orderTemplate) as HTMLFormElement;
    new OrderForm(orderElement, (data) => {
    buyerModel.setData({ address: data.address, payment: data.payment });
    events.emit('order:submit');
});
    modal.render({ content: orderElement });
});

// Обработка первого шага формы
events.on('order:submit', () => {
    const contactsElement = cloneTemplate(contactsTemplate) as HTMLFormElement;
    new ContactsForm(contactsElement, (data) => {
    buyerModel.setData({ email: data.email, phone: data.phone });
    events.emit('contacts:submit');
});
    modal.render({ content: contactsElement });
});

// Оформление заказа
events.on('contacts:submit', () => {
    const buyer = buyerModel.getData();
    const order: IOrder = {
        payment: buyer.payment,
        email: buyer.email,
        phone: buyer.phone,
        address: buyer.address,
        total: basketModel.getTotalPrice(),
        items: basketModel.getItems().map(item => item.id)
    };
    
    api.postOrder(order)
        .then(result => {
            const successElement = cloneTemplate(successTemplate);
            const success = new Success(successElement, () => {
                modal.close();
                basketModel.clear();
                buyerModel.clear();
            });
            success.total = result.total;
            modal.render({ content: successElement });
        })
        .catch(error => {
            console.error('Ошибка оформления заказа:', error);
        });
});

// Открытие карточки товара для просмотра
events.on('product:select', (data: { id: string }) => {
    const product = productsModel.getProductById(data.id);
    if (product) {
        productsModel.setSelectedProduct(product);
    }
});

// Отображение выбранного товара в модальном окне
events.on('selectedProduct:changed', (data: { product: IProduct }) => {
    const product = data.product;
    const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
    const cardElement = cloneTemplate(previewTemplate);
    
    const categoryElement = cardElement.querySelector('.card__category') as HTMLElement;
    const titleElement = cardElement.querySelector('.card__title') as HTMLElement;
    const imageElement = cardElement.querySelector('.card__image') as HTMLImageElement;
    const textElement = cardElement.querySelector('.card__text') as HTMLElement;
    const priceElement = cardElement.querySelector('.card__price') as HTMLElement;
    const button = cardElement.querySelector('.card__button') as HTMLButtonElement;
    
    if (categoryElement) {
        categoryElement.textContent = product.category;
        const categoryMap: Record<string, string> = {
            'софт-скил': 'card__category_soft',
            'хард-скил': 'card__category_hard',
            'кнопка': 'card__category_button',
            'дополнительное': 'card__category_additional',
            'другое': 'card__category_other'
        };
        categoryElement.className = `card__category ${categoryMap[product.category] || 'card__category_other'}`;
    }
    
    if (titleElement) titleElement.textContent = product.title;
    if (imageElement) imageElement.src = CDN_URL + product.image;
    if (textElement) textElement.textContent = product.description;
    
    if (priceElement) {
        if (product.price === null) {
            priceElement.textContent = 'Недоступно';
        } else {
            priceElement.textContent = `${product.price} синапсов`;
        }
    }
    
    if (button) {
        if (product.price === null) {
            button.textContent = 'Недоступно';
            button.setAttribute('disabled', 'disabled');
        } else if (basketModel.isInBasket(product.id)) {
            button.textContent = 'Удалить из корзины';
            button.addEventListener('click', () => {
                basketModel.removeItem(product.id);
                modal.close();
            });
        } else {
            button.textContent = 'Купить';
            button.addEventListener('click', () => {
                basketModel.addItem(product);
                modal.close();
            });
        }
    }
    
    modal.render({ content: cardElement });
});