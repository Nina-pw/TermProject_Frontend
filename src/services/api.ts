import { MOCK_PRODUCTS } from "../mocks/products";
import { MOCK_USERS } from "../mocks/users";
import { MOCK_ORDERS } from "../mocks/orders";
import { MOCK_CATEGORIES } from "../mocks/categories";

export const api = {
  async getProducts() {
    return MOCK_PRODUCTS;
  },
  async getCategories() {
    return MOCK_CATEGORIES;
  },
  async getOrders() {
    return MOCK_ORDERS;
  },
  async getUsers() {
    return MOCK_USERS;
  },
  async login(email: string, _password: string) {
    const user = MOCK_USERS.find(u => u.email === email);
    if (user) return user;
    throw new Error("User not found");
  },
};
