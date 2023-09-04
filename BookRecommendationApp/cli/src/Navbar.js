import React from 'react';
import { Menubar } from 'primereact/menubar';
import './Navbar.css';

export default function NavBar() {
    const items = [
        {
            label: 'Home',
            icon: 'pi pi-fw pi-home'
        },
        {
            label: 'Sign In',
            icon: 'pi pi-sign-in'
        },
        {
            label: 'Sign Out',
            icon: 'pi pi-fw pi-sign-out'
        }
    ];

    return (
        <div className="card">
            <Menubar model={items} />
        </div>
    )
}
