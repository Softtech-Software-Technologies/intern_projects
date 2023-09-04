import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import '/node_modules/primeflex/primeflex.css';
import "primereact/resources/primereact.min.css"; 
import 'primeicons/primeicons.css';
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);