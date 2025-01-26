import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Castle, Sword, Scroll, Users, MessageCircle, Cog } from "lucide-react";

// Animation variants
const containerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4 } },
};

const childVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

// For dissolving list items in a fancy way
const listContainerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05,
    },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: -5,
    transition: {
      duration: 0.2,
    },
  },
};

export default function AIDMWizard() {
  // Steps
  const [step, setStep] = useState(1);

  // Global state
  const [serverUrl, setServerUrl] = useState('http://localhost:5000');
  const [campaignId, setCampaignId] = useState(null);
  const [worldId, setWorldId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [playerId, setPlayerId] = useState(null);

  const handleGoto = (target) => {
    setStep(target);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-fixed bg-cover bg-center p-10"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full max-w-[90vw] max-h-[90vh] overflow-auto rounded-2xl shadow-2xl shadow-yellow-700/50 border border-yellow-700 bg-[#3c2e2e]/70 text-white font-serif p-4"
        >
          <Card className="bg-transparent shadow-none">
            <CardHeader className="border-b border-yellow-700">
              <WizardHeader step={step} />
            </CardHeader>
            <CardContent className="p-4">
              {step === 1 && (
                <motion.div variants={childVariants}>
                  <ServerPage
                    serverUrl={serverUrl}
                    setServerUrl={setServerUrl}
                    onNext={() => handleGoto(2)}
                  />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div variants={childVariants}>
                  <CampaignPage
                    serverUrl={serverUrl}
                    setCampaignId={setCampaignId}
                    setWorldId={setWorldId}
                    onNext={() => handleGoto(3)}
                  />
                </motion.div>
              )}
              {step === 3 && (
                <motion.div variants={childVariants}>
                  <SessionPage
                    serverUrl={serverUrl}
                    campaignId={campaignId}
                    sessionId={sessionId}
                    setSessionId={setSessionId}
                    onNext={() => handleGoto(4)}
                  />
                </motion.div>
              )}
              {step === 4 && (
                <motion.div variants={childVariants}>
                  <PlayerPage
                    serverUrl={serverUrl}
                    campaignId={campaignId}
                    playerId={playerId}
                    setPlayerId={setPlayerId}
                    onNext={() => handleGoto(5)}
                  />
                </motion.div>
              )}
              {step === 5 && (
                <motion.div variants={childVariants}>
                  <ChatPage
                    serverUrl={serverUrl}
                    campaignId={campaignId}
                    worldId={worldId}
                    sessionId={sessionId}
                    playerId={playerId}
                  />
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function WizardHeader({ step }) {
  const steps = [
    { title: 'Server', Icon: Castle },
    { title: 'Campaign', Icon: Scroll },
    { title: 'Session', Icon: Sword },
    { title: 'Player', Icon: Users },
    { title: 'Chat', Icon: MessageCircle },
  ];

  return (
    <motion.div
      className="w-full flex flex-wrap items-center justify-around p-2"
      variants={childVariants}
    >
      {steps.map((obj, idx) => {
        const current = idx + 1 === step;
        const Icon = obj.Icon;
        return (
          <motion.div
            key={obj.title}
            variants={childVariants}
            className={`flex items-center gap-1 text-sm md:text-base px-3 py-2 rounded-lg transition-all duration-300 cursor-default m-1 ${
              current
                ? 'bg-yellow-300 text-black font-bold scale-105 border border-yellow-600 shadow-sm'
                : 'bg-transparent text-gray-300 hover:text-yellow-100'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>
              {obj.title}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function ServerPage({ serverUrl, setServerUrl, onNext }) {
  const [localUrl, setLocalUrl] = useState(serverUrl);

  const handleNextClick = () => {
    if (!localUrl.trim()) {
      alert('Server URL cannot be empty.');
      return;
    }
    setServerUrl(localUrl);
    onNext();
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold text-center mb-2 text-yellow-200 drop-shadow-lg">The Portal</h1>
      <p className="italic text-sm text-yellow-50">
        Enter the URL of your AI-DM realm to open the portal...
      </p>
      <label className="block mb-1 font-semibold">Portal Address:</label>
      <input
        type="text"
        className="w-full p-3 rounded text-black border border-yellow-300 bg-gradient-to-r from-yellow-50 to-white shadow-[0_0_10px_rgba(255,215,0,0.2)] hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] focus:shadow-[0_0_25px_5px_rgba(255,215,0,0.5)] focus:outline-none transition-all duration-300 animate-pulse focus:text-yellow-300 focus:[text-shadow:0_0_6px_rgba(255,215,0,0.8)] caret-yellow-300"
        value={localUrl}
        onChange={(e) => setLocalUrl(e.target.value)}
      />
      <div className="flex justify-center mt-2">
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2" onClick={handleNextClick}>
          Proceed
        </Button>
      </div>
    </div>
  );
}

// A generic popover-based item selector with dissolving animation
function FancySelector({ label, items, selectedValue, onSelect, onRefresh, newItemAction, newItemLabel, confirmLabel }) {
  // We track whether the popover is open ourselves
  const [open, setOpen] = useState(false);

  // Additional variants for popover dissolving effect
  const popoverVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      filter: "blur(10px)",
    },
    show: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      filter: "blur(10px)",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-yellow-100 font-semibold">{label}</p>
      <div className="flex gap-2 items-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              onClick={() => setOpen(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2"
            >
              {selectedValue || `-- Select --`}
            </Button>
          </PopoverTrigger>
          <AnimatePresence>
            {open && (
              <PopoverContent align="start" asChild>
                <motion.div
                  className="bg-[#3c2e2e]/90 border border-yellow-700 text-yellow-100 w-56 p-2 shadow-xl overflow-hidden"
                  variants={popoverVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <motion.div
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    variants={listContainerVariants}
                    className="flex flex-col gap-1"
                  >
                    {items.map((item) => (
                      <motion.button
                        key={item.key}
                        variants={listItemVariants}
                        onClick={() => {
                          onSelect(item);
                          setOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded hover:bg-yellow-600/50 transition-all"
                      >
                        {item.label}
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>
              </PopoverContent>
            )}
          </AnimatePresence>
        </Popover>
        {onRefresh && (
          <Button
            variant="default"
            onClick={onRefresh}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2"
          >
            Refresh
          </Button>
        )}
      </div>

      <div className="flex gap-2 justify-center">
        {newItemAction && (
          <Button className="bg-green-600 hover:bg-green-700 px-4 py-2" onClick={newItemAction}>
            {newItemLabel}
          </Button>
        )}
        {confirmLabel && (
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2"
            onClick={() => {
              if (!selectedValue) {
                alert('Please select an option first.');
                return;
              }
              confirmLabel();
            }}
          >
            Onward
          </Button>
        )}
      </div>
    </div>
  );
}

function CampaignPage({ serverUrl, setCampaignId, setWorldId, onNext }) {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");

  const loadCampaigns = async () => {
    try {
      const resp = await axios.get(`${serverUrl.replace(/\/$/, '')}/api/campaigns`);
      if (Array.isArray(resp.data)) {
        setCampaigns(resp.data);
      } else {
        setCampaigns([]);
      }
    } catch (error) {
      alert(`Failed to load campaigns:\n${error}`);
    }
  };

  React.useEffect(() => {
    loadCampaigns();
    // eslint-disable-next-line
  }, []);

  const handleCreateNew = async () => {
    const title = prompt('Enter campaign title:');
    if (!title) return;
    const description = prompt('Enter description:');
    const worldStr = prompt('Enter world ID (default=1):', '1');
    const worldID = parseInt(worldStr) || 1;

    try {
      const resp = await axios.post(`${serverUrl.replace(/\/$/, '')}/api/campaigns`, {
        title,
        description,
        world_id: worldID,
      });
      if (resp.data && resp.data.campaign_id) {
        alert(`Created Campaign ID=${resp.data.campaign_id}`);
        loadCampaigns();
      } else {
        alert('No campaign_id returned.');
      }
    } catch (error) {
      alert(`Failed to create campaign:\n${error}`);
    }
  };

  const handleConfirm = async () => {
    if (!selectedCampaign) {
      alert('Select or create a campaign first.');
      return;
    }
    const [cidStr] = selectedCampaign.split(':');
    if (!cidStr.trim().match(/^\d+$/)) {
      return;
    }
    const cid = parseInt(cidStr);
    setCampaignId(cid);

    try {
      const resp = await axios.get(`${serverUrl.replace(/\/$/, '')}/api/campaigns/${cid}`);
      setWorldId(resp.data.world_id || 1);
    } catch {
      setWorldId(1);
    }
    onNext();
  };

  // transform campaigns to items for FancySelector
  const campaignItems = campaigns.map((c) => ({
    key: c.campaign_id,
    label: `${c.campaign_id}: ${c.title}`,
  }));

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold text-center mb-2 text-yellow-200 drop-shadow-lg">The Kingdom</h1>
      <p className="italic text-sm text-yellow-50">
        Choose or create a campaign realm to begin your grand adventure...
      </p>
      <FancySelector
        label="Select or Create a Campaign:"
        items={campaignItems}
        selectedValue={selectedCampaign}
        onSelect={(item) => setSelectedCampaign(item.label)}
        onRefresh={loadCampaigns}
        newItemAction={handleCreateNew}
        newItemLabel="Found New Kingdom"
        confirmLabel={handleConfirm}
      />
    </div>
  );
}

function SessionPage({ serverUrl, campaignId, sessionId, setSessionId, onNext }) {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");

  const loadSessions = async () => {
    if (!campaignId) {
      alert('No campaign selected.');
      return;
    }
    try {
      const resp = await axios.get(`${serverUrl.replace(/\/$/, '')}/api/sessions/campaigns/${campaignId}/sessions`);
      if (Array.isArray(resp.data)) {
        setSessions(resp.data);
      } else {
        setSessions([]);
      }
    } catch (error) {
      alert(`Failed to load sessions:\n${error}`);
    }
  };

  React.useEffect(() => {
    loadSessions();
    // eslint-disable-next-line
  }, [campaignId]);

  const createSession = async () => {
    try {
      const resp = await axios.post(`${serverUrl.replace(/\/$/, '')}/api/sessions/start`, {
        campaign_id: campaignId,
      });
      if (resp.data && resp.data.session_id) {
        alert(`Created Session ID=${resp.data.session_id}`);
        loadSessions();
      } else {
        alert('No session_id returned.');
      }
    } catch (error) {
      alert(`Failed to create session:\n${error}`);
    }
  };

  const handleConfirm = () => {
    if (!selectedSession) {
      alert('Select or create a session first.');
      return;
    }
    const [sidStr] = selectedSession.split(' ', 1);
    if (!sidStr.trim().match(/^\d+$/)) {
      return;
    }
    const sid = parseInt(sidStr);
    setSessionId(sid);
    onNext();
  };

  const sessionItems = sessions.map((s) => ({
    key: `${s.session_id}`,
    label: `${s.session_id} (Created: ${s.created_at})`,
  }));

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold text-center mb-2 text-yellow-200 drop-shadow-lg">The Summoning</h1>
      <p className="italic text-sm text-yellow-50">
        Call forth a session to shape your party’s journey...
      </p>
      <FancySelector
        label="Select or Create a Session:"
        items={sessionItems}
        selectedValue={selectedSession}
        onSelect={(item) => setSelectedSession(item.label)}
        onRefresh={loadSessions}
        newItemAction={createSession}
        newItemLabel="New Summoning"
        confirmLabel={handleConfirm}
      />
    </div>
  );
}

function PlayerPage({ serverUrl, campaignId, playerId, setPlayerId, onNext }) {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');

  const loadPlayers = async () => {
    if (!campaignId) {
      alert('No campaign selected.');
      return;
    }
    try {
      const resp = await axios.get(`${serverUrl.replace(/\/$/, '')}/api/players/campaigns/${campaignId}/players`);
      if (Array.isArray(resp.data)) {
        setPlayers(resp.data);
      } else {
        setPlayers([]);
      }
    } catch (error) {
      alert(`Failed to load players:\n${error}`);
    }
  };

  React.useEffect(() => {
    loadPlayers();
    // eslint-disable-next-line
  }, [campaignId]);

  const createPlayer = async () => {
    const userName = prompt('Enter user name:');
    if (!userName) return;
    const characterName = prompt('Enter character name:');
    const race = prompt('Enter race:');
    const charClass = prompt('Enter class:');
    const levelStr = prompt('Enter level (default 1):', '1');

    const data = {
      name: userName,
      character_name: characterName || '',
      race: race || '',
      char_class: charClass || '',
      level: parseInt(levelStr) || 1,
    };

    try {
      const resp = await axios.post(`${serverUrl.replace(/\/$/, '')}/api/players/campaigns/${campaignId}/players`, data);
      if (resp.data && resp.data.player_id) {
        alert(`Player created (ID=${resp.data.player_id})`);
        loadPlayers();
      } else {
        alert('No player_id returned.');
      }
    } catch (error) {
      alert(`Failed to create player:\n${error}`);
    }
  };

  const handleConfirm = () => {
    if (!selectedPlayer) {
      alert('Select or create a player first.');
      return;
    }
    const [pidStr] = selectedPlayer.split(':', 1);
    if (!pidStr.trim().match(/^\d+$/)) {
      return;
    }
    const pid = parseInt(pidStr);
    setPlayerId(pid);
    onNext();
  };

  const playerItems = players.map((p) => ({
    key: p.player_id,
    label: `${p.player_id}: ${p.character_name} (${p.name})`,
  }));

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold text-center mb-2 text-yellow-200 drop-shadow-lg">The Champion</h1>
      <p className="italic text-sm text-yellow-50">
        Select or create your hero to join the quest...
      </p>
      <FancySelector
        label="Choose or Create a Player:"
        items={playerItems}
        selectedValue={selectedPlayer}
        onSelect={(item) => setSelectedPlayer(item.label)}
        onRefresh={loadPlayers}
        newItemAction={createPlayer}
        newItemLabel="New Hero"
        confirmLabel={handleConfirm}
      />
    </div>
  );
}

function ChatPage({ serverUrl, campaignId, worldId, sessionId, playerId }) {
  const [chatLog, setChatLog] = useState([]);
  const [message, setMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [rollResult, setRollResult] = useState(null);

  // New states for font size and family
  const [fontSize, setFontSize] = useState('text-sm');
  const [fontFamily, setFontFamily] = useState('font-serif');

  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  // We'll maintain partial lines for streaming
  const partialLineRef = useRef("");

  // For convenience, define some possible font sizes and families
  const fontSizes = ['text-xs','text-sm','text-base','text-lg','text-xl'];
  const fontFamilies = ['font-sans','font-serif','font-mono'];

  useEffect(() => {
    if (!socketRef.current) {
      try {
        socketRef.current = io(serverUrl, {
          transports: ["websocket"],
          path: "/socket.io",
        });

        socketRef.current.on('connect', () => {
          setConnected(true);
          addLog("Connected to the server via SocketIO.");
          if (sessionId) {
            socketRef.current.emit('join_session', { session_id: sessionId });
          }
        });

        socketRef.current.on('connect_error', (err) => {
          addLog(`Connection failed: ${err}`);
        });

        socketRef.current.on('disconnect', () => {
          setConnected(false);
          addLog("Disconnected from the server.");
        });

        // Handle DM response streaming more efficiently
        socketRef.current.on('dm_response_start', () => {
          setChatLog(prev => [...prev, { text: '\nDM: ', newline: false }]);
        });

        socketRef.current.on('dm_chunk', (data) => {
          const chunk = data?.chunk || '';
          setChatLog(prev => {
            const newLog = [...prev];
            const lastIdx = newLog.length - 1;
            if (lastIdx >= 0) {
              newLog[lastIdx] = {
                ...newLog[lastIdx],
                text: newLog[lastIdx].text + chunk
              };
            }
            return newLog;
          });
        });

        socketRef.current.on('dm_response_end', () => {
          setChatLog(prev => [...prev, { text: '\n', newline: true }]);
        });

        socketRef.current.on('new_message', (data) => {
          const msg = data.message || '';
          const speaker = data.speaker || '';
          if (speaker && msg) {
            addLog(`\n${speaker}: ${msg}\n`);
          } else {
            addLog(`\n${msg}\n`);
          }
        });
      } catch (err) {
        addLog(`Error connecting to SocketIO server:\n${err}`);
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [serverUrl]);

  const addLog = (text, newline = true) => {
    setChatLog(prevLog => {
      // If this is a streaming chunk (newline=false), merge it with the last message
      if (!newline && prevLog.length > 0) {
        const lastIndex = prevLog.length - 1;
        const updatedLastMessage = {
          ...prevLog[lastIndex],
          text: prevLog[lastIndex].text + text
        };
        return [...prevLog.slice(0, -1), updatedLastMessage];
      }
      // Otherwise add as new message
      return [...prevLog, { text, newline }];
    });
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog]);

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    setMessage('');

    let charName = "Unknown Player";
    try {
      const resp = await axios.get(`${serverUrl.replace(/\/$/, '')}/api/players/${playerId}`);
      charName = resp.data?.character_name || 'Unknown Player';
    } catch (err) {
      // ignore
    }

    addLog(`\n${charName}: ${trimmed}\n`);

    if (!connected) {
      addLog("Not connected to SocketIO server.");
      return;
    }

    socketRef.current.emit('send_message', {
      session_id: sessionId,
      campaign_id: campaignId,
      world_id: worldId,
      player_id: playerId,
      message: trimmed,
    });
  };

  const handleEndSession = async () => {
    if (!sessionId) {
      addLog('No session to end.');
      return;
    }
    try {
      const resp = await axios.post(`${serverUrl.replace(/\/$/, '')}/sessions/${sessionId}/end`);
      const recap = resp.data?.recap || 'No recap.';
      addLog('----- SESSION ENDED -----');
      addLog(`Recap:\n${recap}`);
    } catch (err) {
      addLog(`Error ending session:\n${err}`);
    }
  };

  const handleRoll = () => {
    const diceOptions = ["d4", "d6", "d8", "d10", "d12", "d20", "d100"];
    const selectedDie = prompt("Enter die type (d4,d6,d8,d10,d12,d20,d100):", "d20");
    if (!selectedDie || !diceOptions.includes(selectedDie)) {
      alert("Invalid die type.");
      return;
    }
    const maxVal = parseInt(selectedDie.substring(1));
    const roll = Math.floor(Math.random() * maxVal) + 1;
    setRollResult(roll);
    addLog(`🎲 Roll ${selectedDie}: ${roll}\n`);
  };

  return (
    <div className="flex flex-col gap-4 relative">
      <h1 className="text-4xl font-bold text-center mb-2 text-yellow-200 drop-shadow-lg">The Oracle</h1>
      <p className="italic text-sm text-yellow-50">
        Converse with the Dungeon Master, or share your heroic deeds...
      </p>

      {/* Chat container */}
      <div className={`bg-yellow-50 bg-opacity-5 p-3 rounded h-64 overflow-y-auto border border-yellow-700 ${fontSize} ${fontFamily}`}>
        {chatLog.map((entry, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-1 whitespace-pre-wrap"
          >
            {entry.text}
            {entry.newline ? '\n' : ''}
          </motion.div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          className={`flex-1 p-2 rounded text-black ${fontSize} ${fontFamily}`}
          placeholder="Share your words..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <Button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-600 px-4 py-2">
          Send
        </Button>
        <Button variant="destructive" onClick={handleEndSession} className="px-4 py-2">
          End Session
        </Button>
      </div>
      <div className="flex gap-2 items-center justify-start">
        <Button onClick={handleRoll} className="bg-purple-600 hover:bg-purple-700 px-4 py-2">
          Roll Dice
        </Button>
        {rollResult && (
          <span className="font-bold text-yellow-300">Result: {rollResult}</span>
        )}
      </div>

      {/* Gear Popover in bottom-right corner */}
      <div className="absolute -bottom-1 right-1">
        <Popover>
          <PopoverTrigger asChild>
            <button className="m-1 flex items-center justify-center gap-1 p-2 rounded-full transition-all duration-300 border border-yellow-600 bg-transparent text-gray-300 hover:text-yellow-100">
              <Cog className="h-5 w-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="bg-[#3c2e2e] border border-yellow-600 text-yellow-100 w-56 p-4 shadow-xl">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Font Size</label>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={() => {
                      const currentIndex = fontSizes.indexOf(fontSize);
                      if (currentIndex > 0) {
                        setFontSize(fontSizes[currentIndex - 1]);
                      }
                    }}
                    className="w-8 h-8 p-0 bg-yellow-600 hover:bg-yellow-700 rounded-full"
                  >
                    -
                  </Button>
                  <Button
                    onClick={() => {
                      const currentIndex = fontSizes.indexOf(fontSize);
                      if (currentIndex < fontSizes.length - 1) {
                        setFontSize(fontSizes[currentIndex + 1]);
                      }
                    }}
                    className="w-8 h-8 p-0 bg-yellow-600 hover:bg-yellow-700 rounded-full"
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Font Family</label>
                <div className="flex items-center justify-between gap-2">
                  <Button
                    onClick={() => {
                      const currentIndex = fontFamilies.indexOf(fontFamily);
                      const newIndex = currentIndex > 0 ? currentIndex - 1 : fontFamilies.length - 1;
                      setFontFamily(fontFamilies[newIndex]);
                    }}
                    className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700"
                  >
                    &#8592;
                  </Button>
                  <span className="text-sm">{fontFamily.replace('font-', '')}</span>
                  <Button
                    onClick={() => {
                      const currentIndex = fontFamilies.indexOf(fontFamily);
                      const newIndex = currentIndex < fontFamilies.length - 1 ? currentIndex + 1 : 0;
                      setFontFamily(fontFamilies[newIndex]);
                    }}
                    className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700"
                  >
                    &#8594;
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
