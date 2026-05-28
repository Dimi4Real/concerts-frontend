'use client'
import { useForm } from "react-hook-form";
import { Button, Col, Row } from "reactstrap";
import { post } from "@/core/httpClient";
import { useAuth, authAction } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
    const { dispatch } = useAuth();
    const router = useRouter();
    const [error, setError] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ mode: "onSubmit" });

    const onSubmit = async (data) => {
        try {
            setError(null);
            const response = await post("/auth/login", data);
            const result = response.data;

            // Cuvamo token u localStorage
            localStorage.setItem('token', result.token);
            localStorage.setItem('refreshToken', result.refreshToken);
            localStorage.setItem('user', JSON.stringify({
                email: result.email,
                role: result.role,
                firstName: result.firstName,
                lastName: result.lastName
            }));

            // Azuriramo globalno stanje
            dispatch({
                type: authAction.LOGIN,
                payload: {
                    token: result.token,
                    user: {
                        email: result.email,
                        role: result.role,
                        firstName: result.firstName,
                        lastName: result.lastName
                    }
                }
            });

            router.push('/events');
        } catch (err) {
            setError("Pogrešan email ili lozinka!");
        }
    };

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-md-4">
                <div className="card auth-card">
                    <h3 className="mb-4 text-center">Prijava</h3>

                    {error && (
                        <div className="alert alert-danger">{error}</div>
                    )}

                    <Row className="mb-3">
                        <Col md={12}>
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                {...register("email", {
                                    required: "Email je obavezan!",
                                })}
                            />
                            {errors.email && (
                                <span className="text-danger">{errors.email.message}</span>
                            )}
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={12}>
                            <label className="form-label">Lozinka</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Lozinka"
                                {...register("password", {
                                    required: "Lozinka je obavezna!",
                                })}
                            />
                            {errors.password && (
                                <span className="text-danger">{errors.password.message}</span>
                            )}
                        </Col>
                    </Row>

                    <Button
                        className="btn btn-primary w-100"
                        type="button"
                        onClick={() => handleSubmit(onSubmit)()}
                    >
                        Prijavi se
                    </Button>

                    <div className="text-center mt-3">
                        <a href="/register" className="text-decoration-none">
                            Nemate nalog? Registrujte se
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}