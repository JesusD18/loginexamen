import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles2.css";

const UsuarioForm = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState({
        name: "",
        email: "",
        last_name: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario({ ...usuario, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        
        axios.post("http://44.211.247.240/users/crearusuario", usuario)
            .then(() => {
                setLoading(false);
                setSuccess(true);
                console.log("Registro exitoso. Redirigiendo...");
                setTimeout(() => {
                    navigate("/users/login");
                }, 2000);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    };

    return (
        <div className="form-container">
            <h2>Registro de Usuario</h2>
            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Registrando usuario...</p>
                </div>
            ) : success ? (
                <div className="success-container">
                    <p>Registro exitoso. Cargando...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Nombre</label>
                    <input type="text" name="name" placeholder="Nombre" onChange={handleChange} required />

                    <label htmlFor="email">Correo</label>
                    <input type="email" name="email" placeholder="Correo" onChange={handleChange} required />

                    <label htmlFor="last_name">Apellido</label>
                    <input type="text" name="last_name" placeholder="Apellido" onChange={handleChange} required />

                    <label htmlFor="password">Contraseña</label>
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Contraseña" 
                        onChange={handleChange} 
                        required 
                        pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$" 
                        title="La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo como #, @, $, etc."
                    />

                    <button type="submit">Agregar Usuario</button>
                    <p><span onClick={() => navigate("/users/login")} style={{ cursor: "pointer", color: "blue", textDecoration: "none" }}>Regresar al Inicio</span></p>
                </form>
            )}
        </div>
    );
};

const styles = {
    formContainer: {
        width: "300px",
        margin: "auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        textAlign: "center",
        backgroundColor: "#f9f9f9"
    },
    loadingContainer: {
        textAlign: "center",
        fontSize: "1.2em",
        color: "#333"
    },
    successContainer: {
        textAlign: "center",
        fontSize: "1.2em",
        color: "green",
        fontWeight: "bold"
    },
    spinner: {
        width: "40px",
        height: "40px",
        border: "4px solid rgba(0, 0, 0, 0.1)",
        borderTop: "4px solid #007bff",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        margin: "10px auto"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },
    button: {
        padding: "10px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    }
};

// Animación dentro de JSX
const styleTag = document.createElement("style");
styleTag.innerHTML = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleTag);

export default UsuarioForm;
