import React from "react";
import { motion } from "framer-motion";
import { UserPlus, ClipboardList, AlertCircle } from "lucide-react";
import Card from "../ui/Card";
import BrandedNav from "./BrandedNav";

const Instruction = () => {
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
    <>
      <BrandedNav />
      <section className="py-20 bg-green-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enrollment Instructions
            </h2>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              Please review the requirements below before proceeding with your
              program enrollment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Registration Required Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 rounded-xl p-3 shrink-0">
                    <UserPlus className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Registration Required First
                    </h3>
                    <div className="space-y-3 text-gray-600">
                      <p className="leading-relaxed">
                        <span className="font-semibold text-red-600">
                          Action required:
                        </span>{" "}
                        You must{" "}
                        <span className="font-bold">register an account</span>{" "}
                        before you can enroll in any program.
                      </p>
                      <p className="leading-relaxed">
                        The program you are planning to enroll in is only
                        accessible to registered users. Please complete the
                        registration process first to gain access to enrollment.
                      </p>
                      <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-500 mt-2">
                        <p className="text-sm text-red-700 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>
                            If you haven't registered yet, you will not be able
                            to proceed with enrollment. Registration is
                            mandatory for all students.
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* How to Enroll After Registration Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 rounded-xl p-3 shrink-0">
                    <ClipboardList className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Registration → Enrollment Steps
                    </h3>
                    <div className="space-y-3 text-gray-600">
                      <p className="leading-relaxed">
                        Follow these steps to successfully enroll in your
                        desired program:
                      </p>
                      <ol className="list-decimal list-inside space-y-2 pl-2">
                        <li>
                          <span className="font-semibold">
                            <a href="/register">Complete registration</a>
                          </span>{" "}
                          - Create your account with your personal details. you
                          can click{" "}
                          <a className="text-blue-600" href="/register">
                            here!
                          </a>
                        </li>
                        <li>
                          <span className="font-semibold">
                            <a href="/register">Log in</a>
                          </span>{" "}
                          to your new account using your credentials.
                        </li>
                        <li>
                          <span className="font-semibold">
                            Browse available programs
                          </span>{" "}
                          and select the one you're planning to enroll in.
                        </li>
                        <li>
                          <span className="font-semibold">
                            Click the "Enroll" button
                          </span>{" "}
                          to secure your slot.
                        </li>
                      </ol>
                      <div className="bg-green-50 p-3 rounded-lg mt-2">
                        <p className="text-sm text-green-800">
                          ✅ Already registered? Simply log in to your account
                          and proceed directly to enrollment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Additional reminder banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-10 text-center"
          >
            <p className="text-green-100 bg-green-800/50 inline-block px-6 py-3 rounded-full backdrop-blur-sm">
              ⚠️ Important: Enrollment is only available to registered users.
              Please register your account first to avoid any delays.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Instruction;
