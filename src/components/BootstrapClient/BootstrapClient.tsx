"use client";
import { useEffect } from "react";

const BootstrapClient = () => {
    useEffect(() => {
        // @ts-ignore
        import("bootstrap/dist/js/bootstrap.bundle.min").then((bootstrap) => {
            (window as any).bootstrap = bootstrap;
        }).catch((err) => console.error("Failed to load Bootstrap:", err));
    }, []);

    return null;
};

export default BootstrapClient;
