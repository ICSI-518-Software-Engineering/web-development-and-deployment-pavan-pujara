// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Find the root element
const rootElement = document.getElementById('root');
if (rootElement) {
  // Create a root
  const root = createRoot(rootElement);

  // Initial render: Render the App component to the root
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}