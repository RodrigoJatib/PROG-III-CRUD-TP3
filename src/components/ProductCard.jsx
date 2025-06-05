export default function ProductCard({ producto}) {
    return (
        <div className="card m-2" style={{ width: "18rem" }}>
        
            <div className="card-body">
                <h5 className="card-title">{producto.nombre}</h5>
                <p className="card-text">${producto.precio}</p>
                <p className="card-text text-muted">{producto.descripcion}</p>
            </div>
        
        </div>
    );
}
// This code defines a ProductCard component that displays a product's name and price in a card format.
// It takes a `producto` prop, which is expected to be an object with `nombre` and `precio` properties.
// The component uses Bootstrap classes for styling, including a card layout with a title and text.
// The card is styled with a width of 18rem and has a margin of 2 units on all sides.