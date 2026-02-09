import Header from "../components/dashboard/header";
import Navbar from "../components/dashboard/navbar";
import { Routes, Route } from "react-router-dom";
import Home from "../routes/Home";
import About from "../routes/About";
import Contact from "../routes/Contact";
import Products from "../routes/Products";

const dashboard = () => {
  return (
    <>
      <div className="max-w-360">
        <Header />

        <div className="grid grid-cols-12">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default dashboard;
