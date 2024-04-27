import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import Main from './pages/Main';
import reportWebVitals from './Components/reportWebVitals.js'; // Update the import path
import { StateProvider } from './Components/StateProvider.js'; // Update the import path
import reducer, { initialState } from './Components/reducer.js'; // Update the import path

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <StateProvider initialState={initialState} reducer={reducer}>
                <App/>
            </StateProvider>
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();