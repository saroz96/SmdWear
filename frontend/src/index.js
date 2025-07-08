// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import { store } from './store';
// import App from './App';
// import { AuthProvider } from './context/AuthContext';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <AuthProvider store={store}>
//       <App />
//     </AuthProvider>
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals())
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

// src/index.js
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import { store } from './store';
// import App from './App';
// import { Provider } from 'react-redux';
// import { AuthProvider } from './context/AuthContext'; // Make sure this import is correct
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <Provider store={store}>       {/* Redux Provider */}
//       <AuthProvider>              {/* Your Auth Context Provider */}
//         <App />
//       </AuthProvider>
//     </Provider>
//   </React.StrictMode>
// );

// reportWebVitals();

// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { store } from './store';
import App from './App';
import { Provider } from 'react-redux';
import { AuthProvider } from './context/AuthContext';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();