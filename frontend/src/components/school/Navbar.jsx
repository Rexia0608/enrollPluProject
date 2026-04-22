import PrimaryButton from "../ui/PrimaryButton";
// import logoTransparent from "src/img/logoTransparent.png";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <img
              src="http://localhost:3000/faculty/get-images/logoTransparent.png"
              alt="LSTC Logo"
              className="h-10 w-auto object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Laguna Science and Technology College
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Filipina Compound Landayan, San Pedro, Philippines, 4023
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#home"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Home
            </a>
            <a
              href="#vision"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              About
            </a>
            <a
              href="#programs"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Programs
            </a>
            <a
              href="#why"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Why LSTC
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <PrimaryButton className="bg-green-500" size="sm">
              Enroll Now
            </PrimaryButton>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
