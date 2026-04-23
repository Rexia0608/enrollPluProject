import React from "react";
import { MapPin, ArrowRight } from "lucide-react";
import PrimaryButton from "../ui/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section
      id="home"
      className="relative min-h-[85vh] flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(http://localhost:3000/faculty/get-images/schoolPhoto.png)`,
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm mb-6 backdrop-blur">
              <MapPin className="w-4 h-4" />
              San Pedro, Laguna
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
              Laguna{" "}
              <span className="text-green-500">Technology Science and</span>{" "}
              College
            </h1>

            {/* Description */}
            <p className="text-white text-lg mb-6">
              Empowering students through technical excellence, innovation, and
              career-ready skills for a competitive future.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <PrimaryButton
                className="bg-green-500 hover:bg-green-600"
                size="lg"
                icon={ArrowRight}
                onClick={() => navigate("/login")}
              >
                Enroll Now
              </PrimaryButton>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
