import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Modal extends Component<{ content: HTMLElement }> {
  protected closeButton: HTMLElement;
  protected contentContainer: HTMLElement;
  protected scrollbarWidth: number = 0;

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

    this.calculateScrollbarWidth();

    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        this.container.classList.contains("modal_active")
      ) {
        this.close();
      }
    });
  }

  protected calculateScrollbarWidth(): void {
    const scrollDiv = document.createElement("div");
    scrollDiv.style.cssText =
      "width: 100px; height: 100px; overflow: scroll; position: absolute; top: -9999px;";
    document.body.appendChild(scrollDiv);
    this.scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
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
    document.body.style.paddingRight = `${this.scrollbarWidth}px`;
  }

  close() {
    this.container.classList.remove("modal_active");
    document.body.classList.remove("modal_active");
    document.body.style.paddingRight = "";
    this.contentContainer.innerHTML = "";
    // Удаляем дополнительные классы
    this.container.classList.remove("basket-modal", "order-modal");
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
