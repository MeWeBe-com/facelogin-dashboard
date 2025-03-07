"use client";
import styles from './createattendee.module.css';
import { useRouter } from "next/navigation";
import Http from '@/providers/axiosInstance';
import { useCookies } from 'next-client-cookies';
import { toast } from 'react-toastify';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useRef, useState } from 'react';

const CreateAttendee = () => {
    const router = useRouter();
    const cookies = useCookies();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [userImagePreview, setUserImagePreview] = useState<any>(null);
    const [userImageToUpdate, setUserImageToUpdate] = useState<any>(null);


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
        first_name: Yup.string().required('First Name is required'),
        last_name: Yup.string().required('Last Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        phone_number: Yup.string().required('Phone Number is required'),
        user_type: Yup.string().required('User Type is required')
    });

    const registerUser = async (values: any, resetForm: any) => {
        let org_id: any = cookies.get('org_id');
        let formData = new FormData();
        formData.append('id', '');
        formData.append('organization_id', org_id);
        formData.append('first_name', values.first_name);
        formData.append('last_name', values.last_name);
        formData.append('email', values.email);
        formData.append('phone_number', values.phone_number);
        formData.append('user_image', userImageToUpdate);
        formData.append('user_type', values.user_type);

        let res = await Http.fileUpload('RegisterUser', formData);
        if (res && res.status == true) {
            setUserImagePreview(null);
            setUserImageToUpdate(null);
            resetForm();
            toast.success('User Registration Successfull!');
        } else {
            toast.error(res.message)
        }
    }


    return (
        <>
            <div className="container mt-5">
                <h2 className="fw-bold">Create Attendee (User)</h2>
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
                        initialValues={{
                            first_name: '',
                            last_name: '',
                            email: '',
                            phone_number: '',
                            user_type: 'user', // Default value is 'user'
                        }}
                        validationSchema={validationSchema}
                        onSubmit={async (values, { resetForm }) => {
                            if (!userImagePreview) {
                                toast.error('Please select User Image');
                                return;
                            }
                            registerUser(values, resetForm);
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
        </>
    )
}

export default CreateAttendee;