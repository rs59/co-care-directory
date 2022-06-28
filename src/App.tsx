import React from "react";

import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import Search from "./pages/Search";
import Home from "./pages/Home";
import ResultDetail from "./pages/ResultDetail";
import Whoops from "./pages/Whoops";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="result/:resultId" element={<ResultDetail />} />
          <Route path="*" element={<Whoops />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
