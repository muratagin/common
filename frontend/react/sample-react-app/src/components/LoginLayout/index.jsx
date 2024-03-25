import { Outlet } from 'react-router-dom';
import Footer from './footer';

export default function LoginLayout() {
  return (
    <div>
      <Outlet />
      <Footer />
    </div>
  );
}
