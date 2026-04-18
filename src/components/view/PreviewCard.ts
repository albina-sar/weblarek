import { BaseCard } from "./BaseCard";

/**
 * Карточка товара для предпросмотра (модальное окно)
 */
export class PreviewCard extends BaseCard {
  constructor(container: HTMLElement) {
    super(container);
  }

  set buttonHandler(handler: () => void) {
    if (this._button) {
      this._button.addEventListener("click", handler);
    }
  }
}
