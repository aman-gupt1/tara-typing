import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Users, Bot, Zap, Trophy, Copy, Check, ArrowRight, ShieldCheck, Sparkles, Volume2, Flag, Award, Compass, AlertCircle } from 'lucide-react';
import RaceTrack from '../components/racing/RaceTrack';
import { BOT_PROFILES, AIBotSimulator } from '../components/racing/AIBotRacer';
import { socketService } from '../services/socketService';
import { soundEngine } from '../utils/soundEngine';
import { toast } from 'react-toastify';

const PASSAGES = [
  "The quick brown fox jumps over the lazy dog while neon lights illuminate the cybernetic highway of the future.",
  "Great coders do not just write code; they craft scalable architectures and empower human ingenuity across the globe.",
  "Speed and precision are the twin pillars of masterful typing, turning thoughts into digital realities at light speed.",
  "In the quiet of the night, keys click like raindrops on a tin roof, composing algorithms that will reshape tomorrow."
];

const CAR_COLORS = ['#38bdf8', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#ef4444'];
const AVATARS = ['🏎️', '🚗', '⚡', '🚀', '🏍️', '🛸'];

export default function Race() {
  const [activeTab, setActiveTab] = useState('bot'); // 'bot' | 'multiplayer'
  const [selectedBot, setSelectedBot] = useState(BOT_PROFILES[1]); // Default Rabbit
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('tara_race_name') || 'CyberRacer');
  const [selectedAvatar, setSelectedAvatar] = useState('🏎️');
  const [selectedColor, setSelectedColor] = useState('#38bdf8');

  // Race Runtime State
  const [raceState, setRaceState] = useState('lobby'); // 'lobby' | 'countdown' | 'racing' | 'finished'
  const [countdown, setCountdown] = useState(5);
  const [passage, setPassage] = useState(PASSAGES[0]);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [playerWpm, setPlayerWpm] = useState(0);
  const [playerAccuracy, setPlayerAccuracy] = useState(100);
  const [podiumList, setPodiumList] = useState([]);
  const [botFinishedInfo, setBotFinishedInfo] = useState(null);

  // Multiplayer State
  const [roomData, setRoomData] = useState(null);
  const [joinCode, setJoinCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Racers List for RaceTrack
  const [racers, setRacers] = useState([]);

  const inputRef = useRef(null);
  const botSimulatorRef = useRef(null);

  // Initialize Socket listeners for multiplayer
  useEffect(() => {
    const socket = socketService.connect();

    socket.on('room_created', (data) => {
      setRoomData(data);
      setPassage(data.passage);
      setRacers(data.players);
      setErrorMessage('');
    });

    socket.on('room_joined', (data) => {
      setRoomData(data);
      setPassage(data.passage);
      setRacers(data.players);
      setErrorMessage('');
    });

    socket.on('room_updated', (data) => {
      setRoomData(data);
      setRacers(data.players);
    });

    socket.on('countdown_tick', ({ count }) => {
      setRaceState('countdown');
      setCountdown(count);
      soundEngine.playKeypress('mechanical');
    });

    socket.on('race_started', (data) => {
      setRoomData(data);
      setRaceState('racing');
      setStartTime(Date.now());
      setUserInput('');
      soundEngine.playVictory();
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    });

    socket.on('progress_broadcast', ({ playerId, progress, wpm, accuracy }) => {
      setRacers(prev =>
        prev.map(r => r.id === playerId ? { ...r, progress, wpm, accuracy } : r)
      );
    });

    socket.on('player_completed', ({ player, rank }) => {
      setRacers(prev =>
        prev.map(r => r.id === player.id ? { ...r, finished: true, finishRank: rank, wpm: player.wpm } : r)
      );
    });

    socket.on('race_ended', (data) => {
      setRoomData(data);
      setRaceState('finished');
      setPodiumList(data.players.filter(p => p.finished).sort((a, b) => (a.finishRank || 99) - (b.finishRank || 99)));
      soundEngine.playCompletion();
    });

    socket.on('error_message', ({ message }) => {
      setErrorMessage(message);
    });

    return () => {
      if (botSimulatorRef.current) {
        botSimulatorRef.current.stop();
      }
    };
  }, []);

  // Sync Player Name
  useEffect(() => {
    localStorage.setItem('tara_race_name', playerName);
  }, [playerName]);

  // Start Solo AI Race
  const startBotRace = () => {
    const randomPassage = PASSAGES[Math.floor(Math.random() * PASSAGES.length)];
    setPassage(randomPassage);
    setUserInput('');
    setPlayerWpm(0);
    setPlayerAccuracy(100);
    setErrorMessage('');
    setBotFinishedInfo(null);

    // Setup initial racers
    const playerRacer = {
      id: 'player',
      isCurrentUser: true,
      name: playerName || 'Player',
      avatar: selectedAvatar,
      carColor: selectedColor,
      progress: 0,
      wpm: 0,
      finished: false,
      finishRank: null
    };

    const botRacer = {
      id: selectedBot.id,
      isBot: true,
      name: selectedBot.name,
      avatar: selectedBot.avatar,
      carColor: selectedBot.carColor,
      progress: 0,
      wpm: 0,
      finished: false,
      finishRank: null
    };

    setRacers([playerRacer, botRacer]);
    setRaceState('countdown');
    setCountdown(5);

    let count = 5;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
        soundEngine.playKeypress('mechanical');
      } else {
        clearInterval(interval);
        setRaceState('racing');
        setStartTime(Date.now());
        soundEngine.playVictory();

        // Start Bot Simulator
        botSimulatorRef.current = new AIBotSimulator(
          selectedBot,
          randomPassage,
          (botUpdate) => {
            setRacers(prev =>
              prev.map(r => r.id === selectedBot.id ? { ...r, ...botUpdate } : r)
            );
          },
          (botFinish) => {
            const timeTakenSec = Math.max(1, Math.round((botFinish.timeTaken || 1000) / 1000));
            setBotFinishedInfo({
              name: selectedBot.name,
              avatar: selectedBot.avatar,
              wpm: botFinish.wpm,
              timeTaken: timeTakenSec,
            });
            toast.info(`⚡ ${selectedBot.name} finished in 1st Place (${botFinish.wpm} WPM)! Finish typing to see your breakdown!`, { autoClose: 4000 });

            setRacers(prev => {
              const player = prev.find(r => r.id === 'player');
              const botRank = player?.finished ? 2 : 1;
              return prev.map(r =>
                r.id === selectedBot.id
                  ? { ...r, finished: true, finishRank: botRank, wpm: botFinish.wpm }
                  : r
              );
            });
          }
        );

        botSimulatorRef.current.start(0);

        setTimeout(() => {
          if (inputRef.current) inputRef.current.focus();
        }, 50);
      }
    }, 1000);
  };

  // User Typing Handler
  const handleInputChange = (e) => {
    if (raceState !== 'racing') return;

    const value = e.target.value;
    setUserInput(value);
    soundEngine.playKeypress('mechanical');

    // Calculate current stats
    const progress = Math.min(100, Math.round((value.length / passage.length) * 100));
    const elapsedMinutes = Math.max(0.01, (Date.now() - startTime) / 60000);
    const wordsTyped = value.length / 5;
    const currentWpm = Math.round(wordsTyped / elapsedMinutes);

    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === passage[i]) correctChars++;
    }
    const currentAccuracy = value.length > 0 ? Math.round((correctChars / value.length) * 100) : 100;

    setPlayerWpm(currentWpm);
    setPlayerAccuracy(currentAccuracy);

    // Update local racers state
    setRacers(prev =>
      prev.map(r =>
        r.id === 'player' || r.id === socketService.getSocket()?.id
          ? { ...r, progress, wpm: currentWpm, accuracy: currentAccuracy }
          : r
      )
    );

    // If multiplayer, emit progress to server
    if (activeTab === 'multiplayer' && roomData) {
      socketService.updateProgress({
        progress,
        wpm: currentWpm,
        accuracy: currentAccuracy
      });
    }

    // Check Finish
    if (value === passage) {
      if (activeTab === 'bot') {
        const bot = racers.find(r => r.id === selectedBot.id);
        const playerRank = bot?.finished ? 2 : 1;

        setRacers(prev =>
          prev.map(r =>
            r.id === 'player'
              ? { ...r, finished: true, finishRank: playerRank, wpm: currentWpm }
              : r
          )
        );

        setRaceState('finished');
        if (botSimulatorRef.current) botSimulatorRef.current.stop();
        soundEngine.playCompletion();
      } else {
        socketService.playerFinished({
          wpm: currentWpm,
          accuracy: currentAccuracy
        });
      }
    }
  };

  // Allow player to finish run early if bot already finished
  const handleFinishRun = () => {
    if (raceState !== 'racing') return;
    const bot = racers.find(r => r.id === selectedBot.id);
    const playerRank = bot?.finished ? 2 : 1;
    const finalWpm = Math.max(1, playerWpm || 0);

    setRacers(prev =>
      prev.map(r =>
        r.id === 'player'
          ? { ...r, finished: true, finishRank: playerRank, wpm: finalWpm, accuracy: playerAccuracy, progress: 100 }
          : r
      )
    );

    setRaceState('finished');
    if (botSimulatorRef.current) botSimulatorRef.current.stop();
    soundEngine.playCompletion();
  };

  // Multiplayer Actions
  const handleCreateRoom = () => {
    socketService.createRoom({
      playerName,
      avatar: selectedAvatar,
      carColor: selectedColor
    });
  };

  const handleJoinRoom = () => {
    if (!joinCode.trim()) return;
    socketService.joinRoom({
      roomId: joinCode.trim(),
      playerName,
      avatar: selectedAvatar,
      carColor: selectedColor
    });
  };

  const handleQuickMatch = () => {
    socketService.quickMatch({
      playerName,
      avatar: selectedAvatar,
      carColor: selectedColor
    });
  };

  const copyRoomCode = () => {
    if (roomData?.roomId) {
      navigator.clipboard.writeText(roomData.roomId);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏎️</span>
              <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500">
                TARA SPEEDWAY
              </h1>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              High-velocity multiplayer & AI ghost bot typing race arena
            </p>
          </div>

          {/* Mode Switcher Pills */}
          <div className="flex bg-muted/50 border border-border p-1 rounded-xl">
            <button
              onClick={() => {
                setActiveTab('bot');
                setRaceState('lobby');
                setRoomData(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'bot'
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Bot className="w-4 h-4" />
              vs AI Ghost Bot
            </button>
            <button
              onClick={() => {
                setActiveTab('multiplayer');
                setRaceState('lobby');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'multiplayer'
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="w-4 h-4" />
              Live Multiplayer
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded-xl">
            {errorMessage}
          </div>
        )}

        {/* LOBBY / SETUP SCREEN */}
        {raceState === 'lobby' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Customization Card */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-sm">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-500" />
                Racer Customization
              </h2>

              {/* Racer Name */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Racer Callsign</label>
                <input
                  type="text"
                  maxLength={16}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground font-medium focus:outline-none focus:border-primary"
                  placeholder="Enter racer name"
                />
              </div>

              {/* Avatar Picker */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Vehicle Icon</label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      onClick={() => setSelectedAvatar(av)}
                      className={`p-2 rounded-xl text-xl transition-all ${
                        selectedAvatar === av
                          ? 'bg-primary/20 border-2 border-primary scale-105 shadow-sm'
                          : 'bg-muted/40 border border-border hover:bg-accent'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Car Color Picker */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Neon Paint</label>
                <div className="flex gap-2">
                  {CAR_COLORS.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      style={{ backgroundColor: col }}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        selectedColor === col ? 'ring-2 ring-primary ring-offset-2 ring-offset-card scale-110' : 'opacity-80 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Middle/Right Col: Mode Specific Setup */}
            <div className="lg:col-span-2 space-y-6">
              {activeTab === 'bot' ? (
                /* AI Bot Difficulty Selector */
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
                  <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Bot className="w-4 h-4 text-purple-500" />
                    Select AI Opponent
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BOT_PROFILES.map((bot) => (
                      <button
                        key={bot.id}
                        onClick={() => setSelectedBot(bot)}
                        className={`text-left p-4 rounded-xl border transition-all ${
                          selectedBot.id === bot.id
                            ? 'bg-purple-500/10 border-purple-500 shadow-md shadow-purple-500/10'
                            : 'bg-muted/30 border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{bot.avatar}</span>
                            <span className="font-bold text-foreground">{bot.name}</span>
                          </div>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-muted text-purple-600 dark:text-purple-300">
                            {bot.isAdaptive ? 'Adaptive' : `${bot.targetWpm} WPM`}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{bot.description}</p>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={startBotRace}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-base shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] mt-4"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    START RACE VS {selectedBot.name.toUpperCase()}
                  </button>
                </div>
              ) : (
                /* Multiplayer Lobby Controls */
                <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
                  {!roomData ? (
                    <>
                      {/* Quick Match */}
                      <div className="bg-muted/30 border border-border rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-foreground text-base">Quick Matchmaking</h3>
                          <p className="text-xs text-muted-foreground">Instantly match with live online racers in an open grid</p>
                        </div>
                        <button
                          onClick={handleQuickMatch}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-md shadow-emerald-500/20 whitespace-nowrap"
                        >
                          Find Match ⚡
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Create Room */}
                        <div className="bg-muted/30 border border-border rounded-xl p-5 space-y-3">
                          <h3 className="font-bold text-foreground text-sm">Create Private Lobby</h3>
                          <p className="text-xs text-muted-foreground">Generate a custom PIN code to invite your friends</p>
                          <button
                            onClick={handleCreateRoom}
                            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-sm hover:bg-primary/90 transition-colors"
                          >
                            Create Room
                          </button>
                        </div>

                        {/* Join Room Code */}
                        <div className="bg-muted/30 border border-border rounded-xl p-5 space-y-3">
                          <h3 className="font-bold text-foreground text-sm">Join With Room PIN</h3>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={joinCode}
                              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                              placeholder="TAR-882"
                              className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-foreground uppercase font-mono font-bold focus:outline-none focus:border-primary text-sm"
                            />
                            <button
                              onClick={handleJoinRoom}
                              className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-sm"
                            >
                              Join
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* In Room Waiting Screen */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-muted/40 p-4 rounded-xl border border-border">
                        <div>
                          <span className="text-xs text-muted-foreground block">Room PIN Code</span>
                          <span className="text-xl font-black font-mono text-primary">{roomData.roomId}</span>
                        </div>
                        <button
                          onClick={copyRoomCode}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card hover:bg-accent text-xs font-semibold text-foreground border border-border shadow-sm"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedCode ? 'Copied!' : 'Copy Code'}
                        </button>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase text-muted-foreground">Players in Lobby ({roomData.players.length}/5)</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {roomData.players.map((p) => (
                            <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
                              <div className="flex items-center gap-2">
                                <span>{p.avatar}</span>
                                <span className="text-sm font-bold text-foreground">{p.name}</span>
                                {p.isHost && (
                                  <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-300 px-1.5 py-0.5 rounded font-bold">
                                    HOST
                                  </span>
                                )}
                              </div>
                              <span className={`text-xs font-semibold ${p.isReady ? 'text-emerald-500 font-bold' : 'text-muted-foreground'}`}>
                                {p.isReady ? 'Ready' : 'Waiting'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Host Start Button */}
                      {roomData.hostId === socketService.getSocket()?.id ? (
                        <button
                          onClick={() => socketService.startRace()}
                          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-black text-base shadow-lg shadow-emerald-500/20"
                        >
                          LAUNCH RACE NOW 🏁
                        </button>
                      ) : (
                        <div className="text-center py-3 text-sm text-muted-foreground font-medium">
                          Waiting for host to launch the race...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ACTIVE RACE TRACK & TYPING ARENA */}
        {(raceState === 'countdown' || raceState === 'racing' || raceState === 'finished') && (
          <div className="space-y-6">
            {/* Visual Animated Race Track */}
            <RaceTrack
              racers={racers}
              currentUserId={activeTab === 'bot' ? 'player' : socketService.getSocket()?.id}
            />

            {/* Countdown Overlay */}
            {raceState === 'countdown' && (
              <div className="text-center py-8 bg-card border border-border rounded-2xl animate-pulse shadow-md">
                <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-2">Race Starts In</span>
                <span className="text-6xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500">
                  {countdown}
                </span>
              </div>
            )}

            {/* Live Bot Finished Alert Banner */}
            {botFinishedInfo && raceState === 'racing' && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border-2 border-amber-500/40 text-foreground animate-pulse shadow-md">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{botFinishedInfo.avatar}</span>
                  <div>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-300 block">
                      🏆 1st Place: {botFinishedInfo.name} ({botFinishedInfo.wpm} WPM in {botFinishedInfo.timeTaken}s)
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Keep typing to claim 2nd place or click "Finish Run" for instant race feedback!
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleFinishRun}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm cursor-pointer whitespace-nowrap transition-transform hover:scale-105"
                >
                  Finish Run & See Telemetry 🏁
                </button>
              </div>
            )}

            {/* Active Passage Display & Typing Input */}
            {raceState === 'racing' && (
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
                {/* Passage Character Stream */}
                <div className="p-4 bg-muted/30 rounded-xl border border-border text-lg leading-relaxed font-mono select-none">
                  {passage.split('').map((char, index) => {
                    let color = 'text-muted-foreground/40';
                    if (index < userInput.length) {
                      color = userInput[index] === char ? 'text-emerald-500 font-semibold' : 'text-rose-500 bg-rose-500/10 rounded px-0.5';
                    } else if (index === userInput.length) {
                      color = 'text-muted-foreground/70 underline underline-offset-4 decoration-2 decoration-primary font-normal';
                    }
                    return (
                      <span key={index} className={color}>
                        {char}
                      </span>
                    );
                  })}
                </div>

                {/* Input Textarea */}
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  placeholder="Type the passage here to accelerate..."
                  className="w-full px-4 py-3 bg-background border-2 border-primary/70 focus:border-primary rounded-xl text-foreground font-mono text-base focus:outline-none shadow-sm"
                  autoFocus
                />

                {/* Live Typing Metrics */}
                <div className="flex items-center justify-between text-sm pt-2">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">
                      Speed: <span className="font-bold text-amber-500 dark:text-amber-400 font-mono text-base">{playerWpm} WPM</span>
                    </span>
                    <span className="text-muted-foreground">
                      Accuracy: <span className="font-bold text-primary font-mono text-base">{playerAccuracy}%</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-xs text-muted-foreground">
                      Progress: {Math.min(100, Math.round((userInput.length / passage.length) * 100))}%
                    </div>
                    {activeTab === 'bot' && (
                      <button
                        type="button"
                        onClick={handleFinishRun}
                        className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
                      >
                        End Race Early
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Post Race Feedback & Telemetry Podium Modal */}
            {raceState === 'finished' && (() => {
              const player = racers.find(r => r.id === 'player' || r.isCurrentUser);
              const bot = racers.find(r => r.isBot || r.id === selectedBot.id);
              const isPlayerWinner = player?.finishRank === 1;
              const speedDiff = Math.abs((player?.wpm || playerWpm) - (bot?.wpm || selectedBot.targetWpm));

              return (
                <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xl transition-all animate-in fade-in zoom-in-95 duration-200">
                  {/* Top Recap Header Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-muted/40 border border-border">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                        isPlayerWinner 
                          ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40' 
                          : 'bg-primary/20 text-primary border border-primary/40'
                      }`}>
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
                          {isPlayerWinner
                            ? `🏆 VICTORY! YOU WON 1ST PLACE!`
                            : `🏁 RACE FINISHED — ${selectedBot.name.toUpperCase()} WON 1ST!`}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {isPlayerWinner
                            ? `Phenomenal run! You outpaced ${selectedBot.name} by +${speedDiff} WPM.`
                            : `${selectedBot.name} crossed the line first at ${bot?.wpm || selectedBot.targetWpm} WPM.`}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shrink-0 self-start sm:self-auto">
                      ⚡ +{isPlayerWinner ? '50' : '30'} Race XP
                    </span>
                  </div>

                  {/* 50/50 Head-to-Head Telemetry Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {/* Player Card */}
                    <div className={`p-3 rounded-xl border transition-all ${
                      isPlayerWinner
                        ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                        : 'bg-muted/40 border-border'
                    }`}>
                      <div className="flex items-center justify-between pb-2 border-b border-border/60">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{selectedAvatar}</span>
                          <div>
                            <span className="text-xs font-bold text-foreground block">{playerName || 'You'}</span>
                            <span className="text-[10px] text-muted-foreground">Racer (YOU)</span>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                          isPlayerWinner 
                            ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/40' 
                            : 'bg-muted text-muted-foreground border-border'
                        }`}>
                          {player?.finishRank === 1 ? '🥇 1st Place' : '🥈 2nd Place'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 pt-2 text-center">
                        <div className="p-1.5 rounded-lg bg-background/60 border border-border/40">
                          <span className="text-[9px] uppercase font-bold text-muted-foreground block">Speed</span>
                          <span className="text-sm font-black font-mono text-primary">{playerWpm} WPM</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-background/60 border border-border/40">
                          <span className="text-[9px] uppercase font-bold text-muted-foreground block">Accuracy</span>
                          <span className="text-sm font-black font-mono text-emerald-500">{playerAccuracy}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Bot Card */}
                    <div className={`p-3 rounded-xl border transition-all ${
                      !isPlayerWinner
                        ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                        : 'bg-muted/40 border-border'
                    }`}>
                      <div className="flex items-center justify-between pb-2 border-b border-border/60">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{selectedBot.avatar}</span>
                          <div>
                            <span className="text-xs font-bold text-foreground block">{selectedBot.name}</span>
                            <span className="text-[10px] text-muted-foreground">AI Ghost Bot</span>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                          !isPlayerWinner 
                            ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/40' 
                            : 'bg-muted text-muted-foreground border-border'
                        }`}>
                          {bot?.finishRank === 1 ? '🥇 1st Place' : '🥈 2nd Place'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 pt-2 text-center">
                        <div className="p-1.5 rounded-lg bg-background/60 border border-border/40">
                          <span className="text-[9px] uppercase font-bold text-muted-foreground block">Speed</span>
                          <span className="text-sm font-black font-mono text-amber-500 dark:text-amber-400">{bot?.wpm || selectedBot.targetWpm} WPM</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-background/60 border border-border/40">
                          <span className="text-[9px] uppercase font-bold text-muted-foreground block">Difficulty</span>
                          <span className="text-[11px] font-bold text-muted-foreground block truncate">{selectedBot.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Coach Race Feedback Card */}
                  <div className="p-3 rounded-xl bg-muted/30 border border-border text-left space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary uppercase tracking-wider">
                      <Sparkles size={12} className="text-amber-400" />
                      <span>Race Coach Strategy & Feedback:</span>
                    </div>
                    <p className="text-[11px] text-foreground/90 leading-relaxed">
                      {isPlayerWinner
                        ? `🌟 Outstanding racing! Your cadence of ${playerWpm} WPM was razor-sharp with great flow against ${selectedBot.name}.`
                        : selectedBot.id === 'cheetah'
                        ? `🐆 Apex Cheetah is a Grandmaster bot (85+ WPM). Your ${playerWpm} WPM pace is solid! Focus on short burst sprints and >96% accuracy to overtake cheetah next round.`
                        : `💡 Coach Tip: You finished with ${playerWpm} WPM and ${playerAccuracy}% accuracy. Minimizing backspaces on long words will give you the winning edge!`}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => startBotRace()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white font-bold text-xs sm:text-sm shadow-md transition-transform hover:scale-105 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Rematch vs {selectedBot.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRaceState('lobby');
                        setUserInput('');
                        setBotFinishedInfo(null);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card text-foreground hover:bg-muted font-bold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      Choose Different Bot
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
