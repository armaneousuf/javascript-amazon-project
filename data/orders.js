function readOrders() {
  try {
    const orders = JSON.parse(localStorage.getItem("orders"));
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}

export function getOrders() {
  return readOrders();
}

export function getOrder(orderId) {
  return readOrders().find((order) => order.id === orderId);
}

export function placeOrder(cart, totalCents) {
  const orders = readOrders();
  const order = {
    id: crypto.randomUUID(),
    orderTime: Date.now(),
    totalCents,
    products: cart.map((item) => ({ ...item })),
  };
  orders.unshift(order);
  localStorage.setItem("orders", JSON.stringify(orders));
  return order;
}
