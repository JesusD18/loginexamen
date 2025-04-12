import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

const UsuarioList = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [usuarioDetalle, setUsuarioDetalle] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const usuariosPorPagina = 3;

    const navigate = useNavigate();

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    const obtenerUsuarios = () => {
        axios.get("http://44.211.247.240/users/usuarios", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(res => setUsuarios(res.data))
        .catch(err => console.error("Error al obtener usuarios:", err));
    };

    const eliminarUsuario = (id) => {
        if (confirm("¿Seguro que deseas borrar este usuario?")) {
            axios.delete(`http://44.211.247.240/users/eliminarusuario/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
            .then(() => setUsuarios(prev => prev.filter(usuario => usuario.id !== id)))
            .catch(err => console.error("Error al eliminar usuario:", err));
        }
    };

    const obtenerDetalleUsuario = (id) => {
        axios.get(`http://44.211.247.240/users/usuario/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(res => setUsuarioDetalle(res.data))
        .catch(err => console.error("Error al obtener detalle del usuario:", err));
    };

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        navigate("/users/login");
    };

    const usuariosFiltrados = usuarios.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
    const startIndex = (currentPage - 1) * usuariosPorPagina;
    const usuariosPaginados = usuariosFiltrados.slice(startIndex, startIndex + usuariosPorPagina);

    const cambiarPagina = (pagina) => {
        if (pagina >= 1 && pagina <= totalPages) {
            setCurrentPage(pagina);
        }
    };

    return (
        <div>
            {!usuarioDetalle ? (
                <>
                    <h2>Lista de Usuarios</h2>

                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Buscar usuario"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NOMBRE</th>
                                <th>CORREO</th>
                                <th>APELLIDO</th>
                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosPaginados.length ? usuariosPaginados.map(usuario => (
                                <tr key={usuario.id}>
                                    <td>{usuario.id}</td>
                                    <td>{usuario.name}</td>
                                    <td>{usuario.email}</td>
                                    <td>{usuario.last_name}</td>
                                    <td>
                                        <Link to={`/users/actualizarusuario/${usuario.id}`}>
                                            <button>Editar</button>
                                        </Link>
                                        <button onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button>
                                        <button onClick={() => obtenerDetalleUsuario(usuario.id)}>Detalle</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5">No hay usuarios</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="paginacion">
                        <span
                            className={currentPage === 1 ? "disabled" : "link"}
                            onClick={() => cambiarPagina(currentPage - 1)}
                        >
                            ← Anterior
                        </span>
                        <span>Página {currentPage} de {totalPages}</span>
                        <span
                            className={currentPage === totalPages ? "disabled" : "link"}
                            onClick={() => cambiarPagina(currentPage + 1)}
                        >
                            Siguiente →
                        </span>
                    </div>

                    <div className="cerrar-sesion">
                        <button onClick={cerrarSesion} className="btn-rojo">Cerrar</button>
                    </div>
                </>
            ) : (
                <div className="detalle-usuario">
                    <h3>Detalle del Usuario</h3>
                    <p><strong>ID:</strong> {usuarioDetalle.id}</p>
                    <p><strong>Nombre:</strong> {usuarioDetalle.name}</p>
                    <p><strong>Apellido:</strong> {usuarioDetalle.last_name}</p>
                    <p><strong>Correo:</strong> {usuarioDetalle.email}</p>

                    <div className="volver">
                        <button onClick={() => setUsuarioDetalle(null)}>Regresar a la lista</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsuarioList;
