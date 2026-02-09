import { HiLogout } from "react-icons/hi";

const header = () => {
  return (
    <>
      <header className="bg-white border border-[#D1D5DC] shadow-md top-0 left-0 z-50">
        <div className="flex max-w-360 container mx-auto px-4 py-1 flex-items-center justify-between">
          <div className="flex items-center gap-2">
            {/* logo  */}
            <div className="bg-[#D9D9D9] px-2 py-4 rounded-full">LOGO</div>
            <div>
              <h1 className="font-bold">EnrollPlus</h1>
              <p className="text-gray-600 text-sm">School Enrollment System</p>
            </div>
          </div>

          <div className="pt-3">
            <button className="bg-[#D9D9D9] rounded-full p-1">
              <HiLogout className="text-3xl" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default header;
