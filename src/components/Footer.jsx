// components/Footer.jsx
const Footer = () => {
  return (
    <footer className="dashboard-footer">
      <svg className="footer-wave" viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,64 C360,150 1080,-22 1440,64 L1440,140 L0,140 Z" fill="var(--light-bg)"></path>
      </svg>
      <div className="footer-inner">
        <div className="footer-left">
          <span className="footer-brand">UniERP</span>
          <small>© {new Date().getFullYear()} UniERP — All rights reserved.</small>
        </div>

        <nav className="footer-center" aria-label="footer links">
          <a href="#">Home</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </nav>

        <div className="footer-right">
          <div className="socials">
            <a href="#" aria-label="Twitter" className="social">‹</a>
            <a href="#" aria-label="Facebook" className="social">f</a>
            <a href="#" aria-label="LinkedIn" className="social">in</a>
          </div>
          <small className="built">Built with ♥ for education</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;