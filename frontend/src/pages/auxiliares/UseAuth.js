import { useEffect, useState } from 'react';

const useAuth = () => {
    const [authData, setAuthData] = useState({ userId: null, isAdmin: false });

    useEffect(() => {
        // Obtén los valores almacenados en el localStorage al cargar el hook
        const storedAuthData = JSON.parse(localStorage.getItem('authData'));

        if (storedAuthData) {
            setAuthData(storedAuthData);
        }
    }, []);

    const login = (id, isAdminStatus) => {
        // Crea un objeto con los datos de autenticación
        const data = { userId: id, isAdmin: isAdminStatus };
        localStorage.setItem('authData', JSON.stringify(data));
        setAuthData(data);
    };

    const logout = () => {
        // Elimina los datos del localStorage al hacer logout
        localStorage.removeItem('authData');
        setAuthData({ userId: null, isAdmin: false });
    };

    const hasAccessToRoute = (route) => {
        const adminRoutes = [
            '/admin-dashboard',
        ];

        if (adminRoutes.includes(route) && !authData.isAdmin) {
            return false; // No tiene acceso
        }
        return true; // Tiene acceso
    };

    return {
        ...authData,
        login,
        logout,
        hasAccessToRoute,
    };
};

export default useAuth;
