'use client'
import Link from "next/link";
import { useAuth, authAction } from "@/contexts/authContext";
import { useRouter } from "next/navigation";

export default function Header() {
    const { state, dispatch } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        dispatch({ type: authAction.LOGOUT });
        router.push('/login');
    };

    return (
        <header>
            <div className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
                <Link href="/" className="d-flex align-items-center text-dark text-decoration-none">
                    <span className="fs-4">🎵 Concerts App</span>
                </Link>

                <nav className="d-inline-flex mt-2 mt-md-0 ms-md-auto align-items-center">
                    <Link href="/events" className="me-3 py-2 text-dark text-decoration-none">
                        Koncerti
                    </Link>
                    <Link href="/artists" className="me-3 py-2 text-dark text-decoration-none">
                        Izvođači
                    </Link>
                    <Link href="/venues" className="me-3 py-2 text-dark text-decoration-none">
                        Mesta
                    </Link>

                    {state.isAuthenticated ? (
                        <>
                            <span className="me-3 py-2 text-muted">
                                {state.user?.firstName} ({state.user?.role})
                            </span>
                            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                                Odjavi se
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="btn btn-primary btn-sm">
                            Prijavi se
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}