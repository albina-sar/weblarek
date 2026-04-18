import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class ContactsForm extends Component<{
  email: string;
  phone: string;
  errors: string;
}> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;
  protected form: HTMLFormElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this.form = container as HTMLFormElement;
    this.emailInput = container.querySelector(
      'input[name="email"]',
    ) as HTMLInputElement;
    this.phoneInput = container.querySelector(
      'input[name="phone"]',
    ) as HTMLInputElement;
    this.submitButton = container.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    this.errorsElement = container.querySelector(
      ".form__errors",
    ) as HTMLElement;

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

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit("contacts:submit");
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }
}
