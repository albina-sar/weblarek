import { BaseCard } from "./BaseCard";

interface ICardCatalogActions {
  onClick: () => void;
}

export class CardCatalog extends BaseCard<ICardCatalogActions> {
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;

  constructor(container: HTMLElement, actions: ICardCatalogActions) {
    super(container);
    this._category = container.querySelector(".card__category") as HTMLElement;
    this._image = container.querySelector(".card__image") as HTMLImageElement;
    this.container.addEventListener("click", actions.onClick);
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
