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

export default function Attendance() {
    const cookies = useCookies();
    const [classesTypes, setClassesTypes] = useState<any>([]);
    const [classes, setClasses] = useState<any>([]);

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

    const initialValues = {
        id: selectedClass?.id || "",
        organization_id: cookies.get('org_id'),
        event_type_id: selectedClass?.event_type_id || "",
        user_id: selectedClass?.user_id || "",
        event_start_date: selectedClass?.event_start_date || "",
        event_start_time: selectedClass?.event_start_time || "",
        event_end_date: selectedClass?.event_end_date || "",
        event_end_time: selectedClass?.event_end_time || "",
    };

    const [attendeesList, setAttendeesList] = useState<any>([]);
    const [selectedAttendees, setselectedAttendees] = useState<any>([]);
    const [attendeesClass, setAttendeesClass] = useState<any>(null);
    const [checkinAttendees, setcheckinAttendees] = useState<any>([]);

    useEffect(() => {
        let id = cookies.get('org_id');
        if (id) {
            getClassesType(id);
            getClasses(id);
            getInstructors(id);
            getAttendees(id);
        } else {
            toast.error('Something went wrong!');
        }
    }, [])

    const getClassesType = async (orgId: any) => {
        let res = await Http.get(`GetAllClassTypes/${orgId}`);
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
        let res = await Http.get(`GetAllEventByOrgID/${orgId}`);
        if (res && res.status == true) {
            let arr: any = formatEvents(res.data.events);
            setClasses(arr);
        }
    }

    const formatEvents = (classArr: any) => {
        let arr: any = [];
        classArr.forEach((item: any) => {
            arr.push({ ...item, title: item.event_type_name, start: new Date(item.event_start_date) })
        });
        return arr;
    }

    const getAttendees = async (orgId: any) => {
        let res = await Http.get(`GetAllAttendees/${orgId}`);
        if (res && res.status == true) {
            setAttendeesList(res.data.attendees);
        }
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
        let evt = classes.find((item: any) => item.id == clickInfo.event.id);
        setSelectedClass(evt || null);
        openModal('Update Event');
    };

    const handleDateClick = (evt: any) => {
        //console.log('date clicked', evt);
        //openModal('Add Event')
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
        const modalElement = document.getElementById("addClassTypeModal");
        if (modalElement && window.bootstrap) {
            const modal = new window.bootstrap.Modal(modalElement);
            modal.show();
        }
    }

    const closeModal = (modalId: string) => {
        const modalElement = document.getElementById(modalId);
        if (modalElement && window.bootstrap) {
            setSelectedClassType(null);
            setClassTypeName('');
            setIsEditable(false);
            setSelectedClass(null);
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
        let data = {
            id: selectedClassType ? selectedClassType.id : '',
            organization_id: cookies.get('org_id'),
            event_type_name: classTypeName
        };
        let res = await Http.post('AddEditEventsTypes', data);
        if (res && res.status == true) {
            closeModal('addClassTypeModal');
            let id = cookies.get('org_id');
            if (id) {
                getClassesType(id);
            }
            toast.success(res.data.message)
        } else {
            toast.error(res.data.message)
        }
    }

    const deleteClassType = async () => {
        let res = await Http.get(`DeleteClassTypeByID/${selectedClassType.id}`);
        if (res && res.status == true) {
            let id = cookies.get('org_id');
            if (id) {
                getClassesType(id);
            }
            closeModal('addClassTypeModal');
            toast.success(res.data.message)
        } else {
            toast.error(res.data.message)
        }

    }

    const saveClass = async (values: any) => {
        let res = await Http.post('AddEditEvents', values);
        if (res && res.status == true) {
            let id = cookies.get('org_id');
            if (id) {
                getClasses(id);
            }
            closeModal('editModal');
            toast.success(res.data.message);
        }
    }

    const deselectClassType = () => {
        setSelectedClass(null);
        setIsEditable(false);
    }

    const deleteClass = async () => {
        if (selectedClass) {
            let res = await Http.get(`DeleteEventByID/${selectedClass.id}`);
            if (res && res.status) {
                let id = cookies.get('org_id');
                if (id) {
                    getClasses(id);
                }
                setSelectedClass(null);
                closeModal('editModal')
                toast.success(res.data.message);
            }
        } else {
            closeModal('editModal')
        }
    }

    const openCheckinModal = () => {
        if (selectedClass) {
            setAttendeesClass(selectedClass);
            closeModal('editModal');
            const modalElement = document.getElementById("checkInModal");
            if (modalElement && window.bootstrap) {
                const modal = new window.bootstrap.Modal(modalElement);
                modal.show();
            }
        }
    }

    const openAttendeeModal = () => {
        if (selectedClass) {
            setAttendeesClass(selectedClass);
            closeModal('editModal');
            const modalElement = document.getElementById("addAttendeeModal");
            if (modalElement && window.bootstrap) {
                const modal = new window.bootstrap.Modal(modalElement);
                modal.show();
            }
        }
    }


    // add attendee
    const handleAddAllAttendeeCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            const allAttendeeIds = attendeesList.map((attendee: any) => attendee.id);
            setselectedAttendees(allAttendeeIds);
        } else {
            setselectedAttendees([]);
        }
    };

    const handleAddAttendeeCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const attendeeId = Number(e.target.value); // Convert value to number
        const isChecked = e.target.checked;

        setselectedAttendees((prevState: any) =>
            isChecked ? [...prevState, attendeeId] : prevState.filter((id: any) => id !== attendeeId)
        );
    };

    const saveAddAttendees = async () => {
        if (selectedAttendees.length == 0) {
            toast.error('Please select Attendees');
            return
        }
        let data = {
            event_id: attendeesClass.id,
            user_id: selectedAttendees,
        };

        let res = await Http.post('AddAttendeeintoEvent', data);
        if (res && res.status == true) {
            setAttendeesClass(null);
            setcheckinAttendees([]);
            let id = cookies.get('org_id');
            if (id) {
                getClasses(id);
            }
            closeModal('addAttendeeModal');
            toast.success(res.data.message);
        } else {
            toast.error('Something went worng!');
        }
    }

    // checkin attendee
    const handleCheckinAttendeeCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const attendeeId = Number(e.target.value); // Convert to number
        const isChecked = e.target.checked;

        setcheckinAttendees((prevState: number[]) =>
            isChecked ? [...prevState, attendeeId] : prevState.filter((id) => id !== attendeeId)
        );
    };

    const handleSelectAllCheckinAttendees = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            const allAttendeeIds = attendeesClass.attendee_event_users.map((attendee: any) => attendee.user_id);
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
            event_id: attendeesClass.id,
            organization_id: cookies.get('org_id')
        };

        let res = await Http.post('UserCheckin', data);
        if (res && res.status == true) {
            let id = cookies.get('org_id');
            if (id) {
                getClasses(id);
            }
            setAttendeesClass(null);
            setcheckinAttendees([]);
            closeModal('checkInModal');
            toast.success(res.data.message);
        } else {
            toast.error('Something went worng!');
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
                    events={classes}
                    eventContent={RenderEventContent}
                    eventClick={handleEventClick}
                    dateClick={handleDateClick}
                    editable={true}
                />
            </div>

            <div className="container my-3 d-flex">
                <button type="button" style={{ marginRight: 20 }} className={`btn ${styles.btnColor}`} onClick={() => openModal('Add Event')}>Add Class</button>
                <button type="button" className={`btn ${styles.btnOutline}`} onClick={() => openAddEvetModal()}>Add Class Types</button>
            </div>

            <div className="modal fade" id="editModal" tabIndex={-1} aria-labelledby="editModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <Formik
                            enableReinitialize={true}
                            initialValues={initialValues}
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
                                        <button type="button" className={`btn ${styles.btnDanger}`} onClick={() => deleteClass()}>Delete</button>
                                        <button type="button" className={`btn ${styles.btnOutline2}`} onClick={() => openCheckinModal()}>Check-In</button>
                                        <button type="button" className={`btn ${styles.btnOutline2}`} onClick={() => openAttendeeModal()}>Add Attendee</button>

                                        <button type="button" className={`btn ${styles.btnOutline}`} onClick={() => closeModal('editModal')}>Cancel</button>
                                        <button type="submit" className={`btn ${styles.btnColor}`} disabled={isSubmitting}>Save</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="addClassTypeModal" tabIndex={-1} aria-labelledby="addClassTypeModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" >
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-body">
                            <h5 className='text-center fw-bold'>
                                Add Class Type
                            </h5>

                            <div>
                                <div className="mb-3">
                                    <label className="form-label">Select Class Type</label>
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
                                                <option value="" disabled>Choose Class type to Edit or Delete</option>
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
                                                <button type="button" className="btn btn-outline-danger" onClick={() => deleteClassType()}>
                                                    <i className="bi bi-trash-fill"></i>
                                                </button>

                                                <button type="button" className="btn btn-outline-success" onClick={() => updateEventType()}>
                                                    <i className="bi bi-check-circle-fill"></i>
                                                </button>

                                                <button type="button" className="btn btn-outline-secondary" onClick={() => deselectClassType()}>
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

            <div className="modal fade" id="checkInModal" tabIndex={-1} aria-labelledby="checkInModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" >
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
                                        id="checkInAttendee"
                                        onChange={handleSelectAllCheckinAttendees}
                                    />
                                    <label className="form-check-label" htmlFor="checkInAttendee">
                                        Select All
                                    </label>
                                </div>

                                <div>
                                    {attendeesClass &&
                                        attendeesClass.attendee_event_users.map((item: any, i: number) => (
                                            <div className="form-check" key={i}>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value={item.user_id}
                                                    id={'checkInAttendee' + i}
                                                    onChange={handleCheckinAttendeeCheck}
                                                    checked={checkinAttendees.includes(item.user_id)}
                                                />
                                                <label className="form-check-label" htmlFor={'checkInAttendee' + i}>
                                                    {item.attendee_name}
                                                </label>
                                            </div>
                                        ))}
                                </div>

                            </div>
                        </div>

                        <div className="modal-footer d-flex align-items-center justify-content-between">
                            <button type="button" className={`btn ${styles.btnOutline}`} onClick={() => closeModal('checkInModal')}>Cancel</button>
                            <button type="button" className={`btn ${styles.btnColor}`} onClick={() => saveCheckinAttendees()}>Save</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="addAttendeeModal" tabIndex={-1} aria-labelledby="addAttendeeModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" >
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-body">
                            <h5 className='text-center fw-bold'>
                                Add Attendees
                            </h5>

                            <div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="addAttendee"
                                        onChange={handleAddAllAttendeeCheck}
                                        checked={selectedAttendees.length === attendeesList.length && attendeesList.length > 0}
                                    />
                                    <label className="form-check-label" htmlFor="addAttendee">
                                        Select All
                                    </label>
                                </div>

                                {attendeesList &&
                                    attendeesList.map((item: any, i: number) => (
                                        <div className="form-check" key={i}>
                                            <input
                                                className="form-check-input secondary"
                                                type="checkbox"
                                                value={item.id}
                                                id={'addAttendee' + i}
                                                onChange={handleAddAttendeeCheck}
                                                checked={selectedAttendees.includes(item.id)} // Ensures checkbox reflects selection
                                            />
                                            <label className="form-check-label" htmlFor={'addAttendee' + i}>
                                                {item.fullname}
                                            </label>
                                        </div>
                                    ))
                                }

                            </div>
                        </div>

                        <div className="modal-footer d-flex align-items-center justify-content-between">
                            <button type="button" className={`btn ${styles.btnOutline}`} onClick={() => closeModal('addAttendeeModal')}>Cancel</button>
                            <button type="button" className={`btn ${styles.btnColor}`} onClick={() => saveAddAttendees()}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}