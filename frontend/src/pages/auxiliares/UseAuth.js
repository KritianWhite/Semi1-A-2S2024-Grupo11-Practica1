import { useEffect, useState } from 'react';

const UseAuth = () => {
    const [authData, setAuthData] = useState({ userId: null, isAdmin: false });

    useEffect(() => {
        // Obtén los valores almacenados en el localStorage al cargar el hook
        const storedAuthData = JSON.parse(localStorage.getItem('authData'));

        if (storedAuthData) {
            setAuthData(storedAuthData);
        }
    }, []);

    const login = (id, isAdminStatus) => {
        // Asegúrate de que isAdminStatus sea true si el usuario es administrador
        const data = { userId: id, isAdmin: isAdminStatus };
        localStorage.setItem('authData', JSON.stringify(data));
        setAuthData(data);
        console.log('Login data set:', data); // Verifica que los datos sean correctos
    };

    const logout = () => {
        // Elimina los datos del localStorage al hacer logout
        localStorage.removeItem('authData');
        setAuthData({ userId: null, isAdmin: false });
    };

    const hasAccessToRoute = (route) => {
        const adminRoutes = [
            '/dashboard-admin',
        ];

        // Convierte la ruta a minúsculas para asegurar una comparación precisa
        const lowerCaseRoute = route.toLowerCase();
        const storedAuthData = JSON.parse(localStorage.getItem('authData'));

        if (adminRoutes.includes(route) && !storedAuthData.isAdmin) {
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

export default UseAuth;
