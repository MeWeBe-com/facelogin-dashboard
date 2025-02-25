"use client"

import Image from "next/image";
import styles from './settings.module.css';

export default function Reports() {
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
                        <div className="mb-3">
                            <label className="form-label">Logo</label>
                            <Image src="/imgs/logo.png" alt="Logo" width={100} height={100} priority />
                            <input type="file" className={`form-control ${styles.myInput}`} hidden />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input type="email" className={`form-control ${styles.myInput}`} />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="exampleFormControlSelect1">Pass Issue Type:</label>
                            <select className="form-control" id="exampleFormControlSelect1">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                        </div>

                    </div>
                </div>


            </div>
        </>
    )
}