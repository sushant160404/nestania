import React from 'react';
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

export const ValueProps: React.FC = () => {
  const props = [
    {
      icon: <Truck className="w-5 h-5 text-[#8A5A36]" />,
      title: 'Free Shipping',
      description: 'On Orders Above ₹999',
    },
    {
      icon: <RotateCcw className="w-5 h-5 text-[#8A5A36]" />,
      title: 'Easy Returns',
      description: 'Within 7 Days',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#8A5A36]" />,
      title: 'Secure Payments',
      description: '100% Secure',
    },
    {
      icon: <Headphones className="w-5 h-5 text-[#8A5A36]" />,
      title: 'Customer Support',
      description: "We're Here to Help",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#EBE3D8] p-5 sm:p-6 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-4 divide-y md:divide-y-0 md:divide-x divide-[#EBE3D8]">
          {props.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-3.5 ${
                index > 0 ? 'pt-4 md:pt-0 md:pl-6' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border border-[#E3DACD] shadow-xs">
                {item.icon}
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-[#2D2723]">
                  {item.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#7A6C62] mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

