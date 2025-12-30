import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function AuthCallback() {
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) nav("/dashboard", { replace: true });
      else nav("/auth", { replace: true });
    })();
  }, [nav]);

  return <div style={{ padding: 16 }}>Completing sign-in…</div>;
}
