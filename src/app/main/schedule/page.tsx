"use client";
import { useEffect, useState } from 'react';
import styles from './schedule.module.css';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from "@fullcalendar/daygrid"; // For month view
import timeGridPlugin from "@fullcalendar/timegrid"; // For week & day views
import interactionPlugin from "@fullcalendar/interaction";



const events = [
    { title: 'Meeting', start: new Date('Thu Feb 02 2025 20:00:00 GMT+0500 (Pakistan Standard Time)') },
    { title: 'Meeting 1', start: new Date('Thu Feb 03 2025 20:00:00 GMT+0500 (Pakistan Standard Time)') },
    { title: 'Meeting 2', start: new Date('Thu Feb 03 2025 20:00:00 GMT+0500 (Pakistan Standard Time)') }
]

export default function Attendance() {
    const [modalType, setModalType] = useState<any>('Update Event');

    const RenderEventContent = (eventInfo: any) => {
        return (
            <div style={{ background: 'rgb(58, 135, 173)', color: 'white', padding: '3px', borderRadius: '4px' }}>
                <b>{eventInfo.timeText}</b>
                <span>{' ' + eventInfo.event.title}</span>
            </div>
        );
    };

    const handleEventClick = (clickInfo: any) => {
        console.log("Event details:", clickInfo.event);
        openModal('Update Event');
    };

    const openModal = (type: string) => {
        setModalType(type);
        const modalElement = document.getElementById("editModal");
        if (modalElement && window.bootstrap) {
            const modal = new window.bootstrap.Modal(modalElement);
            modal.show();
        }
    };

    const openAddEvetModal = () => {
        console.log('type')
        const modalElement = document.getElementById("addEventModal");
        if (modalElement && window.bootstrap) {
            const modal = new window.bootstrap.Modal(modalElement);
            modal.show();
        }
    }

    const [selectedValue, setSelectedValue] = useState("");
    const [isEditable, setIsEditable] = useState(false);

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedValue(event.target.value);
        setIsEditable(true);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
    };


    return (
        <>
            <div className="container mt-5">
                <h2 className="fw-bold">Schedule</h2>
            </div>

            <div className="container">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView='dayGridMonth'
                    headerToolbar={{
                        left: 'today prev,next',
                        center: 'title',
                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    weekends={true}
                    events={events}
                    eventContent={RenderEventContent}
                    eventClick={handleEventClick}
                />
            </div>

            <div className="container my-3 d-flex">
                <button type="button" style={{ marginRight: 20 }} className={`btn ${styles.btnColor}`} onClick={() => openModal('Add Event')}>Add Events</button>
                <button type="button" className={`btn ${styles.btnOutline}`} onClick={() => openAddEvetModal()}>Add Event Types</button>
            </div>

            <div className="modal fade" id="editModal" tabIndex={-1} aria-labelledby="editModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-body">
                            <h5 className='text-center fw-bold'>
                                {modalType}
                            </h5>

                            <div>
                                <div className="form-group mb-3">
                                    <label htmlFor="exampleFormControlSelect1">Event Type</label>
                                    <select className="form-control" id="exampleFormControlSelect1">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </select>
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="exampleFormControlSelect1">Instructor</label>
                                    <select className="form-control" id="exampleFormControlSelect1">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Start Date / Time</label>
                                    <input type="datetime-local" className={`form-control ${styles.myInput}`} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">End Date / Time</label>
                                    <input type="datetime-local" className={`form-control ${styles.myInput}`} />
                                </div>

                            </div>
                        </div>

                        <div className="modal-footer d-flex align-items-center justify-content-between">
                            <button type="button" className={`btn ${styles.btnDanger}`}>Delete</button>
                            <button type="button" className={`btn ${styles.btnOutline2}`}>Check-In</button>

                            <button type="button" className={`btn ${styles.btnOutline}`} data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className={`btn ${styles.btnColor}`}>Save</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="addEventModal" tabIndex={-1} aria-labelledby="addEventModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-body">
                            <h5 className='text-center fw-bold'>
                                Add Event Type
                            </h5>

                            <div>


                                <div className="mb-3">
                                    <label className="form-label">Select Event</label>
                                    <div className="input-group">
                                        {isEditable ? (
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedValue}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            <select className="form-select" onChange={handleSelectChange} defaultValue="">
                                                <option value="" disabled>Choose an Event Type to Edit or Delete</option>
                                                <option value="2025-02-19 10:00 AM">2025-02-19 10:00 AM</option>
                                                <option value="2025-02-20 02:30 PM">2025-02-20 02:30 PM</option>
                                                <option value="2025-02-21 06:45 PM">2025-02-21 06:45 PM</option>
                                            </select>
                                        )}
                                        {isEditable &&
                                            <>
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setIsEditable(false)}>
                                                    <i className="bi bi-trash-fill"></i>
                                                </button>

                                                <button type="button" className="btn btn-outline-success" onClick={() => setIsEditable(false)}>
                                                    <i className="bi bi-check-circle-fill"></i>
                                                </button>

                                                <button type="button" className="btn btn-outline-secondary" onClick={() => setIsEditable(false)}>
                                                    <i className="bi bi-x-circle"></i>
                                                </button>
                                            </>
                                        }

                                        <button type="button" className="btn btn-outline-secondary" onClick={() => setIsEditable(true)}>
                                            <i className="bi bi-pencil-square"></i>
                                        </button>

                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="modal-footer">

                            <button type="button" className={`btn ${styles.btnOutline}`} data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}