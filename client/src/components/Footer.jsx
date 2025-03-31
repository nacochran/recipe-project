// Footer.js
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically

  return (
    <footer className="bg-white shadow-md py-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gray-500">© {currentYear} Recipe Project. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
