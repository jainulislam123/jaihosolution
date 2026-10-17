import React, { useState, useEffect } from "react";
import {
  Menu, X, Code, Smartphone, Brain, Cloud, Shield, Database,
  ArrowRight, CheckCircle, Star, ChevronRight, Mail, MapPin,
  Phone, Globe, Twitter, Linkedin, Facebook,
  Box, Youtube, Layers, BookOpen, Monitor, ShoppingBag, Activity,
  Sparkles, Bot, Loader2, Lightbulb, Copy, Check, ExternalLink,
  Terminal, FileCode, Search, Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateProjectBlueprint } from "./services/aiService.ts";

const socialLinks = [
  { icon: Twitter, url: "https://twitter.com/jaihosolution", name: "Twitter" },
  { icon: Linkedin, url: "https://in.linkedin.com/in/jaihosolution786", name: "LinkedIn" },
  { icon: Facebook, url: "https://www.facebook.com/Jaihosolution/", name: "Facebook" },
  { icon: Youtube, url: "https://www.youtube.com/c/jaihosolution", name: "YouTube" },
];

const THEME_COLOR = "#45bdb5";
const THEME_GRADIENT = "linear-gradient(135deg, #45bdb5 0%, #32a89f 50%, #c6ea0f 100%)";
const THEME_GRADIENT_HOVER = "linear-gradient(135deg, #c6ea0f 0%, #32a89f 50%, #45bdb5 100%)";
const DARK_BG_COLOR = "#0B1120";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "architect" | "branding";
  initialPrompt?: string;
}

const PROMPTS = {
  architect: {
    title: "AI Project Architect",
    desc: "Describe your dream app or platform, and our AI will architect the technical roadmap, tech stack, and milestone blueprint in seconds.",
    placeholder: "e.g., 'A tinder-style app for adopting shelter dogs with smart matching and vet verification'...",
    samples: [
      "AI-driven automated coffee roastery subscription platform",
      "Uber for drone delivery and urgent parcel logistics",
      "Telemedicine portal with AI triage and prescription sync"
    ]
  },
  branding: {
    title: "AI Brand Visionary",
    desc: "Describe your business idea, and I'll generate catchy names, strategic slogans, and modern visual palettes.",
    placeholder: "e.g., 'A premium organic matcha brand tailored for remote developers and creators'...",
    samples: [
      "Next-gen eco-friendly fashion marketplace",
      "B2B SaaS accounting tool for indie game studios",
      "Smart ergonomic furniture designed with AI robotics"
    ]
  }
};

