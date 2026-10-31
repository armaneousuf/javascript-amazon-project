import {
  cart,
  removeFromCart,
  updateDeliveryOption,
  setCartQuantity,
} from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary() {
  let cartSummaryHTML = "";
  const orderSummary = document.querySelector(".js-order-summary");

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(cartItem.productId);
    if (!matchingProduct) return;
    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + deliveryOption.deliveryDays);
    const dateString = deliveryDate.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    const summaryHTML = `
  <div class="cart-item-container js-cart-item-container-${productId}">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${matchingProduct.id}">Update</span>
                  <input class="quantity-input js-quantity-input" data-product-id="${matchingProduct.id}" type="number" min="1" max="10" value="${cartItem.quantity}" aria-label="Quantity for ${matchingProduct.name}" hidden>
                  <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id="${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchingProduct, cartItem)}
              </div>
            </div>
          </div>
  `;
    cartSummaryHTML += summaryHTML;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";
    deliveryOptions.forEach((deliveryOption) => {
      const deliveryDate = new Date();
      deliveryDate.setDate(
        deliveryDate.getDate() + deliveryOption.deliveryDays,
      );
      const dateString = deliveryDate.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      const priceStrings =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
<div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
        <input type="radio" ${isChecked ? "checked" : ""} class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceStrings} Shipping
          </div>
        </div>
      </div>
  `;
    });
    return html;
  }

  orderSummary.innerHTML =
    cartSummaryHTML ||
    `<div class="empty-cart"><h2>Your cart is empty</h2><p>Add something from the catalog to get started.</p><a class="link-primary" href="index.html">Continue shopping</a></div>`;
  const quantityLink = document.querySelectorAll(".js-update-quantity-link");
  quantityLink.forEach((link) =>
    link.addEventListener("click", () => {
      const input = document.querySelector(
        `.js-quantity-input[data-product-id="${link.dataset.productId}"]`,
      );
      const editing = !input.hidden;
      if (editing) {
        const value = Number(input.value);
        if (!Number.isInteger(value) || value < 1 || value > 10) {
          input.focus();
          return;
        }
        setCartQuantity(link.dataset.productId, value);
        renderOrderSummary();
        renderPaymentSummary();
        return;
      }
      input.hidden = editing;
      link.textContent = editing ? "Update" : "Save";
    }),
  );
  const deleteLink = document.querySelectorAll(".js-delete-quantity-link");
  deleteLink.forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const checkoutQuantity = document.querySelector(".js-checkout-quantity");
  if (checkoutQuantity)
    checkoutQuantity.textContent = `${count} ${count === 1 ? "item" : "items"}`;
}
