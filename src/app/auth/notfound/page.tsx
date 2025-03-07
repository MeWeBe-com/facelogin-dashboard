"use client"

import Image from "next/image";

const NotFound = () => {
    return (
        <div className="text-center">
            <Image src="/imgs/logo.png" alt="Logo" className="mb-3" width={200} height={200} priority />
            <div>
                404 Page not found
            </div>
        </div>
    )
}

export default NotFound;