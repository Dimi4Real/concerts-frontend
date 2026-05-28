'use client'
import "bootstrap/dist/css/bootstrap.min.css";
import "@/app/globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { AuthProvider, useAuth, authAction } from "@/contexts/authContext";
import { ListActionProvider } from "@/contexts/listActionContext";
import { useEffect } from "react";

// Posebna komponenta koja ucitava auth stanje iz localStorage
function AuthInitializer({ children }) {
    const { dispatch } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
            dispatch({
                type: authAction.LOGIN,
                payload: {
                    token: token,
                    user: JSON.parse(user)
                }
            });
        }
    }, []);

    return children;
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
        <AuthProvider>
            <AuthInitializer>
                <div className="container py-4" style={{maxWidth: '960px', margin: '0 auto'}}>
                    <Header />
                    <main>
                        <ListActionProvider>
                            {children}
                        </ListActionProvider>
                    </main>
                    <Footer />
                </div>
            </AuthInitializer>
        </AuthProvider>
        </body>
        </html>
    );
}