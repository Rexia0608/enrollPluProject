import Header from "./dashboard/header";

const test = () => {
  return (
    <>
      <Header />
      <nav className="grid grid-cols-12">
        <div className="col-span-2 bg-red-500 shadow-xl min-h-screen"></div>
        <div className="col-span-10 bg-blue-500 shadow-xl min-h-12.5"></div>
      </nav>
    </>
  );
};

export default test;
