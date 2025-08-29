export const isAuthenticated = () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return false;

        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = new Date().getTime() > payload.exp * 1000;

        return !isExpired;
    } catch (error) {
        console.error('Token validation error:', error);
        return false;
    }
};