import React, { useState } from "react";
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

const App: React.FC = () => {
  const [showSignupNote, setShowSignupNote] = useState(false);

  // form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [field, setField] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!fullName || !email) {
      setMessage("Please fill in at least your name and university email.");
      return;
    }

    // simple ADA restriction for beta
    if (!email.toLowerCase().endsWith("@ada.edu.az")) {
      setMessage("For the beta, please use your ADA university email.");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from("early_signups").insert([
        {
          full_name: fullName,
          email,
          field,
        },
      ]);

      if (error) {
        console.error(error);
        setMessage("Something went wrong. Please try again.");
      } else {
        setMessage("Thank you! You’re on the early access list.");
        setFullName("");
        setEmail("");
        setField("");
      }
    } catch (err) {
      console.error(err);
      setMessage("Unexpected error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Top bar */}
      <header className="app-header">
        <div className="brand">
          <div className="brand-logo">U</div>
          <span className="brand-name">UNIFACE</span>
        </div>
        <div className="header-buttons">
          <button
            className="btn btn-outline"
            onClick={() => setShowSignupNote(true)}
          >
            Log in
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowSignupNote(true)}
          >
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
            <button
              className="btn btn-primary"
              onClick={() => setShowSignupNote(true)}
            >
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
        <aside className="sidebar">
          <h2>Create your academic profile</h2>
          <p className="sidebar-text">
            Join UNIFACE to ask questions, follow fields, and collaborate on
            research and projects.
          </p>

          <form className="signup-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Full name</span>
              <input
                placeholder="Javidan Islamzade"
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

          {message && <p className="signup-note">{message}</p>}

          {showSignupNote && !message && (
            <p className="signup-note">
              You clicked join from the top bar. Complete the form to request
              access.
            </p>
          )}
        </aside>
      </main>
    </div>
  );
};

export default App;
