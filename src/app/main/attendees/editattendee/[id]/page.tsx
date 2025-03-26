"use client";
import styles from './editattendee.module.css';
import { useRouter, useParams } from "next/navigation";
import Http from '@/providers/axiosInstance';
import { toast } from 'react-toastify';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useRef, useState } from 'react';

const EditAttendee = () => {
    const params = useParams();
    const id = params.id as string;

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [userData, setUserData] = useState<any>({});
    const [userPasses, setUserPasses] = useState<any>([]);
    const [userImagePreview, setUserImagePreview] = useState<any>(null);
    const [userImageToUpdate, setUserImageToUpdate] = useState<any>(null);



    const [passType, setPassType] = useState("");

    useEffect(() => {
        getAttendeeDetail(id);
        getAttendeePasses(id);
    }, [id]);

    const getAttendeeDetail = async (id: any) => {
        let res = await Http.get(`GetAttendeeByID/${id}`);
        if (res && res.status == true) {
            setUserData(res.data.attendee);
            setUserImagePreview(res.data.attendee.user_image);
        }
    }

    const getAttendeePasses = async (id: any) => {
        let res = await Http.get(`GetUserPassesByID/${id}`);
        console.log(res)
        if (res && res.status == true) {
            setUserPasses(res.data.passes);
        }
    }

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUserImageToUpdate(file);
            // Use FileReader to read the file
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserImagePreview(reader.result as string); // Set the data URL as the preview
            };
            reader.readAsDataURL(file); // Convert file to data URL
        }
    };

    const validationSchema = Yup.object().shape({
        id: Yup.string(),
        contact_id: Yup.string(),
        first_name: Yup.string().required('First Name is required'),
        last_name: Yup.string().required('Last Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        phone_number: Yup.string().required('Phone Number is required'),
        user_type: Yup.string().required('User Type is required')
    });

    const initialValues = {
        id: userData.id || '',
        contact_id: userData.contact_id || '',
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        phone_number: userData.phone_number || '',
        user_type: userData.role || 'user'
    }

    const updateUser = async (values: any, resetForm: any) => {
        let org_id: any = localStorage.getItem('id');
        let formData = new FormData();
        formData.append('id', values.id);
        formData.append('contact_id', values.contact_id);
        formData.append('organization_id', org_id);
        formData.append('first_name', values.first_name);
        formData.append('last_name', values.last_name);
        formData.append('email', values.email);
        formData.append('phone_number', values.phone_number);
        formData.append('user_image', userImageToUpdate);
        formData.append('user_type', values.user_type);

        let res = await Http.fileUpload('UpdateAttendee', formData);
        if (res && res.status == true) {
            resetForm();
            toast.success('User Registration Successfull!');
        } else {
            toast.error(res.message)
        }
    }

    const openModal = () => {
        const modalElement = document.getElementById("createPassModal");
        if (modalElement && window.bootstrap) {
            const modal = new window.bootstrap.Modal(modalElement);
            modal.show();
        }
    };

    const closeModal = (modalId: string) => {
        const modalElement = document.getElementById(modalId);
        if (modalElement && window.bootstrap) {
            const modal = window.bootstrap.Modal.getInstance(modalElement); // Get existing modal instance
            if (modal) {
                modal.hide();
            }
        }
    };

    const validationPassSchema = Yup.object({
        pass_type: Yup.string().required("Pass type is required"),
        attendance_balance: Yup.string().when("pass_type", {
            is: 'Flexible',
            then: (schema) => schema.required("Please select attendance balance"),
            otherwise: (schema) => schema.notRequired()
        }),
        expiry_date: Yup.string().when("pass_type", {
            is: "Unlimited",
            then: (schema) => schema.required("Expiry Date is required"),
            otherwise: (schema) => schema.notRequired(),
        }),
        payment_status: Yup.string().nullable(),
        payment_method: Yup.string().nullable(),
        amount: Yup.number().nullable(),
        note: Yup.string().max(200, "Note should be 200 characters max"),
    });

    const initialPassValues = {
        user_id: userData.id,
        attendeeName: userData.first_name + " " + userData.last_name,
        pass_type: "",
        attendance_balance: "",
        expiry_date: "",
        payment_status: "",
        payment_method: "",
        amount: "",
        note: "",
        sendPass: false,
    };

    // Form submission handler
    const handleSubmit = async (values: any, { resetForm }: any) => {
        console.log("Form Values:", values);

        let res = await Http.post('AddAttendeePass', values);
        console.log(res);
        if (res && res.status == true) {
            getAttendeePasses(values.user_id);
            resetForm();
            closeModal('createPassModal');
        }
    };

    return (
        <>
            <div className="container mt-5">
                <h2 className="fw-bold">Edit Attendee (User)</h2>
            </div>

            <div className="d-flex justify-content-center align-items-center mt-3">
                <div>
                    {/* Logo */}
                    <div className="text-center" onClick={handleButtonClick}>
                        {
                            (
                                userImagePreview ?
                                    <img src={userImagePreview} alt="User Image Preview" width={120} height={120} style={{ objectFit: 'contain' }} />
                                    :
                                    <div className={`text-muted ${styles.uploadBox} d-flex align-items-center justify-content-center`}>
                                        Click to Upload an Image
                                    </div>
                            )
                        }

                        <input type="file" ref={fileInputRef} className={`form-control ${styles.myInput}`} hidden onChange={handleFileChange} accept="image/*" />
                    </div>

                    <Formik
                        enableReinitialize={true}
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={async (values, { resetForm }) => {
                            if (!userImagePreview) {
                                toast.error('Please select User Image');
                                return;
                            }
                            updateUser(values, resetForm);
                        }}
                    >
                        {({ isSubmitting, values, setFieldValue }) => (
                            <Form>
                                <div className="p-4" style={{ width: '450px', maxWidth: '90%', margin: '0 auto' }}>
                                    {/* First Name */}
                                    <div className="mb-3">
                                        <label className="form-label">First Name</label>
                                        <Field
                                            type="text"
                                            name="first_name"
                                            className={`form-control ${styles.myInput}`}
                                        />
                                        <ErrorMessage
                                            name="first_name"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </div>

                                    {/* Last Name */}
                                    <div className="mb-3">
                                        <label className="form-label">Last Name</label>
                                        <Field
                                            type="text"
                                            name="last_name"
                                            className={`form-control ${styles.myInput}`}
                                        />
                                        <ErrorMessage
                                            name="last_name"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <Field
                                            type="email"
                                            name="email"
                                            className={`form-control ${styles.myInput}`}
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div className="mb-3">
                                        <label className="form-label">Phone Number</label>
                                        <Field
                                            type="tel"
                                            name="phone_number"
                                            className={`form-control ${styles.myInput}`}
                                        />
                                        <ErrorMessage
                                            name="phone_number"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </div>

                                    {/* Is Instructor Checkbox */}
                                    <div className="mb-3">
                                        <div className="form-check">
                                            <Field
                                                type="checkbox"
                                                name="user_type"
                                                id="instructor"
                                                className="form-check-input"
                                                checked={values.user_type === 'instructor'}
                                                onChange={(e: any) => {
                                                    setFieldValue(
                                                        'user_type',
                                                        e.target.checked ? 'instructor' : 'user'
                                                    );
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor="instructor">
                                                Is Instructor
                                            </label>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div
                                        className={`d-flex align-items-center justify-content-between mt-5 ${styles.dflex}`}
                                    >
                                        <div>
                                            <button
                                                className={`btn w-100 ${styles.cancelBtn}`}
                                                onClick={() => router.push('/main/attendees')}
                                                type="button"
                                            >
                                                Cancel
                                            </button>
                                        </div>

                                        <div>
                                            <button
                                                type="submit"
                                                className={`btn w-100 ${styles.loginBtn}`}
                                                disabled={isSubmitting}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>


            <div className="container mt-5">
                <h5 className="fw-bold">List of Passes</h5>
            </div>

            <div className={`container mt-5`}>
                <div className={`p-2 mt-4 ${styles.listMainBox}`}>

                    <div className={`fw-bold mb-4 d-flex align-items-center ${styles.headBox}`}>
                        <div>
                            Pass Type

                        </div>
                        <div>
                            Balance
                        </div>

                        <div>
                            Expiry Date

                        </div>

                        <div>
                            Issued By
                        </div>

                        <div>
                            Issue Date
                        </div>

                        <div>
                            Payment Details

                        </div>
                    </div>


                    {
                        userPasses &&
                        userPasses.map((item: any, i: number) => (
                            <div className={`mb-4 d-flex align-items-center ${styles.headBox}`} key={i}>
                                <div>
                                    {item.pass_type}
                                </div>

                                <div>
                                    {item.attendance_balance}
                                </div>

                                <div>
                                    {item.expiry_date}
                                </div>

                                <div>
                                    {item.issuer}
                                </div>

                                <div>
                                    {item.issue_date}
                                </div>

                                <div>
                                    <button className={`btn text-capitalize ${item.payment_status == 'pending' ? styles.btnPending : styles.btnPaid}`}>{item.payment_status}</button>
                                    {' '+item.amount + ' via ' + item.payment_method}

                                    <div className='my-2'>
                                        <i>
                                            {item.note}
                                        </i>
                                    </div>
                                </div>

                                <div className='d-flex align-items-center mx-3' style={{ gap: 10 }}>
                                    <span className={item.status == 'Revoked Pass' ? 'text-danger' : styles.textPaid}>{item.status}</span>
                                    <button className={`btn ${styles.btnOutline}`}>
                                        <i className="bi bi-pencil-fill"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className="container my-3 d-flex">
                <button type="button" style={{ marginRight: 20 }} className={`btn ${styles.btnOutline}`} onClick={() => openModal()}>Create New Pass</button>
            </div>


            <div
                className={`modal fade`}
                id="createPassModal"
                tabIndex={-1}
                aria-labelledby="createPassModal"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <Formik
                            enableReinitialize={true}
                            initialValues={initialPassValues}
                            validationSchema={validationPassSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ values }) => (
                                <Form>
                                    <div className="modal-body">
                                        <h2 className="text-center fw-bold mb-5">
                                            Attendance Pass Details
                                        </h2>

                                        {/* Attendee Name */}
                                        <div className="mb-3">
                                            <label className="form-label">Attendee Name</label>
                                            <Field
                                                type="text"
                                                name="attendeeName"
                                                className={`form-control`}
                                                readOnly
                                            />
                                        </div>

                                        {/* Pass Type (Radio Buttons) */}
                                        <div className="mb-3">
                                            <label className="form-label">Pass Type</label>
                                            <div>
                                                <div className="form-check form-check-inline">
                                                    <Field
                                                        type="radio"
                                                        name="pass_type"
                                                        className="form-check-input"
                                                        id="radio1"
                                                        value="Unlimited"
                                                        onClick={() => setPassType("Unlimited")}
                                                    />
                                                    <label className="form-check-label" htmlFor="radio1">
                                                        Unlimited
                                                    </label>
                                                </div>

                                                <div className="form-check form-check-inline">
                                                    <Field
                                                        type="radio"
                                                        name="pass_type"
                                                        className="form-check-input"
                                                        id="radio2"
                                                        value="Flexible"
                                                        onClick={() => setPassType("Flexible")}
                                                    />
                                                    <label className="form-check-label" htmlFor="radio2">
                                                        Flexible
                                                    </label>
                                                </div>
                                            </div>
                                            <ErrorMessage name="passType" component="div" className="text-danger" />
                                        </div>

                                        {/* Attendance Balance */}
                                        {
                                            passType == 'Flexible' ?
                                                <div className="form-group mb-3">
                                                    <label htmlFor="attendance_balance">Attendance Balance</label>
                                                    <Field as="select" className="form-control" name="attendance_balance">
                                                        <option value="">Select</option>
                                                        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                                                            <option key={num} value={num}>{num}</option>
                                                        ))}
                                                    </Field>
                                                    <ErrorMessage name="attendance_balance" component="div" className="text-danger" />
                                                </div>
                                                :
                                                null

                                        }

                                        {/* Expiry Date */}
                                        <div className="mb-3">
                                            <label className="form-label">Expiry Date {passType !== "Unlimited" && "(Optional)"}</label>
                                            <Field type="date" name="expiry_date" className="form-control" />
                                            <ErrorMessage name="expiry_date" component="div" className="text-danger" />
                                        </div>

                                        {/* Payment Details Section */}
                                        <div className="p-3 mb-3" style={{ border: "1px solid lightgrey", borderRadius: 10 }}>
                                            <h6 className="text-secondary fw-bold">Payment Details (Optional)</h6>

                                            {/* Payment Status */}
                                            <div className="form-group mb-3">
                                                <label htmlFor="payment_status">Status</label>
                                                <Field as="select" className="form-control" name="payment_status">
                                                    <option value="">Select</option>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Partial">Partial</option>
                                                    <option value="Paid">Paid</option>
                                                </Field>
                                            </div>

                                            {/* Payment Method */}
                                            <div className="form-group mb-3">
                                                <label htmlFor="payment_method">Method</label>
                                                <Field as="select" className="form-control" name="payment_method">
                                                    <option value="">Select</option>
                                                    <option value="Bank">Bank</option>
                                                    <option value="Cash">Cash</option>
                                                    <option value="Card">Card</option>
                                                </Field>
                                            </div>

                                            {/* Amount */}
                                            <div className="mb-3">
                                                <label className="form-label">Amount</label>
                                                <Field
                                                    type="number"
                                                    name="amount"
                                                    className="form-control"
                                                    placeholder="Enter amount"
                                                />
                                            </div>

                                            {/* Note */}
                                            <div className="mb-3">
                                                <label className="form-label">Note</label>
                                                <Field as="textarea" name="note" className="form-control" />
                                            </div>
                                        </div>

                                        {/* Send Pass Checkbox */}
                                        <div className="">
                                            <label className="form-check-label me-2" htmlFor="sendPass">
                                                Send Pass (via Email)
                                            </label>
                                            <Field
                                                type="checkbox"
                                                name="sendPass"
                                                className="form-check-input me-2"
                                                id="sendPass"
                                            />
                                            <span style={{ fontSize: 11 }}>(user@gmail.com)</span>
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="modal-footer d-flex align-items-center justify-content-between">
                                        <button
                                            type="button"
                                            className={`btn btn-outline-secondary ${styles.cancelBtn}`}
                                            onClick={() => closeModal('createPassModal')}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className={`btn ${styles.loginBtn}`}>
                                            Create Pass
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>

        </>
    )
}

export default EditAttendee;