import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Auth() {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const eClean = email.trim().toLowerCase();

    if (!eClean || !eClean.includes("@")) {
      setMsg("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setMsg("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: eClean,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;

        setMsg("Account created. Check your email and verify, then log in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: eClean,
          password,
        });
        if (error) throw error;
        // success -> ProtectedRoute will allow dashboard
      }
    } catch (err: any) {
      setMsg(err?.message ?? "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    setMsg(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      // success => browser redirects; no further code runs here
    } catch (err: any) {
      setMsg(err?.message ?? "Google sign-in failed.");
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1>UNIFACE</h1>

      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={loading}
        style={{ width: "100%", padding: 10, marginTop: 12 }}
      >
        {loading ? "Please wait..." : "Continue with Google"}
      </button>

      <div style={{ margin: "14px 0", textAlign: "center", opacity: 0.7 }}>
        — or —
      </div>

      <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="email"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 8 chars)"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
        <button disabled={loading} type="submit" style={{ padding: 10 }}>
          {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Login"}
        </button>
      </form>

      <button
        style={{ marginTop: 12, width: "100%", padding: 10 }}
        onClick={() => setMode(mode === "signup" ? "login" : "signup")}
        disabled={loading}
        type="button"
      >
        Switch to {mode === "signup" ? "Login" : "Sign up"}
      </button>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
