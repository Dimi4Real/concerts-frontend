'use client'
import { useForm } from "react-hook-form";
import { Button, Col, Row } from "reactstrap";
import { post } from "@/core/httpClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
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
            await post("/auth/register", { ...data, role: "FAN" });
            router.push('/login');
        } catch (err) {
            setError("Greška pri registraciji. Pokušajte ponovo.");
        }
    };

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-md-4">
                <div className="card auth-card">
                    <h3 className="mb-4 text-center">Registracija</h3>

                    {error && (
                        <div className="alert alert-danger">{error}</div>
                    )}

                    <Row className="mb-3">
                        <Col md={12}>
                            <label className="form-label">Ime</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ime"
                                {...register("firstName", {
                                    required: "Ime je obavezno!",
                                    minLength: { value: 2, message: "Minimum 2 karaktera" }
                                })}
                            />
                            {errors.firstName && (
                                <span className="text-danger">{errors.firstName.message}</span>
                            )}
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={12}>
                            <label className="form-label">Prezime</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Prezime"
                                {...register("lastName", {
                                    required: "Prezime je obavezno!",
                                    minLength: { value: 2, message: "Minimum 2 karaktera" }
                                })}
                            />
                            {errors.lastName && (
                                <span className="text-danger">{errors.lastName.message}</span>
                            )}
                        </Col>
                    </Row>

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
                                    minLength: { value: 6, message: "Minimum 6 karaktera" }
                                })}
                            />
                            {errors.password && (
                                <span className="text-danger">{errors.password.message}</span>
                            )}
                        </Col>
                    </Row>

                    <Button
                        className="btn btn-success w-100"
                        type="button"
                        onClick={() => handleSubmit(onSubmit)()}
                    >
                        Registruj se
                    </Button>

                    <div className="text-center mt-3">
                        <a href="/login" className="text-decoration-none">
                            Već imate nalog? Prijavite se
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}