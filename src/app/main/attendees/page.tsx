"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import styles from './attendance.module.css';
import Http from '@/providers/axiosInstance';
import { toast } from "react-toastify";

const Attendance = () => {
    const router = useRouter();
    const [attendeesList, setAttendeesList] = useState<any>([]);

    useEffect(() => {
        let id = localStorage.getItem('id');
        if (id) {
            getAttendees(id);
        } else {
            toast.error('Something went wrong!');
        }
    }, []);

    const getAttendees = async (orgId: any) => {
        let res = await Http.get(`GetAllAttendees/${orgId}`);
        if (res && res.status == true) {
            setAttendeesList(res.data.attendees);
        }
    }

    const sortBy = (type: 'date' | 'name') => {
        const sortedArray = [...attendeesList];
        if (type === 'date') {
            sortedArray.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        } else if (type === 'name') {
            sortedArray.sort((a, b) => a.fullname.localeCompare(b.fullname));
        }
        setAttendeesList(sortedArray);
    };

    return (
        <>
            <div className="container mt-5">
                <h2 className="fw-bold">Attendance</h2>
            </div>

            <div className={`container mt-5`}>

                <div className={`${styles.box}`}>
                    <div className={`fw-bold ${styles.boxHead} d-flex align-items-center justify-content-between`}>
                        <div>
                            Attendees List ({attendeesList.length})
                        </div>

                        <div>
                            <div className="dropdown">
                                <button className="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Sort
                                </button>
                                <ul className="dropdown-menu">
                                    <li className="dropdown-item" onClick={() => sortBy('date')}>Date</li>
                                    <li className="dropdown-item" onClick={() => sortBy('name')}>Name</li>
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

                        {
                            attendeesList &&
                            attendeesList.map((item: any, i: number) => (
                                <div className={`mb-3 d-flex align-items-center ${styles.headBox}`} key={i}>
                                    <div>
                                        {item.fullname}
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
                            ))
                        }
                    </div>
                </div>

                <div className="container my-3 d-flex">
                    <button type="button" style={{ marginRight: 20 }} className={`btn ${styles.btnColor}`} onClick={() => router.push("/main/attendees/createattendee")}>Add Attendee</button>
                </div>
            </div>
        </>
    )
}

export default Attendance;