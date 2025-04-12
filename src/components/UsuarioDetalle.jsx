import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

// Componente para mostrar detalle del usuario
const UsuarioDetalle = ({ usuario, onClose }) => {
    return (
        <div className="card" style={{
            marginTop: "20px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            width: "300px",
            marginLeft: "auto",
            marginRight: "auto",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
        }}>
            <h3>Detalle del Usuario</h3>
            <p><strong>ID:</strong> {usuario.id}</p>
            <p><strong>Nombre:</strong> {usuario.name}</p>
            <p><strong>Apellido:</strong> {usuario.last_name}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <button onClick={onClose} style={{ marginTop: "10px" }}>
                Cerrar Detalle
            </button>
        </div>
    );
};

const UsuarioList = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [usuarioDetalle, setUsuarioDetalle] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("https://44.211.247.240/users/usuarios", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            setUsuarios(response.data);
        })
        .catch(error => console.error("Error al obtener usuarios:", error));
    }, []);

    const mostrarDetalleUsuario = (id) => {
        axios.get(`https://44.211.247.240/users/usuario/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            setUsuarioDetalle(response.data);
        })
        .catch(error => console.error("Error al obtener detalle:", error));
    };

    const handleRegresar = () => {
        navigate("/users/login");
    };

    const filteredUsers = usuarios.filter(usuario =>
        usuario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2>Lista de Usuarios</h2>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Buscar usuario"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "250px" }}
                />
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NOMBRE</th>
                        <th>CORREO</th>
                        <th>APELLIDO</th>
                        <th>DETALLE</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(usuario => (
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td>{usuario.name}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.last_name}</td>
                                <td>
                                    <button onClick={() => mostrarDetalleUsuario(usuario.id)}>Detalle</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No hay usuarios</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Detalle del usuario seleccionado */}
            {usuarioDetalle && (
                <UsuarioDetalle 
                    usuario={usuarioDetalle} 
                    onClose={() => setUsuarioDetalle(null)} 
                />
            )}

            <div style={{ marginTop: "10px", textAlign: "center" }}>
                <button 
                    onClick={handleRegresar}
                    style={{
                        backgroundColor: "red",
                        color: "white",
                        fontSize: "12px",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        width: "100px"
                    }}
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default UsuarioList;
