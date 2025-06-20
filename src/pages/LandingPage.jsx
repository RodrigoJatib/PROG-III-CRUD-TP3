import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";


export default function LandingPage() {
  return (
    <div className="bg-light vh-100 w-100 d-flex align-items-center justify-content-center">

    

      <div className="text-center p-5 bg-white rounded shadow" style={{ maxWidth: 500 }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2933/2933886.png"
          alt="Soda Logo"
          width="100"
          className="mb-3"
        />
        <h1 className="mb-3">Sodería Nevada</h1>
        <p className="text-muted">
          Sistema de gestión de ventas para empleados y clientes. Simple, rápido y eficiente.
        </p>

        <div className="d-grid gap-3 mt-4">
          <Link to="/login" className="btn btn-primary">
            <i className="bi bi-person-circle me-2"></i> Ingresar
          </Link>
          <a
            href="https://github.com/RodrigoJatib/PROG-III-CRUD-TP3.git" // opcional
            className="btn btn-outline-dark"
            target="_blank"
          >
            <i className="bi bi-github me-2"></i> Ver proyecto en GitHub
          </a>
        </div>
      </div>
      
    </div>
  );
}