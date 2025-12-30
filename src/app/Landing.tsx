import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

type Post = {
  id: number;
  title: string;
  summary: string;
  field: string;
  votes: number;
  replies: number;
};

const mockPosts: Post[] = [
  {
    id: 1,
    title: "How can we model inflation expectations in emerging markets?",
    summary:
      "Looking for papers or models that connect survey-based expectations with market-implied measures.",
    field: "Economics / Finance",
    votes: 27,
    replies: 9,
  },
  {
    id: 2,
    title: "Best resources to start with measure-theoretic probability?",
    summary:
      "I finished a standard probability course and want to prepare for graduate-level stochastic processes.",
    field: "Mathematics",
    votes: 34,
    replies: 12,
  },
  {
    id: 3,
    title:
      "Datasets for studying the impact of air pollution on cardiovascular health?",
    summary:
      "Preferably open-source datasets that connect air quality indices with hospital admissions.",
    field: "Environmental Science",
    votes: 19,
    replies: 6,
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [field, setField] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] =
    useState<"success" | "error" | null>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  async function handleWaitlistSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setMessageType(null);

    const nameTrimmed = fullName.trim();
    const emailTrimmed = email.trim().toLowerCase();
    const fieldTrimmed = field.trim();

    if (!nameTrimmed) {
      setMessage("Please enter your name.");
      setMessageType("error");
      return;
    }

    // Simple email validation (global)
    if (!emailTrimmed || !emailTrimmed.includes("@")) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      // This is a waitlist capture, NOT authentication.
      const { error } = await supabase.from("early_signups").insert([
        {
          full_name: nameTrimmed,
          email: emailTrimmed,
          field: fieldTrimmed,
        },
      ]);

      if (error) throw error;

      setMessage("Saved. Now create your account to continue.");
      setMessageType("success");

      setFullName("");
      setEmail("");
      setField("");
    } catch (err) {
      console.error(err);
      setMessage("Could not save your request. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      {message && (
        <div
          className={`flash-message ${
            messageType === "success" ? "flash-success" : "flash-error"
          }`}
        >
          {message}
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="brand">
          <div className="brand-logo">U</div>
          <span className="brand-name">UNIFACE</span>
        </div>

        <div className="header-buttons">
          <button className="btn btn-outline" onClick={() => navigate("/auth")}>
            Log in
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/auth")}>
            Sign up
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="app-main">
        {/* Left content */}
        <section className="content">
          <div className="hero">
            <h1>Join the community and help people achieve their academic goals.</h1>
            <p>
              UNIFACE is a global academic discussion space where students and
              researchers ask questions, share resources, and build projects together.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn btn-primary" onClick={() => navigate("/auth")}>
                Create account
              </button>
              <button className="btn btn-outline" onClick={scrollToForm}>
                Get early access (waitlist)
              </button>
            </div>
          </div>

          <h2 className="section-title">Latest academic discussions</h2>

          <div className="post-list">
            {mockPosts.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-header">
                  <h3>{post.title}</h3>
                  <span className="post-field">{post.field}</span>
                </div>
                <p className="post-summary">{post.summary}</p>
                <div className="post-meta">
                  <span>▲ {post.votes} votes</span>
                  <span>💬 {post.replies} replies</span>
                  <span className="post-note">Create an account to view and reply.</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Right sidebar */}
        <aside className="sidebar" ref={formRef}>
          <h2>Get early access</h2>
          <p className="sidebar-text">
            Leave your details and we’ll prioritize your access. If you want to use
            the platform now, create an account.
          </p>

          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <button className="btn btn-primary" onClick={() => navigate("/auth")}>
              Create account
            </button>
            <button className="btn btn-outline" onClick={() => navigate("/auth")}>
              Log in
            </button>
          </div>

          <form className="signup-form" onSubmit={handleWaitlistSubmit}>
            <label className="field">
              <span>Full name</span>
              <input
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </label>

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="field">
              <span>Field of interest</span>
              <input
                placeholder="Finance, AI, Environmental science…"
                value={field}
                onChange={(e) => setField(e.target.value)}
              />
            </label>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Join early access (waitlist)"}
            </button>
          </form>

          <p className="signup-note" style={{ marginTop: 12, opacity: 0.8 }}>
            Note: waitlist submission is not an account. Use “Create account” to register.
          </p>
        </aside>
      </main>
    </div>
  );
}
