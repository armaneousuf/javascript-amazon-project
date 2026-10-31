function loadCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (Array.isArray(savedCart)) {
      const isLegacyDefault =
        savedCart.length === 2 &&
        savedCart[0]?.productId === "e43638ce-6aa0-4b85-b27f-e1d07eb678c6" &&
        savedCart[0]?.quantity === 2 &&
        savedCart[1]?.productId === "15b6fc6f-327a-4ec4-896f-486349e85a3d" &&
        savedCart[1]?.quantity === 1;

      if (!isLegacyDefault) {
        return savedCart;
      }
      localStorage.removeItem("cart");
    }
  } catch (error) {
    console.warn("Could not read saved cart", error);
  }
  return [];
}
export let cart = loadCart();

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId) {
  const existingItem = cart.find((item) => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      productId,
      quantity: 1,
      deliveryOptionId: "1",
    });
  }
  saveToStorage();
}

export function setCartQuantity(productId, quantity) {
  const item = cart.find((cartItem) => cartItem.productId === productId);
  if (!item) return;
  const parsedQuantity = Number(quantity);
  if (
    !Number.isInteger(parsedQuantity) ||
    parsedQuantity < 1 ||
    parsedQuantity > 10
  )
    return;
  item.quantity = parsedQuantity;
  saveToStorage();
}

export function clearCart() {
  cart = [];
  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  const existingItem = cart.find((item) => item.productId === productId);
  if (!existingItem) return;

  existingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}

export function removeFromCart(productId) {
  cart = cart.filter((item) => item.productId !== productId);
  saveToStorage();
}
