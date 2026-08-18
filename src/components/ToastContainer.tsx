import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-center justify-between gap-3 text-xs sm:text-sm font-medium animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'error'
              ? 'bg-red-50 text-red-900 border-red-200'
              : toast.type === 'info'
              ? 'bg-[#FAF6F1] text-[#4A3E38] border-[#E5DACD]'
              : 'bg-[#2D2723] text-white border-[#4A3F38]'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-[#8A5A36] shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
            )}
            <span className="truncate">{toast.message}</span>
          </div>

          <button
            onClick={() => dismissToast(toast.id)}
            className="p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
