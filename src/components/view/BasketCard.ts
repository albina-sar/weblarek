import { Component } from "../base/Component";
import { IProduct } from "../../types";

/**
 * Карточка товара для корзины
 */
export class BasketCard extends Component<IProduct> {
  private _index: HTMLElement;
  private _title: HTMLElement;
  private _price: HTMLElement;
  private _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, onDelete?: () => void) {
    super(container);
    this._index = container.querySelector(".basket__item-index") as HTMLElement;
    this._title = container.querySelector(".card__title") as HTMLElement;
    this._price = container.querySelector(".card__price") as HTMLElement;
    this._deleteButton = container.querySelector(
      ".basket__item-delete",
    ) as HTMLButtonElement;

    if (onDelete && this._deleteButton) {
      this._deleteButton.addEventListener("click", onDelete);
    }
  }

  set index(value: number) {
    if (this._index) this._index.textContent = String(value);
  }

  set title(value: string) {
    if (this._title) this._title.textContent = value;
  }

  set price(value: number | null) {
    if (this._price) {
      if (value === null) {
        this._price.textContent = "Недоступно";
      } else {
        this._price.textContent = `${value} синапсов`;
      }
    }
  }
}
