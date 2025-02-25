"use client";

import styles from './attendance.module.css';

export default function Attendance() {
    return (
        <>
            <div className="container mt-5">
                <h2 className="fw-bold">Attendance</h2>
            </div>

            <div className={`container mt-5`}>

                <div className={`${styles.box}`}>
                    <div className={`fw-bold ${styles.boxHead} d-flex align-items-center justify-content-between`}>
                        <div>
                            Attendees List (10)
                        </div>

                        <div>
                            <div className="dropdown">
                                <button className="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Sort
                                </button>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">Date</a></li>
                                    <li><a className="dropdown-item" href="#">Name</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className={`p-2 mt-4 ${styles.listMainBox}`}>

                        <div className={`fw-bold mb-4 d-flex align-items-center ${styles.headBox}`}>
                            <div>
                                Full Name
                            </div>
                            <div>
                                Latest Pass Type
                            </div>

                            <div>
                                Balance
                            </div>

                            <div>
                                Expiry Date
                            </div>

                            <div>
                                Payment Details
                            </div>
                        </div>

                        <div className={`mb-3 d-flex align-items-center ${styles.headBox}`}>
                            <div>
                                Ali jawas Jadoon
                            </div>

                            <div>
                                Flexible
                            </div>

                            <div>
                                12
                            </div>

                            <div>
                                22-Feb-2025
                            </div>

                            <div>
                                <button className={`btn ${styles.btnOutline}`}>Paid</button> 224 via bank
                            </div>
                        </div>

                        <div className={`mb-3 d-flex align-items-center ${styles.headBox}`}>
                            <div>
                                Essam Sulaiman
                            </div>

                            <div>
                                Flexible
                            </div>

                            <div>
                                9
                            </div>

                            <div>
                                25-Feb-2025
                            </div>

                            <div>
                                <button className={`btn ${styles.btnOutline}`}>Paid</button> 224 via bank

                                <div className='text-center'>
                                    3x a week
                                </div>
                            </div>
                        </div>

                        <div className={`mb-3 d-flex align-items-center ${styles.headBox}`}>
                            <div>
                                Essam Sulaiman
                            </div>

                            <div>
                                Flexible
                            </div>

                            <div>
                                9
                            </div>

                            <div>
                                25-Feb-2025
                            </div>

                            <div>
                                <button className={`btn ${styles.btnOutline}`}>Paid</button> 224 via bank
                            </div>
                        </div>

                        <div className={`mb-23 d-flex align-items-center ${styles.headBox}`}>
                            <div>
                                Essam Sulaiman
                            </div>

                            <div>
                                Flexible
                            </div>

                            <div>
                                9
                            </div>

                            <div>
                                25-Feb-2025
                            </div>

                            <div>
                                <button className={`btn ${styles.btnOutline}`}>Paid</button> 224 via bank

                                <div className='text-center'>
                                    3x a week
                                </div>
                            </div>
                        </div>

                    </div>
                </div>


            </div>
        </>
    )
}