import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function PasswordResetExpiredPage() {
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    // Redirect after 15 seconds to Gmail
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          redirectToGmail();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const redirectToGmail = () => {
    window.location.replace("https://mail.google.com/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md mx-auto bg-white rounded-2xl shadow-sm p-8"
      >
        <img
          width={200}
          src="http://localhost:3000/faculty/get-images/timeUp.gif"
          alt="Session expired illustration"
          className="mx-auto mb-4"
        />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Reset Link Expired
        </h2>
        <p className="text-gray-600 mt-2">
          The time for your password reset request has expired. Please request a
          new reset link from your school office via email.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Redirecting to Gmail in{" "}
          <span className="font-semibold">{countdown}</span> seconds...
        </p>
        <button
          onClick={redirectToGmail}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Open Gmail
        </button>
      </motion.div>
    </div>
  );
}

export default PasswordResetExpiredPage;
