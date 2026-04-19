import { Component } from "./base/Component";
import { IEvents } from "./base/Events";

export class Success extends Component<{ total: number }> {
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this.descriptionElement = container.querySelector(
      ".order-success__description",
    ) as HTMLElement;
    this.buttonElement = container.querySelector(
      ".order-success__close",
    ) as HTMLButtonElement;

    this.buttonElement.addEventListener("click", () => {
      this.events.emit("success:close");
    });
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}
