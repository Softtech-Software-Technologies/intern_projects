import React, { useState } from "react";
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { RadioButton } from "primereact/radiobutton";
import './Login.css';

export default function App() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [visibleSignUp, setVisibleSignUp] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [typeUser, setTypeUser] = useState('');

    return (
        <div className='login'>
            <div className="card">
                <div className="flex flex-column md:flex-row">
                    <div className="w-full md:w-5 flex flex-column align-items-s justify-content-center gap-3 py-5">
                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <InputText value={username} onChange={e => setUsername((e.target.value))} placeholder="Username" />
                            <Password value={password} onChange={(e) => setPassword(e.target.value)} toggleMask placeholder="Password" feedback={false} />
                        </div>
                        <Button label="Login" icon="pi pi-user" className="w-10rem mx-auto" disabled={typeUser === ''}></Button>
                        <div className="card flex justify-content-center">
                            <div className="flex flex-wrap gap-3">
                                <div className="flex align-items-center">
                                    <RadioButton inputId="type1" name="validator" value="validator" onChange={(e) => setTypeUser(e.value)} checked={typeUser === 'validator'} />
                                    <label htmlFor="type1" className="ml-2">Validator</label>
                                </div>
                                <div className="flex align-items-center">
                                    <RadioButton inputId="type2" name="verifier" value="verifier" onChange={(e) => setTypeUser(e.value)} checked={typeUser === 'verifier'} />
                                    <label htmlFor="type2" className="ml-2">Verifier</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-2">
                        <Divider layout="vertical" className="hidden md:flex">
                            <b>OR</b>
                        </Divider>
                    </div>
                    <div className="w-full md:w-5 flex align-items-center justify-content-center py-5">
                        <Button label="Sign Up" icon="pi pi-user-plus" className="p-button-success" onClick={() => setVisibleSignUp(true)}></Button>
                        <Sidebar visible={visibleSignUp} onHide={() => setVisibleSignUp(false)} className="w-full md:w-20rem lg:w-30rem">
                            <h2>Sign Up</h2>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user" ></i>
                                </span>
                                <InputText value={newUsername} onChange={e => setNewUsername((e.target.value))} placeholder="Username" />
                            </div>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-key"></i>
                                </span>
                                <Password value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='Password' toggleMask />
                                <Button label="Sign Up" severity="success" />
                            </div>
                        </Sidebar>
                    </div>
                </div>
            </div>
        </div>
    )
}
