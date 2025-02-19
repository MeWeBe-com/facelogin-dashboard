import styles from './dashbaord.module.css';

export default function Dashboard() {
    return (
        <>
            <div className="container mt-5">
                <h2 className="fw-bold">Dashboard</h2>
            </div>

            <div className="container">
                <div className="d-flex justify-content-end p-3 align-items-center">
                    <div>
                        Tuesday, 18 Feb
                    </div>
                    <div>
                        <button className="btn">
                            <i className="bi bi-chevron-left"></i>
                        </button>

                        <button className="btn">
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>

                    <div>
                        <button className="btn btn-outline-dark">Today</button>
                    </div>
                </div>
            </div>

            <div className="container px-4">
                <div className={`row fw-bold ${styles.box}`}>
                    Attendance Summary
                </div>
            </div>

            <div>asd</div>

        </>


    )
}