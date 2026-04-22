import { IEvents } from "../base/Events";
import { BaseCard } from "./BaseCard";

export class CardPreview extends BaseCard<{}> {
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this._category = container.querySelector(".card__category") as HTMLElement;
    this._image = container.querySelector(".card__image") as HTMLImageElement;
    this._description = container.querySelector(".card__text") as HTMLElement;
    this._button = container.querySelector(
      ".card__button",
    ) as HTMLButtonElement;

    if (this._button) {
      this._button.addEventListener("click", (e) => {
        e.stopPropagation();
        this.events.emit("preview:toggle");
      });
    }
  }

  set category(value: string) {
    if (this._category) {
      this._category.textContent = value;
      const categoryClass = this.getCategoryClass(value);
      this._category.className = `card__category ${categoryClass}`;
    }
  }

  set image(value: string) {
    if (this._image && value) {
      this._image.src = value;
      this._image.alt = this._title?.textContent || "Товар";
    }
  }

  set description(value: string) {
    if (this._description) this._description.textContent = value;
  }

  set buttonText(value: string) {
    if (this._button) this._button.textContent = value;
  }

  set disabled(value: boolean) {
    if (this._button) {
      if (value) {
        this._button.setAttribute("disabled", "disabled");
      } else {
        this._button.removeAttribute("disabled");
      }
    }
  }

  private getCategoryClass(category: string): string {
    const categoryMap: Record<string, string> = {
      "софт-скил": "card__category_soft",
      "хард-скил": "card__category_hard",
      кнопка: "card__category_button",
      дополнительное: "card__category_additional",
      другое: "card__category_other",
    };
    return categoryMap[category] || "card__category_other";
  }
}
