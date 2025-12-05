import React from 'react';
import { Construction } from 'lucide-react';

const ComingSoon: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <div className="bg-slate-900 p-8 rounded-full mb-6 border border-slate-800">
        <Construction size={48} className="text-indigo-500" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
      <p className="text-slate-400 max-w-md">
        This module is currently under development. The Aureus Admin system is being built module by module.
      </p>
    </div>
  );
};

export default ComingSoon;