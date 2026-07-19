import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ApiProvider } from './services/context/ApiContext';
import { AgaffProvider } from './services/context/AgaffContext';
import { TsevetMevatzeatProvider } from './services/context/TsevetMevatzeatContext';
import { ProjectsProviderWithSync } from './services/context/ProjectsContext';
import { BUDGET_COLORS } from './features/dashboard/constans/chartConstants';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApiProvider initialBase={process.env.REACT_APP_API_BASE}>
      <AgaffProvider>
        <TsevetMevatzeatProvider>
          <ProjectsProviderWithSync>
            <App />
          </ProjectsProviderWithSync>
        </TsevetMevatzeatProvider>
      </AgaffProvider>
    </ApiProvider>
  </React.StrictMode>
);

Object.entries(BUDGET_COLORS).forEach(([key, hex]) => {
  try {
    document.documentElement.style.setProperty(`--color-${key.toLowerCase()}`, hex);
  } catch (e) {
  }
});
