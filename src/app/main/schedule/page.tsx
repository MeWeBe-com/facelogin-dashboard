"use client";
import { useEffect, useState } from 'react';
import styles from './schedule.module.css';
import Http from '@/providers/axiosInstance';
import { useCookies } from 'next-client-cookies';
import { toast } from 'react-toastify';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from "@fullcalendar/daygrid"; // For month view
import timeGridPlugin from "@fullcalendar/timegrid"; // For week & day views
import interactionPlugin from "@fullcalendar/interaction";

let events = [
    { title: 'Meeting', start: new Date('Thu Feb 02 2025 20:00:00 GMT+0500 (Pakistan Standard Time)') },
    { title: 'Meeting 1', start: new Date('Thu Feb 03 2025 20:00:00 GMT+0500 (Pakistan Standard Time)') },
    { title: 'Meeting 2', start: new Date('Thu Feb 03 2025 20:00:00 GMT+0500 (Pakistan Standard Time)') }
]

export default function Attendance() {
    const cookies = useCookies();
    const [classes, setClasses] = useState<any>([]);
    const [classesTypes, setClassesTypes] = useState<any>([]);

    const [selectedClassType, setSelectedClassType] = useState<any>(null);
    const [classTypeName, setClassTypeName] = useState<string>('');
    const [isEditable, setIsEditable] = useState(false);

    const [modalType, setModalType] = useState<string>('Update Event');

    useEffect(() => {
        let id = cookies.get('org_id');
        if (id) {
            getClassesType(id);
            getClasses(id);
        } else {
            toast.error('Something went wrong!');
        }
    }, [])

    const getClasses = async (orgId: any) => {
        let res = await Http.get(`GetAllEventsByOrganizationID/${orgId}`);
        // console.log(res)
        if (res && res.status == true) {
            setClasses(res.data.events);
            // let arr:any = formatEvents(classes);
            // setMyClasses(arr);
            // console.log(myClasses, arr)
        }
    }

    const getClassesType = async (orgId: any) => {
        let res = await Http.get(`GetAllEventsTypes/${orgId}`);
        console.log('type', res)
        if (res && res.status == true) {
            setClassesTypes(res.data.event_types);
        }
    }

    const formatEvents = (classArr: any) => {
        let arr: any = [];
        classArr.forEach((item: any) => {
            arr.push({ title: item.event_name, start: new Date(item.event_date) })
        });

        return arr;
    }

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

    const handleDateClick = (evt: any) => {
        console.log('date clicked', evt);
        openModal('Add Event')
    }



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

    const closeModal = (modalId: string) => {
        const modalElement = document.getElementById(modalId);
        if (modalElement && window.bootstrap) {
            const modal = window.bootstrap.Modal.getInstance(modalElement); // Get existing modal instance
            if (modal) {
                modal.hide();
            }
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value);
        const selectedItem = classesTypes.find((item: any) => item.id === selectedId);
        if (selectedItem) {
            setClassTypeName(selectedItem.event_type_name);
            setSelectedClassType(selectedItem);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClassTypeName(event.target.value);
    };


    const updateEventType = async () => {
        console.log(selectedClassType, classTypeName);

        let data = {
            id: selectedClassType ? selectedClassType.id : '',
            organization_id: cookies.get('org_id'),
            event_type_name: classTypeName
        };
        let res = await Http.post('AddEditEventsTypes', data);
        if(res && res.status == true){
            setSelectedClassType(null);
            setClassTypeName('');
            setIsEditable(false);
            closeModal('addEventModal');
            let id = cookies.get('org_id');
            if (id) {
                getClassesType(id);
            }
            toast.success(res.data.message)
        }else{
            toast.error(res.data.message)
        }
    }



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
                    dateClick={handleDateClick}
                    editable={true}
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
                                                value={classTypeName}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            <select className="form-select" onChange={handleSelectChange} defaultValue="">
                                                <option value="" disabled>Choose an Event Type to Edit or Delete</option>
                                                {
                                                    classesTypes &&
                                                    classesTypes.map((item: any, i: number) => (
                                                        <option value={item.id} key={i}>{item.event_type_name}</option>
                                                    ))
                                                }

                                            </select>
                                        )}
                                        {isEditable &&
                                            <>
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setIsEditable(false)}>
                                                    <i className="bi bi-trash-fill"></i>
                                                </button>

                                                <button type="button" className="btn btn-outline-success" onClick={() => updateEventType()}>
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