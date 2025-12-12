import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Code,
  Smartphone,
  Brain,
  Cloud,
  Shield,
  Database,
  ArrowRight,
  CheckCircle,
  Star,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Globe,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Box,
  Youtube,
  Layers,
  BookOpen,
  Monitor,
  ShoppingBag,
  Activity,
  Sparkles,
  Bot,
  Loader2,
  Zap,
  Rocket,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const socialLinks = [
  { icon: Twitter, url: "https://twitter.com/yourprofile" },
  { icon: Linkedin, url: "https://in.linkedin.com/in/jaihosolution786" },
  { icon: Facebook, url: "https://www.facebook.com/Jaihosolution/" },
  { icon: Youtube, url: "https://www.youtube.com/c/jaihosolution" },
];

// --- Constants ---
const THEME_COLOR = "#45bdb5"; // Primary Fallback
// Updated Gradient: 50% Teal (#45bdb5) -> 50% Lime (#c6ea0f) logic
const THEME_GRADIENT =
  "linear-gradient(135deg, #45bdb5 0%, #45bdb5 50%, #c6ea0f 100%)";
const THEME_GRADIENT_HOVER =
  "linear-gradient(135deg, #c6ea0f 0%, #45bdb5 50%, #45bdb5 100%)";
const DARK_BG_COLOR = "#0B1120"; // Custom Dark Navy from Photo

