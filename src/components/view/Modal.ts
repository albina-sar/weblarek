import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Modal extends Component<{ content: HTMLElement }> {
  protected closeButton: HTMLElement;
  protected contentContainer: HTMLElement;
  protected scrollbarWidth: number = 0;
  protected escKeyHandler: (e: KeyboardEvent) => void;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this.closeButton = container.querySelector(".modal__close") as HTMLElement;
    this.contentContainer = container.querySelector(
      ".modal__content",
    ) as HTMLElement;

    this.closeButton.addEventListener("click", () => this.close());
    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) {
        this.close();
      }
    });

    this.escKeyHandler = this.closeByEsc.bind(this);
  }

  protected closeByEsc(e: KeyboardEvent): void {
    if (e.key === "Escape") {
      this.close();
    }
  }

  set content(value: HTMLElement) {
    this.contentContainer.replaceChildren(value);
  }

  set modalClass(value: string) {
    this.container.classList.add(value);
  }

  removeModalClass(value: string) {
    this.container.classList.remove(value);
  }

  open() {
    this.container.classList.add("modal_active");
    document.body.classList.add("modal_active");
    document.addEventListener("keydown", this.escKeyHandler);
  }

  close() {
    this.container.classList.remove("modal_active");
    document.body.classList.remove("modal_active");
    this.contentContainer.innerHTML = "";
    this.container.classList.remove("basket-modal", "order-modal");
    document.removeEventListener("keydown", this.escKeyHandler);
    this.events.emit("modal:closed");
  }

  render(data: { content: HTMLElement; modalClass?: string }): HTMLElement {
    this.content = data.content;
    if (data.modalClass) {
      this.modalClass = data.modalClass;
    }
    this.open();
    return this.container;
  }
}
