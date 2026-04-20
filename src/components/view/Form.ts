import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IFormData {
  errors: string;
  valid: boolean;
}

export abstract class Form<T> extends Component<IFormData & T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;
  protected form: HTMLFormElement;

  constructor(
    protected container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this.form = container as HTMLFormElement;
    this.submitButton = container.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    this.errorsElement = container.querySelector(
      ".form__errors",
    ) as HTMLElement;

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      // Имя формы получаем из разметки form.name
      this.events.emit(`${this.form.name}:submit`);
    });
  }

  set errors(value: string) {
    if (this.errorsElement) {
      this.errorsElement.textContent = value;
    }
  }

  set valid(value: boolean) {
    if (this.submitButton) {
      this.submitButton.disabled = !value;
    }
  }
}
