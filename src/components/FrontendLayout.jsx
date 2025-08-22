import React from 'react';
import FrontendNavbar from './FrontendNavbar';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function FrontendLayout() {
  const { user } = useAuth();
  return (
    <>
      <FrontendNavbar user={user} />
      <div className="frontend-content">
        <Outlet />
      </div>
    </>
  );
}
