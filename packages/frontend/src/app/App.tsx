import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from '../templates/MainLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Project from '../pages/Project';
import Projects from '../pages/Projects';
import Courses from '../pages/Courses';
import Course from '../pages/Course';
import Backlog from '../pages/Backlog';
import Account from '../pages/Account';

import ProjectOverview from '../pages/ProjectOverview';
import ProjectBacklogs from '../pages/ProjectBacklogs';
import ProjectKanban from '../pages/ProjectKanban';

import './App.css';
import ProjectSettings from '../pages/ProjectSettings';
import CourseOverview from '../pages/CourseOverview';
import CourseSettings from '../pages/CourseSettings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="" element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="project/:projectId" element={<Project />}>
            <Route path="" element={<Navigate to="overview" />} />
            <Route path="overview" element={<ProjectOverview />} />
            <Route path="backlog" element={<ProjectBacklogs />} />
            <Route path="backlog/:backlogId" element={<Backlog />} />
            <Route path="kanban" element={<ProjectKanban />} />
            <Route path="settings" element={<ProjectSettings />} />
          </Route>
          <Route path="courses" element={<Courses />} />
          <Route path="course/:courseId" element={<Course />}>
            <Route path="" element={<Navigate to="overview" />} />
            <Route path="overview" element={<CourseOverview />} />
            <Route path="settings" element={<CourseSettings />} />
          </Route>
          <Route path="account" element={<Account />}/>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <main style={{ padding: '1rem' }}>
              <p>404</p>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
