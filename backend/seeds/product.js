import { sql } from "../config/db.js";

const SAMPLE_PRODUCTS = [
  {
    name: "ASUS TUF Gaming A15 Laptop",
    price: 175000,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Lenovo IdeaPad 5 Laptop",
    price: 142000,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Dell Latitude Business Laptop",
    price: 128000,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "27-inch Full HD Monitor",
    price: 42000,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Mechanical Gaming Keyboard",
    price: 8500,
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Wireless Optical Mouse",
    price: 3500,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "1 TB NVMe SSD",
    price: 12500,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "USB-C Multiport Hub",
    price: 5500,
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop&q=60",
  },
];

async function seedDatabase() {
  const [{ has_products: hasProducts }] = await sql`
    SELECT EXISTS (SELECT 1 FROM products) AS has_products
  `;

  if (hasProducts) {
    console.log("Products already exist; seed skipped.");
    return;
  }

  for (const product of SAMPLE_PRODUCTS) {
    await sql`
      INSERT INTO products (name, price, image)
      VALUES (${product.name}, ${product.price}, ${product.image})
    `;
  }

  console.log("Sample products added.");
}

seedDatabase().catch((error) => {
  console.error("Could not seed products:", error);
  process.exitCode = 1;
});
