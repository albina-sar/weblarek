import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class BasketModel {
  private items: IProduct[] = [];

  constructor(protected events?: IEvents) {}

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    if (!this.isInBasket(product.id)) {
      this.items.push(product);
      this.events?.emit("basket:changed", this.getItems());
    }
  }

  removeItem(productId: string): void {
    this.items = this.items.filter((item) => item.id !== productId);
    this.events?.emit("basket:changed", this.getItems());
  }

  clear(): void {
    this.items = [];
    this.events?.emit("basket:changed", this.getItems());
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getItemCount(): number {
    return this.items.length;
  }

  isInBasket(productId: string): boolean {
    return this.items.some((item) => item.id === productId);
  }
}
