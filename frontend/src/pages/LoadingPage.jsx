// pages/LoadingPage.jsx
import React from "react";
import LoadingImage from "/img/loading.gif";

function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <img width={200} src={LoadingImage} alt="Maintenance GIF image" />
        <p className="text-gray-600 mt-2">Checking authentication…</p>
      </div>
    </div>
  );
}

export default LoadingPage;
