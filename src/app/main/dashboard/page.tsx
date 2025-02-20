"use client";
import { useEffect } from 'react';
import styles from './dashbaord.module.css';

export default function Dashboard() {

    const openModal = () => {
        const modalElement = document.getElementById("deleteModal");
        if (modalElement && window.bootstrap) {
            const modal = new window.bootstrap.Modal(modalElement);
            modal.show();
        }
    };

    return (
        <>
            <div className="container mt-5">
                <h2 className="fw-bold">Dashboard</h2>
            </div>

            <div className="container">
                <div className="d-flex justify-content-end p-3 align-items-center">
                    <div>
                        Tuesday, 18 Feb
                    </div>
                    
                    <div>
                        <button className="btn">
                            <i className="bi bi-chevron-left"></i>
                        </button>

                        <button className="btn">
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>

                    <div>
                        <button className="btn btn-outline-dark">Today</button>
                    </div>
                </div>
            </div>

            <div className={`container px-4`}>

                <div className={`${styles.box}`}>
                    <div className={`fw-bold ${styles.boxHead}`}>
                        Attendance Summary
                    </div>

                    <div className={`d-flex mt-2 ${styles.attMainBox}`}>
                        <div className={`text-center ${styles.attBox}`}>
                            <h6>BJJ All Levels - Men</h6>
                            <div>Steven Stelljes</div>
                            <div>7:45 pm - 9:15 pm</div>
                            <div className={`fw-bold ${styles.attCount}`}>5</div>
                            <div>
                                <i className={`bi bi-check2-circle ${styles.iconColor}`}></i>
                            </div>
                        </div>

                        <div className={`text-center ${styles.attBox + ' ' + styles.attBoxSelected}`}>
                            <h6>BJJ All Levels - Men</h6>
                            <div>Steven Stelljes</div>
                            <div>7:45 pm - 9:15 pm</div>
                            <div className={`fw-bold ${styles.attCount}`}>5</div>
                            <div>
                                <i className={`bi bi-check2-circle ${styles.iconColor}`}></i>
                            </div>
                        </div>

                        <div className={`text-center ${styles.attBox}`}>
                            <h6>BJJ All Levels - Men</h6>
                            <div>Steven Stelljes</div>
                            <div>7:45 pm - 9:15 pm</div>
                            <div className={`fw-bold ${styles.attCount}`}>5</div>
                            <div>
                                <i className={`bi bi-check2-circle ${styles.iconColor}`}></i>
                            </div>
                        </div>

                        <div className={`text-center ${styles.attBox}`}>
                            <h6>BJJ All Levels - Men</h6>
                            <div>Steven Stelljes</div>
                            <div>7:45 pm - 9:15 pm</div>
                            <div className={`fw-bold ${styles.attCount}`}>5</div>
                            <div>
                                <i className={`bi bi-check2-circle ${styles.iconColor}`}></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`mt-3 p-2 ${styles.listMainBox}`}>
                    <div className={`${styles.listBox}`}>
                        <div className={`fw-bold text-center`}>
                            Attendee
                        </div>

                        <div className='d-flex align-items-center justify-content-between mb-2'>
                            <div>
                                SA
                            </div>

                            <div>
                                Sayyed Amir
                            </div>

                            <div onClick={() => openModal()}>
                                <i className="bi bi-x-circle-fill text-danger"></i>
                            </div>
                        </div>

                        <div className='d-flex align-items-center justify-content-between mb-2'>
                            <div>
                                SA
                            </div>

                            <div>
                                Sayyed Amir
                            </div>

                            <div>
                                <i className="bi bi-x-circle-fill text-danger"></i>
                            </div>
                        </div>

                        <div className='d-flex align-items-center justify-content-between mb-2'>
                            <div>
                                SA
                            </div>

                            <div>
                                Sayyed Amir
                            </div>

                            <div>
                                <i className="bi bi-x-circle-fill text-danger"></i>
                            </div>
                        </div>

                        <div className='d-flex align-items-center justify-content-between mb-2'>
                            <div>
                                SA
                            </div>

                            <div>
                                Sayyed Amir
                            </div>

                            <div>
                                <i className="bi bi-x-circle-fill text-danger"></i>
                            </div>
                        </div>

                        <div className='d-flex align-items-center justify-content-between mb-2'>
                            <div>
                                SA
                            </div>

                            <div>
                                Sayyed Amir
                            </div>

                            <div>
                                <i className="bi bi-x-circle-fill text-danger"></i>
                            </div>
                        </div>

                        <div className='d-flex align-items-center justify-content-between mb-2'>
                            <div>
                                SA
                            </div>

                            <div>
                                Sayyed Amir
                            </div>

                            <div>
                                <i className="bi bi-x-circle-fill text-danger"></i>
                            </div>
                        </div>

                        <div className='d-flex align-items-center justify-content-between mb-2'>
                            <div>
                                SA
                            </div>

                            <div>
                                Sayyed Amir
                            </div>

                            <div>
                                <i className="bi bi-x-circle-fill text-danger"></i>
                            </div>
                        </div>

                        <div className='d-flex align-items-center justify-content-between mb-2'>
                            <div>
                                SA
                            </div>

                            <div>
                                Sayyed Amir
                            </div>

                            <div>
                                <i className="bi bi-x-circle-fill text-danger"></i>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


            <div className="modal fade" id="deleteModal" tabIndex={-1} aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-sm">
                    <div className="modal-content">

                        <div className="modal-body">
                            <div className='text-center'>
                                Are you sure you want to delete  an Attendance Record on February 24, 2025 for Fawad Akram
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className={`btn ${styles.btnOutline}`} data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className={`btn ${styles.btnColor}`}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}