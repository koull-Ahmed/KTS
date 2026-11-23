const MAX_PRICE = 99_999_999.99;
const MAX_DATA_IMAGE_LENGTH = 5_592_431;
const IMAGE_DATA_PATTERN =
  /^data:image\/(?:jpeg|png|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/;

export function validateProductInput(body) {
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const image = typeof body?.image === "string" ? body.image.trim() : "";
  const rawPrice = body?.price;
  const priceString =
    typeof rawPrice === "number" || typeof rawPrice === "string"
      ? String(rawPrice).trim()
      : "";

  if (!name || !priceString || !image) {
    return { error: "Name, price, and image are required." };
  }
  if (name.length > 255) {
    return { error: "Product name must be 255 characters or fewer." };
  }
  if (!/^\d+(?:\.\d{1,2})?$/.test(priceString)) {
    return { error: "Price must be a non-negative number with up to 2 decimals." };
  }

  const price = Number(priceString);
  if (!Number.isFinite(price) || price > MAX_PRICE) {
    return { error: "Price exceeds the allowed limit." };
  }

  if (image.startsWith("data:")) {
    if (!IMAGE_DATA_PATTERN.test(image)) {
      return { error: "Image data must be a JPG, PNG, WEBP, or GIF." };
    }
    if (image.length > MAX_DATA_IMAGE_LENGTH) {
      return { error: "Image must be 4 MB or smaller." };
    }
  } else {
    if (image.length > 2048) {
      return { error: "Image URL must be 2048 characters or fewer." };
    }

    try {
      const url = new URL(image);
      if (
        !["http:", "https:"].includes(url.protocol) ||
        url.username ||
        url.password
      ) {
        return { error: "Image URL must use HTTP or HTTPS." };
      }
    } catch {
      return { error: "Enter a valid HTTP or HTTPS image URL." };
    }
  }

  return { product: { name, price, image } };
}

export function isValidProductId(id) {
  return /^[1-9]\d*$/.test(id) && Number(id) <= 2_147_483_647;
}
