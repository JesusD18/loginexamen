import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles2.css";

const UsuarioEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState({
        id: "",
        name: "",
        email: "",
        last_name: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get(`http://44.211.247.240/users/usuario/${id}`)
            .then(response => {
                console.log("Datos recibidos:", response.data);
                setUsuario(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error al cargar el usuario:", error);
                setIsLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage("Actualizando usuario...");

        axios.put(`http://44.211.247.240/users/actualizarusuario/${id}`, usuario)
            .then(response => {
                console.log("Respuesta del servidor:", response.data);
                setMessage("Actualización exitosa. Redirigiendo...");
                setTimeout(() => navigate("/users/usuarios"), 2000);
            })
            .catch(error => {
                console.error("Error al actualizar el usuario:", error);
                setMessage("Hubo un error al actualizar el usuario.");
                setIsUpdating(false);
            });
    };

    return (
        <div className="form-container">
            <h2>Editar Usuario</h2>
            
            {isLoading ? (
                <p className="loading-message">Cargando datos del usuario...</p>
            ) : isUpdating ? (
                <p className="loading-message">{message}</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="id">ID</label>
                    <input type="text" name="id" value={usuario.id} onChange={handleChange} required disabled />

                    <label htmlFor="name">Nombre</label>
                    <input type="text" name="name" value={usuario.name} onChange={handleChange} required />

                    <label htmlFor="email">Correo</label>
                    <input type="email" name="email" value={usuario.email} onChange={handleChange} required />

                    <label htmlFor="last_name">Apellido</label>
                    <input type="text" name="last_name" value={usuario.last_name} onChange={handleChange} required />

                    <label htmlFor="password">Contraseña</label>
                    <input type="password" name="password" value={usuario.password} onChange={handleChange} required 
                        pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$" 
                        title="La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo como #, @, $, etc." 
                    />

                    <div className="button-group">
                        <button type="submit" disabled={isUpdating}>
                            {isUpdating ? "Cargando..." : "Actualizar Usuario"}
                        </button>
                        <button type="button" onClick={() => navigate("/users/usuarios")} className="cancel-button">
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UsuarioEdit;