const SectionHeading = ({
  title,
  subtitle,
  center = true,
  badge = ""
}: {
  title: string;
  subtitle: string;
  center?: boolean;
  badge?: string;
}) => {
  return (
    <div className={`mb-16 ${center ? "text-center" : "text-left"}`}>
      {badge && (
        <span className="inline-block py-1 px-4 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-teal-500/10 text-[#45bdb5] border border-[#45bdb5]/30">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
        {title}
      </h2>
      <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
};

const Button = ({
  children,
  primary = false,
  loading = false,
  icon: Icon,
  className = "",
  onClick,
  style = {},
  disabled = false,
}: {
  children: React.ReactNode;
  primary?: boolean;
  loading?: boolean;
  icon?: any;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  disabled?: boolean;
}) => {
  return (
    <button
      onClick={loading ? undefined : onClick}
      disabled={disabled || loading}
      style={{
        ...(primary ? { backgroundImage: THEME_GRADIENT, color: "white" } : {}),
        ...style
      }}
      onMouseEnter={(e) => {
        if (primary && !loading) e.currentTarget.style.backgroundImage = THEME_GRADIENT_HOVER;
      }}
      onMouseLeave={(e) => {
        if (primary && !loading) e.currentTarget.style.backgroundImage = THEME_GRADIENT;
      }}
      className={`
        inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-lg transition-all duration-300
        ${loading ? "opacity-90 cursor-wait shadow-md" : "cursor-pointer"}
        ${primary ? "shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0" : "bg-white/95 backdrop-blur-sm text-slate-900 border border-slate-200 hover:border-slate-400 hover:bg-white shadow-sm hover:shadow-md"}
        ${className}
      `}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="animate-spin" size={20} />
          <span>Loading...</span>
        </span>
      ) : (
        <>
          {children}
          {Icon && <Icon size={20} className="ml-2" />}
        </>
      )}
    </button>
  );
};

/* Generative Tool Modal with full formatting and quick copy */
const GenerativeToolModal = ({ isOpen, onClose, mode = "architect", initialPrompt = "" }: ModalProps) => {
  const [input, setInput] = useState(initialPrompt);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setInput(initialPrompt);
    setResult(null);
    setError(null);
    setCopied(false);
  }, [isOpen, mode, initialPrompt]);

  const config = PROMPTS[mode] || PROMPTS.architect;

  const handleGenerate = async (queryText?: string) => {
    const textToUse = queryText || input;
    if (!textToUse.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await generateProjectBlueprint(textToUse, mode);
      setResult(response);
    } catch {
      setError("Our AI engine encountered a momentary delay. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    // Strip HTML for clean clipboard paste
    const tmp = document.createElement("DIV");
    tmp.innerHTML = result;
    const plainText = tmp.textContent || tmp.innerText || "";
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 border border-slate-100"
          >
            <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md"
                  style={{ backgroundImage: THEME_GRADIENT }}
                >
                  {mode === "architect" ? <Bot size={24} /> : <Lightbulb size={24} />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{config.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">Jaiho Solution AI Engine • Powered by Gemini</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
              {!result ? (
                <div className="space-y-6">
                  <div className="bg-teal-50 border border-teal-100 p-4 rounded-2xl text-teal-900 text-sm flex gap-3 items-start">
                    <Sparkles className="flex-shrink-0 text-[#45bdb5] mt-0.5" size={20} />
                    <p className="leading-relaxed">{config.desc}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      Tell us about your project or business idea
                    </label>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={config.placeholder}
                      className="w-full h-32 p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#45bdb5] focus:border-[#45bdb5] outline-none resize-none text-slate-800 text-base shadow-inner"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Or try these sample inspirations:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {config.samples.map((sample, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setInput(sample);
                            handleGenerate(sample);
                          }}
                          className="text-xs py-1.5 px-3 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-[#45bdb5] hover:border-[#45bdb5] border border-slate-200 text-slate-700 transition-colors text-left"
                        >
                          "{sample}"
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                  <button
                    onClick={() => handleGenerate()}
                    disabled={loading || !input.trim()}
                    className="w-full py-4 rounded-2xl font-bold text-white text-lg shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
                    style={{ backgroundImage: THEME_GRADIENT }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={22} />
                        Architecting Blueprint...
                      </>
                    ) : (
                      <>
                        <Sparkles size={22} />
                        Generate AI Blueprint
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 py-1 px-3 rounded-full border border-teal-200">
                      Generated Technical Blueprint
                    </span>
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check size={14} className="text-emerald-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          Copy Output
                        </>
                      )}
                    </button>
                  </div>

                  <div
                    className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm md:text-base space-y-4"
                    dangerouslySetInnerHTML={{ __html: result }}
                  />

                  <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => setResult(null)}
                      className="flex-1 py-3.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Refine / New Idea
                    </button>
                    <a
                      href="https://api.whatsapp.com/send?phone=918759417243&text=Hi%20Jaiho%20Solution,%20I%20used%20your%20AI%20Architect%20tool%20and%20want%20to%20build%20my%20project!"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3.5 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                      style={{ backgroundImage: THEME_GRADIENT }}
                    >
                      Let's Build This! <ArrowRight size={18} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/* Quick Contact & Project Proposal Drawer Modal */
const ContactModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "Web Development", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 z-10 border border-slate-100"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Start Your Project</h3>
                <p className="text-sm text-slate-500">We respond with a complete estimate within 24 hours.</p>
              </div>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer">
                <X size={22} />
              </button>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle size={36} />
                </div>
                <h4 className="text-2xl font-bold text-slate-900">Inquiry Received!</h4>
                <p className="text-slate-600 max-w-sm mx-auto">
                  Thank you! Our engineering team will review your requirements and reach out promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Your Name</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Alex Johnson"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#45bdb5] outline-none text-slate-800"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="alex@company.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#45bdb5] outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 8759417243"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#45bdb5] outline-none text-slate-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Service Required</label>
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#45bdb5] outline-none text-slate-800 bg-white"
                  >
                    <option>Web & SaaS Development</option>
                    <option>Mobile App (iOS & Android)</option>
                    <option>AI & Machine Learning Solution</option>
                    <option>Cloud Architecture & DevOps</option>
                    <option>Enterprise Data Engineering</option>
                    <option>Full Digital Transformation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Project Details</label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Briefly describe your objectives, timeline, or key features..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#45bdb5] outline-none text-slate-800 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-bold text-white text-base shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  style={{ backgroundImage: THEME_GRADIENT }}
                >
                  <Send size={18} /> Submit Project Request
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/* Reusable Page Layout Container */
const PageLayout = ({
  title,
  description,
  color,
  icon: Icon,
  badge = "",
  children
}: {
  title: string;
  description: string;
  color: string;
  icon: any;
  badge?: string;
  children: React.ReactNode;
}) => (
  <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200/80 rounded-3xl p-10 md:p-14 text-center mb-14 shadow-sm relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="w-20 h-20 bg-teal-50 text-[#45bdb5] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-teal-100">
            <Icon size={40} />
          </div>
          {badge && (
            <span className="inline-block py-1 px-4 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-teal-500/10 text-[#45bdb5] border border-[#45bdb5]/30">
              {badge}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>
      </motion.div>
      {children}
    </div>
  </div>
);

/* Products Page */
const ProductsPage = ({ onOpenContact }: { onOpenContact: () => void }) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const allProducts = [
    {
      id: 1,
      name: "Coaching Management ERP",
      category: "crm",
      badge: "Popular",
      icon: Activity,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
      description: "An enterprise CRM solution for automated workflow orchestration, omni-channel tracking, and deep AI customer analytics.",
      features: ["AI Predictive Lead Scoring", "Visual Pipeline Automation", "Custom Sales Dashboards & Reporting"]
    },
    {
      id: 2,
      name: "Jaiho Typing Pro",
      category: "cloud",
      badge: "Enterprise",
      icon: Cloud,
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
      description: "Secure, decentralized enterprise cloud storage solution engineered with military-grade encryption and geo-redundancy.",
      features: ["Zero-Knowledge Encryption", "High-Throughput Global Bandwidth", "Automated Real-Time Daily Backups"]
    },
    {
      id: 3,
      name: "E-Commerce Shop",
      category: "commerce",
      badge: "New",
      icon: ShoppingBag,
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop",
      description: "Ultra-fast headless e-commerce API supporting omnichannel checkouts, automated tax compliance, and synchronized catalogs.",
      features: ["Stripe, Razorpay & PayPal Ready", "Sub-second Real-time Inventory Sync", "Multi-Currency Global Tax Engine"]
    },
    {
      id: 4,
      name: "Edufly School Managment",
      category: "Eduaction",
      badge: "Eduaction",
      icon: Shield,
      image: "https://i.postimg.cc/GpMHCM6V/School-Management-System-screenshot-4.png",
      description: "Plug-and-play biometric & MFA identity infrastructure with anomaly behavioral risk profiling and SSO support.",
      features: ["Passkeys & Biometric Login", "OAuth 2.0 & OIDC Standard", "Advanced Bot & Sybil Attack Protection"]
    },
    {
      id: 5,
      name: "PulseFity Gym Managemnet",
      category: "data",
      badge: "Developer",
      icon: Database,
      image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=800&auto=format&fit=crop",
      description: "Robust data warehousing toolkit providing stream ingestion, PostgreSQL compatibility, and automated schema migrations.",
      features: ["Streaming Real-time Ingestion", "PostgreSQL / ClickHouse Ready", "Elastic Auto-scaling Worker Nodes"]
    },
    {
      id: 6,
      name: "IoT Central Hub",
      category: "iot",
      badge: "Hardware",
      icon: Monitor,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
      description: "Connect, monitor, and manage thousands of connected edge IoT devices with zero-trust firmware delivery and telemetry alerts.",
      features: ["Sub-second Device Telemetry", "Over-The-Air (OTA) Safe Updates", "Predictive Anomaly Detection AI"]
    }
  ];

  const filteredProducts = allProducts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageLayout
      title="Our Proprietary Products & APIs"
      description="Explore our suite of enterprise-grade software products, cloud toolkits, and microservice APIs designed to elevate your company's operational speed."
      color="indigo"
      icon={Box}
      badge="Enterprise Software Ecosystem"
    >
      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products or features..."
            className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-[#45bdb5] outline-none text-slate-800 shadow-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {[
            { id: "all", label: "All Products" },
            { id: "crm", label: "CRM & Sales" },
            { id: "cloud", label: "Cloud & Storage" },
            { id: "commerce", label: "E-Commerce" },
            { id: "security", label: "Security & Auth" },
            { id: "data", label: "Big Data" },
            { id: "iot", label: "IoT" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs md:text-sm font-semibold px-4 py-2 rounded-full transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#45bdb5] text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col relative overflow-hidden group"
            >
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-xl text-[#45bdb5]">
                    <product.icon size={24} />
                  </div>
                  {product.badge && (
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                      {product.badge}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#45bdb5] transition-colors">
                  {product.name}
                </h3>
                <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed">
                  {product.description}
                </p>

                <div className="space-y-2.5 mb-6">
                  {product.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-slate-700 text-sm font-medium">
                      <CheckCircle size={16} className="text-[#32a89f] mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 mt-auto">
                  <a
                    href="https://api.whatsapp.com/send?phone=918759417243&text=Hi%20Jaiho%20Solution,%20I'm%20interested%20in%20a%20demo%20for%20products."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 text-center rounded-xl font-bold text-white text-sm shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                    style={{ backgroundImage: THEME_GRADIENT }}
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
};

/* Solutions Page */
const SolutionsPage = ({ onOpenContact }: { onOpenContact: () => void }) => {
  const solutions = [
    {
      title: "FinTech & Banking Infrastructure",
      desc: "Robust banking payment rails, multi-currency wallets, biometric verification, and sub-second ledger accounting systems.",
      tags: ["PCI-DSS Ready", "Real-Time Ledger", "Fraud Mitigation"],
      metric: "99.999% Fault Tolerance"
    },
    {
      title: "Healthcare & HIPAA Telemedicine",
      desc: "Secure end-to-end encrypted video consultations, smart triage assistant bots, and unified electronic health record (EHR) sync.",
      tags: ["HIPAA Compliant", "AI Triage", "EHR Interoperability"],
      metric: "35% Shorter Waiting Times"
    },
    {
      title: "E-Commerce & Omnichannel Retail",
      desc: "Scalable microservices handling millions of flash sale requests per minute, automated ERP warehousing, and custom checkout flows.",
      tags: ["Headless Commerce", "Instant Checkout", "Predictive Stocking"],
      metric: "3.2x Higher Conversion Rate"
    },
    {
      title: "Logistics, Fleet & Supply Chain",
      desc: "AI pathfinding algorithms, live GPS sensor streaming, temperature-controlled delivery telemetry, and automated driver dispatch.",
      tags: ["IoT Streaming", "Geo-fencing", "Dynamic Dispatch"],
      metric: "22% Fuel Cost Reduction"
    }
  ];

  return (
    <PageLayout
      title="Tailored Industry Solutions"
      description="Battle-tested digital architectures designed to overcome domain-specific hurdles in finance, healthcare, global logistics, and retail."
      color="emerald"
      icon={Layers}
      badge="Enterprise Architecture"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {solutions.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                  {item.metric}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-6">{item.desc}</p>
            </div>
            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="text-xs font-medium px-3 py-1 bg-slate-100 rounded-lg text-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href="https://api.whatsapp.com/send?phone=918759417243&text=Hi%20Jaiho%20Solution,%20I%20would%20like%20to%20discuss%20an%20industry%20solution."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl border border-slate-200 font-bold text-slate-800 hover:bg-[#45bdb5] hover:text-white hover:border-[#45bdb5] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Chat on WhatsApp <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </PageLayout>
  );
};

/* Developers Page */
const DevelopersPage = () => {
  const [activeTab, setActiveTab] = useState<"curl" | "node" | "python">("node");

  const codeSnippets = {
    node: `// Initialize Jaiho Solution API client
import { JaihoClient } from '@jaihosolution/sdk';

const client = new JaihoClient({
  apiKey: process.env.JAIHO_API_KEY,
  environment: 'production'
});

// Architect a project or query AI models
const blueprint = await client.architect.generateProposal({
  projectDescription: 'Next-gen cross-border remittance gateway',
  preferredStack: ['react', 'node', 'postgresql'],
  compliance: ['PCI-DSS', 'SOC2']
});

console.log('Estimated Milestones:', blueprint.roadmap);`,
    curl: `curl -X POST https://api.jaihosolution.com/v1/architect/blueprint \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "projectDescription": "Next-gen cross-border remittance gateway",
    "targetPlatforms": ["web", "ios", "android"]
  }'`,
    python: `# Jaiho Solution Python SDK
from jaihosolution import JaihoClient

client = JaihoClient(api_key="YOUR_API_KEY")

response = client.architect.create_blueprint(
    description="Next-gen cross-border remittance gateway",
    output_format="json"
)

for phase in response.phases:
    print(f"Phase {phase.number}: {phase.title}")`
  };

  return (
    <PageLayout
      title="Built by Developers, for Developers"
      description="Robust APIs, type-safe SDKs, and developer-first documentation to integrate enterprise intelligence into your workflows."
      color="rose"
      icon={Code}
      badge="Developer Platform"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <Terminal size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">REST & GraphQL APIs</h3>
          <p className="text-sm text-slate-600 mb-4">
            Sub-50ms endpoint latencies, strict OpenAPI 3.1 specifications, and interactive sandbox environments.
          </p>
          <span className="text-xs font-bold text-[#45bdb5] uppercase tracking-wider">v2.4 LTS Active</span>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#45bdb5] flex items-center justify-center mx-auto mb-4">
            <FileCode size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">SDKs & Toolkits</h3>
          <p className="text-sm text-slate-600 mb-4">
            Official client libraries for TypeScript, React, Node.js, Python, Flutter, Go, and React Native.
          </p>
          <span className="text-xs font-bold text-[#45bdb5] uppercase tracking-wider">100% Type-Safe</span>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Globe size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Global Edge Network</h3>
          <p className="text-sm text-slate-600 mb-4">
            Distributed across 32 regional clusters for guaranteed sub-second response times worldwide.
          </p>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">99.99% Systems Normal</span>
        </div>
      </div>

      {/* Code Snippet Box */}
      <div className="bg-[#0B1120] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 text-left">
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs text-slate-400 font-mono ml-2">Quickstart Integration</span>
          </div>
          <div className="flex gap-2">
            {(["node", "curl", "python"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                  activeTab === tab ? "bg-[#45bdb5] text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                {tab === "node" ? "Node.js" : tab === "curl" ? "cURL" : "Python"}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6 overflow-x-auto font-mono text-sm text-slate-300 leading-relaxed">
          <pre>{codeSnippets[activeTab]}</pre>
        </div>
      </div>
    </PageLayout>
  );
};

/* Resources Page */
const ResourcesPage = () => {
  const articles = [
    {
      tag: "Technical Whitepaper",
      title: "Building Distributed Microservices on Modern Cloud Infrastructure",
      desc: "An in-depth exploration of state reconciliation, multi-region replication, and zero-downtime rolling upgrades in 2025.",
      readTime: "8 min read",
      date: "October 2025"
    },
    {
      tag: "Case Study",
      title: "How HealU Clinic Reduced Patient Triage Time by 40% with Real-Time AI",
      desc: "Learn how healthcare providers scaled remote patient intake while maintaining strict HIPAA compliance and zero data leaks.",
      readTime: "6 min read",
      date: "September 2025"
    },
    {
      tag: "Engineering Guide",
      title: "From Monolith to Event-Driven Microservices: The Complete Playbook",
      desc: "Step-by-step migration blueprint, database separation techniques, and rollback strategies from Jaiho Solution's engineering team.",
      readTime: "11 min read",
      date: "August 2025"
    },
    {
      tag: "Cybersecurity Alert",
      title: "Zero-Trust Identity & Biometric Authentication Best Practices",
      desc: "Why traditional password credentials are failing enterprise audits and how passkeys provide cryptographically unphishable protection.",
      readTime: "5 min read",
      date: "July 2025"
    }
  ];

  return (
    <PageLayout
      title="Knowledge Hub & Resources"
      description="Read our latest technical playbooks, architectural case studies, and engineering whitepapers to stay ahead of the digital curve."
      color="amber"
      icon={BookOpen}
      badge="Research & Insights"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  {item.tag}
                </span>
                <span className="text-xs text-slate-400 font-medium">{item.readTime}</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 hover:text-[#45bdb5] transition-colors cursor-pointer">
                {item.title}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6">{item.desc}</p>
            </div>
            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
              <span className="text-xs font-medium text-slate-400">{item.date}</span>
              <button
                onClick={() => alert(`Opening "${item.title}" whitepaper.`)}
                className="text-sm font-bold text-[#45bdb5] hover:gap-2 flex items-center gap-1 transition-all cursor-pointer"
              >
                Read Whitepaper <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

/* Hero Component */
const Hero = ({
  onNavigate,
  onOpenTool
}: {
  onNavigate: (page: string) => void;
  onOpenTool?: (mode: "architect" | "branding") => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleExplore = () => {
    setIsLoading(true);
    setTimeout(() => {
      onNavigate("products");
      setIsLoading(false);
    }, 450);
  };

  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-36 overflow-hidden" style={{ backgroundColor: DARK_BG_COLOR }}>
      {/* Background imagery with subtle overlay */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2000&auto=format&fit=crop"
          alt="Digital Engineering Workspace"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/70 via-[#0B1120]/90 to-[#0B1120]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span
            className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs md:text-sm font-bold mb-8 shadow-md"
            style={{ color: THEME_COLOR }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: THEME_COLOR }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: "#c6ea0f" }} />
            </span>
            #1 Full-Stack Digital Solutions Agency
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.08] mb-8 tracking-tight">
            Transform Your Vision <br className="hidden md:block" />
            <span
              className="bg-clip-text text-transparent animate-gradient"
              style={{ backgroundImage: `linear-gradient(to right, #45bdb5, #c6ea0f, #45bdb5)` }}
            >
              Into Digital Reality
            </span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed font-normal">
            We architect high-performance software, cloud ecosystems, and AI-driven platforms that empower ambitious enterprises to lead their industries.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5 max-w-md sm:max-w-none mx-auto">
            <Button
              primary
              loading={isLoading}
              onClick={handleExplore}
              icon={ArrowRight}
            >
              Explore Products & Work
            </Button>
          </div>

          <div className="mt-20 pt-10 border-t border-white/10">
            <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
              Engineering with industry standard technologies
            </p>
            <div className="flex flex-wrap justify-center gap-6 sm:gap-12 md:gap-16 opacity-80">
              {["React 19", "Next.js", "AWS Cloud", "Python", "Flutter", "Node.js", "PostgreSQL", "Gemini AI"].map((tech) => (
                <span
                  key={tech}
                  className="text-base sm:text-lg md:text-xl font-bold text-slate-400 hover:text-[#45bdb5] cursor-default transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* AI Tools Section */
const AIToolsSection = ({ onOpenTool }: { onOpenTool: (mode: "architect" | "branding") => void }) => (
  <section className="py-24 bg-slate-50 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <SectionHeading
        badge="Next-Gen Automation"
        title="AI Engineering Suite"
        subtitle="Experience the capability of our generative AI tools. From end-to-end technical roadmaps to high-converting brand kits, we streamline the kickoff phase."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="group bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200 hover:shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-36 h-36 bg-teal-50 rounded-bl-full opacity-60 transition-opacity group-hover:opacity-100" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#45bdb5] flex items-center justify-center mb-6 shadow-sm border border-teal-100">
              <Bot size={36} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">AI Project Architect</h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Describe your software idea in natural language. Our system generates a full technical specification, component hierarchy, database schema, and estimated sprint milestones.
            </p>
          </div>
          <Button onClick={() => onOpenTool("architect")} icon={ArrowRight} className="w-full sm:w-auto">
            Launch Architect
          </Button>
        </div>

        <div className="group bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200 hover:shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-36 h-36 bg-lime-50 rounded-bl-full opacity-60 transition-opacity group-hover:opacity-100" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-lime-50 text-lime-700 flex items-center justify-center mb-6 shadow-sm border border-lime-200">
              <Lightbulb size={36} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">AI Brand Visionary</h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Struggling to find the right name or identity? Generate catchy trademark-ready names, high-impact slogans, and targeted visual palettes in seconds.
            </p>
          </div>
          <Button onClick={() => onOpenTool("branding")} icon={ArrowRight} className="w-full sm:w-auto">
            Launch Visionary
          </Button>
        </div>
      </div>
    </div>
  </section>
);

/* Services Component */
const ServiceCard = ({
  num,
  icon: Icon,
  title,
  desc,
  tags,
  delay
}: {
  num: string;
  icon: any;
  title: string;
  desc: string;
  tags: string[];
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="group relative bg-white p-8 md:p-9 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-[0_24px_50px_-12px_rgba(69,189,181,0.25)] hover:border-[#45bdb5]/60 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
  >
    {/* Ambient Glow Background on Hover */}
    <div
      className="absolute -top-20 -right-20 w-44 h-44 rounded-full filter blur-3xl opacity-0 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"
      style={{ background: `linear-gradient(135deg, ${THEME_COLOR}, #c6ea0f)` }}
    />
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#45bdb5] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <div className="relative z-10">
      {/* Header row with Icon and Numeric watermark */}
      <div className="flex justify-between items-start mb-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-3deg] shadow-sm"
          style={{
            background: `linear-gradient(135deg, ${THEME_COLOR}15, #c6ea0f25)`,
            color: THEME_COLOR,
            border: `1px solid ${THEME_COLOR}30`
          }}
        >
          <Icon size={30} className="group-hover:scale-110 transition-transform duration-300" />
        </div>
        <span className="text-3xl font-black text-slate-200 group-hover:text-[#45bdb5]/40 transition-colors font-mono select-none">
          {num}
        </span>
      </div>

      <h3 className="text-2xl font-extrabold text-slate-900 mb-3 group-hover:text-[#45bdb5] transition-colors tracking-tight">
        {title}
      </h3>
      <p className="text-slate-600 leading-relaxed text-sm mb-6 font-normal">
        {desc}
      </p>

      {/* Capability Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-teal-50 group-hover:text-[#2d918a] transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>

    {/* Bottom Interactive Action */}
    <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between">
      <a
        href={`https://api.whatsapp.com/send?phone=918759417243&text=Hi%20Jaiho%20Solution,%20I'm%20interested%20in%20${encodeURIComponent(title)}.`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 font-bold text-sm transition-all"
        style={{ color: THEME_COLOR }}
      >
        <span>Discuss Project</span>
        <span className="w-7 h-7 rounded-full bg-teal-50 group-hover:bg-[#45bdb5] group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1.5">
          <ChevronRight size={16} />
        </span>
      </a>
      <span className="text-xs font-semibold text-slate-400 group-hover:text-[#45bdb5] transition-colors">
        Full-Stack Ready
      </span>
    </div>
  </motion.div>
);

const Services = () => {
  const services = [
    {
      num: "01",
      icon: Code,
      title: "Web Development",
      desc: "High-performance React & Next.js applications custom-engineered for conversion, speed, and clean code maintainability.",
      tags: ["Next.js 15", "React 19", "Tailwind CSS", "TypeScript"]
    },
    {
      num: "02",
      icon: Smartphone,
      title: "Mobile App Engineering",
      desc: "Smooth cross-platform iOS & Android mobile applications built using React Native and Flutter with native device integration.",
      tags: ["React Native", "Flutter", "iOS & Android", "Expo"]
    },
    {
      num: "03",
      icon: Brain,
      title: "AI Integration & LLMs",
      desc: "Deploy intelligent copilots, predictive analytics, vector databases, and automated workflows utilizing Gemini and open models.",
      tags: ["Gemini 2.5", "RAG & Vectors", "Autonomous Agents", "Python"]
    },
    {
      num: "04",
      icon: Cloud,
      title: "Cloud & DevOps Architecture",
      desc: "Zero-downtime serverless deployments on AWS and Google Cloud, containerization via Docker/Kubernetes, and CI/CD pipelines.",
      tags: ["AWS Cloud", "Docker & K8s", "CI/CD Pipelines", "Terraform"]
    },
    {
      num: "05",
      icon: Database,
      title: "Data Engineering",
      desc: "Scalable PostgreSQL, real-time message brokers, data lakes, and automated reporting systems built for enterprise datasets.",
      tags: ["PostgreSQL", "Kafka & Redis", "BigQuery", "Data Pipelines"]
    },
    {
      num: "06",
      icon: Shield,
      title: "Cybersecurity & Compliance",
      desc: "End-to-end security hardening, biometric authentication, SOC2 & GDPR preparation, and automated penetration testing.",
      tags: ["SOC 2 Compliance", "Zero-Trust", "MFA & Biometrics", "Pen Testing"]
    }
  ];

  return (
    <section className="py-24 bg-white" id="solutions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="End-to-End Capabilities"
          title="Our Core Engineering Expertise"
          subtitle="Comprehensive digital solutions engineered for performance, rock-solid security, and measurable business growth."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} delay={index * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* Features & Metrics */
const Features = () => {
  return (
    <section className="py-24 text-white overflow-hidden relative" style={{ backgroundColor: DARK_BG_COLOR }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span
              className="font-bold tracking-wider uppercase mb-2 block bg-clip-text text-transparent text-sm"
              style={{ backgroundImage: THEME_GRADIENT }}
            >
              Why Choose Jaiho Solution
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
              Built for Speed, Security, and Global Scale.
            </h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed font-normal">
              We don't just write code; we build resilient, future-proof digital architectures designed to handle exponential business growth.
            </p>
            <div className="space-y-6">
              {[
                {
                  title: "Enterprise Grade Security",
                  desc: "SOC 2 & GDPR compliant standards, encrypted transit, and role-based zero trust."
                },
                {
                  title: "99.99% Uptime Guarantee",
                  desc: "High-availability multi-region cloud clustering for uninterrupted operations."
                },
                {
                  title: "Rapid Deployment Pipeline",
                  desc: "Automated CI/CD workflows getting validated features to production without downtime."
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle style={{ color: "#c6ea0f" }} size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1 text-white">{item.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 mt-8">
                <div className="bg-slate-800/90 backdrop-blur p-6 rounded-3xl border border-slate-700/80 shadow-lg">
                  <h3 className="text-4xl font-extrabold text-white mb-1">85%</h3>
                  <p className="text-slate-400 text-sm font-medium">Faster Time to Market</p>
                </div>
                <div className="bg-slate-800/90 backdrop-blur p-6 rounded-3xl border border-slate-700/80 h-48 flex flex-col justify-end shadow-lg">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white shadow-md"
                    style={{ backgroundImage: THEME_GRADIENT }}
                  >
                    <Cloud size={24} />
                  </div>
                  <p className="font-bold text-white text-lg">Cloud-Native</p>
                  <p className="text-xs text-slate-400">AWS & Google Cloud</p>
                </div>
              </div>

              <div className="space-y-4">
                <div
                  className="p-6 rounded-3xl h-48 flex flex-col justify-between shadow-xl"
                  style={{ backgroundImage: THEME_GRADIENT }}
                >
                  <Globe size={32} className="text-white/90" />
                  <div>
                    <h3 className="text-4xl font-extrabold text-white mb-1">24/7</h3>
                    <p className="text-white/95 text-sm font-semibold">Continuous Monitoring</p>
                  </div>
                </div>
                <div className="bg-slate-800/90 backdrop-blur p-6 rounded-3xl border border-slate-700/80 shadow-lg">
                  <h3 className="text-4xl font-extrabold text-white mb-1">100+</h3>
                  <p className="text-slate-400 text-sm font-medium">Delivered Projects</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PortfolioCard = ({
  title,
  category,
  description,
  image,
  color,
  stats,
  link
}: {
  title: string;
  category: string;
  description: string;
  image: string;
  color: string;
  stats: { value: string; label: string }[];
  link: string;
}) => (
  <div
    className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
  >
    {/* Product Image Header with Live Badge */}
    <div className="relative h-52 overflow-hidden bg-slate-900">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

      {/* Top badges */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <span className="py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30">
          {category}
        </span>
        <span className="flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-emerald-500/95 text-white backdrop-blur shadow-sm">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Live System
        </span>
      </div>

      {/* Title with link */}
      <div className="absolute bottom-3 left-6 right-6">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl font-bold text-white hover:text-[#45bdb5] transition-colors flex items-center justify-between group/title"
        >
          <span>{title}</span>
          <ExternalLink size={18} className="text-white/70 group-hover/title:text-[#45bdb5] transition-colors" />
        </a>
      </div>
    </div>

    {/* Content details */}
    <div className="p-6 flex flex-col flex-grow justify-between">
      <div>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          {description}
        </p>

        {/* Impact stats */}
        <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-xl font-black text-slate-900">{stat.value}</p>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live Demo & Case Details Link Button */}
      <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-4 rounded-xl font-bold text-white text-sm shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer group/btn"
          style={{ backgroundImage: THEME_GRADIENT }}
        >
          <span>Live Demo & Case Details</span>
          <ExternalLink size={15} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </a>
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-1">
          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
            <CheckCircle size={12} /> Verified Deployment
          </span>
          <span className="truncate max-w-[170px] text-slate-400 font-mono">
            {link.replace(/^https?:\/\//, '')}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const Portfolio = () => {
  const [showAll, setShowAll] = useState(false);

  // You can easily paste your original URLs into the 'link' properties below!
  const initialProjects = [
    {
      title: "HealU Clinic",
      category: "Healthcare AI",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
      description: "AI-powered patient triage & intake system reducing emergency wait times by 40% with HIPAA-grade records.",
      color: "bg-teal-400",
      stats: [{ value: "40%", label: "Faster Triage" }, { value: "15k+", label: "Patients Served" }],
      link: "https://www.trixofly.com/projects/1"
    },
    {
      title: "EduSmart Portal",
      category: "EdTech Platform",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&auto=format&fit=crop",
      description: "Comprehensive LMS for 50+ regional schools with live virtual classrooms and automated quiz evaluations.",
      color: "bg-orange-400",
      stats: [{ value: "50+", label: "Schools" }, { value: "99.9%", label: "Uptime" }],
      link: "https://www.trixofly.com/projects/2" // <-- Paste your original link here
    },
    {
      title: "WaitroFly",
      category: "Hospitality SaaS",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop",
      description: "QR-based automated ordering and payment system with real-time POS kitchen displays and analytics.",
      color: "bg-purple-400",
      stats: [{ value: "3x", label: "Order Volume" }, { value: "-20%", label: "Staff Overhead" }],
      link: "https://www.trixofly.com/projects/3" // <-- Paste your original link here
    }
  ];

  const extraProjects = [
    {
      title: "E-Commerce Dashboard",
      category: "FinTech Security",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop",
      description: "Decentralized multi-sig blockchain wallet with biometric authentication layers and instant settlements.",
      color: "bg-indigo-400",
      stats: [{ value: "$2B+", label: "Secured" }, { value: "0", label: "Breaches" }],
      link: "https://www.trixofly.com/projects/6" // <-- Paste your original link here
    },
    {
      title: "TravelWiz Aggregator",
      category: "Travel Engine",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop",
      description: "Aggregator platform processing thousands of live flight and hotel data points per second with sub-200ms latency.",
      color: "bg-sky-400",
      stats: [{ value: "0.2s", label: "Latency" }, { value: "100+", label: "Airlines" }],
      link: "https://travelwiz-demo.com" // <-- Paste your original link here
    },
    {
      title: "Freelance CRM",
      category: "CRM",
      image: "https://images.unsplash.com/photo-1510519138161-584736f2f8f0?q=80&w=800&auto=format&fit=crop",
      description: "Wearable synchronization engine for real-time telemetry, heart rate metrics, and sleep tracking.",
      color: "bg-rose-400",
      stats: [{ value: "1M+", label: "Daily Syncs" }, { value: "99.8%", label: "Accuracy" }],
      link: "https://fitpulse-demo.com" // <-- Paste your original link here
    }
  ];

  const displayedProjects = showAll ? [...initialProjects, ...extraProjects] : initialProjects;

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-4 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-teal-500/10 text-[#45bdb5] border border-[#45bdb5]/30">
              Verified Case Studies
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Featured Client Deliveries
            </h2>
            <p className="text-lg md:text-xl text-slate-600">
              We craft reliable digital experiences that generate measurable enterprise value.
            </p>
          </div>
          <button
            onClick={() => setShowAll(!showAll)}
            className="hidden md:flex items-center gap-2 font-bold hover:gap-4 transition-all cursor-pointer text-base"
            style={{ color: THEME_COLOR }}
          >
            {showAll ? "Show Fewer Projects" : "View All 6 Case Studies"} <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {displayedProjects.map((project) => (
              <PortfolioCard key={project.title} {...project} />
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-12 text-center md:hidden">
          <Button onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show Fewer Projects" : "View All Case Studies"}
          </Button>
        </div>
      </div>
    </section>
  );
};

/* Testimonials */
const Testimonials = () => {
  const reviews = [
    {
      name: "Sarah Thomas",
      role: "CEO, HealthPlus Systems",
      text: "The AI triage system integrated seamlessly with our clinical stack. Our patient support overhead dropped by 35% in our first quarter.",
      stars: 5
    },
    {
      name: "Leo Zhang",
      role: "Director of Engineering, AgroTech Global",
      text: "The speed at which Jaiho Solution delivered our IoT dashboard exceeded all our internal benchmarks. Remarkable craftsmanship.",
      stars: 5
    },
    {
      name: "James Turner",
      role: "CTO, EduSmart",
      text: "Reliable, scalable, and intuitive. Over 50 regional schools rely on the LMS daily with zero downtime during peak school hours.",
      stars: 5
    }
  ];

  return (
    <section className="py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionHeading
          badge="Client Endorsements"
          title="What Industry Leaders Say"
          subtitle="Don't just take our word for it. Here is what leading founders and tech executives say about partnering with Jaiho Solution."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-slate-50 p-8 rounded-3xl text-left hover:bg-white hover:shadow-xl border border-transparent hover:border-slate-200 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-6 text-amber-400">
                  {[...Array(review.stars)].map((_, sIdx) => (
                    <Star key={sIdx} size={18} fill="currentColor" />
                  ))}
                </div>
                <p className="text-slate-700 text-base md:text-lg italic mb-6 leading-relaxed">
                  "{review.text}"
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{review.name}</h4>
                <p className="text-xs text-slate-500 font-semibold">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* Footer Component */
const Footer = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <footer className="text-slate-300 pt-20 pb-10" style={{ backgroundColor: DARK_BG_COLOR }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div
              className="flex items-center gap-2 mb-6 cursor-pointer"
              onClick={() => onNavigate("home")}
            >
              <img
                src="https://i.postimg.cc/xCFyP22W/jaihosolution.webp"
                alt="Jaiho Solution Logo"
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  // Fallback styled text if image blocked
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <p className="text-slate-400 mb-6 text-sm leading-relaxed">
              We transform ambitious ideas into scalable digital reality through modern software architecture, AI engines, and enterprise cloud solutions.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, url, name }, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-all hover:scale-110"
                  style={{ transition: "all 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundImage = THEME_GRADIENT)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundImage = "none")}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Platform</h4>
            <ul className="space-y-3">
              {["Home", "Products", "Solutions", "Resources"].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => onNavigate(item.toLowerCase())}
                    className="text-slate-400 hover:text-white transition-colors text-sm cursor-pointer"
                    onMouseEnter={(e) => (e.currentTarget.style.color = THEME_COLOR)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                  >
                    {item}
                  </button>
                </li>
              ))}
              <li>
                <a
                  href="https://jainulislamproductspage.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors text-sm cursor-pointer"
                  onMouseEnter={(e) => (e.currentTarget.style.color = THEME_COLOR)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                >
                  Landing Page
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 flex-shrink-0" size={18} style={{ color: THEME_COLOR }} />
                <span className="text-slate-400">Buniadpur, Banshihari, West Bengal, 733121, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="flex-shrink-0" size={18} style={{ color: THEME_COLOR }} />
                <a href="mailto:islamjainul9@gmail.com" className="text-slate-400 hover:text-white">
                  islamjainul9@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="flex-shrink-0" size={18} style={{ color: THEME_COLOR }} />
                <a href="tel:+918759417243" className="text-slate-400 hover:text-white">
                  +91 8759417243
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Stay Connected</h4>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              Subscribe to our monthly tech bulletin for emerging AI developments and product architecture news.
            </p>
            {subscribed ? (
              <p className="text-emerald-400 text-sm font-semibold flex items-center gap-2">
                <CheckCircle size={16} /> Subscribed successfully!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm w-full text-white placeholder-slate-500 focus:ring-2 focus:ring-[#45bdb5] outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="text-white rounded-xl px-4 transition-all cursor-pointer flex items-center justify-center hover:scale-105"
                  style={{ backgroundImage: THEME_GRADIENT }}
                >
                  <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Jaiho Solution. All Rights Reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Whitepaper</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* Navbar Component */
const Navbar = ({
  activePage,
  setActivePage,
  onOpenContact
}: {
  activePage: string;
  setActivePage: (p: string) => void;
  onOpenContact: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home" },
    { name: "Products" },
    { name: "Solutions" },
    { name: "Resources" }
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/90 backdrop-blur-md shadow-md py-4 border-b border-slate-800/60"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setActivePage("home");
              window.scrollTo(0, 0);
            }}
          >
            <img
              src="https://i.postimg.cc/xCFyP22W/jaihosolution.webp"
              alt="Jaiho Solution"
              className="h-9 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => {
              const key = item.name.toLowerCase();
              const isActive = activePage === key;
              return (
                <button
                  key={item.name}
                  onClick={() => setActivePage(key)}
                  className={`text-sm font-semibold transition-colors cursor-pointer ${
                    isActive ? "text-[#45bdb5] font-bold" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}

            <a
              href="https://jainulislamproductspage.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer flex items-center gap-2.5"
              style={{ backgroundImage: THEME_GRADIENT }}
            >
              <img
                src="https://jainulislam.netlify.app/images/logo.png"
                alt="Landing Page Icon"
                className="w-5 h-5 object-contain rounded-full bg-white/20 p-0.5"
              />
              <span>Landing Page</span>
            </a>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 z-50 relative cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-t border-slate-800 overflow-hidden"
          >
            <div className="px-5 pt-4 pb-8 space-y-4 shadow-2xl">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setActivePage(item.name.toLowerCase());
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-base font-semibold text-slate-200 hover:bg-slate-800 rounded-xl"
                >
                  {item.name}
                </button>
              ))}

              <a
                href="https://jainulislamproductspage.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2.5 w-full text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md"
                style={{ backgroundImage: THEME_GRADIENT }}
              >
                <img
                  src="https://jainulislam.netlify.app/images/logo.png"
                  alt="Landing Page Icon"
                  className="w-5 h-5 object-contain rounded-full bg-white/20 p-0.5"
                />
                <span>Landing Page</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

/* Homepage View */
const HomePage = ({
  onNavigate,
  onOpenTool,
  onOpenContact
}: {
  onNavigate: (page: string) => void;
  onOpenTool: (mode: "architect" | "branding") => void;
  onOpenContact: () => void;
}) => (
  <>
    <Hero onNavigate={onNavigate} onOpenTool={onOpenTool} />
    <Services />
    <Features />
    <Portfolio />
    <Testimonials />

    {/* Bottom CTA Banner */}
    <section className="py-24 relative overflow-hidden" style={{ backgroundImage: THEME_GRADIENT }}>
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight">
          Ready to Scale Your Digital Vision?
        </h2>
        <p className="text-lg sm:text-xl text-white/95 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join 100+ innovative companies transforming their operational speed with Jaiho Solution's engineering and AI services.
        </p>
        <div className="flex justify-center">
          <a
            href="https://api.whatsapp.com/send?phone=918759417243&text=Hi%20Jaiho%20Solution,%20let's%20discuss%20scaling%20my%20business."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white px-10 py-5 rounded-full font-extrabold text-lg sm:text-xl shadow-2xl hover:bg-slate-50 hover:scale-105 transition-all duration-300 cursor-pointer inline-flex items-center justify-center gap-3"
            style={{ color: THEME_COLOR }}
          >
            Chat on WhatsApp <ArrowRight size={22} />
          </a>
        </div>
      </div>
    </section>
  </>
);

/* Main App Entry */
export default function App() {
  const [activePage, setActivePage] = useState<string>("home");
  const [activeTool, setActiveTool] = useState<"architect" | "branding" | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activePage]);

  const renderPage = () => {
    switch (activePage) {
      case "products":
        return <ProductsPage onOpenContact={() => setIsContactOpen(true)} />;
      case "solutions":
        return <SolutionsPage onOpenContact={() => setIsContactOpen(true)} />;
      case "developers":
        return <DevelopersPage />;
      case "resources":
        return <ResourcesPage />;
      default:
        return (
          <HomePage
            onNavigate={setActivePage}
            onOpenTool={setActiveTool}
            onOpenContact={() => setIsContactOpen(true)}
          />
        );
    }
  };

  return (
    <div className="font-sans text-slate-900 bg-white selection:bg-[#45bdb5]/20 selection:text-[#45bdb5]">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenContact={() => setIsContactOpen(true)}
      />

      <GenerativeToolModal
        isOpen={!!activeTool}
        onClose={() => setActiveTool(null)}
        mode={activeTool || "architect"}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onNavigate={setActivePage} />

      {/* Floating WhatsApp in Right Bottom Corner */}
      <a
        href="https://api.whatsapp.com/send?phone=918759417243&text=Hi%20Jaiho%20Solution,%20I%20would%20like%20to%20discuss%20a%20new%20project."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full text-white font-bold text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all bg-[#25D366] hover:bg-[#20ba59]"
        style={{
          boxShadow: "0 10px 25px -5px rgba(37, 211, 102, 0.5), 0 8px 10px -6px rgba(37, 211, 102, 0.4)"
        }}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
        </span>
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
        <span className="hidden sm:inline-block tracking-wide">Chat on WhatsApp</span>
      </a>
    </div>
  );
}
