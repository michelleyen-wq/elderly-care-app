import React, { useState, useEffect } from 'react';
import { X, Play, Pause, CheckCircle, Music, Volume2, Sparkles, Dumbbell, Clock } from 'lucide-react';
import { tts } from '../services/ttsService';

export default function ExercisePopup({ isOpen, onClose, lang, t }) {
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
      descZh: '椅上姿勢正坐，放鬆肩膀做雙臂向上伸展與呼吸調息。',
      descEn: 'Sit upright, relax shoulders, and do arm stretches with deep breaths.',
      actionType: 'stretch'
    },
    noon: {
      time: '12:00',
      titleZh: '⛅ 午間舒敏操 (5分鐘)',
      titleEn: '⛅ 12:00 Noon Flex (5m)',
      descZh: '雙腳踩穩，慢慢抬膝離地 5 秒，重複活絡大腿肌群。',
      descEn: 'Keep feet flat, slowly lift knees for 5 seconds to activate thigh muscles.',
      actionType: 'leg'
    },
    afternoon: {
      time: '15:00',
      titleZh: '🌇 下午活血操 (5分鐘)',
      titleEn: '🌇 15:00 Afternoon Circulation (5m)',
      descZh: '雙手握拳並張開十指，搭配手腕順時針旋轉活血。',
      descEn: 'Fist and open 10 fingers, rotate wrists clockwise for joint health.',
      actionType: 'wrist'
    },
    evening: {
      time: '19:30',
      titleZh: '🌙 晚間安眠操 (5分鐘)',
      titleEn: '🌙 19:30 Evening Sleep Prep (5m)',
      descZh: '腳尖上揚與踩地幫浦，幫助下肢血液循環舒壓助眠。',
      descEn: 'Toe ups and heel pumps to boost leg circulation for better sleep.',
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
      }, 800);
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

  if (!isOpen) return null;

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
    tts.speak(lang === 'zh' ? '恭喜完成運動打卡！獲得 1 顆健康蘋果 🍎' : 'Workout completed! Earned 1 Apple!', lang);
    onClose();
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Render Senior Cartoon Animated Figure SVG
  const renderCartoonFigure = () => {
    const activeY = animationStep % 2 === 0 ? 0 : -10;
    const armRotate = animationStep % 2 === 0 ? -15 : 15;
    const legOffsetY = currentSession.actionType === 'leg' && animationStep % 2 === 1 ? -12 : 0;

    return (
      <div style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 100%)',
        borderRadius: '20px',
        padding: '16px',
        textAlign: 'center',
        margin: '12px 0',
        position: 'relative',
        boxShadow: '0 6px 18px rgba(250, 204, 21, 0.3)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '800', color: '#b45309', marginBottom: '6px' }}>
          🎨 {t.cartoonDemoLabel} ({isPlaying ? '律動中...' : '預備姿勢'})
        </div>

        {/* SVG Cartoon Senior Character (Grandma/Grandpa) in Chair */}
        <svg width="200" height="150" viewBox="0 0 200 150">
          {/* Chair Base */}
          <rect x="70" y="80" width="60" height="10" rx="4" fill="#854d0e" />
          <rect x="75" y="90" width="8" height="45" fill="#ca8a04" />
          <rect x="117" y="90" width="8" height="45" fill="#ca8a04" />
          <rect x="65" y="45" width="8" height="45" fill="#854d0e" />

          {/* Senior Cartoon Grandma/Grandpa Head */}
          <g transform={`translate(0, ${isPlaying ? activeY : 0})`}>
            {/* Hair (Glasses & Cute Grandma Hair bun) */}
            <circle cx="100" cy="35" r="22" fill="#e2e8f0" />
            <circle cx="100" cy="18" r="8" fill="#cbd5e1" /> {/* Hair bun */}
            <circle cx="100" cy="38" r="16" fill="#fde047" opacity="0.3" />

            {/* Face */}
            <circle cx="100" cy="38" r="15" fill="#ffedd5" />
            {/* Glasses */}
            <circle cx="94" cy="36" r="4" fill="none" stroke="#475569" strokeWidth="1.5" />
            <circle cx="106" cy="36" r="4" fill="none" stroke="#475569" strokeWidth="1.5" />
            <line x1="98" y1="36" x2="102" y2="36" stroke="#475569" strokeWidth="1.5" />
            {/* Happy Smile */}
            <path d="M 95 44 Q 100 48 105 44" stroke="#e11d48" strokeWidth="2" fill="none" />
            {/* Rosy Cheeks */}
            <circle cx="90" cy="40" r="3" fill="#fda4af" opacity="0.8" />
            <circle cx="110" cy="40" r="3" fill="#fda4af" opacity="0.8" />
          </g>

          {/* Cartoon Torso Clothes */}
          <path d="M 85 54 L 115 54 L 120 85 L 80 85 Z" fill="#3b82f6" rx="6" />

          {/* Animated Cartoon Arms */}
          <g transform={`rotate(${isPlaying ? armRotate : 0}, 85, 56)`}>
            <rect x="65" y="55" width="20" height="8" rx="4" fill="#ffedd5" />
            <circle cx="63" cy="59" r="4" fill="#ffedd5" />
          </g>
          <g transform={`rotate(${isPlaying ? -armRotate : 0}, 115, 56)`}>
            <rect x="115" y="55" width="20" height="8" rx="4" fill="#ffedd5" />
            <circle cx="137" cy="59" r="4" fill="#ffedd5" />
          </g>

          {/* Animated Legs & Feet */}
          <g transform={`translate(0, ${legOffsetY})`}>
            <rect x="85" y="85" width="10" height="35" rx="4" fill="#1e3a8a" />
            <rect x="105" y="85" width="10" height="35" rx="4" fill="#1e3a8a" />
            {/* Shoes */}
            <rect x="80" y="120" width="18" height="8" rx="4" fill="#e11d48" />
            <rect x="102" y="120" width="18" height="8" rx="4" fill="#e11d48" />
          </g>
        </svg>

        <p style={{ fontSize: '13px', fontWeight: '700', color: '#92400e', marginTop: '4px' }}>
          {currentSession.descZh}
        </p>
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '420px', padding: '18px' }}>
        {/* Top Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ background: '#f59e0b', color: 'white', padding: '6px', borderRadius: '10px' }}>
              <Dumbbell size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-main)' }}>
                {t.exerciseTitle}
              </h3>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.exerciseSubtitle}</div>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* 4 Sessions Daily Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '10px' }}>
          <button 
            onClick={() => { setSelectedSession('morning'); setSecondsLeft(300); setIsPlaying(false); }}
            style={{
              padding: '8px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '12px',
              fontWeight: '800',
              background: selectedSession === 'morning' ? '#4f46e5' : '#f1f5f9',
              color: selectedSession === 'morning' ? 'white' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            {t.sessionMorning}
          </button>

          <button 
            onClick={() => { setSelectedSession('noon'); setSecondsLeft(300); setIsPlaying(false); }}
            style={{
              padding: '8px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '12px',
              fontWeight: '800',
              background: selectedSession === 'noon' ? '#4f46e5' : '#f1f5f9',
              color: selectedSession === 'noon' ? 'white' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            {t.sessionNoon}
          </button>

          <button 
            onClick={() => { setSelectedSession('afternoon'); setSecondsLeft(300); setIsPlaying(false); }}
            style={{
              padding: '8px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '12px',
              fontWeight: '800',
              background: selectedSession === 'afternoon' ? '#4f46e5' : '#f1f5f9',
              color: selectedSession === 'afternoon' ? 'white' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            {t.sessionAfternoon}
          </button>

          <button 
            onClick={() => { setSelectedSession('evening'); setSecondsLeft(300); setIsPlaying(false); }}
            style={{
              padding: '8px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '12px',
              fontWeight: '800',
              background: selectedSession === 'evening' ? '#4f46e5' : '#f1f5f9',
              color: selectedSession === 'evening' ? 'white' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            {t.sessionEvening}
          </button>
        </div>

        {/* 5-Min Countdown Clock & Music Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eef2ff', padding: '10px 14px', borderRadius: '14px', border: '1px solid #c7d2fe' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} color="#4f46e5" />
            <span style={{ fontSize: '24px', fontWeight: '900', color: '#3730a3', fontFamily: 'monospace' }}>
              {formatTime(secondsLeft)}
            </span>
          </div>

          <button 
            onClick={() => setIsMusicOn(!isMusicOn)}
            style={{
              background: isMusicOn ? '#4f46e5' : '#e2e8f0',
              color: isMusicOn ? 'white' : 'var(--text-muted)',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Music size={14} /> {isMusicOn ? t.musicOn : t.musicOff}
          </button>
        </div>

        {/* Cartoon Figure SVG Animation */}
        {renderCartoonFigure()}

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
          <button 
            onClick={handleStartPause}
            className="btn-primary"
            style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            {isPlaying ? <><Pause size={18} /> {t.pauseTimer}</> : <><Play size={18} /> {t.startTimer}</>}
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
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            <CheckCircle size={18} /> {t.finishExercise}
          </button>
        </div>
      </div>
    </div>
  );
}