// --- API Helper ---
const callGeminiAPI = async (prompt) => {
  const apiKey = ""; // Injected at runtime
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const systemPrompt = `You are the Senior Solutions Architect for Jaiho Solution, a high-end digital agency. 
  Your goal is to impress a potential client who has just described a project idea.
  
  Analyze their idea and return a structured technical proposal in valid HTML (NOT Markdown) format. 
  Use <h3> for section headers, <ul>/<li> for lists, and <p> for text. 
  The sections should be:
  1. <h3>🚀 Executive Summary</h3> (1 sentence pitch)
  2. <h3>✨ Core Features</h3> (3-5 bullet points)
  3. <h3>🛠 Recommended Tech Stack</h3> (Specific tools like React, Node, AWS, etc.)
  4. <h3>⏱️ Estimated Complexity</h3> (Low/Medium/High with a brief reason)
  
  Keep the tone professional, innovative, and exciting. Do not include any markdown backticks or json tags, just the HTML string inside the response.`;

  const payload = {
    contents: [{ parts: [{ text: `Client Idea: ${prompt}` }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
  };

  let delay = 1000;
  for (let i = 0; i < 5; i++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();
      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Could not generate proposal."
      );
    } catch (e) {
      if (i === 4) throw e;
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
};

// --- Reusable Components ---

const SectionHeading = ({
  title,
  subtitle,
  center = true,
  themeColor = "theme",
}) => {
  // mapping generic color names to our specific theme hex if needed
  const isMainTheme = themeColor === "theme" || themeColor === "blue";

  return (
    <div className={`mb-16 ${center ? "text-center" : "text-left"}`}>
      <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
        {title}
      </h2>
      <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
        {subtitle}
      </p>
      <div
        className={`mt-6 h-1.5 w-24 rounded-full ${center ? "mx-auto" : ""} ${
          !isMainTheme ? `bg-${themeColor}-600` : ""
        }`}
        style={isMainTheme ? { backgroundImage: THEME_GRADIENT } : {}}
      ></div>
    </div>
  );
};

const Button = ({
  children,
  primary = false,
  icon: Icon,
  className = "",
  onClick,
  colorClass,
}) => {
  return (
    <button
      onClick={onClick}
      style={primary ? { backgroundImage: THEME_GRADIENT, color: "white" } : {}}
      onMouseEnter={(e) => {
        if (primary)
          e.currentTarget.style.backgroundImage = THEME_GRADIENT_HOVER;
      }}
      onMouseLeave={(e) => {
        if (primary) e.currentTarget.style.backgroundImage = THEME_GRADIENT;
      }}
      className={`
        inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-lg transition-all duration-300
        ${
          primary
            ? `shadow-lg hover:shadow-xl hover:-translate-y-1`
            : "bg-white/90 backdrop-blur-sm text-slate-900 border border-slate-200 hover:border-slate-400 hover:bg-white"
        }
        ${className}
      `}
    >
      {children}
      {Icon && <Icon size={20} className="ml-2" />}
    </button>
  );
};

// --- AI Modal Component ---

const AIProjectModal = ({ isOpen, onClose }) => {
  const [idea, setIdea] = useState("");
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setError(null);
    setProposal(null);

    try {
      const result = await callGeminiAPI(idea);
      setProposal(result);
    } catch (err) {
      setError(
        "Our AI architect is currently overwhelmed with requests. Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundImage: THEME_GRADIENT }}
                >
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    AI Project Architect ✨
                  </h3>
                  <p className="text-sm text-slate-500">Powered by Gemini</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
              {!proposal ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800 text-sm flex gap-3">
                    <Sparkles className="flex-shrink-0" size={20} />
                    <p>
                      Describe your dream app, website, or platform, and our AI
                      will instantly architect a technical roadmap for you.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      What do you want to build?
                    </label>
                    <textarea
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                      placeholder="e.g., 'A tinder-style app for adopting shelter dogs' or 'A dashboard for tracking solar panel efficiency'..."
                      className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#45bdb5] focus:border-transparent outline-none resize-none text-slate-700 placeholder:text-slate-400"
                    ></textarea>
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <button
                    onClick={handleGenerate}
                    disabled={loading || !idea.trim()}
                    className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:-translate-y-1"
                    style={{ backgroundImage: THEME_GRADIENT }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />{" "}
                        Architecting Solution...
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} /> Generate Proposal
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div
                    className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-[#45bdb5]"
                    dangerouslySetInnerHTML={{ __html: proposal }}
                  />
                  <div className="mt-8 pt-6 border-t border-slate-100 flex gap-4">
                    <button
                      onClick={() => setProposal(null)}
                      className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      New Idea
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all"
                      style={{ backgroundImage: THEME_GRADIENT }}
                    >
                      Let's Build This!
                    </button>
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

// --- Sub-Page Components ---

const PageLayout = ({ title, description, color, icon: Icon, children }) => (
  <div className={`min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50`}>
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-${color}-50 border border-${color}-100 rounded-3xl p-12 text-center mb-12 relative overflow-hidden`}
      >
        <div
          className={`absolute top-0 right-0 w-64 h-64 bg-${color}-200/50 rounded-full blur-3xl -mr-16 -mt-16`}
        ></div>
        <div className={`relative z-10`}>
          <div
            className={`w-20 h-20 bg-${color}-100 text-${color}-600 rounded-2xl flex items-center justify-center mx-auto mb-6`}
          >
            <Icon size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            {title}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>
      </motion.div>
      {children}
    </div>
  </div>
);

const ProductsPage = () => (
  <PageLayout
    title="Our Products"
    description="Explore our suite of enterprise-grade software products designed to streamline operations."
    color="indigo"
    icon={Box}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
        >
          <div className="h-48 bg-indigo-50 rounded-xl mb-6 flex items-center justify-center">
            <Box className="text-indigo-300 w-16 h-16" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            Product {item}
          </h3>
          <p className="text-slate-600 mb-4">
            An advanced solution for automated workflow management and
            analytics.
          </p>
          <button className="text-indigo-600 font-bold hover:underline">
            Learn More →
          </button>
        </div>
      ))}
    </div>
  </PageLayout>
);

const SolutionsPage = () => (
  <PageLayout
    title="Solutions"
    description="Tailored digital strategies to solve your most complex business challenges."
    color="emerald"
    icon={Layers}
  >
    <div className="bg-white rounded-3xl p-10 shadow-sm border border-emerald-100">
      <h3 className="text-2xl font-bold mb-6 text-slate-900">
        Industry Specific Solutions
      </h3>
      <div className="space-y-6">
        {[
          "FinTech Integration",
          "Healthcare Data Management",
          "E-Commerce Scaling",
          "Logistics Tracking",
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center p-4 bg-emerald-50 rounded-xl"
          >
            <CheckCircle className="text-emerald-600 mr-4" />
            <span className="font-semibold text-emerald-900 text-lg">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  </PageLayout>
);

const DevelopersPage = () => (
  <PageLayout
    title="For Developers"
    description="Documentation, APIs, and tools built by developers, for developers."
    color="rose"
    icon={Code}
  >
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {["API Reference", "SDK Downloads", "Community Forum"].map((item, i) => (
        <div
          key={i}
          className="bg-white p-8 rounded-2xl border-t-4 border-rose-500 shadow-sm text-center"
        >
          <Code className="mx-auto text-rose-500 mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2">{item}</h3>
          <p className="text-sm text-slate-500">
            Access comprehensive resources to build faster.
          </p>
        </div>
      ))}
    </div>
  </PageLayout>
);

const ResourcesPage = () => (
  <PageLayout
    title="Resources"
    description="Case studies, whitepapers, and insights to keep you ahead of the curve."
    color="amber"
    icon={BookOpen}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
        >
          <div className="h-56 bg-amber-100"></div>
          <div className="p-8">
            <span className="text-amber-600 font-bold text-sm uppercase tracking-wide">
              Case Study
            </span>
            <h3 className="text-2xl font-bold mt-2 mb-4">
              Digital Transformation in 2025
            </h3>
            <p className="text-slate-600 mb-6">
              How top companies are leveraging AI to reduce costs by 40%.
            </p>
            <button className="bg-amber-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-amber-600 transition-colors">
              Read Article
            </button>
          </div>
        </div>
      ))}
    </div>
  </PageLayout>
);

// --- Main Sections (Home Page) ---

const Hero = ({ onNavigate, onOpenAI }) => {
  return (
    <section
      className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden"
      style={{ backgroundColor: DARK_BG_COLOR }}
    >
      {/* Background Image - AI Theme */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="https://i.postimg.cc/xjNRKNWw/wmremove-transformed.jpg"
          alt="AI Neural Network Background"
          className="w-full h-full object-cover opacity-60"
        />
        {/* Lighter Gradient Overlay - Restored */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/40 to-slate-900/80"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span
            className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm font-bold mb-8 shadow-md"
            style={{ color: THEME_COLOR }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: THEME_COLOR }}
              ></span>
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ backgroundColor: "#c6ea0f" }}
              ></span>
            </span>
            #1 Digital Solutions Agency
          </span>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.1] mb-8 tracking-tight drop-shadow-sm">
            Transform Your Vision <br className="hidden md:block" />
            <span
              className="bg-clip-text text-transparent bg-300% animate-gradient"
              style={{
                backgroundImage: `linear-gradient(to right, #45bdb5, #c6ea0f, #45bdb5)`,
              }}
            >
              Into Digital Reality
            </span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed font-semibold">
            We architect cutting-edge software, cloud ecosystems, and AI-driven
            experiences that propel forward-thinking businesses into the future.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Button primary icon={Sparkles} onClick={onOpenAI}>
              AI Architect ✨
            </Button>
            <Button onClick={() => onNavigate("products")}>
              View Our Work
            </Button>
          </div>

          {/* Tech Stack Strip */}
          <div className="mt-20 pt-10 border-t border-white/10">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
              Trusted by innovators utilizing
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-80 transition-all duration-500">
              {[
                "React",
                "AWS",
                "Python",
                "Flutter",
                "Node.js",
                "TensorFlow",
              ].map((tech) => (
                <span
                  key={tech}
                  className="text-xl font-bold text-slate-400 hover:text-[#45bdb5] cursor-default transition-colors"
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

const ServiceCard = ({ icon: Icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: delay }}
    className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
  >
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300"
      style={{
        background: `linear-gradient(135deg, ${THEME_COLOR}20, #c6ea0f30)`,
        color: THEME_COLOR,
      }}
    >
      <Icon size={28} />
    </div>
    <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
    <p className="text-slate-600 leading-relaxed mb-6">{desc}</p>
    <a
      href="#"
      className="inline-flex items-center font-bold group-hover:gap-3 gap-1 transition-all"
      style={{ color: THEME_COLOR }}
    >
      Explore service <ChevronRight size={18} />
    </a>
  </motion.div>
);

const Services = () => {
  const services = [
    {
      icon: Code,
      title: "Web Development",
      desc: "High-performance React & Next.js applications tailored to specific business logic and user needs.",
    },
    {
      icon: Smartphone,
      title: "Mobile Apps",
      desc: "Native-feel cross-platform apps for iOS and Android using React Native and Flutter technologies.",
    },
    {
      icon: Brain,
      title: "AI Integration",
      desc: "Leverage LLMs, predictive analytics, and automation to create smarter business workflows.",
    },
    {
      icon: Cloud,
      title: "Cloud Solutions",
      desc: "Scalable AWS/Azure architecture design, serverless deployments, and DevOps automation.",
    },
    {
      icon: Database,
      title: "Data Engineering",
      desc: "Robust database schema design, optimization, and secure data warehousing solutions.",
    },
    {
      icon: Shield,
      title: "Cybersecurity",
      desc: "End-to-end security audits, penetration testing, and compliance implementation (SOC2/GDPR).",
    },
  ];

  return (
    <section className="py-24 bg-white" id="solutions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Our Expertise"
          subtitle="Comprehensive digital solutions engineered for performance, scalability, and measurable business growth."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ title, category, description, color, stats, link }) => (
  <motion.a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="group relative overflow-hidden rounded-3xl bg-slate-100 h-[500px] flex flex-col justify-between cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
  >
    <div
      className={`absolute top-0 right-0 w-64 h-64 ${color} rounded-full filter blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity`}
    ></div>

    <div className="p-10 relative z-10">
      <span className="inline-block py-1 px-3 rounded-lg bg-white/60 backdrop-blur text-slate-800 text-xs font-bold uppercase tracking-wider mb-4 ">
        {category}
      </span>
      <h3
        className="text-3xl font-bold text-slate-900 mb-4 transition-colors"
        onMouseEnter={(e) => (e.currentTarget.style.color = THEME_COLOR)}
        onMouseLeave={(e) => (e.currentTarget.style.color = "")}
      >
        {title}
      </h3>
      <p className="text-slate-600 mb-6 max-w-sm">{description}</p>

      <div className="flex gap-4 mb-6">
        {stats.map((stat, i) => (
          <div key={i}>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 font-medium uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>

    <div className="relative mt-auto px-10">
      <div className="bg-white rounded-t-2xl shadow-2xl p-4 h-64 transform group-hover:translate-y-[-10px] transition-transform duration-500 border border-slate-200">
        <div className="flex gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="space-y-3">
          <div className="h-20 bg-slate-100 rounded-lg w-full"></div>
          <div className="flex gap-3">
            <div className="h-20 bg-slate-100 rounded-lg w-1/3"></div>
            <div className="h-20 bg-slate-100 rounded-lg w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  </motion.a>
);

const Portfolio = () => {
  const [showAll, setShowAll] = useState(false);

  const initialProjects = [
    {
      title: "HealU Clinic",
      category: "Healthcare AI",
      description:
        "AI-powered patient triage system reducing wait times by 40%.",
      color: "bg-teal-400",
      stats: [
        { value: "40%", label: "Faster Triage" },
        { value: "15k+", label: "Patients Served" },
      ],
      link: "https://healu.trixofly.com/", // Replace with actual link
    },
    {
      title: "EduSmart",
      category: "EdTech Platform",
      description:
        "Comprehensive LMS for 50+ schools with live virtual classrooms.",
      color: "bg-orange-400",
      stats: [
        { value: "50+", label: "Schools" },
        { value: "99.9%", label: "Uptime" },
      ],
      link: "https://school-system.example.com/", // Replace with actual link
    },
    {
      title: "WaitroFly",
      category: "Hospitality",
      description: "QR-based ordering system with real-time inventory sync.",
      color: "bg-purple-400",
      stats: [
        { value: "3x", label: "Order Volume" },
        { value: "-20%", label: "Staff Costs" },
      ],
      link: "https://waitrofly.trixofly.com/", // Replace with actual link
    },
  ];

  const extraProjects = [
    {
      title: "Jaiho Online",
      category: "Ecommerce",
      description:
        " Ecommerce platform featuring real-time inventory management, secure payments, and customer analytics",
      color: "bg-indigo-400",
      stats: [
        { value: "$2k+", label: "Secured" },
        { value: "0", label: "Breaches" },
      ],
      link: "https://jaihoonline.netlify.app/", // Replace with actual link
    },
    {
      title: "Company Portfolio",
      category: "voip",
      description:
        "Aggregator platform processing thousands of flight data points per second.",
      color: "bg-sky-400",
      stats: [
        { value: "0.2s", label: "Latency" },
        { value: "100+", label: "Airlines" },
      ],
      link: "https://jainulislam123.github.io/icsllc/", // Replace with actual link
    },
    {
      title: "JaihoShoping",
      category: "Mall Product Finder",
      description:
        "consise time synchronization engine for real-time Product tracking.",
      color: "bg-rose-400",
      stats: [
        { value: "1M+", label: "Users" },
        { value: "99%", label: "Sync Rate" },
      ],
      link: "https://jaihoshopping.base44.app/", // Replace with actual link
    },
  ];

  const displayedProjects = showAll
    ? [...initialProjects, ...extraProjects]
    : initialProjects;

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Our Featured Work
            </h2>
            <p className="text-xl text-slate-600">
              We craft digital experiences that drive real business results.
            </p>
          </div>

          <button
            onClick={() => setShowAll(!showAll)}
            className="hidden md:flex items-center gap-2 font-bold hover:gap-4 transition-all cursor-pointer"
            style={{ color: THEME_COLOR }}
          >
            {showAll ? "Show Less" : "View All Projects"}{" "}
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {displayedProjects.map((project, index) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-12 text-center md:hidden">
          <Button onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show Less" : "View All Projects"}
          </Button>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  return (
    <section
      className="py-24 text-white overflow-hidden relative"
      style={{ backgroundColor: DARK_BG_COLOR }}
    >
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full filter blur-[120px] pointer-events-none"
        style={{ backgroundColor: `${THEME_COLOR}33` }} // 20% opacity hex
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span
              className="font-bold tracking-wider uppercase mb-2 block bg-clip-text text-transparent"
              style={{ backgroundImage: THEME_GRADIENT }}
            >
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built for Speed, Security, and Scale.
            </h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              We don't just write code; we build resilient systems designed to
              handle growth. Our development methodology ensures your product is
              future-proof from day one.
            </p>

            <div className="space-y-6">
              {[
                {
                  title: "Enterprise Security",
                  desc: "SOC 2 compliant standards with end-to-end encryption.",
                },
                {
                  title: "99.99% Uptime SLA",
                  desc: "Guaranteed reliability for mission-critical applications.",
                },
                {
                  title: "Rapid Deployment",
                  desc: "CI/CD pipelines that get features to market faster.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle style={{ color: "#c6ea0f" }} size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                    <p className="text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 mt-8">
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                  <h3 className="text-3xl font-bold text-white mb-1">85%</h3>
                  <p className="text-slate-400 text-sm">Faster Onboarding</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 h-48 flex flex-col justify-end">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white"
                    style={{ backgroundImage: THEME_GRADIENT }}
                  >
                    <Cloud size={24} />
                  </div>
                  <p className="font-bold">Cloud Native</p>
                </div>
              </div>
              <div className="space-y-4">
                <div
                  className="p-6 rounded-2xl h-48 flex flex-col justify-between"
                  style={{ backgroundImage: THEME_GRADIENT }}
                >
                  <Globe size={32} className="text-white/80" />
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-1">24/7</h3>
                    <p className="text-white/90 text-sm">Global Support</p>
                  </div>
                </div>
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                  <h3 className="text-3xl font-bold text-white mb-1">100+</h3>
                  <p className="text-slate-400 text-sm">Integrations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    {
      name: "Sarah Thomas",
      role: "CEO, HealthPlus",
      text: "The AI chatbot integrated seamlessly. Our support tickets dropped by 35% within the first month.",
      stars: 5,
    },
    {
      name: "Leo Zhang",
      role: "Director, AgroTech",
      text: "We saw real-time improvements in how data was handled. Very professional and innovative approach.",
      stars: 5,
    },
    {
      name: "James Turner",
      role: "CTO, EduSmart",
      text: "Scalable and intuitive. Our students and teachers love the real-time performance tracking feature!",
      stars: 5,
    },
  ];

  return (
    <section className="py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionHeading
          title="What Our Clients Say"
          subtitle="Don't just take our word for it. Here's what industry leaders have to say about working with us."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-slate-50 p-8 rounded-3xl text-left hover:bg-white hover:shadow-xl border border-transparent hover:border-slate-100 transition-all duration-300"
            >
              <div className="flex gap-1 mb-6" style={{ color: "#c6ea0f" }}>
                {[...Array(review.stars)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="text-slate-700 text-lg italic mb-6">
                "{review.text}"
              </p>
              <div>
                <h4 className="font-bold text-slate-900">{review.name}</h4>
                <p className="text-sm text-slate-500">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = ({ onNavigate }) => (
  <footer
    className="text-slate-300 pt-20 pb-10"
    style={{ backgroundColor: DARK_BG_COLOR }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div>
          <div
            className="flex items-center gap-2 mb-6 cursor-pointer"
            onClick={() => onNavigate("home")}
          >
            <span className="text-2xl font-bold text-white">
              <img
                src="https://i.postimg.cc/xCFyP22W/jaihosolution.webp"
                alt="jaihosolution"
              />
            </span>
          </div>
          <p className="text-slate-400 mb-6 leading-relaxed">
            We transform visions into reality through cutting-edge technology
            and innovative digital solutions.
          </p>

          <div className="flex gap-4">
            {socialLinks.map(({ icon: Icon, url }, i) => (
              <a
                key={i}
                href={url} // ← 여기 URL이 설정됩니다.
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white transition-colors"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundImage = THEME_GRADIENT)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundImage = "none")
                }
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6">Menu</h4>
          <ul className="space-y-3 ">
            {["Products", "Solutions", "Developers", "Resources"].map(
              (item) => (
                <li key={item}>
                  <button
                    onClick={() => onNavigate(item.toLowerCase())}
                    className="hover:text-white transition-colors text-left"
                    style={{ transition: "color 0.2s" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = THEME_COLOR)
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                  >
                    {item}
                  </button>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin
                className="mt-1 flex-shrink-0"
                size={18}
                style={{ color: THEME_COLOR }}
              />
              <span>Buniadpur, Banshihari, West Bengal,733121</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail
                className="flex-shrink-0"
                size={18}
                style={{ color: THEME_COLOR }}
              />
              <span>islamjainul9@Gmail.com</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone
                className="flex-shrink-0"
                size={18}
                style={{ color: THEME_COLOR }}
              />
              <span>+91 8759417243</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6">Newsletter</h4>
          <p className="text-slate-400 mb-4">
            Subscribe to get the latest news and updates.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="bg-slate-800 border-none rounded-lg px-4 py-3 w-full text-white focus:ring-2 focus:ring-[#45bdb5] outline-none"
            />
            <button
              className="text-white rounded-lg px-4 transition-colors"
              style={{ backgroundImage: THEME_GRADIENT }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundImage = THEME_GRADIENT_HOVER)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundImage = THEME_GRADIENT)
              }
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
        <p>© 2025 Jaiho Solution. All Rights Reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white">
            Sitemap
          </a>
        </div>
      </div>
    </div>
  </footer>
);

const Navbar = ({ activePage, setActivePage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Products", color: "indigo" },
    { name: "Solutions", color: "emerald" },
    { name: "Developers", color: "rose" },
    { name: "Resources", color: "amber" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6 text-slate-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
            onClick={() => setActivePage("home")}
          >
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              <img
                src="https://i.postimg.cc/xCFyP22W/jaihosolution.webp"
                alt=""
              />
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActivePage(item.name.toLowerCase())}
                className={`font-medium transition-colors ${
                  activePage === item.name.toLowerCase()
                    ? `font-bold text-slate-500`
                    : " cursor-pointer"
                }`}
                // text-cyan-300
                style={
                  activePage === item.name.toLowerCase()
                    ? { color: `var(--${item.color}-600, ${THEME_COLOR})` } // Fallback to theme color if generic
                    : {}
                }
                onMouseEnter={(e) => {
                  if (activePage !== item.name.toLowerCase())
                    e.currentTarget.style.color = THEME_COLOR;
                }}
                onMouseLeave={(e) => {
                  if (activePage !== item.name.toLowerCase())
                    e.currentTarget.style.color = "";
                }}
              >
                {item.name}
              </button>
            ))}
            <a
              href="https://api.whatsapp.com/send?phone=918759417243&text=hi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white px-6 py-2.5 rounded-full font-medium transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer flex items-center"
              style={{
                background:
                  "linear-gradient(90deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 65%, rgba(237, 221, 83, 1) 100%)",
              }}
            >
              Booking Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-700 p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 space-y-4 shadow-xl">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setActivePage(item.name.toLowerCase());
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-lg font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  {item.name}
                </button>
              ))}
              <button
                className="w-full mt-4 text-white px-6 py-4 rounded-xl font-bold"
                style={{ backgroundImage: THEME_GRADIENT }}
              >
                Booking Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const HomePage = ({ onNavigate, onOpenAI }) => (
  <>
    <Hero onNavigate={onNavigate} onOpenAI={onOpenAI} />
    <Services />
    <Features />
    <Portfolio />
    <Testimonials />
    <section
      className="py-24 relative overflow-hidden"
      style={{ backgroundImage: THEME_GRADIENT }}
    >
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10 ">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Scale Your Business?
        </h2>
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Join 100+ innovative companies transforming their industries with our
          digital solutions.
        </p>
        <button
          className="bg-white px-10 py-5 rounded-full font-bold text-xl shadow-2xl hover:bg-slate-50 hover:scale-105 transition-all duration-300"
          style={{ color: THEME_COLOR }}
        >
          Start Your Project Now
        </button>
      </div>
    </section>
  </>
);

// --- Main App Component ---

const App = () => {
  const [activePage, setActivePage] = useState("home");
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage]);

  const renderPage = () => {
    switch (activePage) {
      case "products":
        return <ProductsPage />;
      case "solutions":
        return <SolutionsPage />;
      case "developers":
        return <DevelopersPage />;
      case "resources":
        return <ResourcesPage />;
      default:
        return (
          <HomePage
            onNavigate={setActivePage}
            onOpenAI={() => setIsAIModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="font-sans text-slate-900 bg-white selection:bg-teal-100 selection:text-teal-900">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <AIProjectModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />
      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer onNavigate={setActivePage} />
    </div>
  );
};

export default App;
