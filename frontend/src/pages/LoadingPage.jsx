// pages/LoadingPage.jsx
import { motion, AnimatePresence } from "framer-motion";
import LoadingImage from "/img/loading.gif";

function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="text-center">
          <img width={200} src={LoadingImage} alt="Maintenance GIF image" />
          <p className="text-gray-600 mt-2">Checking authentication…</p>
        </div>
      </motion.div>
    </div>
  );
}

export default LoadingPage;
