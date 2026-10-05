import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Wand2, Code2, BookOpen, Dice5, Lightbulb, Layers } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { toast } from 'react-toastify';

const CATEGORIES = [
  { id: 'all', label: 'All Topics', icon: '🌟' },
  { id: 'tech', label: 'Tech & AI', icon: '🤖' },
  { id: 'space', label: 'Sci-Fi & Space', icon: '🚀' },
  { id: 'history', label: 'History & Myths', icon: '🏛️' },
  { id: 'sports', label: 'Sports & Games', icon: '🏏' },
  { id: 'mindset', label: 'Mindset & Growth', icon: '🧠' },
  { id: 'nature', label: 'Nature & Science', icon: '🌿' },
  { id: 'culture', label: 'Cinema & Culture', icon: '🎬' },
];

const TOPIC_PRESETS = [
  // Tech & AI (4 items)
  { category: 'tech', label: 'Artificial Intelligence', prompt: 'How modern generative AI and neural networks are transforming daily human creativity and medicine.' },
  { category: 'tech', label: 'Quantum Computing', prompt: 'The breakthrough power of quantum qubits and superposition breaking conventional computing boundaries.' },
  { category: 'tech', label: 'Cybersecurity Wars', prompt: 'Zero-day exploits, encryption keys, and digital defenders safeguarding the global internet backbone.' },
  { category: 'tech', label: 'Robotics Revolution', prompt: 'Humanoid robots navigating real-world warehouses and assisting surgical teams in sterile operating rooms.' },

  // Space & Sci-Fi (4 items)
  { category: 'space', label: 'Life on Mars 2150', prompt: 'Colony life inside pressurized geodesic domes under the dusty crimson Martian sunset in the year 2150.' },
  { category: 'space', label: 'Deep Black Holes', prompt: 'The gravitational singularity of supermassive black holes warping spacetime and swallowing light itself.' },
  { category: 'space', label: 'Voyager Interstellar', prompt: 'The silent journey of Voyager 1 crossing the heliopause into the uncharted expanse of interstellar space.' },
  { category: 'space', label: 'Cyberpunk Metropolis', prompt: 'Flying vehicles soaring between neon skyscrapers in a rain-soaked futuristic city powered by fusion.' },

  // History & Legends (4 items)
  { category: 'history', label: 'Library of Alexandria', prompt: 'The great ancient library of Alexandria housing the lost wisdom of mathematics, philosophy, and stargazers.' },
  { category: 'history', label: 'Ancient Astronomy', prompt: 'Aryabhata and Vedic scholars accurately calculating planetary orbits and the concept of zero centuries ago.' },
  { category: 'history', label: 'Samurai Bushido', prompt: 'The strict code of honor, mindfulness, and master swordsmanship practiced by feudal Japanese samurai.' },
  { category: 'history', label: 'Silk Road Caravans', prompt: 'Merchant caravans carrying silk, spices, and revolutionary inventions across deserts and mountain passes.' },

  // Sports & Gaming (4 items)
  { category: 'sports', label: 'Cricket World Cup', prompt: 'The electrifying final over of a Cricket World Cup with a packed roaring stadium on the edge of their seats.' },
  { category: 'sports', label: 'Formula 1 Monaco GP', prompt: 'Precision apex cornering, tire degradation strategies, and 350 km/h straights at the legendary Monaco Grand Prix.' },
  { category: 'sports', label: 'Evolution of Gaming', prompt: 'The transformation of gaming from pixelated 8-bit arcade machines to photorealistic virtual reality worlds.' },
  { category: 'sports', label: 'Marathon Resilience', prompt: 'The mental grit, endurance, and pacing required to conquer the grueling final kilometers of a 42km marathon.' },

  // Mindset & Growth (4 items)
  { category: 'mindset', label: 'Flow State & Focus', prompt: 'Entering the elusive psychological state of flow where hours feel like minutes and performance peaks.' },
  { category: 'mindset', label: 'Atomic Habits', prompt: 'The compounding power of daily one percent micro-improvements creating massive transformations over time.' },
  { category: 'mindset', label: 'Stoic Resilience', prompt: 'Marcus Aurelius principles of focusing only on what is within your control and embracing challenges.' },
  { category: 'mindset', label: 'Neuroplasticity', prompt: 'The human brain remarkable ability to rewire neural connections and learn complex skills at any age.' },

  // Nature & Science (4 items)
  { category: 'nature', label: 'Bioluminescent Abyss', prompt: 'Glowing jellyfish and alien-like creatures illuminating the pitch-black depths of the Mariana Trench.' },
  { category: 'nature', label: 'Amazon Rainforest', prompt: 'The dense green canopy of the Amazon basin producing oxygen and sheltering millions of undiscovered species.' },
  { category: 'nature', label: 'Aurora Borealis', prompt: 'Solar winds colliding with Earth magnetosphere to paint undulating emerald and violet light curtains in the Arctic sky.' },
  { category: 'nature', label: 'Himalayan Peaks', prompt: 'Glacial winds howling across the towering snowy crests of Mount Everest under starry midnight skies.' },

  // Cinema & Culture (4 items)
  { category: 'culture', label: 'Sci-Fi Film Score', prompt: 'Synthesizers and orchestral strings swelling together in a cinematic space opera soundtrack.' },
  { category: 'culture', label: 'Epic Fantasy Quests', prompt: 'Ancient prophecies, hidden realm maps, and heroes embarking across misty mountain kingdoms.' },
  { category: 'culture', label: 'Renaissance Masters', prompt: 'Leonardo da Vinci and Michelangelo sketching anatomical secrets and painting world-famous frescoes.' },
  { category: 'culture', label: 'Tokyo Neon Nights', prompt: 'Steam rising from ramen stalls beneath vibrant Shibuya billboards and bustling bullet train platforms.' },
];

