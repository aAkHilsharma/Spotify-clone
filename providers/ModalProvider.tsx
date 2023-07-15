'use client';

import { useEffect, useState } from "react";

import Modal from "@/app/components/Modal";

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(()=>{
        setIsMounted(true);
    },[])
    
    if(!isMounted) {
        return null;
    }

    return (
        <>
            <Modal title="test title" description="test desc" isOpen onChange={()=>{}}>Modal</Modal>
        </>
    )
}

export default ModalProvider