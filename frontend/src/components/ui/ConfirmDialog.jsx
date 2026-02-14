// components/ui/ConfirmDialog.jsx
import React from "react";
import { AlertTriangle } from "lucide-react";
import SecondaryButton from "./SecondaryButton";

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "red",
}) {
  if (!isOpen) return null;

  const colorClasses = {
    red: "bg-red-600 hover:bg-red-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop - separate div with its own z-index */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container - higher z-index and no blur */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0 relative z-10">
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-2xl shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-gray-600">{message}</p>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex flex-col sm:flex-row-reverse gap-3">
            <button
              onClick={onConfirm}
              className={`px-4 py-2.5 text-white font-medium rounded-lg transition-colors ${colorClasses[confirmColor]}`}
            >
              {confirmText}
            </button>
            <SecondaryButton onClick={onClose} className="flex-1">
              {cancelText}
            </SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
