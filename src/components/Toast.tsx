import { XMarkIcon } from "@heroicons/react/20/solid";
import React, { useState, useEffect } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast = ({ message, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [onClose]);

  return (
    <div
      className={`absolute left-1/2 top-1/4 -translate-x-1/4 -translate-y-1/2 transform rounded-md bg-gradient-to-br from-green-500 to-green-700 p-4 text-white shadow-md ${
        isVisible ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300`}
    >
      <div className="flex items-center">
        <div className="px-4">{message}</div>
        <XMarkIcon
          className="absolute right-2 top-2 h-4 w-4 hover:cursor-pointer"
          onClick={() => setIsVisible(false)}
        />
      </div>
    </div>
  );
};

export default Toast;
