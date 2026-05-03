import { createContext, useContext, useEffect, useState } from "react";
import API_URL from "../config";

const AuthContext = createContext(null);

export function AuthProvider({children}) {
    const[user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);


    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("email");

        if (token && savedUser) {
            setUser(savedUser);  // restore from localStorage
        }
        setAuthLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify({email, password})
            });
        
            const data = await response.json();
            
            if(!response.ok){
                return { success: false, message: data.message || "Invalid email or password" };   
            }
            setUser(email);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', email);
            return { success:true, message: "Login successfull" };
        
            return data;
        } catch(err){
            return {success: false, message: "Network error. Please try again."};
        }
    };

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