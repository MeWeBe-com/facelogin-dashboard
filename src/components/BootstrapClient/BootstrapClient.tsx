"use client";
import { useEffect } from "react";

const BootstrapClient = () => {
    useEffect(() => {
        // @ts-ignore
        import("bootstrap/dist/js/bootstrap.bundle.min").then((bootstrap) => {
            (window as any).bootstrap = bootstrap;
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            tooltipTriggerList.forEach((tooltipTriggerEl) => {
                new window.bootstrap.Tooltip(tooltipTriggerEl);
            });
        }).catch((err) => console.error("Failed to load Bootstrap:", err));

       
    }, []);

    return null;
};

export default BootstrapClient;
