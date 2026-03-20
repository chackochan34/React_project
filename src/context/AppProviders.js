import { AuthProvider } from "./AuthContext";
import { NotificationProvider } from "./NotificationContext";
import { WatchlistProvider } from "./WatchlistContext";
import { ThemeProvider } from "./ThemeContext";

export const AppProviders = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      <NotificationProvider>
        <WatchlistProvider>{children}</WatchlistProvider>
      </NotificationProvider>
    </AuthProvider>
  </ThemeProvider>
);
