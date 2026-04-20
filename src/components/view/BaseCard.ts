import { Component } from "../base/Component";
import { TBaseCard } from "../../types";

export type TCardData = TBaseCard;

export abstract class BaseCard<T = {}> extends Component<TCardData & T> {
  // Базовый класс описывает только общие поля: название и цену
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._title = container.querySelector(".card__title") as HTMLElement;
    this._price = container.querySelector(".card__price") as HTMLElement;
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
