import { Form } from "./Form";
import { IEvents } from "../base/Events";

interface IContactsFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container, events);
    this.emailInput = container.querySelector(
      'input[name="email"]',
    ) as HTMLInputElement;
    this.phoneInput = container.querySelector(
      'input[name="phone"]',
    ) as HTMLInputElement;

    this.emailInput.addEventListener("input", () => {
      this.events.emit("contacts:changeEmail", {
        email: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener("input", () => {
      this.events.emit("contacts:changePhone", {
        phone: this.phoneInput.value,
      });
    });
  }

  protected getFormName(): string {
    return "contacts";
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
