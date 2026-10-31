import { getOrder } from "../data/orders.js";
import { cart } from "../data/cart.js";
import { getProduct } from "../data/products.js";
import { getDeliveryOption } from "../data/deliveryOptions.js";

document.querySelector(".js-cart-quantity").textContent = cart.reduce(
  (sum, item) => sum + item.quantity,
  0,
);
const params = new URLSearchParams(window.location.search);
const order = getOrder(params.get("orderId"));
const product = getProduct(params.get("productId"));
const item = order?.products.find((entry) => entry.productId === product?.id);
const container = document.querySelector(".js-order-tracking");
if (!order || !product || !item) {
  container.innerHTML = `<a class="back-to-orders-link link-primary" href="orders.html">View all orders</a><h1>We couldn't find that package</h1><p>Choose a package from your order history to view tracking details.</p>`;
} else {
  const delivery = getDeliveryOption(item.deliveryOptionId);
  const arrival = new Date(order.orderTime);
  arrival.setDate(arrival.getDate() + delivery.deliveryDays);
  const elapsed = Date.now() - order.orderTime;
  const progress =
    elapsed >= delivery.deliveryDays * 86400000
      ? 100
      : elapsed >= 86400000
        ? 50
        : 15;
  const status = progress === 100 ? 2 : progress === 50 ? 1 : 0;
  container.innerHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">View all orders</a>
    <div class="delivery-date">Arriving on ${arrival.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</div>
    <div class="product-info">${product.name}</div><div class="product-info">Quantity: ${item.quantity}</div>
    <img class="product-image" src="${product.image}" alt="${product.name}">
    <div class="progress-labels-container"><div class="progress-label ${status === 0 ? "current-status" : ""}">Preparing</div><div class="progress-label ${status === 1 ? "current-status" : ""}">Shipped</div><div class="progress-label ${status === 2 ? "current-status" : ""}">Delivered</div></div>
    <div class="progress-bar-container"><div class="progress-bar" style="width:${progress}%"></div></div>`;
}
const search = document.querySelector(".js-search-input");
document
  .querySelector(".js-search-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    window.location.href = `index.html?search=${encodeURIComponent(search.value)}`;
  });
