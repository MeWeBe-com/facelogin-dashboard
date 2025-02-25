"use client";

import { useEffect, useState } from 'react';
import styles from './dashbaord.module.css';
import Http from "@/providers/axiosInstance";
import { redirect } from "next/navigation";


export default function Dashboard() {
    const [today, setToday] = useState<Date>(new Date());
    const [debouncedDate, setDebouncedDate] = useState<Date>(today);

    const [classes, setClasses] = useState<any>([]);
    const [selectedClass, setSelectedClass] = useState<number>(0);

    const openModal = () => {
        const modalElement = document.getElementById("deleteModal");
        if (modalElement && window.bootstrap) {
            const modal = new window.bootstrap.Modal(modalElement);
            modal.show();
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedDate(today);
        }, 750);

        return () => clearTimeout(timer);
    }, [today]);

    useEffect(() => {
        let id = localStorage.getItem('org_id');
        if (id) {
            let data = {
                org_id: id,
                date: new Date(today).toISOString().slice(0, 10)
            }
            fetchData(data);
        } else {
            redirect("/auth/login");
        }
    }, [debouncedDate])

    const fetchData = async (data: any) => {
        try {
            const response = await Http.post(`GetAllEventsByOrganizationIDandDate`, data);
            console.log(response)
            setSelectedClass
            setClasses(response.data.events);
        } catch (err) {
            console.error(err);
        }
    };

    const changeDate = (type: "next" | "prev" | "today") => {
        setToday((prevDate: any) => {
            const newDate = new Date(prevDate);
            if (type === "next") {
                newDate.setDate(newDate.getDate() + 1);
            } else if (type === "prev") {
                newDate.setDate(newDate.getDate() - 1);
            } else if (type === "today") {
                return new Date();
            }
            return newDate;
        });
    };

    return (
        <>
            <div className="container mt-5">
                <h2 className="fw-bold">Dashboard</h2>
            </div>

            <div className="container">
                <div className="d-flex justify-content-end p-3 align-items-center">
                    <div>
                        {new Date(today).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', })}
                    </div>

                    <div>
                        <button className="btn" onClick={() => changeDate('prev')}>
                            <i className="bi bi-chevron-left"></i>
                        </button>

                        <button className="btn" onClick={() => changeDate('next')}>
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>

                    <div>
                        <button className="btn btn-outline-dark" onClick={() => changeDate('today')}>Today</button>
                    </div>
                </div>
            </div>

            <div className={`container px-4`}>

                <div className={`${styles.box}`}>
                    <div className={`fw-bold ${styles.boxHead}`}>
                        Attendance Summary
                    </div>

                    <div className={`d-flex mt-2 ${styles.attMainBox}`}>

                        {
                            classes &&
                            classes.map((item: any, i: number) => (
                                <div className={`text-center ${styles.attBox + ' ' + (selectedClass == i ? styles.attBoxSelected : '')}`} key={i} onClick={() => setSelectedClass(i)}>
                                    <h6>{item.event_name}</h6>
                                    <div>{item.instructor}</div>
                                    <div>{item.event_time}</div>
                                    <div className={`fw-bold ${styles.attCount}`}>{item.attendees.length}</div>
                                    <div>
                                        <i className={`bi bi-check2-circle ${styles.iconColor}`}></i>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className={`mt-3 p-2 ${styles.listMainBox}`}>
                    <div className={`${styles.listBox}`}>
                        <div className={`fw-bold text-center`}>
                            Attendee
                        </div>

                        {
                            classes &&
                            classes[selectedClass]?.attendees.map((item: any, i: number) => (
                                <div className='d-flex align-items-center justify-content-between mb-2' key={i}>
                                    <div>
                                        {item.attendee_initial}
                                    </div>

                                    <div>
                                        {item.attendee_name}
                                    </div>

                                    <div onClick={() => openModal()}>
                                        <i className="bi bi-x-circle-fill text-danger"></i>
                                    </div>
                                </div>
                            ))
                        }
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