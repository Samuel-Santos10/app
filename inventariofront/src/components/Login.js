import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
   const [email, setEmail] = useState("");
   const [token, setToken] = useState("");
   const [message, setMessage] = useState("");
   const [loading, setLoading] = useState(false);
   const [tokenRequested, setTokenRequested] = useState(false);

   // Hook para navegación
   const navigate = useNavigate();

   const requestToken = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage("");

      try {
         const response = await axios.post(
            "http://localhost:8000/api/request-token",
            { email }
         );
         setMessage(response.data.message);
         setTokenRequested(true);
         setLoading(false);
      } catch (error) {
         setMessage(
            error.response?.data?.message || "Error al solicitar el token"
         );
         setLoading(false);
      }
   };

   const login = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage("");

      try {
         const response = await axios.post("http://localhost:8000/api/login", {
            email,
            token,
         });

         // Almacenar el token en localStorage
         localStorage.setItem("auth_token", response.data.token);
         localStorage.setItem("user_email", email);

         // Redireccionar a la página de productos
         navigate("/show");
      } catch (error) {
         setMessage(error.response?.data?.message || "Error al iniciar sesión");
         setLoading(false);
      }
   };

   return (
      <div className="container mt-5">
         <div className="card">
            <div className="card-header bg-primary text-white">
               <h3>Autenticación sin contraseña</h3>
            </div>
            <div className="card-body">
               {message && (
                  <div
                     className={`alert ${
                        message.includes("Error")
                           ? "alert-danger"
                           : "alert-success"
                     }`}
                  >
                     {message}
                  </div>
               )}

               {!tokenRequested ? (
                  <form onSubmit={requestToken}>
                     <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                           Correo electrónico
                        </label>
                        <input
                           type="email"
                           className="form-control"
                           id="email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           required
                        />
                     </div>
                     <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                     >
                        {loading
                           ? "Solicitando token..."
                           : "Solicitar token de acceso"}
                     </button>
                  </form>
               ) : (
                  <form onSubmit={login}>
                     <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                           Correo electrónico
                        </label>
                        <input
                           type="email"
                           className="form-control"
                           id="email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           required
                           readOnly
                        />
                     </div>
                     <div className="mb-3">
                        <label htmlFor="token" className="form-label">
                           Token recibido por correo
                        </label>
                        <input
                           type="text"
                           className="form-control"
                           id="token"
                           value={token}
                           onChange={(e) => setToken(e.target.value)}
                           required
                        />
                     </div>
                     <div className="d-flex gap-2">
                        <button
                           type="submit"
                           className="btn btn-success"
                           disabled={loading}
                        >
                           {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                        </button>
                        <button
                           type="button"
                           className="btn btn-secondary"
                           onClick={() => setTokenRequested(false)}
                           disabled={loading}
                        >
                           Volver
                        </button>
                     </div>
                  </form>
               )}
            </div>
         </div>
      </div>
   );
};

export default Login;
