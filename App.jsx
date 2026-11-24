import React, { useState, useMemo } from 'react';
import {
  Compass, LayoutDashboard, Search, Sparkles, History,
  Bookmark, Kanban, Calendar, Award, BarChart3, Bot,
  User, Bell, Settings, Menu, X, ArrowUpRight,
  Clock, MapPin, GraduationCap, Briefcase, Code,
  CheckCircle, Target, Plus, Trash2, Filter, Zap,
  ChevronRight, ExternalLink, Star, TrendingUp
} from 'lucide-react';
import './App.css';

const INITIAL_OPPORTUNITIES = [
  {
    id: 1, title: 'Google Summer of Code',
    organization: 'Google', category: 'Internship',
    description: 'Contribute to open-source software projects with experienced mentors.',
    skills: ['Programming', 'Git', 'Open Source'],
    location: 'Remote', deadline: '2027-02-15',
    eligibility: 'Students and beginners',
    link: 'https://summerofcode.withgoogle.com/',
    type: 'Global'
  },
  {
    id: 2, title: 'ETHGlobal Hackathons',
    organization: 'ETHGlobal', category: 'Hackathon',
    description: 'Build innovative projects and collaborate with developers worldwide.',
    skills: ['Web Development', 'Blockchain', 'Teamwork'],
    location: 'Online', deadline: '2027-03-20',
    eligibility: 'Open to developers',
    link: 'https://ethglobal.com/',
    type: 'Global'
  },
  {
    id: 3, title: 'ACM Student Research Competition',
    organization: 'ACM', category: 'Competition',
    description: 'Showcase your research and technical innovation.',
    skills: ['Research', 'Presentation', 'Technology'],
    location: 'International', deadline: '2027-04-10',
    eligibility: 'Undergraduate students',
    link: 'https://www.acm.org/',
    type: 'Global'
  },
  {
    id: 4, title: 'Google Scholarship Programs',
    organization: 'Google', category: 'Scholarship',
    description: 'Explore educational opportunities and scholarships for students.',
    skills: ['Technology', 'Learning', 'Innovation'],
    location: 'Various', deadline: '2027-05-10',
    eligibility: 'Eligible students',
    link: 'https://buildyourfuture.withgoogle.com/',
    type: 'Global'
  },
  {
    id: 5, title: 'Linux Foundation Mentorship',
    organization: 'Linux Foundation', category: 'Internship',
    description: 'Gain practical experience by contributing to open-source projects.',
    skills: ['Linux', 'Programming', 'Open Source'],
    location: 'Remote', deadline: '2027-04-01',
    eligibility: 'Students and developers',
    link: 'https://mentorship.lfx.linuxfoundation.org/',
    type: 'Global'
  },
  {
    id: 6, title: 'Stanford Online Courses',
    organization: 'Stanford University', category: 'Course',
    description: 'Explore online learning opportunities in computer science and technology.',
    skills: ['Computer Science', 'AI', 'Programming'],
    location: 'Online', deadline: '2027-06-30',
    eligibility: 'Open to learners',
    link: 'https://online.stanford.edu/',
    type: 'Global'
  }
];

const CATEGORIES = [
  'All', 'Internship', 'Hackathon',
  'Scholarship', 'Competition', 'Course'
];

const initialProfile = {
  name: 'Student',
  course: 'Computer Science',
  year: 'First Year',
  interests: 'AI, Web Development, Programming',
  skills: 'Python, C++, HTML'
};

