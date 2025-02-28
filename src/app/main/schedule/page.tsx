"use client";
import { useEffect, useState } from 'react';
import styles from './schedule.module.css';
import Http from '@/providers/axiosInstance';
import { useCookies } from 'next-client-cookies';
import { toast } from 'react-toastify';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from "@fullcalendar/daygrid"; // For month view
import timeGridPlugin from "@fullcalendar/timegrid"; // For week & day views
import interactionPlugin from "@fullcalendar/interaction";

let events: any = [];

export default function Attendance() {
    const cookies = useCookies();
    const [classesTypes, setClassesTypes] = useState<any>([]);

    const [selectedClassType, setSelectedClassType] = useState<any>(null);
    const [classTypeName, setClassTypeName] = useState<string>('');
    const [isEditable, setIsEditable] = useState(false);

    const [modalType, setModalType] = useState<string>('Update Event');

    const [selectedClass, setSelectedClass] = useState<any>(null);
    const [instructors, setInstructors] = useState<any>([]);
    const validationSchema = Yup.object().shape({
        id: Yup.string(),
        organization_id: Yup.string().required('Ogranization ID is required'),
        event_type_id: Yup.string().required('Class type  is required'),
        user_id: Yup.string().required('Instructor is required'),
        event_start_date: Yup.string().required('Start Date  is required'),
        event_start_time: Yup.string().required('Start Time is required'),
        event_end_date: Yup.string().required('End Date  is required'),
        event_end_time: Yup.string().required('End Time  is required'),
    });

    useEffect(() => {
        let id = cookies.get('org_id');
        if (id) {
            getClassesType(id);
            getClasses(id);
            getInstructors(id);
        } else {
            toast.error('Something went wrong!');
        }
    }, [])

    const getClassesType = async (orgId: any) => {
        let res = await Http.get(`GetAllEventsTypes/${orgId}`);
        if (res && res.status == true) {
            setClassesTypes(res.data.event_types);
        }
    }

    const getInstructors = async (ordIg: any) => {
        let res = await Http.get(`getInstructorByOrganizationID/${ordIg}`);
        if (res && res.status == true) {
            setInstructors(res.data.instructor);
        }
    }

    const getClasses = async (orgId: any) => {
        let res = await Http.get(`GetAllEventsByOrganizationID/${orgId}`);
        if (res && res.status == true) {
            let arr: any = formatEvents(res.data.events);
            events = arr;
        }
    }

    const formatEvents = (classArr: any) => {
        let arr: any = [];
        classArr.forEach((item: any) => {
            arr.push({ id: item.id, title: item.event_name, start: new Date(item.event_date_time) })
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
        console.log("Event details:", clickInfo.event, clickInfo.event.title, clickInfo.event.start, clickInfo.event.end);
        // /setSelectedClass(selectedClassData || null);
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
        if (res && res.status == true) {
            setSelectedClassType(null);
            setClassTypeName('');
            setIsEditable(false);
            closeModal('addEventModal');
            let id = cookies.get('org_id');
            if (id) {
                getClassesType(id);
            }
            toast.success(res.data.message)
        } else {
            toast.error(res.data.message)
        }
    }

    const saveClass = async (values: any) => {
        console.log(values);
        let res = await Http.post('AddEditEvents', values);
        console.log(res);
        if (res && res.status == true) {
            closeModal('editModalLabel');
            let id = cookies.get('org_id');
            if (id) {
                getClassesType(id);
            }
            toast.success(res.data.message);
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
                        <Formik
                            initialValues={{
                                id: "",
                                organization_id: cookies.get('org_id'),
                                event_type_id: "",
                                user_id: "",
                                event_start_date: "",
                                event_start_time: "",
                                event_end_date: "",
                                event_end_time: "",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={saveClass}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="modal-body">
                                        <h5 className='text-center fw-bold'>{modalType}</h5>

                                        <div>
                                            <div className="form-group mb-3">
                                                <label htmlFor="event_type_id">Class Type</label>
                                                <Field as="select" name="event_type_id" className="form-select">
                                                    <option value="" disabled>Choose an Event Type to Edit or Delete</option>
                                                    {classesTypes.map((item: any, i: number) => (
                                                        <option value={item.id} key={i}>{item.event_type_name}</option>
                                                    ))}
                                                </Field>
                                                <ErrorMessage name="event_type_id" component="div" className="text-danger" />
                                            </div>

                                            <div className="form-group mb-3">
                                                <label htmlFor="user_id">Instructor</label>
                                                <Field as="select" name="user_id" className="form-control">
                                                    <option value="" disabled>Choose an Instructor</option>
                                                    {instructors.map((item: any, i: number) => (
                                                        <option value={item.id} key={i}>{item.fullname}</option>
                                                    ))}
                                                </Field>
                                                <ErrorMessage name="user_id" component="div" className="text-danger" />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Start Date</label>
                                                <Field type="date" name="event_start_date" className={`form-control ${styles.myInput}`} />
                                                <ErrorMessage name="event_start_date" component="div" className="text-danger" />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Start Time</label>
                                                <Field type="time" name="event_start_time" className={`form-control ${styles.myInput}`} />
                                                <ErrorMessage name="event_start_time" component="div" className="text-danger" />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">End Date</label>
                                                <Field type="date" name="event_end_date" className={`form-control ${styles.myInput}`} />
                                                <ErrorMessage name="event_end_date" component="div" className="text-danger" />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">End Time</label>
                                                <Field type="time" name="event_end_time" className={`form-control ${styles.myInput}`} />
                                                <ErrorMessage name="event_end_time" component="div" className="text-danger" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-footer d-flex align-items-center justify-content-between">
                                        <button type="button" className={`btn ${styles.btnDanger}`}>Delete</button>
                                        <button type="button" className={`btn ${styles.btnOutline2}`}>Check-In</button>

                                        <button type="button" className={`btn ${styles.btnOutline}`} data-bs-dismiss="modal">Cancel</button>
                                        <button type="submit" className={`btn ${styles.btnColor}`} disabled={isSubmitting}>Save</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
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