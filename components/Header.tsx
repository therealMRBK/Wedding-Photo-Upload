
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-12 px-6 border-b border-gray-100 flex flex-col items-center justify-center text-center">
      <div className="border-2 border-black p-4 mb-6">
        <h1 className="text-6xl md:text-8xl font-thin tracking-tighter serif uppercase">P & R</h1>
      </div>
      <div className="space-y-1">
        <p className="text-sm tracking-[0.3em] font-light uppercase">Patrick & Romy Schupka</p>
      </div>
    </header>
  );
};

export default Header;