export default function App() {
  const [page, setPage] = useState('Dashboard');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [opportunities] = useState(INITIAL_OPPORTUNITIES);

  const [saved, setSaved] = useState(() =>
    JSON.parse(localStorage.getItem('or-saved') || '[]')
  );

  const [applications, setApplications] = useState(() =>
    JSON.parse(localStorage.getItem('or-applications') || '[]')
  );

  const [profile, setProfile] = useState(() =>
    JSON.parse(localStorage.getItem('or-profile') || 'null') || initialProfile
  );

  const [assistantInput, setAssistantInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your Opportunity Radar assistant. Ask me about internships, hackathons, scholarships or skills.'
    }
  ]);

  const [mobileMenu, setMobileMenu] = useState(false);

  const saveProfile = (updated) => {
    setProfile(updated);
    localStorage.setItem('or-profile', JSON.stringify(updated));
  };

  const toggleSave = (id) => {
    const updated = saved.includes(id)
      ? saved.filter(item => item !== id)
      : [...saved, id];

    setSaved(updated);
    localStorage.setItem('or-saved', JSON.stringify(updated));
  };

  const addApplication = (item) => {
    if (applications.some(a => a.id === item.id)) return;

    const updated = [
      ...applications,
      { ...item, status: 'Interested' }
    ];

    setApplications(updated);
    localStorage.setItem('or-applications', JSON.stringify(updated));
  };

  const updateStatus = (id, status) => {
    const updated = applications.map(item =>
      item.id === id ? { ...item, status } : item
    );

    setApplications(updated);
    localStorage.setItem('or-applications', JSON.stringify(updated));
  };

  const filtered = useMemo(() => {
    return opportunities.filter(item => {
      const matchesSearch =
        `${item.title} ${item.organization} ${item.skills.join(' ')}`
          .toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === 'All' || item.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [opportunities, search, category]);

  const sendMessage = () => {
    if (!assistantInput.trim()) return;

    const question = assistantInput.trim();

    setMessages(prev => [
      ...prev,
      { sender: 'user', text: question }
    ]);

    const q = question.toLowerCase();

    let answer = 'Explore the opportunities section to discover programs that match your interests. Check eligibility and deadlines on the official websites before applying.';

    if (q.includes('internship')) {
      answer = 'Start with beginner-friendly internships and open-source programs like Google Summer of Code and Linux Foundation Mentorship. Check their official eligibility requirements.';
    } else if (q.includes('hackathon')) {
      answer = 'Hackathons are great for teamwork and practical experience. Start by exploring ETHGlobal and other student innovation events.';
    } else if (q.includes('scholarship')) {
      answer = 'Explore scholarship opportunities based on your academic background, eligibility and interests. Always verify details on official websites.';
    } else if (q.includes('python') || q.includes('skill')) {
      answer = 'Start with Python fundamentals, problem solving, Git, HTML, CSS and JavaScript. Build small projects to demonstrate your skills.';
    } else if (q.includes('resume')) {
      answer = 'Create a simple resume with your education, technical skills, projects, achievements and contact information.';
    }

    setMessages(prev => [
      ...prev,
      { sender: 'bot', text: answer }
    ]);

    setAssistantInput('');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Explore', icon: Compass },
    { name: 'Saved', icon: Bookmark },
    { name: 'Application Tracker', icon: Kanban },
    { name: 'Skill Analysis', icon: BarChart3 },
    { name: 'AI Assistant', icon: Bot },
    { name: 'Profile', icon: User }
  ];

  const changePage = (name) => {
    setPage(name);
    setMobileMenu(false);
  };

  const stats = [
    { label: 'Total Opportunities', value: opportunities.length, icon: Target },
    { label: 'Saved Opportunities', value: saved.length, icon: Bookmark },
    { label: 'Applications', value: applications.length, icon: Briefcase },
    { label: 'Completed', value: applications.filter(a => a.status === 'Completed').length, icon: Award }
  ];

  const OpportunityCard = ({ item }) => (
    <div className="opportunity-card">
      <div className="card-top">
        <span className="category-tag">{item.category}</span>
        <button className="icon-button" onClick={() => toggleSave(item.id)}>
          <Bookmark
            size={19}
            fill={saved.includes(item.id) ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <h3>{item.title}</h3>
      <p className="organization">{item.organization}</p>
      <p className="description">{item.description}</p>

      <div className="opportunity-meta">
        <span><MapPin size={14} /> {item.location}</span>
        <span><Clock size={14} /> {item.deadline}</span>
      </div>

      <div className="skill-tags">
        {item.skills.map(skill => (
          <span key={skill}>{skill}</span>
        ))}
      </div>

      <div className="card-actions">
        <button className="secondary-btn" onClick={() => addApplication(item)}>
          <Plus size={15} /> Track
        </button>
        <a href={item.link} target="_blank" rel="noreferrer" className="primary-btn">
          Official Website <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );

  return (
    <div className="app-container">

      {mobileMenu && (
        <div className="mobile-overlay" onClick={() => setMobileMenu(false)} />
      )}

      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-icon"><Compass size={25} /></div>
          <div>
            <h2>Opportunity</h2>
            <span>RADAR</span>
          </div>
          <button className="close-menu" onClick={() => setMobileMenu(false)}>
            <X />
          </button>
        </div>

        <p className="nav-label">WORKSPACE</p>

        <nav>
          {navItems.map(item => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${page === item.name ? 'active' : ''}`}
                onClick={() => changePage(item.name)}
              >
                <Icon size={19} />
                <span>{item.name}</span>
                {item.name === 'Saved' && saved.length > 0 &&
                  <small>{saved.length}</small>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-profile">
            <div className="avatar"><User size={20} /></div>
            <div>
              <strong>{profile.name}</strong>
              <small>{profile.year}</small>
            </div>
          </div>
          <p>Opportunity Radar © 2026</p>
        </div>
      </aside>

      <main className="main-content">

        <header className="topbar">
          <button className="menu-button" onClick={() => setMobileMenu(true)}>
            <Menu />
          </button>

          <div className="breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={15} />
            <strong>{page}</strong>
          </div>

          <div className="topbar-right">
            <button className="icon-button" onClick={() => changePage('Profile')}>
              <Settings size={19} />
            </button>
            <button className="icon-button" onClick={() => changePage('Saved')}>
              <Bell size={19} />
            </button>
            <div className="top-avatar">{profile.name.charAt(0).toUpperCase()}</div>
          </div>
        </header>

        <div className="page-content">

          {page === 'Dashboard' && (
            <>
              <section className="welcome-section">
                <div>
                  <span className="eyebrow"><Sparkles size={15} /> YOUR FUTURE STARTS HERE</span>
                  <h1>Welcome back, {profile.name}!</h1>
                  <p>Discover opportunities. Develop skills. Build your future.</p>
                </div>
                <button className="primary-btn" onClick={() => changePage('Explore')}>
                  Explore Opportunities <ArrowUpRight size={17} />
                </button>
              </section>

              <section className="stats-grid">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div className="stat-card" key={stat.label}>
                      <div className="stat-icon"><Icon size={21} /></div>
                      <p>{stat.label}</p>
                      <h2>{stat.value}</h2>
                    </div>
                  );
                })}
              </section>

              <section className="section-heading">
                <div>
                  <h2>Featured Opportunities</h2>
                  <p>Explore selected opportunities for students.</p>
                </div>
                <button className="text-btn" onClick={() => changePage('Explore')}>
                  View All <ChevronRight size={16} />
                </button>
              </section>

              <div className="opportunity-grid">
                {opportunities.slice(0, 3).map(item =>
                  <OpportunityCard key={item.id} item={item} />
                )}
              </div>

              <section className="quick-banner">
                <div className="banner-icon"><Zap size={25} /></div>
                <div>
                  <h3>Ready to discover your next opportunity?</h3>
                  <p>Explore programs that can help you grow professionally.</p>
                </div>
                <button className="secondary-btn" onClick={() => changePage('Explore')}>
                  Get Started <ArrowUpRight size={16} />
                </button>
              </section>
            </>
          )}

          {page === 'Explore' && (
            <>
              <div className="page-heading">
                <span className="eyebrow"><Compass size={15} /> DISCOVER</span>
                <h1>Explore Opportunities</h1>
                <p>Find internships, hackathons, scholarships and more.</p>
              </div>

              <div className="search-panel">
                <Search size={20} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search opportunities, organizations or skills..."
                />
                <Filter size={18} />
              </div>

              <div className="category-filters">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={category === cat ? 'filter-active' : ''}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <p className="result-count">{filtered.length} opportunities found</p>

              <div className="opportunity-grid">
                {filtered.map(item =>
                  <OpportunityCard key={item.id} item={item} />
                )}
              </div>

              {filtered.length === 0 &&
                <div className="empty-state">
                  <Search size={35} />
                  <h3>No opportunities found</h3>
                  <p>Try another search or category.</p>
                </div>
              }
            </>
          )}

          {page === 'Saved' && (
            <>
              <div className="page-heading">
                <span className="eyebrow"><Bookmark size={15} /> YOUR COLLECTION</span>
                <h1>Saved Opportunities</h1>
                <p>All your bookmarked opportunities in one place.</p>
              </div>

              <div className="opportunity-grid">
                {opportunities.filter(item => saved.includes(item.id)).map(item =>
                  <OpportunityCard key={item.id} item={item} />
                )}
              </div>

              {saved.length === 0 && (
                <div className="empty-state">
                  <Bookmark size={35} />
                  <h3>No saved opportunities yet</h3>
                  <p>Bookmark opportunities to find them here.</p>
                  <button className="primary-btn" onClick={() => changePage('Explore')}>
                    Explore Now
                  </button>
                </div>
              )}
            </>
          )}

          {page === 'Application Tracker' && (
            <>
              <div className="page-heading">
                <span className="eyebrow"><Kanban size={15} /> STAY ORGANIZED</span>
                <h1>Application Tracker</h1>
                <p>Monitor your opportunity application progress.</p>
              </div>

              <div className="tracker-summary">
                <div><strong>{applications.length}</strong><span>Total</span></div>
                <div><strong>{applications.filter(a => a.status === 'Interested').length}</strong><span>Interested</span></div>
                <div><strong>{applications.filter(a => a.status === 'Applied').length}</strong><span>Applied</span></div>
                <div><strong>{applications.filter(a => a.status === 'Completed').length}</strong><span>Completed</span></div>
              </div>

              <div className="tracker-list">
                {applications.map(item => (
                  <div className="tracker-item" key={item.id}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.organization} · {item.category}</p>
                    </div>
                    <select
                      value={item.status}
                      onChange={e => updateStatus(item.id, e.target.value)}
                    >
                      <option>Interested</option>
                      <option>Applied</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                    <button className="icon-button danger" onClick={() => {
                      const updated = applications.filter(a => a.id !== item.id);
                      setApplications(updated);
                      localStorage.setItem('or-applications', JSON.stringify(updated));
                    }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              {applications.length === 0 && (
                <div className="empty-state">
                  <Kanban size={35} />
                  <h3>Your tracker is empty</h3>
                  <p>Explore opportunities and click Track to add them.</p>
                  <button className="primary-btn" onClick={() => changePage('Explore')}>
                    Find Opportunities
                  </button>
                </div>
              )}
            </>
          )}

          {page === 'Skill Analysis' && (
            <>
              <div className="page-heading">
                <span className="eyebrow"><BarChart3 size={15} /> PERSONAL GROWTH</span>
                <h1>Skill Gap Analysis</h1>
                <p>Understand your skills and identify areas to improve.</p>
              </div>

              <div className="skill-layout">
                <div className="skill-card">
                  <div className="skill-card-icon"><GraduationCap size={25} /></div>
                  <h2>Your Current Skills</h2>
                  <p>Skills listed in your student profile.</p>
                  <div className="skill-tags">
                    {profile.skills.split(',').map(skill =>
                      <span key={skill}>{skill.trim()}</span>
                    )}
                  </div>
                </div>

                <div className="skill-card">
                  <div className="skill-card-icon"><Target size={25} /></div>
                  <h2>Recommended Skills</h2>
                  <p>Useful skills found across listed opportunities.</p>
                  <div className="skill-tags">
                    {['Python', 'Git', 'JavaScript', 'Research', 'Communication', 'Problem Solving'].map(skill =>
           