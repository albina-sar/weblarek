import { BaseCard } from "./BaseCard";

interface ICardCatalogActions {
  onClick: () => void;
}

export class CardCatalog extends BaseCard<ICardCatalogActions> {
  constructor(container: HTMLElement, actions: ICardCatalogActions) {
    super(container);
    this.container.addEventListener("click", actions.onClick);
  }
}
