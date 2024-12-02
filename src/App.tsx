import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import WelcomeSplash from './components/WelcomeSplash';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Pipeline from './pages/Pipeline';
import CandidateList from './pages/CandidateList';
import CandidateDetails from './pages/CandidateDetails';
import ArchivePage from './pages/Archive';
import JobList from './pages/JobList';
import JobDetails from './pages/JobDetails';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

const AppContent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { showWelcome, setShowWelcome } = useAuth();

  return (
    <Router>
      <WelcomeSplash isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gradient-to-br from-[#EDF7F8] via-[#F0F1F9] to-[#F5F6FA]">
                <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <div className="flex min-h-screen pt-16">
                  <div className={`fixed left-0 top-0 h-full transition-all duration-300 ease-in-out z-30 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-64'
                  }`}>
                    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                  </div>
                  <main className={`flex-1 transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? 'ml-64' : 'ml-0'
                  } p-4 md:p-8`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="backdrop-blur-xl bg-white/95 p-4 md:p-8 rounded-2xl shadow-lg"
                    >
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/pipeline" element={<Pipeline />} />
                        <Route path="/candidates" element={<CandidateList />} />
                        <Route path="/candidates/:id" element={<CandidateDetails />} />
                        <Route path="/jobs" element={<JobList />} />
                        <Route path="/jobs/:id" element={<JobDetails />} />
                        <Route path="/archive" element={<ArchivePage />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/admin/*" element={<AdminDashboard />} />
                      </Routes>
                    </motion.div>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;