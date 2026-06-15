/**
 * ResumePro AI — Enhanced App.jsx
 * 
 * NEW FEATURES ADDED:
 * 1. SplashScreen — premium animated intro (2.5s) with particles + glow
 * 2. ProfilePage  — fully editable profile with avatar upload + settings
 * 3. HelpCenter   — FAQ, contact support, report issue, feedback, search
 * 4. LogoutModal  — confirmation modal with smooth animation
 * 5. Dark Mode    — comprehensive fixes for all contrast/visibility issues
 * 6. UI Polish    — animations, glassmorphism, gradient system, micro-interactions
 *
 * All existing business logic, APIs, and resume builder features are PRESERVED.
 */

import React, { useState, useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";
import { DndContext } from "@dnd-kit/core";

import { generateAISummary } from "./service/aiservice";
import { calculateResumeScore } from "./service/scoreResume";
import ChatBot from "./components/ChatBot/ChatBot";

import {
  Layout, User, FileText, Sparkles, PlusCircle, Download,
  Moon, Bell, HelpCircle, LogOut, Trash2, MapPin, Mail, Phone,
  GraduationCap, Award, Briefcase, MessageCircle, Send, Sun,
  ChevronDown, ChevronUp, Search, X, Check, AlertCircle,
  Shield, Camera, Edit3, Settings, Star, ArrowLeft, ExternalLink,
} from "lucide-react";

// ─────────────────────────────────────────────
// 1. SPLASH SCREEN COMPONENT
// ─────────────────────────────────────────────
function SplashScreen({ onComplete }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState("in"); // "in" | "hold" | "out"

  /* Particle canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147,197,253,${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > W) p.dx *= -1;
        if (p.y < 0 || p.y > H) p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* Timing sequence */
  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase("out"), 2200);
    const doneTimer = setTimeout(() => onComplete(), 2900);
    return () => { clearTimeout(holdTimer); clearTimeout(doneTimer); };
  }, [onComplete]);

  const isOut = phase === "out";

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "linear-gradient(135deg, #0a0f1e 0%, #0d1635 40%, #0a1628 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column",
        opacity: isOut ? 0 : 1,
        transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1)",
        pointerEvents: isOut ? "none" : "all",
      }}
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, opacity: 0.6 }} />

      {/* Ambient glow orbs */}
      <div style={{
        position: "absolute", width: 400, height: 400,
        borderRadius: "50%", top: "10%", left: "20%",
        background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
        filter: "blur(40px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 300, height: 300,
        borderRadius: "50%", bottom: "15%", right: "15%",
        background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
        filter: "blur(40px)", pointerEvents: "none",
      }} />

      {/* Center content */}
      <div style={{
        position: "relative", textAlign: "center", zIndex: 1,
        animation: "splashFadeUp 0.8s cubic-bezier(0.34,1.56,0.64,1) both",
      }}>
        {/* Logo mark */}
        <div style={{
          width: 80, height: 80, borderRadius: 22, margin: "0 auto 24px",
          background: "linear-gradient(135deg, #3b82f6, #6366f1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 40px rgba(99,102,241,0.5), 0 0 80px rgba(59,130,246,0.2)",
          animation: "logoPulse 2s ease-in-out infinite",
        }}>
          <FileText size={38} color="white" />
        </div>

        {/* Brand name */}
        <h1 style={{
          margin: 0, fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 900, letterSpacing: "-2px", lineHeight: 1,
          background: "linear-gradient(135deg, #ffffff 0%, #93c5fd 50%, #c4b5fd 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          ResumePro AI
        </h1>

        {/* Tagline */}
        <p style={{
          margin: "12px 0 0", fontSize: "0.9rem", letterSpacing: "3px",
          textTransform: "uppercase", color: "rgba(148,163,184,0.8)",
          fontWeight: 500,
          animation: "splashFadeUp 0.8s 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        }}>
          Craft Your Future
        </p>

        {/* Founder badge */}
        <div style={{
          marginTop: 32, display: "inline-flex", alignItems: "center", gap: 10,
          background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 50,
          padding: "8px 20px",
          animation: "splashFadeUp 0.8s 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "linear-gradient(135deg, #f59e0b, #ef4444)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Star size={13} color="white" fill="white" />
          </div>
          <span style={{ color: "rgba(226,232,240,0.9)", fontSize: "0.8rem", fontWeight: 600 }}>
            Founded by <span style={{ color: "#93c5fd" }}>LOVELY SINGH</span>
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          marginTop: 48, width: 200, height: 2, borderRadius: 99,
          background: "rgba(255,255,255,0.1)", overflow: "hidden", margin: "48px auto 0",
          animation: "splashFadeUp 0.8s 0.6s both",
        }}>
          <div style={{
            height: "100%", borderRadius: 99,
            background: "linear-gradient(90deg, #3b82f6, #6366f1)",
            animation: "progressFill 2s 0.3s cubic-bezier(0.4,0,0.2,1) both",
          }} />
        </div>
      </div>

      {/* Keyframes injected once */}
      <style>{`
        @keyframes splashFadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes logoPulse {
          0%,100% { box-shadow:0 0 40px rgba(99,102,241,0.5),0 0 80px rgba(59,130,246,0.2); }
          50%     { box-shadow:0 0 60px rgba(99,102,241,0.7),0 0 120px rgba(59,130,246,0.3); }
        }
        @keyframes progressFill {
          from { width:0; }
          to   { width:100%; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// 2. PROFILE PAGE COMPONENT
// ─────────────────────────────────────────────
function ProfilePage({ darkMode, onBack }) {
  const [profile, setProfile] = useState({
    name: "Lovely Singh", email: "lovely@resumepro.ai",
    role: "Product Designer", location: "San Francisco, CA", bio: "Building the future of resumes.",
  });
  const [editing, setEditing] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);

  /* dm = dark-mode-aware style helper */
  const dm = (light, dark) => darkMode ? dark : light;

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  /* Field row */
  const Field = ({ label, field, type = "text" }) => (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.8px",
        color: dm("#64748b", "#94a3b8"), marginBottom: 6 }}>{label}</label>
      {editing ? (
        <input type={type} value={profile[field]}
          onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "10px 14px", borderRadius: 10, fontSize: "0.9rem",
            border: `1px solid ${dm("#e2e8f0", "#334155")}`,
            background: dm("#f8fafc", "#1e293b"), color: dm("#0f172a", "#f1f5f9"),
            outline: "none", transition: "border-color 0.2s",
          }}
        />
      ) : (
        <p style={{ margin: 0, padding: "10px 0", fontSize: "0.95rem",
          color: dm("#1e293b", "#e2e8f0"), borderBottom: `1px solid ${dm("#f1f5f9","#1e293b")}` }}>
          {profile[field] || "—"}
        </p>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", padding: "40px 24px",
      background: dm("linear-gradient(160deg,#f0f4ff,#f8faff)", "linear-gradient(160deg,#0f172a,#1a2235)") }}>
      {/* Back button */}
      <button onClick={onBack} style={{
        display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32,
        background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem",
        fontWeight: 600, color: "#3b82f6",
      }}>
        <ArrowLeft size={16} /> Back to Builder
      </button>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Header card */}
        <div style={{
          borderRadius: 24, padding: "40px 40px 32px",
          background: dm("white", "#1e293b"),
          boxShadow: dm("0 8px 32px rgba(15,23,42,0.1)", "0 8px 32px rgba(0,0,0,0.4)"),
          marginBottom: 24, position: "relative", overflow: "hidden",
        }}>
          {/* Gradient accent top */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 4,
            background: "linear-gradient(90deg,#3b82f6,#6366f1,#8b5cf6)",
          }} />

          <div style={{ display: "flex", alignItems: "flex-start", gap: 28, flexWrap: "wrap" }}>
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 100, height: 100, borderRadius: 24, overflow: "hidden",
                border: "3px solid #bfdbfe",
                boxShadow: "0 0 0 4px #eff6ff, 0 8px 24px rgba(59,130,246,0.2)",
              }}>
                <img src={avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200"}
                  alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <button onClick={() => fileRef.current?.click()} style={{
                position: "absolute", bottom: -6, right: -6, width: 30, height: 30,
                borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", boxShadow: "0 2px 8px rgba(59,130,246,0.4)",
              }}>
                <Camera size={13} color="white" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: "none" }} />
            </div>

            {/* Name / role */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <h2 style={{ margin: "0 0 4px", fontSize: "1.75rem", fontWeight: 800,
                color: dm("#0f172a", "#f1f5f9"), letterSpacing: "-0.5px" }}>
                {profile.name}
              </h2>
              <p style={{ margin: "0 0 12px", fontSize: "0.95rem", color: "#3b82f6", fontWeight: 600 }}>
                {profile.role}
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.8rem",
                  color: dm("#64748b", "#94a3b8") }}>
                  <Mail size={13} /> {profile.email}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.8rem",
                  color: dm("#64748b", "#94a3b8") }}>
                  <MapPin size={13} /> {profile.location}
                </span>
              </div>
            </div>

            {/* Edit button */}
            <button onClick={() => editing ? handleSave() : setEditing(true)} style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px",
              borderRadius: 12, fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
              background: editing ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#3b82f6,#6366f1)",
              color: "white", border: "none",
              boxShadow: editing ? "0 4px 14px rgba(16,185,129,0.35)" : "0 4px 14px rgba(59,130,246,0.35)",
              transition: "all 0.2s",
            }}>
              {editing ? <><Check size={15} /> Save</> : <><Edit3 size={15} /> Edit Profile</>}
            </button>
          </div>

          {/* Save confirmation */}
          {saved && (
            <div style={{
              marginTop: 16, padding: "10px 16px", borderRadius: 10,
              background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
              color: "#059669", fontSize: "0.85rem", fontWeight: 600,
              display: "flex", alignItems: "center", gap: 8,
              animation: "splashFadeUp 0.3s both",
            }}>
              <Check size={15} /> Profile saved successfully!
            </div>
          )}
        </div>

        {/* Details card */}
        <div style={{
          borderRadius: 24, padding: "32px 40px",
          background: dm("white", "#1e293b"),
          boxShadow: dm("0 4px 16px rgba(15,23,42,0.06)", "0 4px 16px rgba(0,0,0,0.3)"),
          marginBottom: 24,
        }}>
          <h3 style={{ margin: "0 0 24px", fontSize: "1rem", fontWeight: 700,
            color: dm("#0f172a", "#f1f5f9"), display: "flex", alignItems: "center", gap: 8 }}>
            <User size={18} color="#3b82f6" /> Personal Information
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
            <Field label="Full Name" field="name" />
            <Field label="Email" field="email" type="email" />
            <Field label="Role / Title" field="role" />
            <Field label="Location" field="location" />
          </div>
          <Field label="Bio" field="bio" />
        </div>

        {/* Account settings card */}
        <div style={{
          borderRadius: 24, padding: "32px 40px",
          background: dm("white", "#1e293b"),
          boxShadow: dm("0 4px 16px rgba(15,23,42,0.06)", "0 4px 16px rgba(0,0,0,0.3)"),
        }}>
          <h3 style={{ margin: "0 0 24px", fontSize: "1rem", fontWeight: 700,
            color: dm("#0f172a", "#f1f5f9"), display: "flex", alignItems: "center", gap: 8 }}>
            <Settings size={18} color="#3b82f6" /> Account Settings
          </h3>
          {[
            { icon: Shield, label: "Two-Factor Authentication", desc: "Add extra security to your account", badge: "Off" },
            { icon: Bell, label: "Email Notifications", desc: "Get notified about resume views", badge: "On" },
            { icon: Download, label: "Export Data", desc: "Download all your resume data", badge: null },
          ].map(({ icon: Icon, label, desc, badge }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 0", borderBottom: `1px solid ${dm("#f1f5f9", "#1e293b")}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, background: dm("#eff6ff", "#0f172a"),
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={17} color="#3b82f6" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700,
                    color: dm("#0f172a", "#f1f5f9") }}>{label}</p>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: dm("#64748b", "#94a3b8") }}>{desc}</p>
                </div>
              </div>
              {badge && (
                <span style={{
                  padding: "4px 12px", borderRadius: 99, fontSize: "0.72rem", fontWeight: 700,
                  background: badge === "On" ? "rgba(16,185,129,0.1)" : "rgba(100,116,139,0.1)",
                  color: badge === "On" ? "#059669" : "#64748b",
                  border: `1px solid ${badge === "On" ? "rgba(16,185,129,0.2)" : "rgba(100,116,139,0.2)"}`,
                }}>{badge}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 3. HELP CENTER COMPONENT
// ─────────────────────────────────────────────
const FAQ_DATA = [
  { q: "How do I download my resume as PDF?", a: "Click the 'Download PDF' button in the top header. Your resume will be exported with all current styling and content." },
  { q: "Can I switch between templates?", a: "Yes! In the left panel under 'Choose Template', you can switch between Modern and Classic styles instantly." },
  { q: "What does the ATS score mean?", a: "The ATS (Applicant Tracking System) score rates how well your resume will perform with automated screening software. A score above 70 is considered good." },
  { q: "How does the AI Summary Generator work?", a: "Click 'AI Generate' in the Professional Summary section. It analyzes your experience, education, and title to create a tailored summary." },
  { q: "Can I upload my own profile photo?", a: "Yes, use the file upload in the Personal Details section to upload any image as your profile photo." },
  { q: "Is the Cover Letter Generator free to use?", a: "Yes, the Cover Letter Generator is included with your ResumePro AI account. Simply fill in the job details and click generate." },
];

function HelpCenter({ darkMode, onBack }) {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [rating, setRating] = useState(0);

  const dm = (light, dark) => darkMode ? dark : light;
  const filtered = FAQ_DATA.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  const handleContactSubmit = () => {
    if (contactForm.name && contactForm.email && contactForm.message) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setContactForm({ name: "", email: "", message: "" });
    }
  };

  const cardStyle = {
    borderRadius: 20, padding: "28px 32px",
    background: dm("white", "#1e293b"),
    boxShadow: dm("0 4px 16px rgba(15,23,42,0.06)", "0 4px 16px rgba(0,0,0,0.3)"),
    marginBottom: 20,
  };

  return (
    <div style={{ minHeight: "100vh", padding: "40px 24px",
      background: dm("linear-gradient(160deg,#f0f4ff,#f8faff)", "linear-gradient(160deg,#0f172a,#1a2235)") }}>
      <button onClick={onBack} style={{
        display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32,
        background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem",
        fontWeight: 600, color: "#3b82f6",
      }}>
        <ArrowLeft size={16} /> Back to Builder
      </button>

      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, margin: "0 auto 16px",
            background: "linear-gradient(135deg,#3b82f6,#6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 24px rgba(59,130,246,0.3)",
          }}>
            <HelpCircle size={30} color="white" />
          </div>
          <h1 style={{ margin: "0 0 8px", fontSize: "2rem", fontWeight: 800,
            color: dm("#0f172a", "#f1f5f9"), letterSpacing: "-0.5px" }}>Help Center</h1>
          <p style={{ margin: 0, color: dm("#64748b", "#94a3b8") }}>Find answers, get support, share feedback</p>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 32 }}>
          <Search size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
            color: dm("#94a3b8", "#64748b") }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search help articles..."
            style={{
              width: "100%", boxSizing: "border-box", padding: "14px 16px 14px 48px",
              borderRadius: 14, fontSize: "0.95rem", border: `1px solid ${dm("#e2e8f0", "#334155")}`,
              background: dm("white", "#1e293b"), color: dm("#0f172a", "#f1f5f9"),
              outline: "none", boxShadow: dm("0 2px 8px rgba(15,23,42,0.05)", "none"),
            }}
          />
        </div>

        {/* FAQ */}
        <div style={cardStyle}>
          <h2 style={{ margin: "0 0 20px", fontSize: "1.1rem", fontWeight: 800,
            color: dm("#0f172a", "#f1f5f9"), display: "flex", alignItems: "center", gap: 8 }}>
            <MessageCircle size={18} color="#3b82f6" /> Frequently Asked Questions
          </h2>
          {filtered.length === 0 && (
            <p style={{ color: dm("#94a3b8", "#64748b"), fontSize: "0.9rem" }}>No results found for "{search}".</p>
          )}
          {filtered.map((item, i) => (
            <div key={i} style={{
              borderRadius: 12, marginBottom: 8, overflow: "hidden",
              border: `1px solid ${dm("#e2e8f0", "#334155")}`,
            }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                width: "100%", padding: "14px 18px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: openFaq === i ? dm("#eff6ff", "#0f172a") : "transparent",
                border: "none", cursor: "pointer", textAlign: "left",
              }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: dm("#0f172a", "#f1f5f9") }}>{item.q}</span>
                {openFaq === i ? <ChevronUp size={16} color="#3b82f6" /> : <ChevronDown size={16} color={dm("#94a3b8","#64748b")} />}
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 18px 14px", fontSize: "0.875rem", lineHeight: 1.7,
                  color: dm("#475569", "#94a3b8") }}>{item.a}</div>
              )}
            </div>
          ))}
        </div>

        {/* Contact support */}
        <div style={cardStyle}>
          <h2 style={{ margin: "0 0 20px", fontSize: "1.1rem", fontWeight: 800,
            color: dm("#0f172a", "#f1f5f9"), display: "flex", alignItems: "center", gap: 8 }}>
            <Send size={18} color="#3b82f6" /> Contact Support
          </h2>
          {submitted ? (
            <div style={{ padding: "20px", textAlign: "center", color: "#059669", fontWeight: 700 }}>
              <Check size={24} style={{ marginBottom: 8 }} /> Message sent! We'll reply within 24 hours.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[["Name", "name"], ["Email", "email"]].map(([label, field]) => (
                <div key={field}>
                  <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700,
                    textTransform: "uppercase", color: dm("#64748b", "#94a3b8"), marginBottom: 6 }}>{label}</label>
                  <input value={contactForm[field]}
                    onChange={(e) => setContactForm({ ...contactForm, [field]: e.target.value })}
                    style={{
                      width: "100%", boxSizing: "border-box", padding: "10px 14px",
                      borderRadius: 10, fontSize: "0.875rem",
                      border: `1px solid ${dm("#e2e8f0", "#334155")}`,
                      background: dm("#f8fafc", "#0f172a"), color: dm("#0f172a", "#f1f5f9"),
                      outline: "none",
                    }}
                  />
                </div>
              ))}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700,
                  textTransform: "uppercase", color: dm("#64748b", "#94a3b8"), marginBottom: 6 }}>Message</label>
                <textarea value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  rows={4} style={{
                    width: "100%", boxSizing: "border-box", padding: "10px 14px",
                    borderRadius: 10, fontSize: "0.875rem", resize: "none",
                    border: `1px solid ${dm("#e2e8f0", "#334155")}`,
                    background: dm("#f8fafc", "#0f172a"), color: dm("#0f172a", "#f1f5f9"),
                    outline: "none",
                  }}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <button onClick={handleContactSubmit} style={{
                  padding: "11px 28px", borderRadius: 12, border: "none", cursor: "pointer",
                  background: "linear-gradient(135deg,#3b82f6,#6366f1)", color: "white",
                  fontWeight: 700, fontSize: "0.875rem",
                  boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
                }}>Send Message</button>
              </div>
            </div>
          )}
        </div>

        {/* Feedback */}
        <div style={cardStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "1.1rem", fontWeight: 800,
            color: dm("#0f172a", "#f1f5f9"), display: "flex", alignItems: "center", gap: 8 }}>
            <Star size={18} color="#3b82f6" /> Rate Your Experience
          </h2>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setRating(n)} style={{
                width: 40, height: 40, borderRadius: 10, border: "none", cursor: "pointer",
                background: n <= rating ? "linear-gradient(135deg,#f59e0b,#ef4444)" : dm("#f1f5f9", "#334155"),
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
                transform: n <= rating ? "scale(1.1)" : "scale(1)",
              }}>
                <Star size={18} color={n <= rating ? "white" : dm("#94a3b8","#64748b")} fill={n <= rating ? "white" : "none"} />
              </button>
            ))}
          </div>
          <button onClick={() => { if (rating > 0) setFeedbackSent(true); }} style={{
            padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer",
            background: rating > 0 ? "linear-gradient(135deg,#10b981,#059669)" : dm("#e2e8f0","#334155"),
            color: rating > 0 ? "white" : dm("#94a3b8","#475569"),
            fontWeight: 700, fontSize: "0.85rem", transition: "all 0.2s",
          }}>
            {feedbackSent ? "✓ Thank you!" : "Submit Feedback"}
          </button>
        </div>

        {/* Report issue */}
        <div style={{
          ...cardStyle,
          background: dm("rgba(239,68,68,0.04)", "rgba(239,68,68,0.08)"),
          border: `1px solid ${dm("rgba(239,68,68,0.15)","rgba(239,68,68,0.2)")}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <AlertCircle size={22} color="#ef4444" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "0.95rem",
                color: dm("#0f172a", "#f1f5f9") }}>Report an Issue</h3>
              <p style={{ margin: 0, fontSize: "0.8rem", color: dm("#64748b","#94a3b8") }}>
                Found a bug or technical problem? Let us know so we can fix it.
              </p>
            </div>
            <button style={{
              padding: "9px 20px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.3)",
              background: "rgba(239,68,68,0.08)", color: "#ef4444",
              fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", flexShrink: 0,
            }}>
              Report Bug
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 4. LOGOUT MODAL COMPONENT
// ─────────────────────────────────────────────
function LogoutModal({ darkMode, onConfirm, onCancel }) {
  const dm = (light, dark) => darkMode ? dark : light;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9000,
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
      animation: "modalOverlayIn 0.2s both",
    }}>
      <div style={{
        width: "100%", maxWidth: 400, borderRadius: 24,
        background: dm("white", "#1e293b"),
        padding: "40px 36px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
        animation: "modalCardIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        textAlign: "center",
      }}>
        {/* Icon */}
        <div style={{
          width: 64, height: 64, borderRadius: 18, margin: "0 auto 20px",
          background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <LogOut size={28} color="#ef4444" />
        </div>

        <h2 style={{ margin: "0 0 10px", fontSize: "1.5rem", fontWeight: 800,
          color: dm("#0f172a", "#f1f5f9") }}>Sign Out?</h2>
        <p style={{ margin: "0 0 32px", fontSize: "0.9rem", color: dm("#64748b", "#94a3b8"),
          lineHeight: 1.6 }}>
          You'll be returned to the login screen. Any unsaved changes will be lost.
        </p>

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: "12px", borderRadius: 12, cursor: "pointer",
            border: `1px solid ${dm("#e2e8f0","#334155")}`,
            background: dm("white", "#0f172a"), color: dm("#374151","#e2e8f0"),
            fontWeight: 700, fontSize: "0.9rem", transition: "all 0.2s",
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: "12px", borderRadius: 12, cursor: "pointer",
            background: "linear-gradient(135deg,#ef4444,#dc2626)",
            border: "none", color: "white",
            fontWeight: 700, fontSize: "0.9rem",
            boxShadow: "0 4px 14px rgba(239,68,68,0.35)", transition: "all 0.2s",
          }}>Sign Out</button>
        </div>
      </div>
      <style>{`
        @keyframes modalOverlayIn { from { opacity:0; } to { opacity:1; } }
        @keyframes modalCardIn { from { opacity:0; transform:scale(0.9) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// 5. COVER LETTER GENERATOR (PRESERVED + DARK FIXES)
// ─────────────────────────────────────────────
function CoverLetterGenerator({ personalDetails, summary, experience, education, certifications, onBack, darkMode }) {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!jobTitle || !companyName) return;
    setLoading(true);
    setCoverLetter("");
    try {
      const resumeContext = `
Name: ${personalDetails.firstName} ${personalDetails.lastName}
Title: ${personalDetails.title}
Email: ${personalDetails.email}
Location: ${personalDetails.location}
Summary: ${summary}
Experience: ${experience.map((e) => `${e.role} at ${e.company} (${e.period})`).join("; ")}
Education: ${education.map((e) => `${e.degree} from ${e.school}`).join("; ")}
Certifications: ${certifications.map((c) => c.name).join(", ")}
      `.trim();

      const prompt = `You are a professional cover letter writer. Write a compelling, personalized cover letter for the following:

Applicant Resume:
${resumeContext}

Job Title: ${jobTitle}
Company: ${companyName}
${jobDescription ? `Job Description:\n${jobDescription}` : ""}

Write a professional cover letter in 3-4 paragraphs. Make it specific, engaging, and tailored to the role. Use a formal but warm tone. Do NOT use placeholder text like [Your Name] — use the actual details provided. Start directly with "Dear Hiring Manager," and end with "Sincerely, ${personalDetails.firstName} ${personalDetails.lastName}".`;

      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(prompt);
      const geminiResponse = await result.response;
      setCoverLetter(geminiResponse.text());
    } catch (err) {
      setCoverLetter("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([coverLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${companyName || "download"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* Dark-mode-aware classes (Tailwind-compatible) */
  const bg = darkMode ? "bg-gray-900 text-white" : "bg-slate-50 text-slate-900";
  const card = darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-slate-200 text-slate-800";
  const input = darkMode ? "bg-gray-700 border-gray-500 text-white placeholder-gray-300" : "border-slate-200 text-slate-800";
  const labelColor = darkMode ? "text-slate-300" : "text-slate-500";

  return (
    <div className={`flex min-h-screen p-8 gap-8 ${bg}`}>
      <div className="w-full max-w-md flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Sparkles size={20} />
            </div>
            <h2 className="text-2xl font-bold text-blue-600">Cover Letter Generator</h2>
          </div>
          <p className={`text-sm mt-1 ${darkMode ? "text-slate-300" : "text-slate-500"}`}>
            Fill in the job details and AI will write a tailored cover letter using your resume.
          </p>
        </div>

        {/* Resume snapshot */}
        <div className={`rounded-xl border p-4 text-sm ${darkMode ? "bg-gray-700 border-gray-500 text-slate-200" : "bg-blue-50 border-blue-100 text-slate-600"}`}>
          <p className="text-xs font-semibold uppercase text-blue-400 mb-2">Using your resume data</p>
          <p className={darkMode ? "text-white font-semibold" : ""}>
            <span className="font-semibold">{personalDetails.firstName} {personalDetails.lastName}</span> — {personalDetails.title}
          </p>
          <p className={`text-xs mt-1 ${darkMode ? "text-slate-300" : "text-slate-400"}`}>
            {experience.length} experience · {education.length} education · {certifications.length} certifications
          </p>
        </div>

        {[
          { label: "Job Title", value: jobTitle, setter: setJobTitle, placeholder: "e.g. Senior Product Designer", required: true },
          { label: "Company Name", value: companyName, setter: setCompanyName, placeholder: "e.g. Google", required: true },
        ].map(({ label, value, setter, placeholder, required }) => (
          <div key={label} className="flex flex-col gap-1">
            <label className={`text-xs font-semibold uppercase ${labelColor}`}>
              {label} {required && <span className="text-red-400">*</span>}
            </label>
            <input type="text" value={value} onChange={(e) => setter(e.target.value)} placeholder={placeholder}
              className={`rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${input}`} />
          </div>
        ))}

        <div className="flex flex-col gap-1">
          <label className={`text-xs font-semibold uppercase ${labelColor}`}>
            Job Description <span className={darkMode ? "text-slate-400" : "text-slate-400"}>(optional)</span>
          </label>
          <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here for a more tailored letter..."
            className={`rounded-lg border px-4 py-2.5 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none ${input}`} />
        </div>

        <div className="flex gap-3">
          <button onClick={handleGenerate} disabled={loading || !jobTitle || !companyName}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <Sparkles size={16} />
            {loading ? "Generating..." : "Generate Cover Letter"}
          </button>
          <button onClick={onBack}
            className={`rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors ${darkMode ? "border-gray-500 text-slate-200 hover:bg-gray-700" : "border-slate-200 text-slate-600 hover:bg-slate-100"}`}>
            ← Back
          </button>
        </div>
      </div>

      {/* RIGHT — Output */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-semibold uppercase tracking-wide ${darkMode ? "text-slate-200" : "text-slate-600"}`}>Generated Cover Letter</h3>
          {coverLetter && (
            <div className="flex gap-2">
              <button onClick={handleCopy}
                className={`rounded-lg border px-4 py-1.5 text-xs font-medium transition-colors ${darkMode ? "border-gray-500 text-slate-200 hover:bg-gray-700" : "border-slate-200 text-slate-600 hover:bg-slate-100"}`}>
                {copied ? "✓ Copied!" : "Copy"}
              </button>
              <button onClick={handleDownload}
                className="flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors">
                <Download size={13} /> Download
              </button>
            </div>
          )}
        </div>

        <div className={`flex-1 rounded-2xl border p-6 shadow-sm min-h-[500px] ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-slate-200"}`}>
          {loading && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
              <Sparkles size={32} className="animate-pulse text-blue-400" />
              <p className="text-sm">Writing your cover letter...</p>
            </div>
          )}
          {!loading && !coverLetter && (
            <div className={`flex flex-col items-center justify-center h-full gap-2 ${darkMode ? "text-slate-400" : "text-slate-300"}`}>
              <FileText size={40} />
              <p className="text-sm">Your cover letter will appear here</p>
            </div>
          )}
          {!loading && coverLetter && (
            <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)}
              className={`w-full h-full text-sm leading-relaxed resize-none focus:outline-none ${darkMode ? "bg-gray-800 text-slate-100" : "text-slate-700"}`} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 6. MAIN APP COMPONENT
// ─────────────────────────────────────────────
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("builder");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [image, setImage] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");

  const [personalDetails, setPersonalDetails] = useState({
    firstName: "Alexander", lastName: "Sterling",
    title: "Senior Product Designer", email: "alex.s@design.com",
    phone: "+1 (555) 012-3456", location: "San Francisco, CA",
  });

  const [summary, setSummary] = useState(
    "Innovative Product Designer with 8+ years of experience in creating user-centric digital experiences."
  );

  const [experience, setExperience] = useState([{
    id: 1, role: "Lead UX Designer", company: "InnovateTech Solutions",
    location: "San Francisco, CA", period: "Jan 2021 — Present",
    bullets: ["Led a cross-functional team of 12 designers.", "Increased user engagement by 40%.", "Created scalable design systems."],
  }]);

  const [education, setEducation] = useState([{
    id: 1, degree: "Bachelor of Design", school: "Stanford University", year: "2018",
  }]);

  const [certifications, setCertifications] = useState([{
    id: 1, name: "Google UX Design Certificate", issuer: "Google",
  }]);

  /* ── Experience CRUD ── */
  const addExperience = () => setExperience([...experience, {
    id: Date.now(), role: "New Role", company: "Company Name",
    location: "Location", period: "2023 - Present", bullets: ["Achievement 1"],
  }]);
  const deleteExperience = (id) => setExperience(experience.filter(i => i.id !== id));
  const updateExperienceField = (id, field, value) =>
    setExperience(experience.map(e => e.id === id ? { ...e, [field]: value } : e));
  const updateExperienceBullet = (id, i, val) =>
    setExperience(experience.map(e => { if (e.id !== id) return e; const b = [...e.bullets]; b[i] = val; return { ...e, bullets: b }; }));
  const addExperienceBullet = (id) =>
    setExperience(experience.map(e => e.id === id ? { ...e, bullets: [...e.bullets, "New achievement"] } : e));
  const deleteExperienceBullet = (id, i) =>
    setExperience(experience.map(e => e.id === id ? { ...e, bullets: e.bullets.filter((_, idx) => idx !== i) } : e));

  /* ── Education CRUD ── */
  const addEducation = () => setEducation([...education, { id: Date.now(), degree: "Degree", school: "University", year: "2024" }]);
  const deleteEducation = (id) => setEducation(education.filter(i => i.id !== id));
  const updateEducationField = (id, field, value) =>
    setEducation(education.map(e => e.id === id ? { ...e, [field]: value } : e));

  /* ── Certification CRUD ── */
  const addCertification = () => setCertifications([...certifications, { id: Date.now(), name: "Certification Name", issuer: "Issuer" }]);
  const deleteCertification = (id) => setCertifications(certifications.filter(i => i.id !== id));
  const updateCertificationField = (id, field, value) =>
    setCertifications(certifications.map(c => c.id === id ? { ...c, [field]: value } : c));

  /* ── ATS + AI ── */
  const handleATSCheck = () => {
    const resumeData = {
      name: `${personalDetails.firstName} ${personalDetails.lastName}`,
      title: personalDetails.title, summary,
      experience: experience.map(e => e.role).join(", "),
      education: education.map(e => e.degree).join(", "),
      certifications: certifications.map(c => c.name).join(", "),
    };
    setScore(calculateResumeScore(resumeData));
  };

  const handleAIGenerate = async () => {
    setLoading(true);
    try {
      const resumeData = {
        name: `${personalDetails.firstName} ${personalDetails.lastName}`,
        title: personalDetails.title, skills: "Product Design, UX Design, UI Design, SaaS",
        experience: experience.map(e => e.role).join(", "),
        education: education.map(e => e.degree).join(", "),
      };
      setScore(calculateResumeScore(resumeData));
      setSummary(await generateAISummary(resumeData));
    } catch { setSummary("Failed to generate AI summary"); }
    finally { setLoading(false); }
  };

  const handleImageUpload = (e) => { const f = e.target.files[0]; if (f) setImage(URL.createObjectURL(f)); };
  const downloadPDF = () => html2pdf().from(document.getElementById("resume-preview")).save("resume.pdf");

  const handleNewResume = () => {
    setPersonalDetails({ firstName: "", lastName: "", title: "", email: "", phone: "", location: "" });
    setSummary(""); setExperience([]); setEducation([]); setCertifications([]); setImage(null); setScore(0);
  };

  const handleLogout = () => { setShowLogoutModal(false); alert("Logged out! (Connect your auth provider here)"); };

  /* ── Dark mode style tokens ── */
  const dm = (light, dark) => darkMode ? dark : light;

  const sidebarBg = dm("bg-white border-slate-200", "bg-gray-900 border-gray-700");
  const headerBg  = dm("bg-white border-slate-200", "bg-gray-900 border-gray-700");
  const panelBg   = dm("bg-white border-slate-200", "bg-gray-900 border-gray-700");
  const rightBg   = dm("bg-slate-100", "bg-gray-800");
  const cardBg    = dm("border-slate-200 bg-slate-50/50", "border-gray-600 bg-gray-800");
  const inputCls  = dm("bg-white border-slate-200 text-slate-900 placeholder-slate-400",
                       "bg-gray-700 border-gray-500 text-white placeholder-gray-300");
  const labelCls  = dm("text-slate-500", "text-slate-300");
  const textCls   = dm("text-slate-900", "text-white");
  const mutedCls  = dm("text-slate-500", "text-slate-400");

  /* ── Shared input style ── */
  const inp = `rounded-lg border px-4 py-2 text-sm ${inputCls}`;

  return (
    <>
      {/* SPLASH SCREEN — shown until animation completes */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <LogoutModal darkMode={darkMode} onConfirm={handleLogout} onCancel={() => setShowLogoutModal(false)} />
      )}

      <DndContext>
        <div className={dm("flex min-h-screen bg-[#f8f9fb] text-slate-900", "flex min-h-screen bg-black text-white")}>

          {/* ── SIDEBAR ── */}
          <aside className={`fixed left-0 top-0 hidden h-screen w-64 flex-col border-r lg:flex ${sidebarBg}`}>
            {/* Logo */}
            <div className={`flex h-16 items-center border-b px-6 ${dm("border-slate-100","border-gray-700")}`}>
              <span className="text-xl font-bold text-blue-600">ResumePro AI</span>
            </div>

            <div className="p-4">
              {/* Workspace card */}
              <div className={`mb-6 flex items-center gap-3 rounded-xl p-3 ${dm("bg-slate-50","bg-gray-800")}`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${textCls}`}>Professional Editor</p>
                  <p className="text-xs text-slate-500">AI-Powered Workspace</p>
                </div>
              </div>

              {/* New Resume */}
              <button onClick={handleNewResume}
                className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 font-medium text-white hover:bg-blue-700 transition-colors">
                <PlusCircle size={18} /> New Resume
              </button>

              {/* Nav */}
              <nav className="space-y-1">
                {[
                  { id: "builder",    icon: FileText,    label: "Resume Builder" },
                  { id: "ai-editor",  icon: Sparkles,    label: "Cover Letter" },
                  { id: "profile",    icon: User,        label: "Profile" },
                  { id: "help",       icon: HelpCircle,  label: "Help Center" },
                ].map(({ id, icon: Icon, label }) => (
                  <button key={id} onClick={() => setActiveTab(id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                      activeTab === id
                        ? "bg-blue-50 text-blue-600"
                        : dm("text-slate-600 hover:bg-slate-100", "text-slate-300 hover:bg-gray-700")
                    }`}>
                    <Icon size={18} /> {label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Footer */}
            <div className={`mt-auto space-y-1 border-t p-4 ${dm("border-slate-100","border-gray-700")}`}>
              <button onClick={() => setDarkMode(!darkMode)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm ${dm("text-slate-600 hover:bg-slate-100","text-slate-300 hover:bg-gray-700")}`}>
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
              <button onClick={() => setShowLogoutModal(true)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm ${dm("text-slate-600 hover:bg-slate-100","text-slate-300 hover:bg-gray-700")}`}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          </aside>

          {/* ── MAIN ── */}
          <main className="flex-1 lg:ml-64">
            {/* Header */}
            <header className={`sticky top-0 z-10 flex h-16 items-center justify-between border-b px-8 ${headerBg}`}>
              <div className="text-xl font-bold text-blue-600">ResumePro AI</div>
              <div className="flex items-center gap-4">
                <button className={`rounded-lg border px-4 py-2 text-sm font-medium ${dm("border-slate-200 text-slate-700","border-gray-600 text-slate-200")}`}>
                  Save
                </button>
                <button onClick={downloadPDF}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
                  <Download size={16} /> Download PDF
                </button>
                <button onClick={() => setDarkMode(!darkMode)} className={dm("text-slate-600 hover:text-blue-600","text-slate-300 hover:text-blue-400")}>
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <Bell size={20} className={dm("text-slate-600","text-slate-300")} />
                <button onClick={() => setActiveTab("profile")}>
                  <User size={20} className={dm("text-slate-600","text-slate-300")} />
                </button>
              </div>
            </header>

            {/* ── VIEWS ── */}
            {activeTab === "profile" && (
              <ProfilePage darkMode={darkMode} onBack={() => setActiveTab("builder")} />
            )}

            {activeTab === "help" && (
              <HelpCenter darkMode={darkMode} onBack={() => setActiveTab("builder")} />
            )}

            {activeTab === "ai-editor" && (
              <CoverLetterGenerator
                personalDetails={personalDetails} summary={summary}
                experience={experience} education={education}
                certifications={certifications}
                onBack={() => setActiveTab("builder")} darkMode={darkMode}
              />
            )}

            {/* ── BUILDER ── */}
            {activeTab === "builder" && (
              <div className="grid grid-cols-1 xl:grid-cols-2">

                {/* LEFT PANEL */}
                <section className={`min-h-screen space-y-10 overflow-y-auto border-r p-8 ${panelBg}`}>

                  {/* Personal Details */}
                  <section>
                    <div className={`mb-6 flex items-center gap-2 text-blue-600`}>
                      <User size={20} /><h2 className="text-xl font-bold">Personal Details</h2>
                    </div>
                    <div className={`rounded-2xl border p-6 ${cardBg}`}>
                      <div>
                        <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-slate-100 bg-slate-50">
                          <img src={image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100"}
                            alt="Profile" className="h-full w-full object-cover" />
                        </div>
                        <input type="file" onChange={handleImageUpload} className="mt-3 text-sm" />
                      </div>
                      <div className="mt-8 grid grid-cols-2 gap-4">
                        <input type="text" value={personalDetails.firstName}
                          onChange={(e) => setPersonalDetails({ ...personalDetails, firstName: e.target.value })}
                          placeholder="First Name" className={inp} />
                        <input type="text" value={personalDetails.lastName}
                          onChange={(e) => setPersonalDetails({ ...personalDetails, lastName: e.target.value })}
                          placeholder="Last Name" className={inp} />
                      </div>
                      <input type="text" value={personalDetails.title}
                        onChange={(e) => setPersonalDetails({ ...personalDetails, title: e.target.value })}
                        placeholder="Professional Title" className={`mt-4 w-full ${inp}`} />
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {["email","phone","location"].map(field => (
                          <input key={field} type="text" value={personalDetails[field]}
                            onChange={(e) => setPersonalDetails({ ...personalDetails, [field]: e.target.value })}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            className={`${inp} text-sm`} />
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Template Selector */}
                  <section>
                    <h2 className={`mb-4 text-xl font-bold ${textCls}`}>Choose Template</h2>
                    <div className="flex gap-4">
                      {["modern","classic"].map(t => (
                        <button key={t} onClick={() => setSelectedTemplate(t)}
                          className={`rounded-lg px-4 py-2 capitalize font-semibold ${
                            selectedTemplate === t ? "bg-blue-600 text-white" : `border ${dm("text-slate-600","text-slate-300 border-gray-600")}`
                          }`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* ATS Score */}
                  <div className={`rounded-2xl p-6 shadow ${dm("bg-white","bg-gray-800")}`}>
                    <h2 className={`text-lg font-bold ${textCls}`}>ATS Resume Score</h2>
                    <div className="mt-2 text-5xl font-black text-blue-600">{score}/100</div>
                    <button onClick={handleATSCheck} className="mt-4 rounded-lg bg-green-600 px-5 py-2 text-white font-semibold">
                      Check ATS Score
                    </button>
                  </div>

                  {/* Summary */}
                  <section>
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-600">
                        <FileText size={20} /><h2 className="text-xl font-bold">Professional Summary</h2>
                      </div>
                      <button onClick={handleAIGenerate}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white">
                        <Sparkles size={14} />{loading ? "Generating..." : "AI Generate"}
                      </button>
                    </div>
                    <textarea value={summary} onChange={(e) => setSummary(e.target.value)}
                      className={`min-h-[180px] w-full rounded-xl border p-4 ${inputCls}`} />
                  </section>

                  {/* Experience */}
                  <section>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-600">
                        <Briefcase size={20} /><h2 className="text-xl font-bold">Work Experience</h2>
                      </div>
                      <button onClick={addExperience} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white font-semibold">
                        Add Experience
                      </button>
                    </div>
                    <div className="space-y-4">
                      {experience.map((exp) => (
                        <div key={exp.id} className={`rounded-2xl border p-6 space-y-3 ${cardBg}`}>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold uppercase text-slate-400">Experience Record</span>
                            <Trash2 size={18} className="cursor-pointer text-red-500 hover:text-red-700"
                              onClick={() => deleteExperience(exp.id)} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                              { label: "Job Title / Role", field: "role", placeholder: "e.g. Lead UX Designer" },
                              { label: "Company", field: "company", placeholder: "Company Name" },
                              { label: "Location", field: "location", placeholder: "e.g. San Francisco, CA" },
                              { label: "Time Period", field: "period", placeholder: "e.g. Jan 2021 — Present" },
                            ].map(({ label, field, placeholder }) => (
                              <div key={field} className="flex flex-col gap-1">
                                <label className={`text-xs font-medium ${labelCls}`}>{label}</label>
                                <input type="text" value={exp[field]}
                                  onChange={(e) => updateExperienceField(exp.id, field, e.target.value)}
                                  placeholder={placeholder}
                                  className={`rounded-lg border px-3 py-1.5 text-sm ${inputCls}`} />
                              </div>
                            ))}
                          </div>
                          <div className="space-y-2 mt-2">
                            <div className="flex justify-between items-center">
                              <label className={`text-xs font-semibold ${dm("text-slate-600","text-slate-300")}`}>Achievements / Bullet Points</label>
                              <button type="button" onClick={() => addExperienceBullet(exp.id)}
                                className="text-xs text-blue-600 font-medium hover:underline">+ Add Bullet</button>
                            </div>
                            {exp.bullets.map((bullet, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <input type="text" value={bullet}
                                  onChange={(e) => updateExperienceBullet(exp.id, i, e.target.value)}
                                  className={`flex-1 rounded-lg border px-3 py-1 text-xs ${inputCls}`}
                                  placeholder="Describe your impact" />
                                <Trash2 size={14} className="cursor-pointer text-slate-400 hover:text-red-500"
                                  onClick={() => deleteExperienceBullet(exp.id, i)} />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Education */}
                  <section>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-600">
                        <GraduationCap size={20} /><h2 className="text-xl font-bold">Education</h2>
                      </div>
                      <button onClick={addEducation} className="rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold">
                        Add Education
                      </button>
                    </div>
                    <div className="space-y-4">
                      {education.map((edu) => (
                        <div key={edu.id} className={`rounded-xl border p-4 space-y-3 ${cardBg}`}>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold uppercase text-slate-400">Education Details</span>
                            <Trash2 size={16} className="cursor-pointer text-red-500 hover:text-red-700"
                              onClick={() => deleteEducation(edu.id)} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[
                              { label: "Degree", field: "degree", ph: "e.g. Bachelor of Design" },
                              { label: "School/University", field: "school", ph: "e.g. Stanford University" },
                              { label: "Graduation Year", field: "year", ph: "e.g. 2018" },
                            ].map(({ label, field, ph }) => (
                              <div key={field} className="flex flex-col gap-1">
                                <label className={`text-xs font-medium ${labelCls}`}>{label}</label>
                                <input type="text" value={edu[field]}
                                  onChange={(e) => updateEducationField(edu.id, field, e.target.value)}
                                  placeholder={ph}
                                  className={`rounded-lg border px-3 py-1.5 text-sm ${inputCls}`} />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Certifications */}
                  <section>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-600">
                        <Award size={20} /><h2 className="text-xl font-bold">Certifications</h2>
                      </div>
                      <button onClick={addCertification} className="rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold">
                        Add Certification
                      </button>
                    </div>
                    <div className="space-y-4">
                      {certifications.map((cert) => (
                        <div key={cert.id} className={`rounded-xl border p-4 space-y-3 ${cardBg}`}>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold uppercase text-slate-400">Certification Details</span>
                            <Trash2 size={16} className="cursor-pointer text-red-500 hover:text-red-700"
                              onClick={() => deleteCertification(cert.id)} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                              { label: "Certification Name", field: "name", ph: "e.g. UX Design Certificate" },
                              { label: "Issuer", field: "issuer", ph: "e.g. Google" },
                            ].map(({ label, field, ph }) => (
                              <div key={field} className="flex flex-col gap-1">
                                <label className={`text-xs font-medium ${labelCls}`}>{label}</label>
                                <input type="text" value={cert[field]}
                                  onChange={(e) => updateCertificationField(cert.id, field, e.target.value)}
                                  placeholder={ph}
                                  className={`rounded-lg border px-3 py-1.5 text-sm ${inputCls}`} />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </section>

                {/* RIGHT PANEL — Resume Preview */}
                <section className={`min-h-screen overflow-y-auto p-12 ${rightBg}`}>
                  <div id="resume-preview" className={`mx-auto min-h-[1056px] w-full max-w-[800px] bg-white p-12 shadow-2xl ${
                    selectedTemplate === "classic" ? "border-t-[20px] border-black" : "border-t-[20px] border-blue-600"
                  }`}>
                    {/* Header */}
                    <header className="mb-12 flex items-start justify-between">
                      <div>
                        <h1 className={`text-5xl font-black uppercase ${selectedTemplate === "classic" ? "text-black" : "text-blue-900"}`}>
                          {personalDetails.firstName}<br />{personalDetails.lastName}
                        </h1>
                        <p className="mt-2 text-xl text-blue-600">{personalDetails.title}</p>
                      </div>
                      <img src={image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100"}
                        alt="Profile" className="h-24 w-24 rounded-xl object-cover" />
                    </header>

                    {/* Contact */}
                    <div className="mb-10 flex flex-wrap gap-6 text-sm text-slate-600">
                      <div className="flex items-center gap-2"><Mail size={14} />{personalDetails.email}</div>
                      <div className="flex items-center gap-2"><Phone size={14} />{personalDetails.phone}</div>
                      <div className="flex items-center gap-2"><MapPin size={14} />{personalDetails.location}</div>
                    </div>

                    {/* Summary */}
                    <section className="mb-10">
                      <h3 className="border-b pb-2 text-sm font-bold uppercase text-blue-700">Summary</h3>
                      <p className="mt-4 text-sm leading-relaxed text-slate-700">{summary}</p>
                    </section>

                    {/* Experience */}
                    <section className="mb-10">
                      <h3 className="border-b pb-2 text-sm font-bold uppercase text-blue-700">Experience</h3>
                      <div className="mt-6 space-y-8">
                        {experience.map((exp) => (
                          <div key={exp.id}>
                            <div className="flex justify-between">
                              <h4 className="font-bold">{exp.role}</h4>
                              <span className="text-xs text-slate-400">{exp.period}</span>
                            </div>
                            <p className="text-sm italic text-slate-500">{exp.company} | {exp.location}</p>
                            <ul className="mt-3 space-y-2">
                              {exp.bullets.map((b, i) => (
                                <li key={i} className="text-sm text-slate-700">• {b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Education */}
                    <section className="mb-10">
                      <h3 className="border-b pb-2 text-sm font-bold uppercase text-blue-700">Education</h3>
                      <div className="mt-4 space-y-4">
                        {education.map((edu) => (
                          <div key={edu.id}>
                            <h4 className="font-bold">{edu.degree}</h4>
                            <p className="text-sm text-slate-500">{edu.school} • {edu.year}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Certifications */}
                    <section>
                      <h3 className="border-b pb-2 text-sm font-bold uppercase text-blue-700">Certifications</h3>
                      <div className="mt-4 space-y-4">
                        {certifications.map((cert) => (
                          <div key={cert.id}>
                            <h4 className="font-bold">{cert.name}</h4>
                            <p className="text-sm text-slate-500">{cert.issuer}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </section>
              </div>
            )}
          </main>
        </div>

        <ChatBot />
      </DndContext>
    </>
  );
}