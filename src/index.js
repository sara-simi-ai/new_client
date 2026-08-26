import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ApiProvider } from './services/context/ApiContext';
import { AgaffProvider } from './services/context/AgaffContext';
import { MachlakaProvider } from './services/context/MachlakaContext';
import { ChativaProvider } from './services/context/ChativaContext';
import { ProjectsProviderWithSync } from './services/context/ProjectsContext';
import ModalRoot from './components/ModalRoot/ModalRoot';
import { BUDGET_COLORS } from './features/dashboard/constans/chartConstants';

ReactDOM.render(
  <React.StrictMode>
    <ApiProvider initialBase={process.env.REACT_APP_API_BASE}>
      <AgaffProvider>
        <MachlakaProvider>
          <ChativaProvider>
            <ProjectsProviderWithSync>
              <App />
              <ModalRoot />
            </ProjectsProviderWithSync>
          </ChativaProvider>
        </MachlakaProvider>
      </AgaffProvider>
    </ApiProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

Object.entries(BUDGET_COLORS).forEach(([key, hex]) => {
  try {
    document.documentElement.style.setProperty(`--color-${key.toLowerCase()}`, hex);
  } catch (e) {
  }
});
