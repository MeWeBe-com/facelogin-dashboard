"use client"
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./style.module.css";
import { useRouter } from "next/navigation";

const Header = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const closeNavbar = () => setIsOpen(false);

    const onLogout = () => {
        closeNavbar();
        localStorage.removeItem('id');
        router.push("/auth/login");
    }

    return (
        <nav className="navbar navbar-expand-lg bg-white border-bottom px-3">
            <div className="container d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <Link href="/main/dashboard" style={{ textDecoration: 'none' }}>
                        <Image src="/imgs/logo.png" alt="Logo" width={50} height={50} priority />
                        <span className="fw-bold ms-2 text-dark" >Attendance Pass</span>
                    </Link>
                </div>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse justify-content-end ${isOpen ? "show" : ""}`} id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center gap-4">
                        <li className="nav-item">
                            <Link className="nav-link fw-semibold text-dark" href="/main/dashboard" onClick={closeNavbar}>Dashboard</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link fw-semibold text-dark" href="/main/attendees" onClick={closeNavbar}>Attendees</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link fw-semibold text-dark" href="/main/schedule" onClick={closeNavbar}>Schedule</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link fw-semibold text-dark" href="/main/reports" onClick={closeNavbar}>Reports</Link>
                        </li>

                        {/* <li className="nav-item">
                            <Link className="nav-link fw-semibold text-dark" href="">Scanner</Link>
                        </li> */}

                        <li className="nav-item">
                            <Link className="nav-link" href="#" onClick={closeNavbar}>
                                <i className={`bi bi-info-circle-fill ${styles.iconColor}`}></i>
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" href="/main/settings" onClick={closeNavbar}>
                                <i className={`bi bi-gear-fill ${styles.iconColor}`}></i>
                            </Link>
                        </li>

                        <li className="nav-item dropdown">
                            <button type="button" className="btn btn-outline dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className={`bi bi-person-circle ${styles.iconColor}`}></i>
                            </button>

                            <ul className="dropdown-menu" data-bs-display="static">
                                <li onClick={onLogout}>
                                    <span className="dropdown-item">Log Out</span>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
