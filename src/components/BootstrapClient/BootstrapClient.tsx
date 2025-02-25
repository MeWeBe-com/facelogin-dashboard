"use client"

import { useEffect } from "react";

const BootstrapClient = () => {
    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min")
    }, []);

    return null
}

export default BootstrapClient;  // eslint-disable-line