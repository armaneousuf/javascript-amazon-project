import { cart, addToCart } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

const grid = document.querySelector(".js-products-grid");
const searchInput = document.querySelector(".js-search-input");
const countCart = () => cart.reduce((total, item) => total + item.quantity, 0);

function renderProducts(query = "") {
  const normalizedQuery = query.trim().toLowerCase();
  const filteredProducts = products.filter((product) =>
    `${product.name} ${(product.keywords || []).join(" ")}`
      .toLowerCase()
      .includes(normalizedQuery),
  );
  grid.innerHTML = filteredProducts.length
    ? filteredProducts
        .map(
          (product) => `
    <div class="product-container">
      <div class="product-image-container"><img class="product-image" src="${product.image}" alt="${product.name}"></div>
      <div class="product-name limit-text-to-2-lines">${product.name}</div>
      <div class="product-rating-container"><img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars * 10}.png" alt="${product.rating.stars} out of 5 stars"><div class="product-rating-count link-primary">${product.rating.count}</div></div>
      <div class="product-price">$${formatCurrency(product.priceCents)}</div>
      <div class="product-quantity-container"><select aria-label="Quantity for ${product.name}" class="js-quantity-${product.id}">${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("")}</select></div>
      <div class="product-spacer"></div><div class="added-to-cart js-added-${product.id}" aria-live="polite"><img src="images/icons/checkmark.png" alt=""> Added</div>
      <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">Add to Cart</button>
    </div>`,
        )
        .join("")
    : `<p class="empty-search">No products found. Try another search.</p>`;
  grid.querySelectorAll(".js-add-to-cart").forEach((button) =>
    button.addEventListener("click", () => {
      const id = button.dataset.productId;
      const quantity = Number(
        document.querySelector(`.js-quantity-${id}`).value,
      );
      for (let i = 0; i < quantity; i += 1) addToCart(id);
      updateCartQuantity();
      const notice = document.querySelector(`.js-added-${id}`);
      notice.classList.add("added-to-cart-visible");
      window.setTimeout(
        () => notice.classList.remove("added-to-cart-visible"),
        1400,
      );
    }),
  );
}

function updateCartQuantity() {
  document.querySelector(".js-cart-quantity").textContent = countCart();
}

const initialSearch =
  new URLSearchParams(window.location.search).get("search") || "";
searchInput.value = initialSearch;
renderProducts(initialSearch);
updateCartQuantity();
searchInput.addEventListener("input", () => renderProducts(searchInput.value));
document
  .querySelector(".js-search-button")
  .addEventListener("click", () => renderProducts(searchInput.value));
document
  .querySelector(".js-search-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    renderProducts(searchInput.value);
  });
