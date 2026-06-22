import { Outlet } from "react-router-dom";

import Navebar from "./Navebar";
import NewsLetter from "./NewsLetter";
import Footer from "./Footer";

export default function Layout() {
  return (
    <>
     <Navebar/>
   
      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}