import { BaseCard } from "./BaseCard";

interface IBasketCardActions {
  onDelete: () => void;
}

interface IBasketCardData {
  index: number;
}

export class BasketCard extends BaseCard<IBasketCardData & IBasketCardActions> {
  private _index: HTMLElement;

  constructor(container: HTMLElement, actions: IBasketCardActions) {
    super(container);
    this._index = container.querySelector(".basket__item-index") as HTMLElement;

    if (this._button) {
      this._button.addEventListener("click", actions.onDelete);
    }
  }

  set index(value: number) {
    if (this._index) this._index.textContent = String(value);
  }

  set buttonHandler(handler: () => void) {
    if (this._button) {
      this._button.onclick = handler;
    }
  }
}
