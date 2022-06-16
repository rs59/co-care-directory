import React from 'react';

import "@trussworks/react-uswds/lib/uswds.css";
import "@trussworks/react-uswds/lib/index.css";
import "./App.css";

import { Route, Routes } from "react-router-dom";

import Layout from './components/Layout';
import Search from './pages/Search';
import Home from './pages/Home';
import ResultDetail from './pages/ResultDetail';
import './i18n';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}/>
          <Route path="search" element={<Search />} />
          <Route path="result/:resultId" element={<ResultDetail />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;