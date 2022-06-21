import { Header, Title, PrimaryNav } from "@trussworks/react-uswds";
import { Link, Outlet } from "react-router-dom";
import Banner from "./Banner";
import { ReactComponent as ColoradoBhaLogo } from "../images/colorado_bha_logo.svg";

function Layout() {
  return (
    <>
      <Header basic color="primary" role="banner">
        <Banner />
        <div className="usa-nav-container">
          <div className="usa-navbar">
            <div className="usa-logo">
              <Title>
                <a href="/" title="Home" aria-label="Home">
                  <ColoradoBhaLogo />
                </a>
              </Title>
            </div>
          </div>
          <PrimaryNav items={[<Link to="/search">Search</Link>]} />
        </div>
      </Header>
      <div className="usa-section">
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
