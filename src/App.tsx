import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SWRConfig } from 'swr';
import { ErrorBoundary } from './components';
import { default as RootPage } from './pages/Root'
import NotFound from './pages/NotFound';

const HomePage = React.lazy(() => import('./pages/Home'))
const DetailsPage = React.lazy(() => import('./pages/Details'))

const mdTheme = createTheme();

function App() {
  return (
    <ErrorBoundary>
      <SWRConfig value={{
        fetcher: (key, config) => fetch(key, config).then(res => res.json())
      }}>
        <ThemeProvider theme={mdTheme}>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={ <RootPage /> }>
                <Route path='' element={<HomePage/>}/>
                <Route path='article/:id' element={<DetailsPage/>}/>
              </Route>
              <Route path="*" element={<NotFound/>} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </SWRConfig>
    </ErrorBoundary>
  );
}

export default App;
