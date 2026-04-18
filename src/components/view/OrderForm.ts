import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { TPayment } from "../../types";

export class OrderForm extends Component<{
  address: string;
  payment: TPayment;
  errors: string;
}> {
  protected addressInput: HTMLInputElement;
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;
  protected form: HTMLFormElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this.form = container as HTMLFormElement;
    this.addressInput = container.querySelector(
      'input[name="address"]',
    ) as HTMLInputElement;
    this.cardButton = container.querySelector(
      'button[name="card"]',
    ) as HTMLButtonElement;
    this.cashButton = container.querySelector(
      'button[name="cash"]',
    ) as HTMLButtonElement;
    this.submitButton = container.querySelector(
      ".order__button",
    ) as HTMLButtonElement;
    this.errorsElement = container.querySelector(
      ".form__errors",
    ) as HTMLElement;

    this.addressInput.addEventListener("input", () => {
      this.events.emit("order:changeAddress", {
        address: this.addressInput.value,
      });
    });

    this.cardButton.addEventListener("click", () => {
      this.events.emit("order:changePayment", { payment: "card" });
    });

    this.cashButton.addEventListener("click", () => {
      this.events.emit("order:changePayment", { payment: "cash" });
    });

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit("order:submit");
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set payment(value: TPayment) {
    if (value === "card") {
      this.cardButton.classList.add("button_alt-active");
      this.cashButton.classList.remove("button_alt-active");
    } else if (value === "cash") {
      this.cashButton.classList.add("button_alt-active");
      this.cardButton.classList.remove("button_alt-active");
    }
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }
}
