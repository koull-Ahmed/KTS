import test from "node:test";
import assert from "node:assert/strict";
import { isValidProductId, validateProductInput } from "./productValidation.js";

test("validates and normalizes product input", () => {
  const result = validateProductInput({
    name: "  Laptop  ",
    price: "125000.50",
    image: "https://example.com/laptop.jpg",
  });

  assert.deepEqual(result, {
    product: {
      name: "Laptop",
      price: 125000.5,
      image: "https://example.com/laptop.jpg",
    },
  });
});

test("rejects invalid prices and image URLs", () => {
  assert.match(
    validateProductInput({
      name: "Laptop",
      price: "-1",
      image: "https://example.com/laptop.jpg",
    }).error,
    /Price/,
  );
  assert.match(
    validateProductInput({
      name: "Laptop",
      price: "100",
      image: "javascript:alert(1)",
    }).error,
    /HTTP or HTTPS/,
  );
});

test("accepts bounded local image data and rejects oversized data", () => {
  const image = "data:image/png;base64,AAAA";
  assert.equal(
    validateProductInput({ name: "Laptop", price: 100, image }).product.image,
    image,
  );

  const oversizedImage = `data:image/png;base64,${"A".repeat(5_592_410)}`;
  assert.match(
    validateProductInput({ name: "Laptop", price: 100, image: oversizedImage }).error,
    /4 MB/,
  );
});

test("accepts only positive serial product IDs", () => {
  assert.equal(isValidProductId("8"), true);
  assert.equal(isValidProductId("0"), false);
  assert.equal(isValidProductId("1.5"), false);
  assert.equal(isValidProductId("2147483648"), false);
});
