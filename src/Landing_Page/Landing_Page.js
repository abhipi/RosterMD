import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './Navbar';
import Product from './Product';
import Footer from './Footer';
import About from './About';
function Landing_Page() {
  return (
    <div className="Navbar">
      <Navbar/>
      <Product />
      <About />
      <Footer/>
    </div>
  );
}

export default Landing_Page;
