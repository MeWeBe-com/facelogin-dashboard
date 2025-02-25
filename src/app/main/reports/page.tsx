"use client"
import styles from './reports.module.css';

export default function Reports() {
    return (
        <>
            <div className="container mt-5">
                <h2 className="fw-bold">Reports</h2>
            </div>

            <div className={`container mt-5`}>

                <div className={`${styles.box}`}>
                    <div className={`fw-bold ${styles.boxHead} d-flex align-items-center justify-content-between`}>
                        <div>
                            Attendees Report <i className='bi bi-info-circle'></i>
                        </div>

                        <div>
                            <button className='btn'>
                                <i className="bi bi-download"></i>
                            </button>
                        </div>
                    </div>

                    <div className='d-flex m-2 align-items-center'>
                        Filter:
                        <div className="d-flex ms-2 align-items-center">
                            <input className="btn btn-outline-dark" type="date" />
                            <span className='mx-2'> - </span>
                            <input className="btn btn-outline-dark" type="date" />
                        </div>

                        <div className="dropdown ms-3">
                            <button className="btn btn-outline-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Sort
                            </button>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">Date</a></li>
                                <li><a className="dropdown-item" href="#">Name</a></li>
                                <li><a className="dropdown-item" href="#">Event</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className={`p-2 mt-4 ${styles.listMainBox}`}>

                        <div className={`fw-bold mb-4 d-flex align-items-center ${styles.headBox}`}>
                            <div className='text-center'>
                                Attendee
                            </div>

                            <div className='text-center'>
                                Class
                            </div>

                            <div className='text-center'>
                                Instructor
                            </div>

                            <div className='text-center'>
                                Attended Date
                            </div>

                        </div>

                        <div className={`mb-3 d-flex align-items-center ${styles.headBox}`}>
                            <div className='text-center'>
                                Ali jawas Jadoon
                            </div>

                            <div className='text-center'>
                                Flexible
                            </div>

                            <div className='text-center'>
                                12
                            </div>

                            <div className='text-center'>
                                22-Feb-2025
                            </div>

                        </div>


                        <div className={`mb-3 d-flex align-items-center ${styles.headBox}`}>
                            <div className='text-center'>
                                Ali jawas Jadoon
                            </div>

                            <div className='text-center'>
                                Flexible
                            </div>

                            <div className='text-center'>
                                12
                            </div>

                            <div className='text-center'>
                                22-Feb-2025
                            </div>

                        </div>


                        <div className={`mb-3 d-flex align-items-center ${styles.headBox}`}>
                            <div className='text-center'>
                                Ali jawas Jadoon
                            </div>

                            <div className='text-center'>
                                Flexible
                            </div>

                            <div className='text-center'>
                                12
                            </div>

                            <div className='text-center'>
                                22-Feb-2025
                            </div>

                        </div>

                    </div>
                </div>


            </div>
        </>
    )
}