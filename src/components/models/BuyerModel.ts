import { IBuyer, TPayment, TValidationErrors } from "../../types";
import { IEvents } from "../base/Events";

export class BuyerModel {
  private payment: TPayment | null = null;
  private email: string = "";
  private phone: string = "";
  private address: string = "";

  constructor(protected events?: IEvents) {}

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
    this.events?.emit("buyer:changed", this.getData());
  }

  getData(): IBuyer {
    return {
      payment: this.payment as TPayment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
    this.events?.emit("buyer:changed", this.getData());
  }

  validate(): TValidationErrors {
    const errors: TValidationErrors = {};
    if (!this.payment) errors.payment = "Не выбран способ оплаты";
    if (!this.address.trim()) errors.address = "Укажите адрес доставки";
    if (!this.email.trim()) errors.email = "Укажите email";
    if (!this.phone.trim()) errors.phone = "Укажите телефон";
    return errors;
  }

  validateOrder(): { valid: boolean; errors: string } {
    const errors: string[] = [];
    if (!this.payment) errors.push("Выберите способ оплаты");
    if (!this.address.trim()) errors.push("Укажите адрес доставки");
    return { valid: errors.length === 0, errors: errors.join(", ") };
  }

  validateContacts(): { valid: boolean; errors: string } {
    const errors: string[] = [];
    if (!this.email.trim()) errors.push("Укажите email");
    if (!this.phone.trim()) errors.push("Укажите телефон");
    return { valid: errors.length === 0, errors: errors.join(", ") };
  }
}
