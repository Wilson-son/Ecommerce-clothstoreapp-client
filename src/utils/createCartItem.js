export const createCartItem = (product, extras = {}) => {
  return {
    _id: product._id,
    name: product.name,
    image: product.images?.[0]?.url || "",
    price: product.price,
    qty: extras.qty || 1,
    size: extras.size || "M",
    color: product.color?.name || "Default",
    colorHex: product.color?.hex || "#999",
    sizes: extras.sizes || product.sizes || [],
  };
};