import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { TPayment } from "../../types";

interface IOrderFormData {
  address: string;
  payment: TPayment;
}

export class OrderForm extends Form<IOrderFormData> {
  protected addressInput: HTMLInputElement;
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container, events);
    this.addressInput = container.querySelector(
      'input[name="address"]',
    ) as HTMLInputElement;
    this.cardButton = container.querySelector(
      'button[name="card"]',
    ) as HTMLButtonElement;
    this.cashButton = container.querySelector(
      'button[name="cash"]',
    ) as HTMLButtonElement;

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
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set payment(value: TPayment | null) {
    // Сбрасываем активные классы у обеих кнопок
    this.cardButton.classList.remove("button_alt-active");
    this.cashButton.classList.remove("button_alt-active");

    // Устанавливаем активный класс если значение не null
    if (value === "card") {
      this.cardButton.classList.add("button_alt-active");
    } else if (value === "cash") {
      this.cashButton.classList.add("button_alt-active");
    }
  }
}
