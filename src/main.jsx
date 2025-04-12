import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


import HomeTabla from "./pages/HomeTabla"; 



import UsuarioEdit from "./components/UsuarioEdit";



import Login from "./components/Login";




import UsuarioForm from "./components/UsuarioForm";


import HomeUsuario from "./pages/HomeUsuario";
import HomeDetalle from "./pages/HomeDetalle";

// Función para verificar si el usuario está autenticado
const isAuthenticated = () => {
    const token = localStorage.getItem("token"); // Verificar si hay token
    return !!token; // Devuelve true si el token existe
};

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/users/login" />} /> {/* Redirige al login */}
            <Route path="/users/login" element={<Login />} />

            

            <Route
                path="/users/usuarios"
                element={isAuthenticated() ? <HomeTabla /> : <Navigate to="/users/usuarios" />}
            />

            <Route
                path="/users/usuario"
                element={isAuthenticated() ? <HomeDetalle /> : <Navigate to="/users/usuarios" />}
            />
    

            <Route
                path="/users/usuario"
                element={isAuthenticated() ? <HomeUsuario /> : <Navigate to="/users/usuarios" />}
            />

            <Route
                path="/users/actualizarusuario/:id"
                element={isAuthenticated() ? <UsuarioEdit /> : <Navigate to="/users/usuarios" />}
            />
            

            <Route path="/users/crearusuario" element={<UsuarioForm />} /> {/* Formulario de registro */}
        


        </Routes>
    </BrowserRouter>
);
