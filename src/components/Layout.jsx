import { Outlet } from "react-router-dom";

import Newsletter from "./Newsletter";
import Footer from "./Footer";

export default function Layout() {
  return (
    <>
     

      <main>
        <Outlet />
      </main>

      <Newsletter />
      <Footer />
    </>
  );
}