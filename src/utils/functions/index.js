export const getCartTotal = (cart) => {
  return cart?.reduce((acc, item) => acc + item.price * item.quantity, 0);
}