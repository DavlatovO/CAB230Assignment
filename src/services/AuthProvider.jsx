import { createContext, useContext, useEffect, useState } from "react";
import API_URL from "../config";

const AuthContext = createContext(null);

export function AuthProvider({children}) {
    const[user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);


    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser && savedUser !== "null") {
            setUser(savedUser);  // restore from localStorage
        } else {
            setUser(null);
        }
        setAuthLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await fetch(`${API_URL}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({email, password})
        });
        
        if(!response.ok){
            throw new Error(`Htttp error: ${response.status}`);
        }
        const data = await response.json();
        setUser(email);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', email);

        return data;
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{user, login, logout, authLoading}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext);