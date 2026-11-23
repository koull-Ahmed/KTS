import { sql } from "../config/db.js";
import {
  isValidProductId,
  validateProductInput,
} from "../lib/productValidation.js";

function sendServerError(res, error, operation) {
  console.error(`Error ${operation}:`, error);
  return res
    .status(500)
    .json({ success: false, message: "Internal server error." });
}

export async function getProducts(_req, res) {
  try {
    const products = await sql`
      SELECT * FROM products
      ORDER BY created_at DESC
    `;
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return sendServerError(res, error, "fetching products");
  }
}

export async function createProduct(req, res) {
  const result = validateProductInput(req.body);
  if (result.error) {
    return res.status(400).json({ success: false, message: result.error });
  }

  try {
    const [product] = await sql`
      INSERT INTO products (name, price, image)
      VALUES (${result.product.name}, ${result.product.price}, ${result.product.image})
      RETURNING *
    `;
    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    return sendServerError(res, error, "creating product");
  }
}

export async function getProduct(req, res) {
  const { id } = req.params;
  if (!isValidProductId(id)) {
    return res.status(400).json({ success: false, message: "Invalid product ID." });
  }

  try {
    const [product] = await sql`
      SELECT * FROM products WHERE id = ${Number(id)}
    `;
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return sendServerError(res, error, "fetching product");
  }
}

export async function updateProduct(req, res) {
  const { id } = req.params;
  if (!isValidProductId(id)) {
    return res.status(400).json({ success: false, message: "Invalid product ID." });
  }

  const result = validateProductInput(req.body);
  if (result.error) {
    return res.status(400).json({ success: false, message: result.error });
  }

  try {
    const [product] = await sql`
      UPDATE products
      SET name = ${result.product.name},
          price = ${result.product.price},
          image = ${result.product.image}
      WHERE id = ${Number(id)}
      RETURNING *
    `;
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return sendServerError(res, error, "updating product");
  }
}

export async function deleteProduct(req, res) {
  const { id } = req.params;
  if (!isValidProductId(id)) {
    return res.status(400).json({ success: false, message: "Invalid product ID." });
  }

  try {
    const [product] = await sql`
      DELETE FROM products WHERE id = ${Number(id)}
      RETURNING *
    `;
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return sendServerError(res, error, "deleting product");
  }
}
