
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = ({ user }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <main className="flex-grow">
        <Outlet user={user} />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
