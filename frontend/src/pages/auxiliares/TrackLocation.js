import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TrackLocation = () => {
    const location = useLocation();


    useEffect(() => {
        const validRoutes = [
            '/login',
            '/registrarse',
            '/inicio',
            '/perfil',
            '/playlist',
            '/favoritos',
            '/radio',
        ];
        const currentPath = location.pathname.toLowerCase(); // Convierte la ruta a minúsculas
        // Verifica si la ruta actual (en minúsculas) es válida
        if (validRoutes.includes(currentPath)) {
            localStorage.setItem('previousPath', currentPath);
        }
    }, [location]);

    return null;
};

export default TrackLocation;