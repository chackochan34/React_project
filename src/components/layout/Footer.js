import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { FiHeadphones, FiHelpCircle, FiMessageCircle, FiPhoneCall } from "react-icons/fi";

const aboutLinks = [
  { label: "About PlateAuction", to: "/about" },
  { label: "Our Services", to: "/about" },
  { label: "Trusted Bidding", to: "/about" },
  { label: "Success Stories", to: "/about" },
  { label: "Careers", to: "/contact" },
];

const auctionLinks = [
  { label: "Live Auctions", to: "/live-auctions" },
  { label: "VIP Plates", to: "/live-auctions" },
  { label: "Fancy Plates", to: "/live-auctions" },
  { label: "Trending Plates", to: "/live-auctions" },
  { label: "My Bids", to: "/my-bids" },
];

const helpLinks = [
  { label: "Help Center", to: "/contact" },
  { label: "FAQs", to: "/contact" },
  { label: "Support", to: "/contact" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
];

const quickLinks = [
  { label: "Register", to: "/register" },
  { label: "Login", to: "/login" },
  { label: "Profile", to: "/profile" },
  { label: "Payments", to: "/payments" },
  { label: "Watchlist", to: "/watchlist" },
];

const LinkColumn = ({ title, links }) => (
  <div className="mega-col">
    <h4>{title}</h4>
    {links.map((item) => (
      <Link key={item.label} to={item.to}>
        {item.label}
      </Link>
    ))}
  </div>
);

export const Footer = () => (
  <footer className="mega-footer">
    <div className="mega-top">
      <LinkColumn title="About PlateAuction" links={aboutLinks} />
      <LinkColumn title="Auctions" links={auctionLinks} />
      <LinkColumn title="Help Center" links={helpLinks} />
      <LinkColumn title="Quick Links" links={quickLinks} />

      <aside className="mega-help">
        <h4>Need help? We&apos;re here for you 24/7</h4>
        <p>Reach out to us for bidding, account, payment, or verification support anytime.</p>
        <div className="mega-help-item">
          <FiHeadphones />
          <span>Create Support Ticket</span>
        </div>
        <div className="mega-help-item">
          <FiPhoneCall />
          <span>+91 600 54 54 54</span>
        </div>
        <div className="mega-help-item">
          <FiHelpCircle />
          <span>Help Center</span>
        </div>
        <div className="mega-help-item">
          <FiMessageCircle />
          <span>Chat Now</span>
        </div>
      </aside>
    </div>

    <div className="mega-bottom">
      <div>
        <h4>Get in Touch</h4>
        <p>Discover exclusive auctions and follow PlateAuction updates across social channels.</p>
        <div className="mega-social">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X">
            <FaXTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
            <FaYoutube />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <FaLinkedinIn />
          </a>
        </div>
      </div>

      <div className="mega-app">
        <h4>PlateAuction</h4>
        <p>India&apos;s premium fancy number plate auction platform.</p>
        <small>Secure bidding. Real-time updates. Transparent outcomes.</small>
      </div>
    </div>
  </footer>
);
