import { NavLink } from "react-router-dom";

const navbar = () => {
  return (
    <>
      <nav className="col-span-2  bg-[#FFFFFF] shadow-md z-50 border border-[#D1D5DC]">
        <div className="flex flex-col items-center justify-center p-3 m-2">
          <div className="px-15 py-2 bg-gray-200 rounded flex items-center gap-2">
            <NavLink to="/" className="bg=[##E8E8E8] text-black">
              Home
            </NavLink>
          </div>

          <div className="px-15 py-2 bg-gray-200 rounded flex items-center gap-2">
            <NavLink to="/about" className="bg=[##E8E8E8] text-black">
              About
            </NavLink>
          </div>

          <div className="px-15 py-2 bg-gray-200 rounded flex items-center gap-2">
            <NavLink to="/contact" className="bg=[##E8E8E8] text-black">
              Contact
            </NavLink>
          </div>

          <div className="px-15 py-2 bg-gray-200 rounded flex items-center gap-2">
            <NavLink to="/products" className="bg=[##E8E8E8] text-black">
              Prodcut
            </NavLink>
          </div>
        </div>
      </nav>
    </>
  );
};

export default navbar;
