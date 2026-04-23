import React from "react";
import { motion } from "framer-motion";
import { Target, BookOpen } from "lucide-react";
import Card from "../ui/Card";

const Features = () => {
  // Animation variants for cards
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-20 bg-green-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Vision Card with scroll animation */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={cardVariants}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 rounded-xl p-3">
                  <Target className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    Vision
                  </h1>
                  <p className="text-gray-600 leading-relaxed">
                    Laguna Science and Technology College envisions itself as a
                    growing institution of learning and developing individuals
                    technically, technologically and professionally thus
                    becoming useful citizens of the nation contributing to its
                    greatness.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Mission Card with scroll animation */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={cardVariants}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 rounded-xl p-3">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Mission
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    The mission of Laguna Science and Technology College is to
                    train young men and women to become productive citizens
                    fully equipped with rightful skills and values that the
                    modern industries demand.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;
