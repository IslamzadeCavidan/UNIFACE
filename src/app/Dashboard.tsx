import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) setEmail(data.user?.email ?? null);
    })();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>Dashboard</h1>
      <p>Authenticated ✅</p>
      {email && <p>Signed in as: {email}</p>}
      <button onClick={() => supabase.auth.signOut()}>Logout</button>
    </div>
  );
}
