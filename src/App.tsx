import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

import Landing from "./app/Landing";
import Auth from "./app/Auth";
import AuthCallback from "./app/AuthCallback";
import Dashboard from "./app/Dashboard";

function Protected({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;

  // Not logged in -> go to auth
  if (!session) return <Navigate to="/auth" replace />;

  // Logged in but NOT verified -> go to auth (you can make a nicer page later)
  const confirmed = !!session.user.email_confirmed_at;
  if (!confirmed) return <Navigate to="/auth" replace />;

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing (waitlist/marketing only) */}
        <Route path="/" element={<Landing />} />

        {/* Real authentication */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected dashboard */}
        <Route
          path="/dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
