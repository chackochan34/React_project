import { Navigate, Route, Routes } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { AdminRoute } from "./components/routing/AdminRoute";
import { ToastContainer } from "./components/common/Toast";
import { WelcomePage } from "./pages/WelcomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { LiveAuctionsPage } from "./pages/LiveAuctionsPage";
import { AuctionDetailsPage } from "./pages/AuctionDetailsPage";
import { MyBidsPage } from "./pages/MyBidsPage";
import { WatchlistPage } from "./pages/WatchlistPage";
import { PaymentPage } from "./pages/PaymentPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { ProfilePage } from "./pages/ProfilePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { useAuth } from "./context/AuthContext";

const AnimatedPage = ({ children }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
    {children}
  </motion.div>
);

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/welcome"} replace />} />
          <Route path="/welcome" element={<AnimatedPage><WelcomePage /></AnimatedPage>} />
          <Route path="/login" element={<AnimatedPage><LoginPage /></AnimatedPage>} />
          <Route path="/register" element={<AnimatedPage><RegisterPage /></AnimatedPage>} />
          <Route path="/about" element={<AnimatedPage><AboutPage /></AnimatedPage>} />
          <Route path="/contact" element={<AnimatedPage><ContactPage /></AnimatedPage>} />
          <Route path="/privacy" element={<AnimatedPage><PrivacyPage /></AnimatedPage>} />
          <Route path="/terms" element={<AnimatedPage><TermsPage /></AnimatedPage>} />

          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<AnimatedPage><HomePage /></AnimatedPage>} />
            <Route path="/live-auctions" element={<AnimatedPage><LiveAuctionsPage /></AnimatedPage>} />
            <Route path="/auctions/:id" element={<AnimatedPage><AuctionDetailsPage /></AnimatedPage>} />
            <Route path="/my-bids" element={<AnimatedPage><MyBidsPage /></AnimatedPage>} />
            <Route path="/watchlist" element={<AnimatedPage><WatchlistPage /></AnimatedPage>} />
            <Route path="/payments" element={<AnimatedPage><PaymentPage /></AnimatedPage>} />
            <Route path="/profile" element={<AnimatedPage><ProfilePage /></AnimatedPage>} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AnimatedPage><AdminDashboardPage /></AnimatedPage>} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <ToastContainer />
    </>
  );
}

export default App;
