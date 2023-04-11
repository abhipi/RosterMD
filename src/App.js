import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './Landing_Page/Navbar';
import Product from './Landing_Page/Product';
import Footer from './Landing_Page/Footer';
import About from './Landing_Page/About';
import Landing_Page from './Landing_Page/Landing_Page';
import Scheduler from './Scheduler/Scheduler';
import Voicenote from './Scheduler/Voicenote';
import Dashboard from './Scheduler/Dashboard';
function App() {
  return (
    <div className="RosterMD_App">
      <Router>
          <Routes>
          <Route path="/home" index element={<Landing_Page />}/>
          <Route path="/dashboard" element={<Dashboard />}/>
          </Routes>
      </Router>
    </div>
  );
}

export default App;
