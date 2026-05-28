export default function Footer() {
    return (
        <footer className="pt-4 my-md-5 pt-md-5 border-top">
            <div className="row">
                <div className="col-12 col-md">
                    <span className="fs-4">🎵 Concerts App</span>
                    <small className="d-block mb-3 text-muted">© 2025</small>
                </div>
                <div className="col-6 col-md">
                    <h5>Navigacija</h5>
                    <ul className="list-unstyled text-small">
                        <li className="mb-1">
                            <a className="link-secondary text-decoration-none" href="/events">
                                Koncerti
                            </a>
                        </li>
                        <li className="mb-1">
                            <a className="link-secondary text-decoration-none" href="/artists">
                                Izvođači
                            </a>
                        </li>
                        <li className="mb-1">
                            <a className="link-secondary text-decoration-none" href="/venues">
                                Mesta
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}