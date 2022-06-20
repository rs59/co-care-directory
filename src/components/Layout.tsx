import { Header, Title, PrimaryNav } from '@trussworks/react-uswds';
import { Link, Outlet } from 'react-router-dom';
import Banner from './Banner';

function Layout() {
  return (
    <>
      <Header basic color="primary" role="banner">
        <Banner />
        <div className="usa-nav-container">
          <div className="usa-navbar">
            <Title>
              <a href="/" title="Home" aria-label="Home">
                Colorado Care Directory Prototype
              </a>
            </Title>
          </div>
          <PrimaryNav items={[<Link to="/search">Search</Link>]}/>
        </div>
      </Header>

      <Outlet />
    </>
  );
}

export default Layout;