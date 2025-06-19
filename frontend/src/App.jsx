import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import LayoutWrapper from "./components/LayoutWrapper"
// import MyProgram from "./components/MyPrograms"
import ProgramDetailsActive from "./components/ProgramDetailsActive"

import { programsData, facultyData, tools } from "./data"
import MyPrograms from './components/MyPrograms'
import ProgramDetailsInactives from './components/ProgramDetailsInactives'
// import LayoutWrapper from "./layout-wrapper"
// import MyProgramsPage from "../pages/my-programs"
// import ProgramDetailsActivePage from "../pages/program-details-active"
// import ProgramDetailsInactivePage from "../pages/program-details-inactive"

const App = () => {
  return (
    <LayoutWrapper>
      <Routes>
        <Route path="/" element={<Navigate to="/my-programs" replace />} />
        <Route path="/my-programs" element={<MyPrograms programs={programsData} />} />
        <Route
          path="/program-details-active"
          element={<ProgramDetailsActive faculty={facultyData} tools={tools} />}
        />
        <Route
          path="/program-details-inactive"
          element={<ProgramDetailsInactives faculty={facultyData} tools={tools} />}
        />
        <Route path="/home" element={<div className="p-4 text-center">Home Page Content</div>} />
        <Route path="/notifications" element={<div className="p-4 text-center">Notifications Page Content</div>} />
        <Route path="/profile" element={<div className="p-4 text-center">Profile Page Content</div>} />
      </Routes>
    </LayoutWrapper>
  )
}

export default App
