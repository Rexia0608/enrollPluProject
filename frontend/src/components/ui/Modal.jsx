import React, { useEffect, useCallback } from "react";
import { X } from "lucide-react";

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnBackdropClick = true,
  closeOnEsc = true,
  className = "",
  backdropBlur = "md", // "none", "sm", "md", "lg"
  backdropOpacity = "dark", // "light", "dark", "darker"
}) {
  // Define size classes
  const sizeClasses = {
    sm: "sm:max-w-md",
    md: "sm:max-w-lg",
    lg: "sm:max-w-2xl",
    xl: "sm:max-w-4xl",
  };

  // Define backdrop styles
  const backdropStyles = {
    // Opacity variants
    opacity: {
      light: "bg-black/20",
      dark: "bg-black/40",
      darker: "bg-black/60",
    },
    // Blur variants
    blur: {
      none: "",
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
    },
  };

  // Handle Escape key press
  const handleEscapeKey = useCallback(
    (event) => {
      if (event.key === "Escape" && closeOnEsc) {
        onClose();
      }
    },
    [onClose, closeOnEsc],
  );

  // Handle backdrop click
  const handleBackdropClick = (event) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscapeKey);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, handleEscapeKey]);

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div
        className={`
          fixed inset-0 z-50 
          ${backdropStyles.opacity[backdropOpacity]} 
          ${backdropStyles.blur[backdropBlur]}
          transition-all duration-300 ease-in-out
        `}
        aria-hidden="true"
        onClick={handleBackdropClick}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          {/* Modal Panel */}
          <div
            className={`
              relative transform overflow-hidden rounded-2xl bg-white shadow-2xl 
              transition-all sm:my-8 sm:w-full
              ${sizeClasses[size]}
              ${className}
            `}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
          >
            {/* Close Button */}
            <div className="absolute right-4 top-4 z-10">
              <button
                type="button"
                onClick={onClose}
                className="
                  rounded-lg p-2 text-gray-400 
                  hover:bg-gray-100 hover:text-gray-500 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  transition-colors
                "
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 pt-6 pb-4">
              {/* Title */}
              {title && (
                <div className="mb-6">
                  <h3
                    id="modal-title"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    {title}
                  </h3>
                </div>
              )}

              {/* Children Content */}
              <div className="mt-2">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
