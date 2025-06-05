import { useFetch } from "../hooks/useApi";
import ProductCard from "../components/ProductCard";

export default function ProductosPage() {
  const productos = useFetch("productos");

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">🛒 Lista de Productos</h2>

      {productos.length === 0 ? (
        <div className="text-center text-muted">
          <p>No hay productos disponibles.</p>
        </div>
      ) : (
        <div className="row g-4">
          {productos.map((producto) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={producto.id}>
              <ProductCard producto={producto} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
