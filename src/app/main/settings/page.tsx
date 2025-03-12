"use client"

import styles from './settings.module.css';
import Http from '@/providers/axiosInstance';
import { useCookies } from 'next-client-cookies';
import { toast } from 'react-toastify';
import { useEffect, useState, useRef } from "react";

const Settings = () => {
    const cookies = useCookies();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [logoPreview, setLogoPreview] = useState<any>('');
    const [logoToUpdate, setLogoToUpdate] = useState<any>(null);

    const [orgProfile, setOrgProfile] = useState<any>({
        organization_logo: '',
        organization_name: '',
        admin_id: '',
        admin_pin: '',
        id: ''
    });


    useEffect(() => {
        let id = cookies.get('org_id');
        if (id) {
            getOrgDetails(id);
        } else {
            toast.error('Something went wrong!');
        }
    }, []);

    const getOrgDetails = async (id: any) => {
        let res = await Http.get(`/GetOrganization/${id}`)
        setOrgProfile({
            id: id,
            organization_logo: res.data.organization_logo,
            organization_name: res.data.organization_name,
            admin_id: res.data.admin_id,
            admin_pin: res.data.admin_pin,
        })
    }

    const onNameChangeHandler = (e: any) => {
        setOrgProfile({ ...orgProfile, organization_name: e.target.value });
    }

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setLogoToUpdate(file);
            // Use FileReader to read the file
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string); // Set the data URL as the preview
            };
            reader.readAsDataURL(file); // Convert file to data URL
        }
    };

    const onPinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOrgProfile({ ...orgProfile, admin_pin: event.target.value });
    }



    const saveOrg = async () => {
        if (orgProfile.admin_pin.length > 4 || orgProfile.admin_pin.length < 4) {
            toast.error('Pleae enter 4 digit Pin');
            return
        }

        let formData = new FormData();
        formData.append('id', orgProfile.id);
        formData.append('logo', logoToUpdate);
        formData.append('organization_name', orgProfile.organization_name);
        formData.append('admin_pin', orgProfile.admin_pin);

        let res = await Http.fileUpload('/UpdateOrganization', formData);
        if (res && res.status == true) {
            toast.success(res.data.message);
        } else {
            toast.success(res.data.message);
        }
    }


    return (
        <>
            <div className="container mt-5">
                <h2 className="fw-bold">Settings</h2>
            </div>

            <div className={`container mt-5`}>

                <div className={`${styles.box}`}>
                    <div className={`fw-bold ${styles.boxHead} d-flex align-items-center justify-content-between`}>
                        <div>
                            Organisation
                        </div>
                    </div>

                    <div className={`m-5 ${styles.formBox}`}>
                        <div className="mb-3" onClick={handleButtonClick}>
                            <label className="form-label">Logo</label>
                            {
                                orgProfile.organization_logo &&
                                (
                                    logoPreview != '' ?
                                        <img src={logoPreview} alt="Organization Logo Preview" width={100} height={100} />
                                        :
                                        <img src={orgProfile.organization_logo} alt="Logo" width={100} height={100} />
                                )
                            }
                            <input type="file" ref={fileInputRef} className={`form-control  `} hidden onChange={handleFileChange} accept="image/*" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input type="text" className={`form-control`}
                                value={orgProfile.organization_name}
                                onChange={onNameChangeHandler} />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Admin ID</label>
                            <input type="text" className={`form-control`} value={orgProfile.admin_id} readOnly />
                        </div>


                        <div className="mb-3">
                            <label className="form-label">Admin Pin</label>
                            <input type="text" className={`form-control`}
                                maxLength={4}
                                minLength={4}
                                value={orgProfile.admin_pin}
                                onChange={onPinChange} />
                        </div>

                    </div>
                </div>
            </div>

            <div className="container my-3 d-flex">
                <button type="button" style={{ marginRight: 20 }} className={`btn ${styles.btnColor}`} onClick={() => saveOrg()}>Save Settings</button>
            </div>
        </>
    )
}

export default Settings;