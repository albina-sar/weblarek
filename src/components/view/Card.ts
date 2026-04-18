import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";

export class Card extends Component<IProduct> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected categoryElement?: HTMLElement;
  protected imageElement?: HTMLImageElement;
  protected descriptionElement?: HTMLElement;
  protected buttonElement?: HTMLButtonElement;
  protected indexElement?: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
    protected type: "catalog" | "preview" | "basket" = "catalog",
  ) {
    super(container);

    this.titleElement = container.querySelector(".card__title") as HTMLElement;
    this.priceElement = container.querySelector(".card__price") as HTMLElement;

    if (type === "catalog") {
      this.categoryElement = container.querySelector(
        ".card__category",
      ) as HTMLElement;
      this.imageElement = container.querySelector(
        ".card__image",
      ) as HTMLImageElement;
      container.addEventListener("click", () =>
        this.events.emit("card:select", { id: this.id }),
      );
    }

    if (type === "preview") {
      this.categoryElement = container.querySelector(
        ".card__category",
      ) as HTMLElement;
      this.imageElement = container.querySelector(
        ".card__image",
      ) as HTMLImageElement;
      this.descriptionElement = container.querySelector(
        ".card__text",
      ) as HTMLElement;
      this.buttonElement = container.querySelector(
        ".card__button",
      ) as HTMLButtonElement;
      if (this.buttonElement) {
        this.buttonElement.addEventListener("click", (e) => {
          e.stopPropagation();
          this.events.emit("card:toggleBasket", { id: this.id });
        });
      }
    }

    if (type === "basket") {
      this.indexElement = container.querySelector(
        ".basket__item-index",
      ) as HTMLElement;
      this.buttonElement = container.querySelector(
        ".basket__item-delete",
      ) as HTMLButtonElement;
      if (this.buttonElement) {
        this.buttonElement.addEventListener("click", () => {
          this.events.emit("basket:remove", { id: this.id });
        });
      }
    }
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || "";
  }

  set title(value: string) {
    if (this.titleElement) {
      this.titleElement.textContent = value;
    }
  }

  set price(value: number | null) {
    if (value === null) {
      if (this.priceElement) {
        this.priceElement.textContent = "Недоступно";
      }
      if (this.buttonElement && this.type === "preview") {
        this.buttonElement.disabled = true;
        this.buttonElement.textContent = "Недоступно";
      }
    } else {
      if (this.priceElement) {
        this.priceElement.textContent = `${value} синапсов`;
      }
    }
  }

  set category(value: string) {
    if (this.categoryElement) {
      this.categoryElement.textContent = value;
      const modifier =
        categoryMap[value as keyof typeof categoryMap] ||
        "card__category_other";
      this.categoryElement.className = `card__category ${modifier}`;
    }
  }

  set image(value: string) {
    if (this.imageElement) {
      this.setImage(this.imageElement, value, this.title);
    }
  }

  set description(value: string) {
    if (this.descriptionElement) {
      this.descriptionElement.textContent = value;
    }
  }

  set index(value: number) {
    if (this.indexElement) {
      this.indexElement.textContent = String(value);
    }
  }

  set buttonText(value: string) {
    if (this.buttonElement) {
      this.buttonElement.textContent = value;
    }
  }

  disableButton(disabled: boolean) {
    if (this.buttonElement) {
      this.buttonElement.disabled = disabled;
    }
  }
}
