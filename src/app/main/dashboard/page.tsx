"use client";

import { useEffect, useRef, useState } from 'react';
import styles from './dashbaord.module.css';
import Http from "@/providers/axiosInstance";
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [today, setToday] = useState<Date>(new Date());
    const [debouncedDate, setDebouncedDate] = useState<Date>(today);

    const [classes, setClasses] = useState<any>([]);
    const [selectedClass, setSelectedClass] = useState<number>(0);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [checkinAttendees, setcheckinAttendees] = useState<any>([]);

    const openModal = (user: any, index: number) => {
        setSelectedUser({ user: user, index: index });
        const modalElement = document.getElementById("deleteModal");
        if (modalElement && window.bootstrap) {
            const modal = new window.bootstrap.Modal(modalElement);
            modal.show();
        }
    };

    const openCheckModal = () => {
        const modalElement = document.getElementById("checkinModal");
        if (modalElement && window.bootstrap) {
            const modal = new window.bootstrap.Modal(modalElement);
            modal.show();
        }
    }

    const closeModal = (modalId: string) => {
        const modalElement = document.getElementById(modalId);
        if (modalElement && window.bootstrap) {
            const modal = window.bootstrap.Modal.getInstance(modalElement); // Get existing modal instance
            if (modal) {
                modal.hide();
            }
        }
    };

    const removeUser = async () => {
        const res = await Http.get(`RemoveAttendeeCheckIn/${selectedUser.user.checkin_id}`);
        if (res && res.status == true) {
            removeCheckedin(selectedClass, selectedUser.index);
            setSelectedUser(null);
            closeModal("deleteModal");
            toast.success(res.data.message);
        } else {
            toast.error(res.data.message);
        }
    }

    const removeCheckedin = (selectedClassIndex: number, selectedUserIndex: number) => {
        setClasses((prevClasses: any) =>
            prevClasses.map((cls: any, index: number) =>
                index === selectedClassIndex
                    ? { ...cls, checked_in: cls.checked_in.filter((_: any, i: number) => i !== selectedUserIndex) }
                    : cls
            )
        );
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedDate(today);
        }, 750);

        return () => clearTimeout(timer);
    }, [today]);

    useEffect(() => {
        const id = localStorage.getItem('id');
        if (id) {
            let data = {
                org_id: id,
                date: new Date(today).toISOString().slice(0, 10)
            }
            fetchData(data);
        }
    }, [debouncedDate])

    const fetchData = async (data: any) => {
        try {
            const response = await Http.post(`GetAllClassesByOrganizationIDandDate`, data);
            setSelectedClass(0);
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

    // checkin attendee
    const handleCheckinAttendeeCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const attendeeId = Number(e.target.value); // Convert to number
        const isChecked = e.target.checked;

        setcheckinAttendees((prevState: number[]) =>
            isChecked ? [...prevState, attendeeId] : prevState.filter((user_id) => user_id !== attendeeId)
        );
    };

    const handleSelectAllCheckinAttendees = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            const allAttendeeIds = classes[selectedClass]?.attendees.map((attendee: any) => attendee.user_id);
            setcheckinAttendees(allAttendeeIds);
        } else {
            setcheckinAttendees([]);
        }
    };

    const saveCheckinAttendees = async () => {
        if (checkinAttendees.length == 0) {
            toast.error('Please select Attendees');
            return
        }
        let data = {
            user_id: checkinAttendees,
            event_id: classes[selectedClass]?.id,
            organization_id: localStorage.getItem('id')
        };

        let res = await Http.post('UserCheckin', data);
        if (res && res.status == true) {
            let id = localStorage.getItem('id');
            if (id) {
                let data = {
                    org_id: id,
                    date: new Date(today).toISOString().slice(0, 10)
                }
                fetchData(data);
            }
            setcheckinAttendees([]);
            closeModal('checkinModal');
            toast.success(res.data.message);
        } else {
            toast.error(res.data.message);
        }
    }

    const [selectedDate, setSelectedDate] = useState(new Date());
    const dateInputRef = useRef<HTMLInputElement>(null);

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setToday(new Date(event.target.value))
    };

    return (
        <>
            <div className="container mt-5">
                <h2 className="fw-bold">Dashboard</h2>
            </div>

            <div className="container">
                <div className="d-flex justify-content-end p-3 align-items-center">
                    {/* <div>
                        

                    </div> */}

                    <div className="position-relative">
                        {/* Clickable Date Display */}
                        <div
                            onClick={() => dateInputRef.current?.showPicker()}
                            className="cursor-pointer bg-gray-200 p-2 rounded-md"
                        >
                            {new Date(today).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', })}
                        </div>

                        <input
                            type="date"
                            ref={dateInputRef}
                            className='position-absolute'
                            style={{ visibility: 'hidden' }}
                            value={selectedDate.toISOString().slice(0, 10)}
                            onChange={handleDateChange}
                        />
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
                                    <div className={`fw-bold ${styles.attCount}`}>{item.checked_in.length}</div>
                                    <div onClick={() => openCheckModal()}>
                                        <i className={`bi bi-check2-circle ${styles.iconColor}`}></i>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className={`my-3 p-2 ${styles.listMainBox}`}>
                    <div className={`${styles.listBox}`}>
                        <div className={`fw-bold text-center`}>
                            Attendee
                        </div>

                        {
                            classes &&
                            classes[selectedClass]?.checked_in.map((item: any, i: number) => (
                                <div className='d-flex align-items-center justify-content-between mb-2' key={i}>
                                    <div>
                                        {item?.attendee_initial?.toUpperCase()}
                                    </div>

                                    <div>
                                        {item.attendee_name}
                                    </div>

                                    <div onClick={() => openModal(item, i)}>
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
                                Are you sure you want to delete an Attendance Record on
                                {' ' + new Date(today).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', }) + ' '}
                                for <br /> {selectedUser?.user?.attendee_name}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className={`btn ${styles.btnOutline}`} data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className={`btn ${styles.btnColor}`} onClick={() => removeUser()}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="checkinModal" tabIndex={-1} aria-labelledby="checkinModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-body">
                            <h5 className='text-center fw-bold'>
                                Check-In Attendees
                            </h5>

                            <div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="checkinAttendee"
                                        onChange={handleSelectAllCheckinAttendees}
                                    />
                                    <label className="form-check-label" htmlFor="checkinAttendee">
                                        Select All
                                    </label>
                                </div>

                                <div>
                                    {classes &&
                                        classes[selectedClass]?.attendees.map((item: any, i: number) => (
                                            <div className="form-check" key={i}>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value={item.user_id}
                                                    id={'checkinAttendee' + i}
                                                    onChange={handleCheckinAttendeeCheck}
                                                    checked={checkinAttendees.includes(item.user_id)}
                                                />
                                                <label className="form-check-label" htmlFor={'checkinAttendee' + i}>
                                                    {item.attendee_name}
                                                </label>
                                            </div>
                                        ))}
                                </div>

                            </div>
                        </div>

                        <div className="modal-footer d-flex align-items-center justify-content-between">
                            <button type="button" className={`btn ${styles.btnOutline}`} onClick={() => closeModal('checkinModal')}>Cancel</button>
                            <button type="button" className={`btn ${styles.btnColor}`} onClick={() => saveCheckinAttendees()}>Save</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Dashboard;