import React, { useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";


export default function SignUpPopup() {
    const [visible, setVisible] = useState(false);
    const footerContent = (
        <div>
            <Button label="No" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button label="Sig Up" severity="succes" icon="pi pi-check" onClick={() => setVisible(false)} autoFocus />
        </div>
    );

    return (
        <div className="card flex justify-content-center">
            <Button label="Show" icon="pi pi-external-link" onClick={() => setVisible(true)} />
            <Dialog header="Header" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} footer={footerContent}>
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-user" ></i>
                    </span>
                <InputText value={username} onChange={e => setUsername((e.target.value))} placeholder="Username"/>
                    <span className="p-inputgroup-addon">
                        <i  className="pi pi-key"></i>
                    </span>
                <Password value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' toggleMask />
                <Button label="Sign Up" onClick={() => signUp()} severity="success"/>
                </div>
            </Dialog>
        </div>
    )
}