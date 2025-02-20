"use client";
import Image from "next/image";
import styles from './createattendee.module.css';
import { useRouter } from "next/navigation";

export default function CreateAttendee() {
    const router = useRouter();

    return (
        <>
            <div className="container mt-5">
                <h2 className="fw-bold">Create Attendee (User)</h2>
            </div>

            <div className="d-flex justify-content-center align-items-center mt-3">
                <div>
                    {/* Logo */}
                    <div className="text-center">
                        <div className={`text-muted ${styles.uploadBox} d-flex align-items-center justify-content-center`}>
                            Click to Upload an Image
                        </div>
                    </div>

                    {/* Login Card */}
                    <div className="p-4" style={{ width: "450px", maxWidth: '90%', margin: '0 auto' }}>

                        <div className="mb-3">
                            <label className="form-label">First Name</label>
                            <input type="text" className={`form-control ${styles.myInput}`} />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Last Name</label>
                            <input type="text" className={`form-control ${styles.myInput}`} />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className={`form-control ${styles.myInput}`} />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Phone Number</label>
                            <input type="tel" className={`form-control ${styles.myInput}`} />
                        </div>

                        <div className="mb-3">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="instructor" />
                                <label className="form-check-label" htmlFor="instructor">
                                    Is Instructor
                                </label>
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="admin" />
                                <label className="form-check-label" htmlFor="admin">
                                    Is Admin
                                </label>
                            </div>
                        </div>

                        <div className={`d-flex align-items-center justify-content-between mt-5 ${styles.dflex}`}>
                            <div>
                                <button className={`btn w-100 ${styles.cancelBtn}`} onClick={() => router.push("/main/attendance")}>cancle</button>
                            </div>

                            <div>
                                <button className={`btn  w-100 ${styles.loginBtn}`} onClick={() => router.push("/main/attendance")}>Save</button>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}