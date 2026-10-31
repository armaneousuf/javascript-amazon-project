import { getOrders } from "../data/orders.js";
import { cart, addToCart } from "../data/cart.js";
import { getProduct } from "../data/products.js";
import { getDeliveryOption } from "../data/deliveryOptions.js";
import { formatCurrency } from "./utils/money.js";

const count = cart.reduce((sum, item) => sum + item.quantity, 0);
document.querySelector(".js-cart-quantity").textContent = count;
const orders = getOrders();
document.querySelector(".js-orders-grid").innerHTML = orders.length
  ? orders
      .map(
        (order) => `
  <section class="order-container">
    <div class="order-header"><div class="order-header-left-section"><div class="order-date"><div class="order-header-label">Order Placed:</div><div>${new Date(order.orderTime).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</div></div><div class="order-total"><div class="order-header-label">Total:</div><div>$${formatCurrency(order.totalCents)}</div></div></div><div class="order-header-right-section"><div class="order-header-label">Order ID:</div><div>${order.id}</div></div></div>
    <div class="order-details-grid">${order.products
      .map((item) => {
        const product = getProduct(item.productId);
        const delivery = getDeliveryOption(item.deliveryOptionId);
        const arrival = new Date(order.orderTime);
        arrival.setDate(arrival.getDate() + delivery.deliveryDays);
        return product
          ? `<div class="product-image-container"><img src="${product.image}" alt="${product.name}"></div><div class="product-details"><div class="product-name">${product.name}</div><div class="product-delivery-date">Arriving on: ${arrival.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</div><div class="product-quantity">Quantity: ${item.quantity}</div><button class="buy-again-button button-primary js-buy-again" data-product-id="${product.id}"><img class="buy-again-icon" src="images/icons/buy-again.png" alt=""><span>Buy it again</span></button></div><div class="product-actions"><a href="tracking.html?orderId=${encodeURIComponent(order.id)}&productId=${encodeURIComponent(product.id)}"><button class="track-package-button button-secondary">Track package</button></a></div>`
          : "";
      })
      .join("")}</div>
  </section>`,
      )
      .join("")
  : `<div class="empty-orders"><h2>You haven't placed any orders yet</h2><p>When you place an order, it will appear here.</p><a class="button-primary" href="index.html">Continue shopping</a></div>`;

document.querySelectorAll(".js-buy-again").forEach((button) =>
  button.addEventListener("click", () => {
    addToCart(button.dataset.productId);
    button.innerHTML = "Added to cart";
    document.querySelector(".js-cart-quantity").textContent = cart.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
  }),
);
const search = document.querySelector(".js-search-input");
document
  .querySelector(".js-search-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    window.location.href = `index.html?search=${encodeURIComponent(search.value)}`;
  });
