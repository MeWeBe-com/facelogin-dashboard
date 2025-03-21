"use client"
import styles from './reports.module.css';
import Http from '@/providers/axiosInstance';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Reports = () => {
    const [reportDates, setReportDates] = useState<any>({
        start_date: new Date(new Date().setDate(new Date().getDate() - 7)), // 1 week prior
        end_date: new Date()
    });
    const [reports, setReports] = useState<any>([]);

    useEffect(() => {
        const id = localStorage.getItem('id');
        if (id) {
            getReports(id);
        } else {
            toast.error('Something went wrong!');
        }
    }, [reportDates]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: "start_date" | "end_date") => {
        setReportDates((prev: any) => ({
            ...prev,
            [type]: new Date(e.target.value)
        }));
    };

    const getReports = async (orgId: any) => {
        let data = {
            id: orgId,
            start_date: reportDates.start_date.toISOString().slice(0, 10), // Format YYYY-MM-DD
            end_date: reportDates.end_date.toISOString().slice(0, 10) // Format YYYY-MM-DD
        };

        let res = await Http.post(`Report`, data);
        if (res && res.status == true) {
            setReports(res.data.report);
        }
    }

    const sortBy = (type: string) => {
        let sortedReports = [...reports]; // Copy the array to avoid mutating state directly
    
        switch (type) {
            case "date":
                sortedReports.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); // Newest first
                break;
            case "name":
                sortedReports.sort((a, b) => a.user.localeCompare(b.user)); // Sort by name (A-Z)
                break;
            case "event":
                sortedReports.sort((a, b) => a.class_name.localeCompare(b.class_name)); // Sort by event (A-Z)
                break;
            default:
                return;
        }
        setReports(sortedReports); // Update state to trigger re-render
    };

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
                            <input className="btn btn-outline-dark" type="date"
                                value={reportDates.start_date.toISOString().slice(0, 10)}
                                onChange={(e) => handleDateChange(e, "start_date")}
                            />
                            <span className='mx-2'> - </span>
                            <input className="btn btn-outline-dark" type="date"
                                value={reportDates.end_date.toISOString().slice(0, 10)}
                                onChange={(e) => handleDateChange(e, "end_date")}
                            />
                        </div>

                        <div className="dropdown ms-3">
                            <button className="btn btn-outline-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Sort
                            </button>

                            <ul className="dropdown-menu">
                                <li  className="dropdown-item" onClick={()=> sortBy('date')}>Attended Date</li>
                                <li  className="dropdown-item" onClick={()=> sortBy('name')}>Name</li>
                                <li  className="dropdown-item" onClick={()=> sortBy('event')}>Event</li>
                            </ul>
                        </div>
                    </div>

                    <div className={`p-2 mt-4 ${styles.listMainBox}`}>

                        <div className={`fw-bold mb-4 d-flex align-items-center ${styles.headBox}`}>
                            <div className={`${styles.nameBoxHead}`}>

                            </div>
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

                        {
                            reports &&
                            reports.map((item: any, i: number) => (
                                <div className={`mb-3 d-flex align-items-center ${styles.headBox}`} key={i}>
                                    <div className={`${styles.nameBox}`}>
                                        {item.user_initial}
                                    </div>

                                    <div className='text-center'>
                                        {item.user}
                                    </div>

                                    <div className='text-center'>
                                        {item.class_name}
                                    </div>

                                    <div className='text-center'>
                                        {item.instructor}
                                    </div>

                                    <div className='text-center'>
                                        {new Date(item.created_at).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>


            </div>
        </>
    )
}

export default Reports;