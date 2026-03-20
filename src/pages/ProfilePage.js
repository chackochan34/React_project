import { useAuth } from "../context/AuthContext";

export const ProfilePage = () => {
  const { user } = useAuth();
  return (
    <main className="page section">
      <h1>Profile</h1>
      <article className="glass-panel">
        <p>
          <strong>Name:</strong> {user?.name}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Role:</strong> {user?.role}
        </p>
      </article>
    </main>
  );
};
