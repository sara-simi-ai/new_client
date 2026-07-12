import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ApiProvider } from './services/context/ApiContext';
import { ProjectsProvider } from './services/context/ProjectsContext';
import reportWebVitals from './reportWebVitals';
import { BUDGET_COLORS } from './features/dashboard/constans/chartConstants';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApiProvider initialBase={process.env.REACT_APP_API_BASE}>
      <ProjectsProvider>
        <App />
      </ProjectsProvider>
    </ApiProvider>
  </React.StrictMode>
);

reportWebVitals();

Object.entries(BUDGET_COLORS).forEach(([key, hex]) => {
  try {
    document.documentElement.style.setProperty(`--color-${key.toLowerCase()}`, hex);
  } catch (e) {
  }
});
