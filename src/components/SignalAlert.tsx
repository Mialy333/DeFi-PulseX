import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type SignalType = "success" | "error" | "info" | "warning";

interface SignalAlertProps {
  message: string;
  type?: SignalType;
  duration?: number; // en ms
  show: boolean;
  onClose: () => void;
}

const icons = {
  success: <CheckCircle2 className="text-green-600" />,
  error: <AlertCircle className="text-red-600" />,
  info: <Info className="text-blue-600" />,
  warning: <AlertTriangle className="text-yellow-600" />,
};

const bgColors = {
  success: "bg-green-100 border-green-600",
  error: "bg-red-100 border-red-600",
  info: "bg-blue-100 border-blue-600",
  warning: "bg-yellow-100 border-yellow-600",
};

export default function SignalAlert({
  message,
  type = "info",
  duration = 4000,
  show,
  onClose,
}: SignalAlertProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`fixed top-5 right-5 z-50 px-4 py-3 border-l-4 rounded shadow-md flex items-center space-x-2 ${bgColors[type]}`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
        >
          {icons[type]}
          <span className="text-sm font-medium text-gray-800">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
