import { AlertCircle } from "lucide-react";

const FailedLoadData = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8 text-center">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-red-800 mb-2">
        Failed to Load Data
      </h3>
      <p className="text-gray-600 mb-6">{contextError}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Retry
      </button>
    </div>
  );
};

export default FailedLoadData;
