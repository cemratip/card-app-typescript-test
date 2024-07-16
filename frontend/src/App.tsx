import React, { useState } from "react";
import NavBar from './components/NavBar'
import AllEntries from './routes/AllEntries'
import NewEntry from './routes/NewEntry'
import EditEntry from './routes/EditEntry'
import { EntryProvider } from './utilities/globalContext'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <section className={`min-h-screen transition duration-500 ease-in-out ${darkMode && "bg-gray-800"}`}>
      <ThemeToggle onToggle={() => setDarkMode(!darkMode)} darkMode={darkMode} />
      <Router>
        <EntryProvider>
        <NavBar />
          <Routes>
            <Route path="/" element={<AllEntries darkMode={darkMode} />}>
            </Route>
            <Route path="create" element={<NewEntry/>}>
            </Route>
            <Route path="edit/:id" element={<EditEntry/>}>
            </Route>
          </Routes>
        </EntryProvider>
      </Router>
    </section>
  );
}
