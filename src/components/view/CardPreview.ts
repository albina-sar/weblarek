import { BaseCard } from "./BaseCard";

interface ICardPreviewActions {
  onToggleBasket: () => void;
}

export class CardPreview extends BaseCard<ICardPreviewActions> {
  constructor(container: HTMLElement, actions: ICardPreviewActions) {
    super(container);
    if (this._button) {
      this._button.addEventListener("click", (e) => {
        e.stopPropagation();
        actions.onToggleBasket();
      });
    }
  }

  set buttonHandler(handler: () => void) {
    if (this._button) {
      this._button.onclick = handler;
    }
  }
}