const QUICK_CODE_SNIPPETS = [
  { lang: 'javascript', label: 'JS Async Await', topic: 'fetch API with async await and try catch error handling' },
  { lang: 'javascript', label: 'JS Array Transform', topic: 'filter and map array data transformation pipelines' },
  { lang: 'react', label: 'React Custom Hook', topic: 'useLocalStorage custom React hook with state sync' },
  { lang: 'python', label: 'Python Binary Search', topic: 'binary search algorithm implementation with pointers' },
  { lang: 'python', label: 'Python Decorator', topic: 'execution timer decorator with functools wraps' },
  { lang: 'cpp', label: 'C++ Vector Sorting', topic: 'vector sorting with custom lambda comparator' },
  { lang: 'sql', label: 'SQL Aggregations', topic: 'GROUP BY with HAVING and window functions over scores' },
  { lang: 'html', label: 'Tailwind Flex Grid', topic: 'responsive CSS grid and flexbox layout with smooth hover' },
];

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'cpp', label: 'C++' },
  { id: 'react', label: 'React' },
  { id: 'html', label: 'HTML/CSS' },
  { id: 'sql', label: 'SQL' },
];

export default function AIPromptModal({ isOpen, onClose, onApplyText, initialTopic = '' }) {
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'code'
  const [topic, setTopic] = useState(initialTopic || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('medium');
  const [length, setLength] = useState('medium'); // 'short' (35), 'medium' (65), 'long' (100)
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Code tab states
  const [selectedLang, setSelectedLang] = useState('javascript');
  const [codeTopic, setCodeTopic] = useState('');

  const [loading, setLoading] = useState(false);

  const textInputRef = useRef(null);
  const codeInputRef = useRef(null);

  // Auto focus input when opened or tab changed
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (activeTab === 'text') {
          textInputRef.current?.focus();
        } else {
          codeInputRef.current?.focus();
        }
      }, 100);
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleRandomTopic = () => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 500);

    const pool = selectedCategory === 'all' 
      ? TOPIC_PRESETS 
      : TOPIC_PRESETS.filter(t => t.category === selectedCategory);

    const randomItem = pool[Math.floor(Math.random() * pool.length)] || TOPIC_PRESETS[Math.floor(Math.random() * TOPIC_PRESETS.length)];
    setTopic(randomItem.prompt);
    toast.info(`🎲 Surprise Topic: "${randomItem.label}"`, { autoClose: 2000 });
    textInputRef.current?.focus();
  };

  const handleExpandTopic = () => {
    if (!topic.trim()) {
      handleRandomTopic();
      return;
    }
    const trimmed = topic.trim();
    const expanded = `An engaging, informative, and descriptive narrative about ${trimmed}, highlighting key insights, exciting context, and a smooth typing rhythm.`;
    setTopic(expanded);
    toast.success('✨ Prompt crafted from your topic name!', { autoClose: 2000 });
    textInputRef.current?.focus();
  };

  const handleGenerateText = async () => {
    const finalTopic = topic.trim() || 'Modern Technology and Innovation';
    const wordCounts = { short: 35, medium: 65, long: 100 };
    
    setLoading(true);
    try {
      const res = await aiService.generateText({
        topic: finalTopic,
        difficulty,
        wordCount: wordCounts[length] || 65,
      });

      if (res?.data?.text || res?.text) {
        const generatedText = res?.data?.text || res?.text;
        toast.success(`✨ Generated typing passage: "${finalTopic.slice(0, 30)}${finalTopic.length > 30 ? '...' : ''}"`);
        onApplyText(generatedText, 'ai', { topic: finalTopic, difficulty });
        onClose();
      } else {
        toast.error('Could not generate text. Please try again.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI generation failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    const finalTopic = codeTopic.trim() || 'Clean functional utility algorithms';
    setLoading(true);
    try {
      const res = await aiService.generateCodeSnippet({
        language: selectedLang,
        topic: finalTopic,
      });

      if (res?.data?.code || res?.code) {
        const generatedCode = res?.data?.code || res?.code;
        toast.success(`⚡ Generated ${selectedLang.toUpperCase()} code drill!`);
        onApplyText(generatedCode, 'code', { language: selectedLang, topic: finalTopic });
        onClose();
      } else {
        toast.error('Could not generate code snippet. Please try again.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI code generation failed.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTopics = selectedCategory === 'all'
    ? TOPIC_PRESETS.slice(0, 6)
    : TOPIC_PRESETS.filter(t => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-border bg-card shadow-2xl text-foreground flex flex-col overflow-hidden transition-all max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Ambient Backlight Glow Effects */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-44 h-44 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 w-44 h-44 rounded-full bg-purple-500/20 blur-3xl" />

        {/* MODAL HEADER (Fixed / No Scroll) */}
        <div className="p-4 sm:p-5 pb-3 border-b border-border/80 bg-card z-10 shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-primary via-purple-600 to-indigo-600 text-white shadow-md shadow-primary/25 shrink-0">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div>
                <h2 className="font-display text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  AI Topic & Prompt Generator
                  <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[9px] font-bold text-primary tracking-wider uppercase">
                    Fast AI
                  </span>
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Type any custom topic name, expand prompts, or roll the Surprise Me dice!
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-xl border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              title="Close"
            >
              <X size={15} />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-muted/60 p-1 border border-border">
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'text'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen size={14} /> Topic & Story Generator
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Code2 size={14} /> Developer Code Drill
            </button>
          </div>
        </div>

        {/* MODAL BODY (Scrollable with smooth stylish-scrollbar) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 stylish-scrollbar min-h-0">
          {/* TAB 1: TEXT PASSAGE */}
          {activeTab === 'text' && (
            <div className="flex flex-col gap-3.5">
              {/* Topic Input Box with High-Visibility Surprise Me and Expand Buttons */}
              <div className="flex flex-col gap-2 p-3.5 rounded-2xl border border-border bg-muted/30 shadow-inner">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                    <span>Enter Your Topic Name or Custom Prompt:</span>
                  </label>

                  {/* HIGH-VISIBILITY SURPRISE ME & EXPAND BUTTONS */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRandomTopic}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-purple-500/20 border border-amber-500/50 text-amber-600 dark:text-amber-300 font-bold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer select-none"
                      title="Pick a random exciting topic prompt"
                    >
                      <Dice5 size={13} className={`text-amber-500 ${isSpinning ? 'animate-spin' : ''}`} />
                      <span>Surprise Me!</span>
                    </button>

                    {topic.trim() && (
                      <button
                        type="button"
                        onClick={handleExpandTopic}
                        className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl border border-primary/30 bg-primary/10 text-primary font-semibold text-xs hover:bg-primary/20 transition-all cursor-pointer"
                        title="Expand short topic name into a detailed prompt"
                      >
                        <Lightbulb size={12} />
                        <span>Expand Prompt</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Main Text Input */}
                <div className="relative">
                  <input
                    ref={textInputRef}
                    type="text"
                    value={topic}
                    autoFocus
                    onChange={(e) => setTopic(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === 'Enter' && !loading) {
                        e.preventDefault();
                        handleGenerateText();
                      }
                    }}
                    placeholder="Apna topic name likhein (e.g. Cricket World Cup, Chandrayaan 3, Cyberpunk, Mahabharat)..."
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    maxLength={300}
                  />
                  {topic && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTopic('');
                        textInputRef.current?.focus();
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 grid h-5 w-5 place-items-center rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
                      title="Clear topic"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-muted-foreground gap-1">
                  <span>💡 Tip: Type any topic and press <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[10px] text-foreground">Enter ↵</kbd></span>
                  {topic.length > 0 && <span className="font-mono text-[10px]">{topic.length}/300</span>}
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="flex flex-col gap-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Layers size={13} className="text-primary" /> 1. Select Category:
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Click to filter presets
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {CATEGORIES.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all cursor-pointer select-none text-center ${
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-bold ring-2 ring-primary/30'
                            : 'border border-border bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/80 hover:border-border'
                        }`}
                      >
                        <span className="text-xs">{cat.icon}</span>
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Topic Presets Header */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles size={12} className="text-amber-500" />
                    <span>2. Choose Topic Preset ({CATEGORIES.find(c => c.id === selectedCategory)?.label || 'All'}):</span>
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                    {selectedCategory === 'all' ? '6 Featured' : `${filteredTopics.length} Presets`}
                  </span>
                </div>

                {/* Topic Preset Cards - Balanced Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredTopics.map((item) => {
                    const isSelected = topic === item.prompt;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          setTopic(item.prompt);
                          textInputRef.current?.focus();
                          toast.info(`Selected: "${item.label}"`, { autoClose: 1500 });
                        }}
                        className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between group ${
                          isSelected
                            ? 'bg-primary/15 border-primary shadow-sm ring-1 ring-primary'
                            : 'border-border bg-muted/25 hover:bg-muted hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-xs font-bold truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                            {item.label}
                          </span>
                          {isSelected ? (
                            <span className="text-[9px] bg-primary text-primary-foreground font-black px-1.5 py-0.5 rounded-md shrink-0">
                              ✓ Selected
                            </span>
                          ) : (
                            <span className="text-[9px] text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              Use Topic →
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground line-clamp-1 mt-1">
                          {item.prompt}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Options: Difficulty & Length */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-border/80">
                {/* Difficulty */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Difficulty Level:</label>
                  <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted/60 p-1 border border-border">
                    {['easy', 'medium', 'hard'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDifficulty(d)}
                        className={`py-1 text-xs font-medium capitalize rounded-lg transition-all cursor-pointer ${
                          difficulty === d
                            ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Length */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Passage Length:</label>
                  <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted/60 p-1 border border-border">
                    {[
                      { id: 'short', label: 'Short (~35w)' },
                      { id: 'medium', label: 'Med (~65w)' },
                      { id: 'long', label: 'Long (~100w)' },
                    ].map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setLength(l.id)}
                        className={`py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                          length === l.id
                            ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CODE DRILL */}
          {activeTab === 'code' && (
            <div className="flex flex-col gap-3.5">
              {/* Language Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Select Programming Language:</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => {
                        setSelectedLang(lang.id);
                        codeInputRef.current?.focus();
                      }}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        selectedLang === lang.id
                          ? 'bg-purple-600 text-white font-bold shadow-sm shadow-purple-500/20 border-purple-500'
                          : 'bg-muted/40 border-border text-foreground hover:bg-muted'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Topic Input with Surprise Randomizer */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <label className="text-foreground">
                    Algorithm or Snippet Topic (Optional):
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const snippets = QUICK_CODE_SNIPPETS.filter(s => s.lang === selectedLang || selectedLang === 'javascript');
                      const pick = snippets[Math.floor(Math.random() * snippets.length)] || QUICK_CODE_SNIPPETS[0];
                      setSelectedLang(pick.lang);
                      setCodeTopic(pick.topic);
                      toast.info(`🎲 Code Topic: "${pick.label}"`, { autoClose: 2000 });
                    }}
                    className="flex items-center gap-1 text-[11px] font-semibold text-purple-500 dark:text-purple-400 hover:underline cursor-pointer"
                  >
                    <Dice5 size={13} /> Surprise Code Drill
                  </button>
                </div>

                <div className="relative">
                  <input
                    ref={codeInputRef}
                    type="text"
                    value={codeTopic}
                    onChange={(e) => setCodeTopic(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === 'Enter' && !loading) {
                        e.preventDefault();
                        handleGenerateCode();
                      }
                    }}
                    placeholder="e.g. Debounce utility, Binary Search tree, Fetch API..."
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    maxLength={150}
                  />
                  {codeTopic && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCodeTopic('');
                        codeInputRef.current?.focus();
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 grid h-5 w-5 place-items-center rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
                      title="Clear text"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Pick Code Chips */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground">Popular Code Patterns:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {QUICK_CODE_SNIPPETS.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setSelectedLang(item.lang);
                        setCodeTopic(item.topic);
                        codeInputRef.current?.focus();
                      }}
                      className={`flex items-center gap-1.5 rounded-xl border p-2 text-xs transition-all cursor-pointer select-none text-left ${
                        codeTopic === item.topic && selectedLang === item.lang
                          ? 'bg-purple-600/15 border-purple-500 text-purple-500 dark:text-purple-300 font-semibold'
                          : 'border-border bg-muted/40 hover:bg-muted text-foreground'
                      }`}
                    >
                      <Code2 size={12} className="text-purple-500 dark:text-purple-400 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER (Fixed / No Scroll) */}
        <div className="p-4 sm:p-5 pt-3 border-t border-border/80 bg-card/95 backdrop-blur z-10 shrink-0">
          {activeTab === 'text' ? (
            <button
              type="button"
              onClick={handleGenerateText}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-purple-600 to-indigo-600 hover:from-primary/90 hover:via-purple-700 hover:to-indigo-700 py-2.5 sm:py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Synthesizing Custom Passage...</span>
                </>
              ) : (
                <>
                  <Wand2 size={15} />
                  <span>Generate Typing Test</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGenerateCode}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 py-2.5 sm:py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Synthesizing Code Snippet...</span>
                </>
              ) : (
                <>
                  <Code2 size={15} />
                  <span>Generate Code Drill</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

