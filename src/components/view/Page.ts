import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Page extends Component<{
  counter: number;
  catalog: HTMLElement[];
}> {
  protected counterElement: HTMLElement;
  protected galleryElement: HTMLElement;
  protected basketButton: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this.counterElement = container.querySelector(
      ".header__basket-counter",
    ) as HTMLElement;
    this.galleryElement = container.querySelector(".gallery") as HTMLElement;
    this.basketButton = container.querySelector(
      ".header__basket",
    ) as HTMLElement;

    this.basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }

  set catalog(items: HTMLElement[]) {
    this.galleryElement.replaceChildren(...items);
  }
}
