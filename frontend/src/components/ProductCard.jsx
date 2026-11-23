import { EditIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore.js"; // Import the useProductStore hook
import { formatAlgerianPrice } from "../utils/formatPrice";

function ProductCard({ product }) {
    const { deleteProduct } = useProductStore(); // Import the deleteProduct function from the store
   
  return (
    <div className="card group overflow-hidden bg-base-100 shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl motion-reduce:transform-none">
      {/* PRODUCT IMAGE */}
      <figure className="relative pt-[56.25%]">
        <img
          src={product.image}
          alt={product.name}
          className="absolute top-0 left-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transform-none"
        />
      </figure>

      <div className="card-body">
        {/* PRODUCT INFO */}
        <h2 className="card-title text-lg font-semibold">{product.name}</h2>
        <p className="text-2xl font-bold text-primary">
          {formatAlgerianPrice(product.price)}
        </p>

        {/* CARD ACTIONS */}
        <div className="card-actions justify-end mt-4">
          <Link
            to={`/product/${product.id}`}
            className="btn btn-sm btn-info btn-outline"
            aria-label={`Edit ${product.name}`}
          >
            <EditIcon className="size-4" />
          </Link>

          <button className="btn btn-sm btn-error btn-outline" onClick={() => deleteProduct(product.id)} aria-label={`Delete ${product.name}`}>
            <Trash2Icon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;