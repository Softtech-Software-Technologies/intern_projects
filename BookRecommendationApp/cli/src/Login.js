import React from 'react'; 
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import './Login.css';

export default function Login() {

    return (  
    <div className='container'>
        <div className='box'>
            <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-user" ></i>
                </span>
                <InputText size='' placeholder="Username" />
            </div>

            <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-key"></i>
                </span>
                <InputText placeholder="Password" type='password' />
            </div>

            <div className='button'>
                <Button label="Login" severity="primary" />
                <Button label="Sign Up" severity="success" />
            </div>

        </div>
    </div>
    )        
}
        