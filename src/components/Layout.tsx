import { Header } from "@trussworks/react-uswds";
import { Outlet } from "react-router-dom";
import Banner from "./Banner";
import Footer from "./Footer";
import { ReactComponent as ColoradoBhaLogo } from "../images/logos/colorado_bha.svg";

function Layout() {
  return (
    <>
      <Header basic color="primary" role="banner">
        <Banner />
        <div className="display-flex flex-justify-center border-bottom border-base-lighter">
          <div className="padding-top-2 padding-bottom-1 height-auto">
            <a href="/" title="Home" aria-label="Home">
              <ColoradoBhaLogo />
            </a>
          </div>
        </div>
      </Header>

      <Outlet />

      <Footer />
    </>
  );
}

export default Layout;
