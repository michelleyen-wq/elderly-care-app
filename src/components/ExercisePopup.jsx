import React, { useState, useEffect } from 'react';
import { X, Play, Pause, CheckCircle, Music, Volume2, Sparkles, Dumbbell, Clock, Tv } from 'lucide-react';
import { tts } from '../services/ttsService';

export default function ExercisePopup({ isOpen, onClose, isInline = false, lang, t, onEarnApple }) {
  const [selectedSession, setSelectedSession] = useState('morning'); // 'morning', 'noon', 'afternoon', 'evening'
  const [isPlaying, setIsPlaying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes = 300 seconds
  const [isMusicOn, setIsMusicOn] = useState(true);
  const [animationStep, setAnimationStep] = useState(0);

  // Exercise 4 Sessions Config
  const sessionsConfig = {
    morning: {
      time: '09:00',
      titleZh: '☀️ 早晨醒腦操 (5分鐘)',
      titleEn: '☀️ 09:00 Morning Stretch (5m)',
      descZh: '1. 正坐椅上 ➔ 2. 雙臂舉高伸展 ➔ 3. 深呼吸調息',
      descEn: 'Sit upright -> Raise arms -> Take deep breaths.',
      actionType: 'stretch'
    },
    noon: {
      time: '12:00',
      titleZh: '⛅ 午間舒敏操 (5分鐘)',
      titleEn: '⛅ 12:00 Noon Flex (5m)',
      descZh: '1. 雙腳踩平 ➔ 2. 慢慢抬膝離地 5 秒 ➔ 3. 換腳重複',
      descEn: 'Feet flat -> Slowly lift knee for 5s -> Alternate legs.',
      actionType: 'leg'
    },
    afternoon: {
      time: '15:00',
      titleZh: '🌇 下午活血操 (5分鐘)',
      titleEn: '🌇 15:00 Afternoon Circulation (5m)',
      descZh: '1. 握拳並張開十指 ➔ 2. 順時針轉動手腕 ➔ 3. 促進循環',
      descEn: 'Clench & open fist -> Rotate wrist -> Boost flow.',
      actionType: 'wrist'
    },
    evening: {
      time: '19:30',
      titleZh: '🌙 晚間安眠操 (5分鐘)',
      titleEn: '🌙 19:30 Evening Sleep Prep (5m)',
      descZh: '1. 腳尖向上抬 ➔ 2. 踩地幫浦動作 ➔ 3. 舒壓助眠',
      descEn: 'Raise toes -> Heel pump -> Relax for sound sleep.',
      actionType: 'ankle'
    }
  };

  useEffect(() => {
    let timer = null;
    let animTimer = null;

    if (isPlaying && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);

      // Cartoon Figure Animation Step loop
      animTimer = setInterval(() => {
        setAnimationStep(prev => (prev + 1) % 4);
      }, 500); // 500ms smooth animation rate
    } else if (secondsLeft === 0) {
      setIsPlaying(false);
      tts.stopExerciseMusic();
      tts.playChime('rainbow');
      tts.speak(lang === 'zh' ? '太棒了！您已完成 5 分鐘卡通健康操！' : 'Awesome! You finished the 5-min workout!', lang);
    }

    return () => {
      clearInterval(timer);
      clearInterval(animTimer);
    };
  }, [isPlaying, secondsLeft, lang]);

  useEffect(() => {
    if (isPlaying && isMusicOn) {
      tts.playExerciseMusic();
    } else {
      tts.stopExerciseMusic();
    }

    return () => {
      tts.stopExerciseMusic();
    };
  }, [isPlaying, isMusicOn]);

  if (!isInline && !isOpen) return null;

  const currentSession = sessionsConfig[selectedSession];

  const handleStartPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      tts.speak(lang === 'zh' ? `開始${currentSession.titleZh}，跟著卡通畫面動一動！` : `Starting workout!`, lang);
    } else {
      setIsPlaying(false);
      tts.stopExerciseMusic();
    }
  };

  const handleFinish = () => {
    setIsPlaying(false);
    tts.stopExerciseMusic();
    tts.playChime('apple');
    if (onEarnApple) onEarnApple();
    tts.speak(lang === 'zh' ? '恭喜完成運動打卡！獲得 1 顆健康蘋果 🍎' : 'Workout completed! Earned 1 Apple!', lang);
    if (onClose) onClose();
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Render Full Cartoon Exercise Stage SVG (Park Stage + Cartoon Grandma & Grandpa Character Duo)
  const renderCartoonStage = () => {
    const isOdd = animationStep % 2 === 1;
    const bodyY = isPlaying && isOdd ? -8 : 0;
    const armAngleLeft = isPlaying ? (isOdd ? -40 : 10) : 0;
    const armAngleRight = isPlaying ? (isOdd ? 40 : -10) : 0;
    const legOffsetY = currentSession.actionType === 'leg' && isPlaying && isOdd ? -16 : 0;

    return (
      <div style={{
        background: 'linear-gradient(180deg, #bfdbfe 0%, #e0f2fe 60%, #86efac 60%, #4ade80 100%)',
        borderRadius: '24px',
        padding: '16px',
        textAlign: 'center',
        margin: '14px 0',
        position: 'relative',
        boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
        border: '3px solid #60a5fa',
        overflow: 'hidden'
      }}>
        {/* Stage Header Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.85)', padding: '6px 12px', borderRadius: '12px', backdropFilter: 'blur(4px)', marginBottom: '10px' }}>
          <div style={{ fontSize: '13px', fontWeight: '900', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Tv size={16} color="#2563eb" /> 📺 卡通銀髮族運動動畫影音
          </div>
          <span style={{
            background: isPlaying ? '#ef4444' : '#64748b',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: '11px',
            fontWeight: '800',
            animation: isPlaying ? 'pulse 1.5s infinite' : 'none'
          }}>
            {isPlaying ? '🔴 播放示範中' : '⏸️ 準備就緒'}
          </span>
        </div>

        {/* SVG Cartoon Senior Characters (Grandma & Grandpa Cartoon Duo on Park Benches) */}
        <svg width="100%" height="190" viewBox="0 0 320 180" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}>
          {/* Outdoor Park Background Elements */}
          {/* Sun */}
          <circle cx="280" cy="35" r="18" fill="#fde047" />
          <line x1="280" y1="10" x2="280" y2="5" stroke="#facc15" strokeWidth="3" />
          <line x1="300" y1="35" x2="305" y2="35" stroke="#facc15" strokeWidth="3" />
          <line x1="295" y1="20" x2="300" y2="15" stroke="#facc15" strokeWidth="3" />
          
          {/* Park Trees */}
          <rect x="25" y="70" width="10" height="40" fill="#78350f" />
          <circle cx="30" cy="60" r="22" fill="#22c55e" />
          <rect x="280" y="80" width="10" height="35" fill="#78350f" />
          <circle cx="285" cy="70" r="18" fill="#16a34a" />

          {/* Park Wooden Chairs */}
          {/* Chair Left (Grandma) */}
          <rect x="70" y="110" width="65" height="12" rx="4" fill="#92400e" />
          <rect x="75" y="122" width="8" height="38" fill="#78350f" />
          <rect x="122" y="122" width="8" height="38" fill="#78350f" />
          <rect x="65" y="70" width="8" height="50" fill="#92400e" />

          {/* Chair Right (Grandpa) */}
          <rect x="185" y="110" width="65" height="12" rx="4" fill="#92400e" />
          <rect x="190" y="122" width="8" height="38" fill="#78350f" />
          <rect x="237" y="122" width="8" height="38" fill="#78350f" />
          <rect x="180" y="70" width="8" height="50" fill="#92400e" />

          {/* ================= CARTOON GRANDMA (LEFT) ================= */}
          <g transform={`translate(0, ${bodyY})`}>
            {/* Grandma Head */}
            <circle cx="102" cy="55" r="22" fill="#cbd5e1" /> {/* Grey Bun Hair */}
            <circle cx="102" cy="38" r="8" fill="#94a3b8" /> {/* Hair Bun */}
            <circle cx="102" cy="58" r="16" fill="#ffedd5" /> {/* Face */}
            {/* Glasses & Smile */}
            <circle cx="96" cy="56" r="4" fill="none" stroke="#334155" strokeWidth="1.5" />
            <circle cx="108" cy="56" r="4" fill="none" stroke="#334155" strokeWidth="1.5" />
            <line x1="100" y1="56" x2="104" y2="56" stroke="#334155" strokeWidth="1.5" />
            <path d="M 97 64 Q 102 68 107 64" stroke="#e11d48" strokeWidth="2" fill="none" />
            <circle cx="92" cy="60" r="3" fill="#fda4af" opacity="0.8" />
            <circle cx="112" cy="60" r="3" fill="#fda4af" opacity="0.8" />

            {/* Grandma Clothes */}
            <path d="M 87 74 L 117 74 L 122 110 L 82 110 Z" fill="#ec4899" rx="6" />

            {/* Grandma Animated Arms */}
            <g transform={`rotate(${armAngleLeft}, 87, 76)`}>
              <rect x="67" y="75" width="22" height="8" rx="4" fill="#ffedd5" />
              <circle cx="65" cy="79" r="5" fill="#ffedd5" />
            </g>
            <g transform={`rotate(${armAngleRight}, 117, 76)`}>
              <rect x="117" y="75" width="22" height="8" rx="4" fill="#ffedd5" />
              <circle cx="140" cy="79" r="5" fill="#ffedd5" />
            </g>

            {/* Grandma Legs */}
            <g transform={`translate(0, ${legOffsetY})`}>
              <rect x="88" y="110" width="10" height="35" rx="4" fill="#831843" />
              <rect x="106" y="110" width="10" height="35" rx="4" fill="#831843" />
              <rect x="82" y="145" width="18" height="8" rx="4" fill="#be185d" />
              <rect x="103" y="145" width="18" height="8" rx="4" fill="#be185d" />
            </g>
          </g>

          {/* ================= CARTOON GRANDPA (RIGHT) ================= */}
          <g transform={`translate(0, ${bodyY})`}>
            {/* Grandpa Head */}
            <circle cx="217" cy="55" r="20" fill="#ffedd5" /> {/* Face */}
            <path d="M 197 50 Q 217 38 237 50" fill="#e2e8f0" /> {/* Hair */}
            {/* Mustache & Smile */}
            <path d="M 210 63 Q 217 60 224 63" stroke="#64748b" strokeWidth="3" fill="none" />
            <circle cx="212" cy="55" r="2" fill="#000" />
            <circle cx="222" cy="55" r="2" fill="#000" />

            {/* Grandpa Clothes */}
            <path d="M 202 74 L 232 74 L 237 110 L 197 110 Z" fill="#3b82f6" rx="6" />

            {/* Grandpa Animated Arms */}
            <g transform={`rotate(${armAngleRight}, 202, 76)`}>
              <rect x="182" y="75" width="22" height="8" rx="4" fill="#ffedd5" />
              <circle cx="180" cy="79" r="5" fill="#ffedd5" />
            </g>
            <g transform={`rotate(${armAngleLeft}, 232, 76)`}>
              <rect x="232" y="75" width="22" height="8" rx="4" fill="#ffedd5" />
              <circle cx="255" cy="79" r="5" fill="#ffedd5" />
            </g>

            {/* Grandpa Legs */}
            <g transform={`translate(0, ${legOffsetY})`}>
              <rect x="203" y="110" width="10" height="35" rx="4" fill="#1e3a8a" />
              <rect x="221" y="110" width="10" height="35" rx="4" fill="#1e3a8a" />
              <rect x="197" y="145" width="18" height="8" rx="4" fill="#0369a1" />
              <rect x="218" y="145" width="18" height="8" rx="4" fill="#0369a1" />
            </g>
          </g>
        </svg>

        {/* Action Instruction Guide */}
        <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '14px', marginTop: '6px', border: '1px solid #bfdbfe' }}>
          <div style={{ fontSize: '13px', fontWeight: '900', color: '#1d4ed8', marginBottom: '2px' }}>
            🏃‍♀️ 動作步驟指引：
          </div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#1e3a8a' }}>
            {currentSession.descZh}
          </div>
        </div>
      </div>
    );
  };

  const contentMarkup = (
    <div className={isInline ? "card" : "modal-card"} style={isInline ? { padding: '20px' } : { maxWidth: '460px', padding: '18px' }}>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: '#f59e0b', color: 'white', padding: '8px', borderRadius: '12px' }}>
            <Dumbbell size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-main)' }}>
              {t.exerciseTitle}
            </h3>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.exerciseSubtitle}</div>
          </div>
        </div>

        {!isInline && onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        )}
      </div>

      {/* 4 Sessions Daily Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        <button 
          onClick={() => { setSelectedSession('morning'); setSecondsLeft(300); setIsPlaying(false); }}
          style={{
            padding: '10px 8px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '12px',
            fontWeight: '800',
            background: selectedSession === 'morning' ? '#4f46e5' : '#f1f5f9',
            color: selectedSession === 'morning' ? 'white' : 'var(--text-muted)',
            cursor: 'pointer',
            boxShadow: selectedSession === 'morning' ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none'
          }}
        >
          {t.sessionMorning}
        </button>

        <button 
          onClick={() => { setSelectedSession('noon'); setSecondsLeft(300); setIsPlaying(false); }}
          style={{
            padding: '10px 8px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '12px',
            fontWeight: '800',
            background: selectedSession === 'noon' ? '#4f46e5' : '#f1f5f9',
            color: selectedSession === 'noon' ? 'white' : 'var(--text-muted)',
            cursor: 'pointer',
            boxShadow: selectedSession === 'noon' ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none'
          }}
        >
          {t.sessionNoon}
        </button>

        <button 
          onClick={() => { setSelectedSession('afternoon'); setSecondsLeft(300); setIsPlaying(false); }}
          style={{
            padding: '10px 8px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '12px',
            fontWeight: '800',
            background: selectedSession === 'afternoon' ? '#4f46e5' : '#f1f5f9',
            color: selectedSession === 'afternoon' ? 'white' : 'var(--text-muted)',
            cursor: 'pointer',
            boxShadow: selectedSession === 'afternoon' ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none'
          }}
        >
          {t.sessionAfternoon}
        </button>

        <button 
          onClick={() => { setSelectedSession('evening'); setSecondsLeft(300); setIsPlaying(false); }}
          style={{
            padding: '10px 8px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '12px',
            fontWeight: '800',
            background: selectedSession === 'evening' ? '#4f46e5' : '#f1f5f9',
            color: selectedSession === 'evening' ? 'white' : 'var(--text-muted)',
            cursor: 'pointer',
            boxShadow: selectedSession === 'evening' ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none'
          }}
        >
          {t.sessionEvening}
        </button>
      </div>

      {/* 5-Min Countdown Clock & Music Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eef2ff', padding: '12px 16px', borderRadius: '16px', border: '1px solid #c7d2fe' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Clock size={24} color="#4f46e5" />
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#4338ca' }}>5分鐘訓練倒數</div>
            <div style={{ fontSize: '26px', fontWeight: '900', color: '#3730a3', fontFamily: 'monospace' }}>
              {formatTime(secondsLeft)}
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsMusicOn(!isMusicOn)}
          style={{
            background: isMusicOn ? '#4f46e5' : '#e2e8f0',
            color: isMusicOn ? 'white' : 'var(--text-muted)',
            border: 'none',
            padding: '8px 14px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Music size={16} /> {isMusicOn ? t.musicOn : t.musicOff}
        </button>
      </div>

      {/* Full Cartoon Stage SVG Animation */}
      {renderCartoonStage()}

      {/* Action Controls */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        <button 
          onClick={handleStartPause}
          className="btn-primary"
          style={{ flex: 1, padding: '14px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          {isPlaying ? <><Pause size={20} /> {t.pauseTimer}</> : <><Play size={20} /> {t.startTimer}</>}
        </button>

        <button 
          onClick={handleFinish}
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            fontWeight: '900',
            fontSize: '15px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
          }}
        >
          <CheckCircle size={20} /> {t.finishExercise}
        </button>
      </div>
    </div>
  );

  if (isInline) {
    return contentMarkup;
  }

  return (
    <div className="modal-overlay">
      {contentMarkup}
    </div>
  );
}
