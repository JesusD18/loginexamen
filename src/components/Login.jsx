import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "font-awesome/css/font-awesome.min.css"; // Agrega esta línea
import "./Login.css"; 

const Login = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [intentos, setIntentos] = useState(0);
    const [bloqueado, setBloqueado] = useState(false);
    const [tiempoRestante, setTiempoRestante] = useState(0);
    const [mostrarContrasena, setMostrarContrasena] = useState(false);

    useEffect(() => {
        const bloqueo = localStorage.getItem("bloqueo");
        if (bloqueo) {
            const tiempoTranscurrido = Date.now() - parseInt(bloqueo, 10);
            if (tiempoTranscurrido < 60000) {
                setBloqueado(true);
                setTiempoRestante(60 - Math.floor(tiempoTranscurrido / 1000));
                const interval = setInterval(() => {
                    setTiempoRestante(prev => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            setBloqueado(false);
                            setUsuario({ email: "", password: "" });
                            setError("");
                            localStorage.removeItem("bloqueo");
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
                return () => clearInterval(interval);
            }
        }
    }, []);

    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (bloqueado) return;

        setLoading(true);
        setError("");
        
        axios.post("http://44.211.247.240/users/login", usuario, {
            headers: { "Content-Type": "application/json" }
        })
        .then(response => {
            if (response.data.access_token) {
                localStorage.setItem("token", response.data.access_token);
                navigate("/users/usuarios");
                window.location.reload();
            } else {
                manejarIntentoFallido();
            }
        })
        .catch(() => {
            manejarIntentoFallido();
        });
    };

    const manejarIntentoFallido = () => {
        setLoading(false);
        setError("Error al iniciar sesión, revise sus datos.");
        setIntentos(prev => {
            const nuevosIntentos = prev + 1;
            if (nuevosIntentos >= 3) {
                setBloqueado(true);
                setTiempoRestante(60);
                localStorage.setItem("bloqueo", Date.now().toString());
                const interval = setInterval(() => {
                    setTiempoRestante(prev => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            setBloqueado(false);
                            setUsuario({ email: "", password: "" });
                            setError("");
                            localStorage.removeItem("bloqueo");
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
            return nuevosIntentos;
        });
    };

    return (
        <div className="form-container">
            <div className="form-box">
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleLogin}>
                    <label>Email</label>
                    <input type="email" name="email" placeholder="Correo electrónico" value={usuario.email} onChange={handleChange} required disabled={bloqueado} />

                    <label>Contraseña</label>
                    <div className="password-container">
                        <input 
                            type={mostrarContrasena ? "text" : "password"} 
                            name="password" 
                            placeholder="Contraseña" 
                            value={usuario.password} 
                            onChange={handleChange} 
                            required 
                            disabled={bloqueado} 
                        />
                        <span 
                            className="toggle-password" 
                            onClick={() => setMostrarContrasena(!mostrarContrasena)}
                            style={{ cursor: "pointer", marginLeft: "8px" }}
                        >
                            <i className={`fa ${mostrarContrasena ? "fa-eye-slash" : "fa-eye"}`} /> {/* Aquí usamos los iconos de FontAwesome */}
                        </span>
                    </div>
                    
                    {bloqueado ? (
                        <p className="error-message">Demasiados intentos fallidos. Intente de nuevo en {tiempoRestante} segundos.</p>
                    ) : loading ? (
                        <div className="loading-animation">Iniciando sesión...</div>
                    ) : (
                        <button type="submit">Iniciar sesión</button>
                    )}
                    {error && <p className="error-message">{error}</p>}
                    
                    <p>
                        ¿No tiene cuenta? {" "}
                        <span onClick={() => navigate("/users/crearusuario")} style={{ cursor: "pointer", color: "blue", textDecoration: "none" }}>Regístrese</span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
