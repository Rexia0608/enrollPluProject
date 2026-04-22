import React from "react";

const Ribbon = () => {
  return (
    <section className="py-10 bg-linear-to-r  from-blue-600 to-indigo-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Build Your Future?
        </h2>
        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
          Join LSTC today and take the first step toward a successful career in
          technology and skills development.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <PrimaryButton
            size="lg"
            className="bg-green-500 text-shadow-white hover:bg-green-300"
          >
            Enroll Now
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
};

export default Ribbon;
