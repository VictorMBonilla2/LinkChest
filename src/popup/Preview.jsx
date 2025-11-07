// Preview.jsx
import React from "react";
import Popup from "./Home";

function Preview() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h2 className="text-lg font-bold">400x300 (default)</h2>
        <div className="border border-gray-300 p-2">
          <Popup />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold">600x400</h2>
        <div className="border border-gray-300 p-2 w-[600px] h-[400px]">
          <Popup />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold">800x600 (límite Chrome)</h2>
        <div className="border border-gray-300 p-2 w-[800px] h-[600px]">
          <Popup />
        </div>
      </div>
    </div>
  );
}

export default Preview;
