import { BaseCard } from "./BaseCard";

interface IBasketCardData {
  index: number;
}

export class BasketCard extends BaseCard<IBasketCardData> {
  private _index: HTMLElement;
  private _button: HTMLButtonElement;

  constructor(container: HTMLElement, onDelete: () => void) {
    super(container);
    this._index = container.querySelector(".basket__item-index") as HTMLElement;
    this._button = container.querySelector(
      ".basket__item-delete",
    ) as HTMLButtonElement;

    if (this._button) {
      this._button.addEventListener("click", onDelete);
    }
  }

  set index(value: number) {
    if (this._index) this._index.textContent = String(value);
  }
}
