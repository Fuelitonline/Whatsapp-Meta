import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './Routes';

const App = () => {
  return (
    <Router>
      <Routes>
        {Object.keys(routes).map((category) =>
          routes[category].map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element} // Removed fbLoaded prop
              
            />
          ))
        )}
      </Routes>
    </Router>
  );
};

export default App;