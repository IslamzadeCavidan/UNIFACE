import React, { useState, useRef } from "react";
import { supabase } from "./supabaseClient";

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

type View = "landing" | "dashboard";

const App: React.FC = () => {
  const [view, setView] = useState<View>("landing");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [field, setField] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

  const formRef = useRef<HTMLDivElement | null>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setMessageType(null);

    const nameTrimmed = fullName.trim();
    const emailTrimmed = email.trim();
    const fieldTrimmed = field.trim();

    if (!nameTrimmed || !emailTrimmed) {
      setMessage("Please fill in your name and university email.");
      setMessageType("error");
      return;
    }

    if (!emailTrimmed.toLowerCase().endsWith("@ada.edu.az")) {
      setMessage(
        "The platform is currently only for ADA University students. Please use your @ada.edu.az email."
      );
      setMessageType("error");
      return;
    }

    // ✅ If we reach here, the email is ADA → go to dashboard immediately
    setView("dashboard");
    setMessage("You’re in. Welcome to UNIFACE.");
    setMessageType("success");

    // Clear only email/field; keep fullName for greeting
    setEmail("");
    setField("");

    // Insert into Supabase in the background
    try {
      setLoading(true);
      const { error } = await supabase.from("early_signups").insert([
        {
          full_name: nameTrimmed,
          email: emailTrimmed,
          field: fieldTrimmed,
        },
      ]);

      if (error) {
        console.error(error);
        // We already switched view; just update message if needed
        setMessage("You’re in, but there was an issue saving your data.");
        setMessageType("error");
      }
    } catch (err) {
      console.error(err);
      setMessage("Unexpected error while saving. You are still in.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // ============= DASHBOARD VIEW =============
  if (view === "dashboard") {
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

        <header className="app-header">
          <div className="brand">
            <div className="brand-logo">U</div>
            <span className="brand-name">UNIFACE</span>
          </div>
          <div className="header-buttons">
            <span className="user-chip">
              {fullName ? fullName : "ADA student"}
            </span>
          </div>
        </header>

        <main className="app-main">
          <section className="content">
            <div className="hero">
              <h1>Welcome to your academic dashboard.</h1>
              <p>
                This is the early UNIFACE workspace for ADA students. Here
                you’ll see your key fields, questions, and study tools in one
                place.
              </p>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h2>Your focus areas</h2>
                <p className="dashboard-text">
                  {field
                    ? `Primary field of interest: ${field}.`
                    : "You selected your field during sign-up. Future versions will use it to personalize content."}
                </p>
                <ul className="dashboard-list">
                  <li>• Track questions by subject and course</li>
                  <li>• Organize materials for Finance, CS, Math, etc.</li>
                  <li>• See curated resources per discipline</li>
                </ul>
              </div>

              <div className="dashboard-card">
                <h2>Academic discussions</h2>
                <p className="dashboard-text">
                  Latest questions from the academic feed. In later versions,
                  this will be filtered by your courses and interests.
                </p>
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
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="dashboard-card">
                <h2>Next steps for UNIFACE</h2>
                <ul className="dashboard-list">
                  <li>• Personal timetable and deadlines</li>
                  <li>• Saved questions and resources</li>
                  <li>• AI assistant tied to your courses</li>
                </ul>
                <p className="dashboard-text">
                  You’re part of the first ADA cohort. Your feedback will shape
                  how this dashboard evolves.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // ============= LANDING VIEW =============
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

      {/* Top bar */}
      <header className="app-header">
        <div className="brand">
          <div className="brand-logo">U</div>
          <span className="brand-name">UNIFACE</span>
        </div>
        <div className="header-buttons">
          <button className="btn btn-outline" onClick={scrollToForm}>
            Log in
          </button>
          <button className="btn btn-primary" onClick={scrollToForm}>
            Join community
          </button>
        </div>
      </header>

      {/* Main layout */}
      <main className="app-main">
        {/* Left side: hero + feed */}
        <section className="content">
          <div className="hero">
            <h1>Join the community and help people achieve their academic goals.</h1>
            <p>
              UNIFACE is a global academic discussion space where students and
              researchers ask questions, share resources, and build projects
              together.
            </p>
            <button className="btn btn-primary" onClick={scrollToForm}>
              Get early access
            </button>
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
                  <span className="post-note">
                    Sign up to read full thread and reply.
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Right side: signup form */}
        <aside className="sidebar" ref={formRef}>
          <h2>Create your academic profile</h2>
          <p className="sidebar-text">
            Join UNIFACE to ask questions, follow fields, and collaborate on
            research and projects.
          </p>

          <form className="signup-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Full name</span>
              <input
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </label>

            <label className="field">
              <span>University email</span>
              <input
                type="email"
                placeholder="name@ada.edu.az"
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
              {loading ? "Submitting..." : "Join UNIFACE (beta)"}
            </button>
          </form>

          {message && (
            <p
              className={
                "signup-note " +
                (messageType === "error"
                  ? "signup-note-error"
                  : "signup-note-success")
              }
            >
              {message}
            </p>
          )}
        </aside>
      </main>
    </div>
  );
};

export default App;
