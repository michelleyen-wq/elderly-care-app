import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, CheckCircle, Music, Volume2, Sparkles, Dumbbell, Clock, Tv, Film } from 'lucide-react';
import { tts } from '../services/ttsService';

export default function ExercisePopup({ isOpen, onClose, isInline = false, lang, t, onEarnApple }) {
  const [selectedSession, setSelectedSession] = useState('morning'); // 'morning', 'noon', 'afternoon', 'evening'
  const [isPlaying, setIsPlaying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes = 300 seconds
  const [isMusicOn, setIsMusicOn] = useState(true);

  const canvasRef = useRef(null);

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

  const currentSession = sessionsConfig[selectedSession];

  // 60FPS HTML5 Canvas Continuous Animated Video Engine (ALWAYS ANIMATING!)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let frameCount = 0;

    const render = () => {
      frameCount++;
      // Speed multiplier: faster when playing, gentle motion when idle
      const speed = isPlaying ? 0.08 : 0.04;
      const time = frameCount * speed;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Clear & Background Gradient (Sky to Grass Park)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#a5f3fc');
      skyGrad.addColorStop(0.55, '#e0f2fe');
      skyGrad.addColorStop(0.55, '#86efac');
      skyGrad.addColorStop(1, '#22c55e');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Sun & Moving Clouds
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(width - 40, 35, 20, 0, Math.PI * 2);
      ctx.fill();

      // Clouds
      const cloud1X = (frameCount * 0.5) % (width + 100) - 50;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(cloud1X, 35, 16, 0, Math.PI * 2);
      ctx.arc(cloud1X + 18, 30, 20, 0, Math.PI * 2);
      ctx.arc(cloud1X + 36, 35, 16, 0, Math.PI * 2);
      ctx.fill();

      // 3. Draw Park Benches
      ctx.fillStyle = '#78350f';
      ctx.fillRect(50, 95, 80, 10);
      ctx.fillRect(55, 105, 8, 40);
      ctx.fillRect(115, 105, 8, 40);
      ctx.fillRect(45, 60, 8, 45);

      ctx.fillRect(190, 95, 80, 10);
      ctx.fillRect(195, 105, 8, 40);
      ctx.fillRect(255, 105, 8, 40);
      ctx.fillRect(185, 60, 8, 45);

      // Trigonometric Continuous Movement (ALWAYS ACTIVE)
      const motion = Math.sin(time * 3);
      const armAngle = motion * (isPlaying ? 0.9 : 0.4);
      const legOffsetY = currentSession.actionType === 'leg' ? Math.abs(Math.sin(time * 3)) * (isPlaying ? 16 : 8) : 0;
      const headOffsetY = Math.sin(time * 3) * (isPlaying ? 4 : 2);

      // 4. Draw Cartoon Grandma (Left Character - Pink Outfit)
      ctx.save();
      ctx.translate(90, 50 + headOffsetY);

      // Hair Bun & Face
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(0, -18, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffedd5';
      ctx.beginPath();
      ctx.arc(0, 2, 16, 0, Math.PI * 2);
      ctx.fill();

      // Glasses & Happy Smile
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-6, 0, 4, 0, Math.PI * 2);
      ctx.arc(6, 0, 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-2, 0);
      ctx.lineTo(2, 0);
      ctx.stroke();

      ctx.strokeStyle = '#e11d48';
      ctx.beginPath();
      ctx.arc(0, 6, 5, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
      ctx.restore();

      // Grandma Clothes
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.roundRect(74, 68 + headOffsetY, 32, 36, 6);
      ctx.fill();

      // Grandma Animated Arms
      ctx.save();
      ctx.translate(74, 72 + headOffsetY);
      ctx.rotate(-0.5 + armAngle);
      ctx.fillStyle = '#ffedd5';
      ctx.fillRect(-22, -4, 22, 8);
      ctx.restore();

      ctx.save();
      ctx.translate(106, 72 + headOffsetY);
      ctx.rotate(0.5 - armAngle);
      ctx.fillStyle = '#ffedd5';
      ctx.fillRect(0, -4, 22, 8);
      ctx.restore();

      // Grandma Legs
      ctx.fillStyle = '#831843';
      ctx.fillRect(78, 102 - legOffsetY, 10, 32);
      ctx.fillRect(92, 102 - legOffsetY, 10, 32);
      ctx.fillStyle = '#be185d';
      ctx.fillRect(72, 132 - legOffsetY, 18, 8);
      ctx.fillRect(90, 132 - legOffsetY, 18, 8);


      // 5. Draw Cartoon Grandpa (Right Character - Blue Outfit)
      ctx.save();
      ctx.translate(230, 50 + headOffsetY);

      ctx.fillStyle = '#ffedd5';
      ctx.beginPath();
      ctx.arc(0, 2, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(0, -8, 18, Math.PI, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(-6, -2, 2, 0, Math.PI * 2);
      ctx.arc(6, -2, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-8, 6);
      ctx.quadraticCurveTo(0, 2, 8, 6);
      ctx.stroke();

      ctx.restore();

      // Grandpa Clothes
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.roundRect(214, 68 + headOffsetY, 32, 36, 6);
      ctx.fill();

      // Grandpa Animated Arms
      ctx.save();
      ctx.translate(214, 72 + headOffsetY);
      ctx.rotate(-0.5 - armAngle);
      ctx.fillStyle = '#ffedd5';
      ctx.fillRect(-22, -4, 22, 8);
      ctx.restore();

      ctx.save();
      ctx.translate(246, 72 + headOffsetY);
      ctx.rotate(0.5 + armAngle);
      ctx.fillStyle = '#ffedd5';
      ctx.fillRect(0, -4, 22, 8);
      ctx.restore();

      // Grandpa Legs
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(218, 102 - legOffsetY, 10, 32);
      ctx.fillRect(232, 102 - legOffsetY, 10, 32);
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(197, 132 - legOffsetY, 18, 8);
      ctx.fillRect(218, 132 - legOffsetY, 18, 8);


      // 6. Draw Live Video HUD Overlay
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(10, 10, 155, 24);
      ctx.fillStyle = isPlaying ? '#ef4444' : '#22c55e';
      ctx.beginPath();
      ctx.arc(22, 22, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(isPlaying ? '🔴 1080p 動畫視訊播放中' : '🟢 卡通帶動畫面 (即刻開始)', 34, 26);

      // Bottom Action Banner Overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(10, height - 36, width - 20, 28);
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`📺 跟著卡通爺爺奶奶：${currentSession.descZh}`, 18, height - 18);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, selectedSession]);

  useEffect(() => {
    let timer = null;

    if (isPlaying && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsPlaying(false);
      tts.stopExerciseMusic();
      tts.playChime('rainbow');
      tts.speak(lang === 'zh' ? '太棒了！您已完成 5 分鐘卡通健康操！' : 'Awesome! You finished the 5-min workout!', lang);
    }

    return () => {
      clearInterval(timer);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eef2ff', padding: '12px 16px', borderRadius: '16px', border: '1px solid #c7d2fe', marginBottom: '12px' }}>
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

      {/* 60FPS HTML5 Canvas Cartoon Senior Exercise Video Screen */}
      <div style={{ position: 'relative', width: '100%', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(0,0,0,0.15)', border: '2px solid #bfdbfe' }}>
        <canvas 
          ref={canvasRef} 
          width={340} 
          height={180} 
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>

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
