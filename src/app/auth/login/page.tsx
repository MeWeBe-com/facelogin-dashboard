"use client";
import React from "react";
import Image from "next/image";
import styles from './login.module.css';
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
    const router = useRouter();

    return (
        <div className="d-flex justify-content-center align-items-center mt-3">
            <div>
                {/* Logo */}
                <div className="text-center">
                    <Image src="/imgs/logo.png" alt="Logo" className="mb-3" width={80} height={80} priority />
                </div>

                {/* Login Card */}
                <div className="p-4" style={{ width: "450px", maxWidth: '90%', margin: '0 auto' }}>
                    <div className="text-center mb-3" style={{ fontSize: 27, fontWeight: 400 }}>Log In for Face Login</div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className={`form-control ${styles.myInput}`} />
                    </div>

                    <div className="mb-1">
                        <label className="form-label">Password</label>
                        <input type="password" className={`form-control ${styles.myInput}`} />
                    </div>

                    <div className="d-flex justify-content-between mb-3">
                        <div>
                            <input type="checkbox" id="rememberMe" />
                            <label htmlFor="rememberMe" className="ms-2">Remember me</label>
                        </div>
                        <Link href="/auth/forgotpassword" className={styles.forgot}>Forgot password?</Link>
                    </div>

                    <button className={`btn w-100 ${styles.loginBtn}`}>Log In</button>
                    
                </div>
            </div>
        </div>
    );
};

export default Login;
