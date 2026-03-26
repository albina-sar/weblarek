import './scss/styles.scss';
import { ProductsModel } from './components/models/ProductsModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';
import { WebLarekApi } from './components/WebLarekApi';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

// Создание экземпляров моделей данных
const productsModel = new ProductsModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

console.log('=== НАЧАЛО ТЕСТИРОВАНИЯ МОДЕЛЕЙ ДАННЫХ ===');

// 1. Тестирование модели каталога товаров (ProductsModel)
console.log('\n1. Тестирование ProductsModel:');

// Сохранение массива товаров из тестовых данных
productsModel.setItems(apiProducts.items);
console.log('✓ Сохранены товары в каталог. Количество:', productsModel.getItems().length);

// Получение всех товаров
console.log('✓ Все товары из каталога:', productsModel.getItems());

// Получение товара по id
const testProduct = productsModel.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390');
console.log('✓ Товар по id "854cef69-976d-4c2a-a18c-2aa45046c390":', testProduct);

// Сохранение выбранного товара
if (testProduct) {
    productsModel.setSelectedProduct(testProduct);
    console.log('✓ Сохранен выбранный товар:', productsModel.getSelectedProduct());
}

// 2. Тестирование модели корзины (BasketModel)
console.log('\n2. Тестирование BasketModel:');

// Добавление товаров в корзину
const product1 = apiProducts.items[0];
const product2 = apiProducts.items[1];
basketModel.addItem(product1);
basketModel.addItem(product2);
console.log('✓ Добавлены товары в корзину:', basketModel.getItems());

// Проверка наличия товара в корзине
console.log('✓ Проверка наличия товара', product1.id, 'в корзине:', basketModel.isInBasket(product1.id));
console.log('✓ Проверка наличия товара с несуществующим id в корзине:', basketModel.isInBasket('invalid-id'));

// Получение общей стоимости
console.log('✓ Общая стоимость товаров в корзине:', basketModel.getTotalPrice(), 'синапсов');

// Получение количества товаров
console.log('✓ Количество товаров в корзине:', basketModel.getItemCount());

// Удаление товара из корзины
basketModel.removeItem(product1.id);
console.log('✓ После удаления товара, товары в корзине:', basketModel.getItems());

// Очистка корзины
basketModel.clear();
console.log('✓ После очистки корзины, товаров в корзине:', basketModel.getItems().length);

// 3. Тестирование модели покупателя (BuyerModel)
console.log('\n3. Тестирование BuyerModel:');

// Сохранение данных через setData (способ оплаты и адрес)
buyerModel.setData({
    payment: 'card',
    address: 'г. Москва, ул. Ленина, д. 1'
});
console.log('✓ Сохранен способ оплаты и адрес');
console.log('✓ Текущие данные покупателя:', buyerModel.getData());

// Проверка валидации (теперь все поля проверяются через единый метод)
console.log('✓ Результат валидации после сохранения payment и address:', buyerModel.validate());

// Сохранение остальных данных (email и телефон)
buyerModel.setData({
    email: 'test@example.com',
    phone: '+7 999 123-45-67'
});
console.log('✓ Сохранены email и телефон');

// Получение всех данных через getData
console.log('✓ Все данные покупателя:', buyerModel.getData());

// Проверка полной валидации (пустой объект - нет ошибок)
console.log('✓ Результат полной валидации (пустой объект - нет ошибок):', buyerModel.validate());

// Очистка данных
buyerModel.clear();
console.log('✓ После очистки, данные покупателя:', buyerModel.getData());

// Проверка валидации после очистки (должны быть ошибки)
console.log('✓ Валидация после очистки (должны быть ошибки):', buyerModel.validate());

console.log('\n=== ТЕСТИРОВАНИЕ МОДЕЛЕЙ ЗАВЕРШЕНО ===');

// 4. Тестирование работы с API
console.log('\n=== НАЧАЛО ТЕСТИРОВАНИЯ РАБОТЫ С API ===');

// Создание экземпляра класса для работы с API
const api = new WebLarekApi(API_URL);

// Запрос товаров с сервера
console.log('\nЗапрос товаров с сервера...');
api.getProducts()
    .then(data => {
        console.log('✓ Получены товары с сервера:', data);
        
        // Сохранение полученных товаров в модель каталога
        productsModel.setItems(data.items);
        console.log('✓ Сохранены товары в модель каталога. Количество:', productsModel.getItems().length);
        
        // Вывод сохраненного каталога в консоль
        console.log('✓ Каталог товаров после сохранения с сервера:', productsModel.getItems());
    })
    .catch(error => {
        console.error('✗ Ошибка при получении товаров с сервера:', error);
    });

console.log('\n=== ТЕСТИРОВАНИЕ API ЗАВЕРШЕНО ===');