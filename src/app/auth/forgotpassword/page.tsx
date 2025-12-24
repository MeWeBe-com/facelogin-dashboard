"use client";
import React from "react";
import Image from "next/image";
import styles from './fpassword.module.css';
import { useRouter } from "next/navigation";
import Link from "next/link";

const ForgotPassword = () => {
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
                    <div className="text-center mb-3" style={{ fontSize: 27, fontWeight: 400 }}>
                        Forgot Password
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className={`form-control ${styles.myInput}`} />
                    </div>

                    <button className={`btn w-100 ${styles.loginBtn}`} onClick={() => router.push("/main/home")}>Submit</button>

                    <p className="text-center mt-3">
                        <Link href="/auth/login" className={styles.forgot}>Back to login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
