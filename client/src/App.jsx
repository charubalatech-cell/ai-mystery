import { createContext, useContext, useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import {
  Activity, ArrowDownRight, ArrowLeft, ArrowRight, AudioLines, BadgeCheck, Bell,
  BookOpen, Check, ChevronDown, ChevronRight, Clock3, Command, Cpu, Crosshair,
  FileText, Fingerprint, FolderClosed, Globe, Image as ImageIcon, Layers, Lock,
  LockKeyhole, Menu, MessageSquare, Mic, Moon, Pause, Play, Plus, RefreshCw,
  Search, Shield, ShieldCheck, SlidersHorizontal, Sparkles, Sun, Target,
  UserCheck, UserRound, Users, Video, Volume2, X
} from 'lucide-react';

const ThemeContext = createContext(null);

const themesCatalog = [
  { id: 'CRIME', name: 'Crime', tag: 'CRIME', img: '/images/theme-crime.jpg', icon: Crosshair, color: 'coral' },
  { id: 'MISSING_PERSON', name: 'Missing Person', tag: 'MISSING', img: '/images/theme-missing.jpg', icon: Search, color: 'blue' },
  { id: 'THEFT', name: 'Theft', tag: 'THEFT', img: '/images/theme-theft.jpg', icon: Fingerprint, color: 'violet' },
  { id: 'CORPORATE', name: 'Corporate', tag: 'CORPORATE', img: '/images/theme-corporate.jpg', icon: Shield, color: 'green' },
  { id: 'SUPERNATURAL', name: 'Fantasy', tag: 'FANTASY', img: '/images/theme-fantasy.jpg', icon: Sparkles, color: 'amber' },
];

const demo = {
  id: 'case-047',
  title: 'The Last Broadcast',
  category: 'CRIME',
  difficulty: 'HARD',
  tone: 'Noir Suspense',
  briefing: {
    location: 'Wavelength Radio, Lower Manhattan',
    timeOfIncident: '11:42 PM · October 14',
    summary: 'A late-night host vanished mid-broadcast. The studio was locked from the inside, the tape kept rolling, and one voice on the recording does not belong.',
    timeline: [
      { time: '10:18 PM', event: 'Mara Voss enters the building alone' },
      { time: '11:06 PM', event: 'Final broadcast begins; no guests logged' },
      { time: '11:42 PM', event: 'Transmission cuts out mid-sentence' },
      { time: '12:17 AM', event: 'Security finds the studio empty, door locked' }
    ]
  },
  suspects: [
    { id: 's1', name: 'Elias Ward', role: 'Station manager', alibi: 'Claims he left at 10:30 PM. Badge records say otherwise.', motive: 'The station was hours from being sold—and he knew it.', avatarUrl: '' },
    { id: 's2', name: 'Nina Cole', role: 'Sound engineer', alibi: 'Working in the control booth. The feed says she was there.', motive: 'Mara had been asking questions about the missing reel.', avatarUrl: '' },
    { id: 's3', name: 'Jonah Price', role: 'Former co-host', alibi: 'A cab receipt places him three blocks away at midnight.', motive: 'He was cut from the show six weeks ago.', avatarUrl: '' },
  ],
  evidence: [
    { id: 'e1', type: 'CHAT', title: 'Encrypted messages', content: 'MARA: The reel from 1987. You said it was destroyed.\nELIAS: It was. Forget you heard anything.\nMARA: Then why is it in the archive?\nELIAS: Don\'t go in there tonight.', isClue: true },
    { id: 'e2', type: 'IMAGE_CCTV', title: 'Corridor camera · 11:38 PM', content: 'A figure enters the east corridor carrying a reel-to-reel case. Face obscured by the camera blind spot.', isClue: true },
    { id: 'e3', type: 'AUDIO', title: 'Recovered broadcast fragment', content: 'Three seconds of room tone, followed by a second voice beneath the static: "You kept the original."', isClue: true },
    { id: 'e4', type: 'DOCUMENT', title: 'Studio access report', content: 'The booth door was opened with a master key at 11:51 PM. Only two master keys are unaccounted for.', isClue: true },
    { id: 'e5', type: 'DOCUMENT', title: 'Forensic audio analysis', content: 'A second vocal signature is present in the final 14 seconds. Likely recorded from inside the studio.', isClue: false },
  ],
  culpritId: 's1'
};

function readCases() {
  try {
    return JSON.parse(localStorage.getItem('mystery-cases') || '[]');
  } catch {
    return [];
  }
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('mystery-theme') || 'dark');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('mystery-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className="app-shell">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateCase />} />
          <Route path="/investigation/:caseId" element={<Investigation />} />
          <Route path="/evidence/:caseId" element={<EvidenceRoom />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}

function Header() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="ref-topbar">
      <Link to="/" className="ref-brand" title="AI Mystery Room / ShadowCase">
        <span className="ref-brand-icon">
          <img src="/logo.png" alt="AI Mystery Room Logo" className="ref-logo-img" />
        </span>
        <span className="ref-brand-title">AI Mystery Room</span>
      </Link>

      <button
        className="ref-mobile-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation"
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <nav className={`ref-nav-pills ${mobileMenuOpen ? 'open' : ''}`}>
        <NavLink to="/" end className={({ isActive }) => `ref-nav-item ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
          Home
        </NavLink>
        <a href="#how-it-works" className="ref-nav-item" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>
          How It Works
        </a>
        <a href="#features" className="ref-nav-item" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>
          Features
        </a>
        <a href="#about" className="ref-nav-item" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
          About
        </a>
      </nav>

      <div className="ref-top-right">
        <div className="ref-theme-pill">
          <button
            className="ref-theme-btn"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle Light / Dark mode"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            className="ref-theme-btn"
            onClick={() => window.location.reload()}
            title="Refresh Room"
            aria-label="Refresh Room"
          >
            <RefreshCw size={13} />
          </button>
        </div>

        <Link to="/create" className="ref-btn-get-started">
          Get Started
        </Link>
      </div>
    </header>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioTime, setAudioTime] = useState('0:32');

  const toggleAudio = () => {
    setAudioPlaying(!audioPlaying);
  };

  return (
    <main className="ref-dashboard">
      {/* 1. HERO SECTION */}
      <section className="ref-hero-grid">
        <div className="ref-hero-left">
          <div className="ref-hero-kicker">
            <span>THINK</span>
            <span className="dot">•</span>
            <span>INVESTIGATE</span>
            <span className="dot">•</span>
            <span>SOLVE</span>
          </div>

          <h1 className="ref-hero-heading">
            TURN YOUR STORY INTO A
            <span className="ref-glow-brush-mystery">MYSTERY</span>
          </h1>

          <p className="ref-hero-desc">
            Share a short scenario, and let AI create a thrilling mystery challenge with clues, suspects and hidden truths. Can you find the real culprit?
          </p>

          <Link to="/create" className="ref-btn-create-mystery">
            <span className="ref-fingerprint-box">
              <Fingerprint size={24} />
            </span>
            <span className="ref-btn-text">Create Your Mystery</span>
            <ArrowRight size={20} className="ref-btn-arrow" />
          </Link>
        </div>

        <div className="ref-hero-right">
          <div className="ref-desk-container">
            {/* Background Detective Desk photo */}
            <img
              src="/images/hero-desk.jpg"
              alt="Detective investigation desk with cork board and lamp"
              className="ref-desk-bg"
            />
            <div className="ref-desk-overlay" />

            {/* Cork board text badge */}
            <div className="ref-cork-badge">
              <span>WHO DID IT?</span>
            </div>

            {/* Floating Smartphone Mockup */}
            <div className="ref-phone-mockup">
              <div className="ref-phone-notch" />
              <div className="ref-phone-header">
                <div className="ref-phone-avatar">
                  <UserRound size={14} />
                </div>
                <div className="ref-phone-contact">
                  <strong>Unknown</strong>
                  <small>online</small>
                </div>
              </div>
              <div className="ref-phone-chat">
                <div className="ref-chat-msg incoming">
                  <p>Are you coming tonight?</p>
                  <span>11:14 PM</span>
                </div>
                <div className="ref-chat-msg outgoing">
                  <p>Yes... but don't tell anyone about the meeting...</p>
                  <span>11:15 PM</span>
                </div>
                <div className="ref-chat-msg incoming">
                  <p>I'll be there.</p>
                  <span>11:18 PM</span>
                </div>
              </div>
            </div>

            {/* Polaroid evidence snapshot */}
            <div className="ref-polaroid-cctv">
              <div className="ref-polaroid-inner">
                <img src="/images/theme-missing.jpg" alt="Evidence snapshot" />
                <div className="ref-cctv-code">CAM 03 21:42:17</div>
              </div>
            </div>

            {/* Handwritten cursive mystery quote */}
            <div className="ref-cursive-quote">
              <span>Every clue</span>
              <span>has a story...</span>
              <span className="ref-cursive-highlight">Can you connect them?</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS & REALISTIC EVIDENCE SECTION */}
      <section className="ref-mid-row" id="how-it-works">
        {/* Left: How It Works */}
        <div className="ref-how-it-works-panel">
          <div className="ref-section-header">
            <h2 className="ref-section-title">
              <span className="ref-accent-line">How</span> It Works
            </h2>
            <p className="ref-section-sub">A simple process. A mind-bending mystery.</p>
          </div>

          <div className="ref-steps-chain">
            <div className="ref-step-node">
              <div className="ref-step-circle">
                <FileText size={20} />
              </div>
              <h4>1. Share Your Scenario</h4>
              <p>Give a short story or scenario (e.g. a missing item, a crime, etc.).</p>
            </div>

            <div className="ref-step-arrow">
              <ArrowRight size={18} />
            </div>

            <div className="ref-step-node">
              <div className="ref-step-circle">
                <Cpu size={20} />
              </div>
              <h4>2. AI Builds the Mystery</h4>
              <p>Our AI creates a fictional investigation with suspects, clues and evidence.</p>
            </div>

            <div className="ref-step-arrow">
              <ArrowRight size={18} />
            </div>

            <div className="ref-step-node">
              <div className="ref-step-circle">
                <Search size={20} />
              </div>
              <h4>3. Explore the Evidence</h4>
              <p>Check messages, images, CCTV, audio and more (all AI-generated).</p>
            </div>

            <div className="ref-step-arrow">
              <ArrowRight size={18} />
            </div>

            <div className="ref-step-node">
              <div className="ref-step-circle">
                <UserCheck size={20} />
              </div>
              <h4>4. Find the Culprit</h4>
              <p>Analyze the clues, compare suspects and select the right person.</p>
            </div>
          </div>
        </div>

        {/* Right: Realistic Evidence. 100% AI Generated. */}
        <div className="ref-evidence-showcase-panel" id="features">
          <h3 className="ref-evidence-title">Realistic Evidence. 100% AI Generated.</h3>

          <div className="ref-evidence-grid">
            {/* Item 1: WhatsApp Messages */}
            <div className="ref-evi-card ref-evi-whatsapp" onClick={() => navigate('/investigation/case-047')}>
              <div className="ref-mini-chat-bubble incoming">
                <span className="ref-bubble-meta">Meet me at 8?</span>
              </div>
              <div className="ref-mini-chat-bubble outgoing">
                <span>I can't. Someone is watching me</span>
              </div>
              <div className="ref-mini-chat-bubble incoming">
                <span>It's done.</span>
              </div>
              <div className="ref-evi-footer">
                <span className="ref-evi-tag green"><MessageSquare size={13} /> WhatsApp Messages</span>
              </div>
            </div>

            {/* Item 2: Images */}
            <div className="ref-evi-card ref-evi-photo" onClick={() => navigate('/investigation/case-047')}>
              <div className="ref-evi-thumb-box">
                <img src="/images/theme-missing.jpg" alt="Misty Forest Evidence" />
              </div>
              <div className="ref-evi-footer">
                <span className="ref-evi-tag purple"><ImageIcon size={13} /> Images</span>
              </div>
            </div>

            {/* Item 3: CCTV Recordings */}
            <div className="ref-evi-card ref-evi-cctv" onClick={() => navigate('/investigation/case-047')}>
              <div className="ref-evi-thumb-box cctv-box">
                <img src="/images/hero-desk.jpg" alt="CCTV Camera" />
                <div className="ref-cctv-scanline" />
                <div className="ref-cctv-stamp">CAM 01 22:17:29</div>
              </div>
              <div className="ref-evi-footer">
                <span className="ref-evi-tag blue"><Video size={13} /> CCTV Recordings</span>
              </div>
            </div>

            {/* Item 4: Audio Recordings */}
            <div className="ref-evi-card ref-evi-audio">
              <div className="ref-audio-box">
                <button
                  className="ref-audio-play-btn"
                  onClick={toggleAudio}
                  aria-label={audioPlaying ? 'Pause audio' : 'Play audio'}
                >
                  {audioPlaying ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: 2 }} />}
                </button>
                <div className="ref-wave-bars">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <span
                      key={i}
                      className={audioPlaying ? 'wave-bar active' : 'wave-bar'}
                      style={{
                        height: `${6 + ((i * 13 + 7) % 22)}px`,
                        animationDelay: `${(i % 5) * 0.15}s`
                      }}
                    />
                  ))}
                </div>
                <span className="ref-audio-time">{audioTime}</span>
              </div>
              <div className="ref-evi-footer">
                <span className="ref-evi-tag magenta"><Mic size={13} /> Audio Recordings</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BOTTOM ROW: THEMES, TECH STACK, & QUOTE */}
      <section className="ref-bottom-row" id="about">
        {/* Left Box: Choose Your Theme */}
        <div className="ref-themes-panel">
          <div className="ref-panel-header">
            <h3>Choose Your Theme</h3>
            <p>From crime to mystery, every story is different.</p>
          </div>

          <div className="ref-themes-cards-strip">
            {themesCatalog.map((t) => (
              <div
                key={t.id}
                className="ref-theme-card"
                onClick={() => navigate('/create', { state: { category: t.id } })}
                title={`Start a ${t.name} mystery`}
              >
                <div className="ref-theme-img-wrap">
                  <img src={t.img} alt={t.name} />
                  <div className="ref-theme-overlay" />
                  <span className="ref-theme-badge">
                    <t.icon size={11} /> {t.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Box: Tech Stack */}
        <div className="ref-tech-panel">
          <div className="ref-panel-header">
            <h3>Tech Stack</h3>
          </div>

          <div className="ref-tech-badges">
            <div className="ref-tech-item">
              <span className="ref-tech-icon mongo">🍃</span>
              <span className="ref-tech-name">MongoDB</span>
            </div>
            <div className="ref-tech-item">
              <span className="ref-tech-icon express">E</span>
              <span className="ref-tech-name">Express.js</span>
            </div>
            <div className="ref-tech-item">
              <span className="ref-tech-icon react">⚛</span>
              <span className="ref-tech-name">React.js</span>
            </div>
            <div className="ref-tech-item">
              <span className="ref-tech-icon node">⬡</span>
              <span className="ref-tech-name">Node.js</span>
            </div>
          </div>

          <div className="ref-ai-badge">
            <span className="ref-ai-label">AI</span>
            <div className="ref-ai-details">
              <div className="ref-ai-brand">
                <Sparkles size={14} className="ref-ai-sparkle" />
                <strong>ChatGPT & Gemini AI</strong>
              </div>
              <small>Powering the investigation</small>
            </div>
          </div>
        </div>

        {/* Right Box: Handwritten Quote */}
        <div className="ref-quote-panel">
          <div className="ref-quote-inner">
            <p className="ref-quote-text">
              "Not just a game...<br />
              it's a thinking<br />
              journey."
            </p>
            <div className="ref-quote-underline" />
          </div>
        </div>
      </section>
    </main>
  );
}

function Footer() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <footer className="ref-footer">
      <div className="ref-footer-left">
        <span className="ref-footer-logo">
          <img src="/logo.png" alt="ShadowCase Logo" />
        </span>
        <span className="ref-footer-brand">AI Mystery Room</span>
      </div>

      <div className="ref-footer-center">
        <span>Create</span>
        <span className="dot">•</span>
        <span>Investigate</span>
        <span className="dot">•</span>
        <span>Solve</span>
      </div>

      <div className="ref-footer-right">
        <label className="ref-theme-toggle-switch" title="Toggle Dark / Light Mode">
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
          <span className="ref-toggle-slider" />
          <span className="ref-toggle-label">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
        </label>
        <span className="ref-footer-divider">|</span>
        <span className="ref-truth-quote">Uncover the truth... 🔍</span>
        <span className="ref-footer-divider">|</span>
        <span className="ref-creator-credit">Created by <strong>Charu</strong></span>
      </div>
    </footer>
  );
}

function CreateCase() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    scenario: '',
    category: 'CRIME',
    difficulty: 'MEDIUM',
    suspects: 4,
    tone: 'Noir Suspense'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/cases/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (response.ok) {
        const data = await response.json();
        navigate(`/investigation/${data.caseId}`);
        return;
      }
      const body = await response.json().catch(() => ({}));
      if (response.status !== 404) {
        throw new Error(body.message || 'Could not generate the case.');
      }
    } catch (err) {
      if (err.name !== 'TypeError' && !err.message.includes('Failed to fetch')) {
        setError(err.message);
      }
    }
    const local = {
      ...demo,
      id: `case-${Date.now()}`,
      title: form.title || demo.title,
      category: form.category,
      difficulty: form.difficulty,
      tone: form.tone
    };
    const cases = readCases();
    cases.unshift(local);
    localStorage.setItem('mystery-cases', JSON.stringify(cases));
    navigate(`/investigation/${local.id}`);
    setLoading(false);
  }

  return (
    <main className="page create-page">
      <div className="breadcrumb">
        <Link to="/">DASHBOARD</Link>
        <ChevronRight size={13} />
        <span>NEW INVESTIGATION</span>
      </div>
      <div className="create-intro">
        <div className="eyebrow">
          <span className="eyebrow-line" /> CASE GENERATION TERMINAL
        </div>
        <h1>Give us a <span className="gradient-text">beginning.</span></h1>
        <p>A single detail can change everything. Set the scene and we'll build the rest.</p>
      </div>

      <form className="create-layout" onSubmit={submit}>
        <section className="form-panel">
          <div className="form-section">
            <div className="form-title">
              <span className="form-number">01</span>
              <div>
                <h2>The premise</h2>
                <p>Set the first scene. Leave room for the unexpected.</p>
              </div>
            </div>

            <label className="field-label">
              MYSTERY TITLE <span>OPTIONAL</span>
            </label>
            <input
              className="text-input"
              maxLength={80}
              placeholder="e.g. The Last Broadcast"
              value={form.title}
              onChange={e => set('title', e.target.value)}
            />
            <div className="field-foot">
              <span>A good title keeps them guessing.</span>
              <span>{form.title.length} / 80</span>
            </div>

            <label className="field-label scenario-label">
              SCENARIO DESCRIPTION <span className="required">REQUIRED</span>
            </label>
            <textarea
              className="text-input scenario-input"
              minLength={30}
              maxLength={2000}
              required
              placeholder="A radio host vanishes mid-broadcast. The studio door is locked from the inside, but the tape kept rolling..."
              value={form.scenario}
              onChange={e => set('scenario', e.target.value)}
            />
            <div className="field-foot">
              <span>Include a setting, a mystery, or an unexplained detail.</span>
              <span className={form.scenario.length < 30 && form.scenario.length > 0 ? 'count-warning' : ''}>
                {form.scenario.length} / 2,000 <small>· min 30</small>
              </span>
            </div>
          </div>

          <div className="form-divider" />

          <div className="form-section">
            <div className="form-title">
              <span className="form-number">02</span>
              <div>
                <h2>Shape the investigation</h2>
                <p>Choose the parameters. The details are ours to fill in.</p>
              </div>
            </div>

            <label className="field-label">CASE CATEGORY</label>
            <div className="pill-grid">
              {[
                ['CRIME', 'Crime'],
                ['MISSING_PERSON', 'Missing person'],
                ['THEFT', 'Theft'],
                ['CORPORATE', 'Corporate'],
                ['SUPERNATURAL', 'Supernatural']
              ].map(([v, l]) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => set('category', v)}
                  className={`choice-pill ${form.category === v ? 'chosen' : ''}`}
                >
                  {l}
                  {form.category === v && <Check size={12} />}
                </button>
              ))}
            </div>

            <div className="two-fields">
              <div>
                <label className="field-label">DIFFICULTY</label>
                <div className="difficulty-options">
                  {['EASY', 'MEDIUM', 'HARD'].map((v, i) => (
                    <button
                      type="button"
                      key={v}
                      onClick={() => set('difficulty', v)}
                      className={`difficulty-option ${form.difficulty === v ? 'chosen' : ''}`}
                    >
                      <span className={`difficulty-bars d${i + 1}`}>
                        <i /><i /><i />
                      </span>
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="field-label">
                  SUSPECT MATRIX <span>{form.suspects} PEOPLE</span>
                </label>
                <div className="slider-wrap">
                  <input
                    aria-label="Suspect count"
                    type="range"
                    min="3"
                    max="6"
                    value={form.suspects}
                    onChange={e => set('suspects', Number(e.target.value))}
                  />
                  <div>
                    <span>03</span>
                    <span>06</span>
                  </div>
                </div>
              </div>
            </div>

            <label className="field-label tone-label">ATMOSPHERIC TONE</label>
            <div className="tone-select">
              {['Noir Suspense', 'Dark Thriller', 'Cosmic Horror', 'Classic Whodunit'].map(t => (
                <button
                  type="button"
                  key={t}
                  onClick={() => set('tone', t)}
                  className={form.tone === t ? 'selected' : ''}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="terminal-sidebar">
          <div className="terminal-heading">
            <span className="terminal-led" /> SYNTHESIS PREVIEW <span>LIVE</span>
          </div>
          <div className="terminal-art">
            <div className="terminal-radar">
              <div /><div /><div />
              <span><Crosshair size={23} /></span>
            </div>
            <div className="radar-sweep" />
          </div>
          <div className="terminal-stats">
            <div>
              <span>CASE STRUCTURE</span>
              <b><i /> READY TO BUILD</b>
            </div>
            <div>
              <span>EST. EVIDENCE ITEMS</span>
              <b>08 – 14</b>
            </div>
            <div>
              <span>EST. INVESTIGATION</span>
              <b>15 – 25 MIN</b>
            </div>
            <div>
              <span>AI COHERENCE</span>
              <b className="cyan-text">98.6%</b>
            </div>
          </div>
          {error && <div className="form-error">{error}</div>}
          <button
            type="submit"
            disabled={loading || form.scenario.length < 30}
            className="button button-primary synth-button"
          >
            {loading ? (
              <><span className="spinner" /> Building your case</>
            ) : (
              <>Synthesize investigation <ArrowRight size={15} /></>
            )}
          </button>
          <div className="terminal-secure">
            <LockKeyhole size={12} /> YOUR PREMISE IS PRIVATE AND ENCRYPTED
          </div>
        </aside>
      </form>
    </main>
  );
}

function getCase(id) {
  return readCases().find(c => c.id === id) || demo;
}

function useCase(caseId) {
  const [current, setCurrent] = useState(() => getCase(caseId));
  useEffect(() => {
    let active = true;
    const cached = readCases().find(item => item.id === caseId);
    if (cached) setCurrent(cached);
    fetch(`/api/cases/${caseId}`)
      .then(response => response.ok ? response.json() : null)
      .then(record => {
        if (active && record) setCurrent(record);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [caseId]);
  return current;
}

function Investigation() {
  const { caseId } = useParams();
  const c = useCase(caseId);
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  return (
    <main className="page investigation-page">
      <div className="breadcrumb">
        <Link to="/">DASHBOARD</Link>
        <ChevronRight size={13} />
        <span>ACTIVE INVESTIGATION</span>
      </div>
      <div className="case-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" /> INVESTIGATION // {caseId.toUpperCase()}
          </div>
          <h1>{c.title}</h1>
          <p>{c.briefing.location} <span>·</span> {c.briefing.timeOfIncident}</p>
        </div>
        <span className="active-badge"><i /> ACTIVE CASE</span>
      </div>

      <div className="case-tags">
        <span>{c.category.replace('_', ' ')}</span>
        <span>{c.difficulty} DIFFICULTY</span>
        <span>{c.tone}</span>
      </div>

      <div className="briefing-grid">
        <section className="briefing-card">
          <div className="card-kicker">
            <span><FileText size={14} /> INCIDENT BRIEFING</span>
            <span>01 / BRIEF</span>
          </div>
          <h2>The incident</h2>
          <p>{c.briefing.summary}</p>
          <div className="briefing-location">
            <span><Target size={14} /> LOCATION</span>
            <b>{c.briefing.location}</b>
            <span><Clock3 size={14} /> TIME OF INCIDENT</span>
            <b>{c.briefing.timeOfIncident}</b>
          </div>
        </section>

        <section className="timeline-card">
          <div className="card-kicker">
            <span><Clock3 size={14} /> RECONSTRUCTED TIMELINE</span>
            <span>02 / TIMELINE</span>
          </div>
          <div className="timeline">
            {c.briefing.timeline.map((t, i) => (
              <div className="timeline-item" key={t.time}>
                <span className="timeline-time">{t.time}</span>
                <span className={`timeline-node ${i === c.briefing.timeline.length - 1 ? 'last' : ''}`} />
                <span className="timeline-event">{t.event}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="matrix-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow small"><span className="eyebrow-line" /> FIELD NOTES</div>
            <h2>Evidence matrix<span className="heading-period">.</span></h2>
          </div>
          <Link className="button button-secondary compact-button" to={`/evidence/${caseId}`}>
            Inspect evidence room <ArrowRight size={14} />
          </Link>
        </div>
        <div className="evidence-matrix">
          {[
            { name: 'Chat intercepts', count: 1, icon: <AudioLines /> },
            { name: 'CCTV feeds', count: 1, icon: <Video /> },
            { name: 'Audio wiretaps', count: 1, icon: <AudioLines /> },
            { name: 'Documents', count: 2, icon: <FileText /> },
            { name: 'Crime scene photos', count: 0, icon: <ImageIcon /> }
          ].map(x => (
            <div className="matrix-cell" key={x.name}>
              <span>{x.icon}</span>
              <div>
                <b>{String(x.count).padStart(2, '0')}</b>
                <small>{x.name}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="suspects-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow small"><span className="eyebrow-line" /> PERSONS OF INTEREST</div>
            <h2>Suspect matrix<span className="heading-period">.</span></h2>
          </div>
          <span className="section-index">{String(c.suspects.length).padStart(2, '0')} IDENTIFIED</span>
        </div>
        <div className="suspect-grid">
          {c.suspects.map((s, i) => (
            <article className="suspect-card" key={s.id}>
              <div className={`suspect-avatar suspect-${i + 1}`}>
                <UserRound size={31} />
                <span>0{i + 1}</span>
              </div>
              <div className="suspect-details">
                <div className="suspect-role">{s.role}</div>
                <h3>{s.name}</h3>
                <div className="suspect-fact">
                  <span>ALIBI</span>
                  <p>{s.alibi}</p>
                </div>
                <div className="suspect-fact">
                  <span>MOTIVE</span>
                  <p>{s.motive}</p>
                </div>
                <button className="dossier-button" onClick={() => setSelected(s)}>
                  Open dossier <ArrowRight size={13} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="investigation-actions">
        <span><LockKeyhole size={13} /> Keep your theory close until you're ready.</span>
        <button onClick={() => navigate(`/evidence/${caseId}`, { state: { accuse: true } })} className="button button-primary">
          Submit accusation <Target size={15} />
        </button>
      </div>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal dossier-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}><X /></button>
            <div className="eyebrow small">PERSON OF INTEREST // DOSSIER</div>
            <div className="dossier-heading">
              <span className="avatar-large"><UserRound /></span>
              <div>
                <h2>{selected.name}</h2>
                <p>{selected.role}</p>
              </div>
            </div>
            <div className="dossier-block">
              <span>ALIBI STATEMENT</span>
              <p>{selected.alibi}</p>
            </div>
            <div className="dossier-block">
              <span>POSSIBLE MOTIVE</span>
              <p>{selected.motive}</p>
            </div>
            <button className="button button-secondary full-button" onClick={() => setSelected(null)}>
              Return to case file
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function EvidenceRoom() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const c = useCase(caseId);
  const [tab, setTab] = useState('ALL');
  const [accuse, setAccuse] = useState(false);
  const [choice, setChoice] = useState('');
  const [result, setResult] = useState(null);
  const [playing, setPlaying] = useState('');

  const tabs = [
    ['ALL', 'All evidence'],
    ['CHAT', 'Chat intercepts'],
    ['IMAGE_CCTV', 'CCTV feeds'],
    ['AUDIO', 'Audio'],
    ['DOCUMENT', 'Documents']
  ];

  const evidence = c.evidence.filter(e => tab === 'ALL' || e.type === tab);

  async function submitAccusation() {
    try {
      const r = await fetch(`/api/cases/${caseId}/accuse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suspectId: choice })
      });
      if (r.ok) {
        const data = await r.json();
        setResult(data);
        return;
      }
    } catch {}
    const culprit = c.culpritId || demo.culpritId;
    setResult({
      status: choice === culprit ? 'SOLVED' : 'FAILED',
      solution: {
        culprit: c.suspects.find(s => s.id === culprit)?.name || demo.suspects[0].name,
        explanation: 'The recovered evidence places the culprit at the studio during the final broadcast. The access log and encrypted messages reveal who had both the key and a reason to silence Mara.'
      }
    });
  }

  return (
    <main className="page evidence-page">
      <div className="breadcrumb">
        <button onClick={() => navigate(`/investigation/${caseId}`)}>
          <ArrowLeft size={13} /> CASE BRIEFING
        </button>
        <ChevronRight size={13} />
        <span>EVIDENCE ROOM</span>
      </div>

      <div className="case-heading evidence-title">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" /> FORENSIC ARCHIVE // {caseId.toUpperCase()}
          </div>
          <h1>Evidence room<span className="heading-period">.</span></h1>
          <p>{c.title} <span>·</span> All evidence is case-linked and time-stamped.</p>
        </div>
        <button className="button button-primary" onClick={() => setAccuse(true)}>
          Make an accusation <Target size={15} />
        </button>
      </div>

      <div className="evidence-tabs">
        {tabs.map(([id, label]) => (
          <button className={tab === id ? 'active' : ''} key={id} onClick={() => setTab(id)}>
            {label}
            <span>{id === 'ALL' ? c.evidence.length : c.evidence.filter(e => e.type === id).length}</span>
          </button>
        ))}
      </div>

      <div className="evidence-list">
        {evidence.map((e, i) => (
          <article className="evidence-item" key={e.id}>
            <div className={`evidence-type-icon ${e.type.toLowerCase()}`}>
              {e.type === 'CHAT' ? <AudioLines /> : e.type === 'IMAGE_CCTV' ? <Video /> : e.type === 'AUDIO' ? <AudioLines /> : <FileText />}
            </div>
            <div className="evidence-item-main">
              <div className="evidence-item-meta">
                {e.type.replace('_', ' ')} <span>·</span> EVIDENCE {String(i + 1).padStart(2, '0')}
                {e.isClue && <span className="clue-tag"><BadgeCheck size={11} /> RELEVANT</span>}
              </div>
              <h3>{e.title}</h3>
              {e.type === 'AUDIO' ? (
                <>
                  <div className="audio-player">
                    <button onClick={() => setPlaying(playing === e.id ? '' : e.id)} aria-label={playing === e.id ? 'Pause' : 'Play'}>
                      {playing === e.id ? '❚❚' : '▶'}
                    </button>
                    <div className="waveform small-wave">
                      {Array.from({ length: 55 }, (_, j) => (
                        <i key={j} style={{ height: `${8 + (j * 13 % 23)}px` }} />
                      ))}
                    </div>
                    <span>00:14 / 00:38</span>
                  </div>
                  <p className="evidence-content">{e.content}</p>
                </>
              ) : (
                <p className={`evidence-content ${e.type === 'CHAT' ? 'preserve-lines' : ''}`}>{e.content}</p>
              )}
              {e.type === 'IMAGE_CCTV' && (
                <div className="cctv-evidence">
                  <div className="scan-lines" />
                  <div className="cctv-figure" />
                  <span>CAM 03 · EAST CORRIDOR · 23:38:42</span>
                </div>
              )}
            </div>
            <div className="evidence-item-side">
              <span>{e.type === 'CHAT' ? 'INTERCEPTED' : e.type === 'IMAGE_CCTV' ? 'VISUAL' : e.type === 'AUDIO' ? 'RECOVERED' : 'FILED'}</span>
              <small>CASE LINKED</small>
            </div>
          </article>
        ))}
      </div>

      <div className="evidence-bottom">
        <span><ShieldCheck size={14} /> Evidence integrity verified <span className="live-dot" /></span>
        <button onClick={() => navigate(`/investigation/${caseId}`)} className="text-button">
          <ArrowLeft size={14} /> BACK TO BRIEFING
        </button>
      </div>

      {accuse && (
        <div className="modal-backdrop" onClick={() => !result && setAccuse(false)}>
          <div className="modal accusation-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setAccuse(false); setResult(null); }}><X /></button>
            {result ? (
              <div className="resolution">
                <div className={`resolution-icon ${result.status.toLowerCase()}`}>
                  {result.status === 'SOLVED' ? <Check /> : <X />}
                </div>
                <div className={`eyebrow small ${result.status === 'SOLVED' ? 'cyan-text' : 'red-text'}`}>
                  CASE RESOLUTION // {result.status}
                </div>
                <h2>{result.status === 'SOLVED' ? 'The truth is out.' : 'The trail went cold.'}</h2>
                <p>The culprit was <strong>{result.solution?.culprit}</strong>. {result.solution?.explanation}</p>
                <button className="button button-primary full-button" onClick={() => { setAccuse(false); navigate('/'); }}>
                  Return to dashboard <ArrowRight size={15} />
                </button>
              </div>
            ) : (
              <>
                <div className="eyebrow small"><span className="eyebrow-line" /> FINAL ASSESSMENT</div>
                <h2>Who did it?</h2>
                <p className="modal-intro">Review your evidence. When you're certain, make the call.</p>
                <div className="accuse-options">
                  {c.suspects.map((s, i) => (
                    <button key={s.id} onClick={() => setChoice(s.id)} className={choice === s.id ? 'chosen' : ''}>
                      <span className={`accuse-avatar suspect-${i + 1}`}><UserRound size={17} /></span>
                      <span><b>{s.name}</b><small>{s.role}</small></span>
                      <span className="radio-check">{choice === s.id && <Check size={13} />}</span>
                    </button>
                  ))}
                </div>
                <button disabled={!choice} className="button button-primary full-button" onClick={submitAccusation}>
                  Confirm accusation <ArrowRight size={15} />
                </button>
                <div className="terminal-secure"><LockKeyhole size={12} /> THIS DECISION IS FINAL</div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
