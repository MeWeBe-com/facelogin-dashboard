"use client"
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./style.module.css";

const Header = () => {

    return (
        <nav className="navbar navbar-expand-lg bg-white border-bottom px-3">
            <div className="container d-flex justify-content-between align-items-center">

                {/* Left: Logo & Brand Name */}
                <div className="d-flex align-items-center">
                    <Image src="/imgs/logo.png" alt="Logo" width={50} height={50} priority />
                    <span className="fw-bold ms-2">Izza Mixed Martial Arts</span>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navigation Links (Aligned to Right) */}
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item">
                            <Link className="nav-link fw-semibold text-dark" href="#">Dashboard</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-semibold text-dark" href="#">Attendees</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-semibold text-dark" href="#">Schedule</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-semibold text-dark" href="#">Reports</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-semibold text-dark" href="#">Scanner</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" href="#">
                                <i className={`bi bi-info-circle-fill ${styles.iconColor}`}></i>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="#">
                                <i className={`bi bi-gear-fill ${styles.iconColor}`}></i>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="#">
                                <i className={`bi bi-person-circle ${styles.iconColor}`}></i>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
