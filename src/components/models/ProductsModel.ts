import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ProductsModel {
  private items: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(protected events?: IEvents) {}

  setItems(items: IProduct[]): void {
    this.items = items;
    this.events?.emit("products:changed", this.items);
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getProductById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events?.emit("products:selected", product);
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
