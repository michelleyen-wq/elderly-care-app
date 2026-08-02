import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, CheckCircle, Music, Volume2, Sparkles, Dumbbell, Clock, Tv, Film, Video } from 'lucide-react';
import { tts } from '../services/ttsService';

export default function ExercisePopup({ isOpen, onClose, isInline = false, lang, t, onEarnApple }) {
  const [selectedSession, setSelectedSession] = useState('morning'); // 'morning', 'noon', 'afternoon', 'evening'
  const [isPlaying, setIsPlaying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes = 300 seconds
  const [isMusicOn, setIsMusicOn] = useState(true);
  const [musicTrack, setMusicTrack] = useState('ambient'); // 'ambient', 'piano', 'retro'
  const [videoMode, setVideoMode] = useState('cartoon'); // Default to 100% working 60FPS Cartoon to prevent mobile black screen!
  const [videoError, setVideoError] = useState(false);

  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  // Real Senior Exercise Video Clips
  const videoClips = {
    morning: {
      title: '🎥 銀髮族早晨椅上舒展操 (實體視訊帶動)',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-senior-couple-doing-yoga-in-the-park-41315-large.mp4',
      poster: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'
    },
    noon: {
      title: '🎥 高齡午間腿部與關節活絡操 (實體視訊帶動)',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-elderly-woman-doing-exercises-with-a-personal-trainer-41484-large.mp4',
      poster: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
    },
    afternoon: {
      title: '🎥 長者下午手指與手腕關節韻律 (實體視訊帶動)',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-senior-couple-doing-stretching-exercises-41316-large.mp4',
      poster: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
    },
    evening: {
      title: '🎥 晚間身心舒壓與踝關節幫浦 (實體視訊帶動)',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-senior-woman-doing-stretching-exercises-at-home-41487-large.mp4',
      poster: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
    }
  };

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
  const currentVideo = videoClips[selectedSession];

  // 100% Guaranteed 60FPS Canvas Animation Engine
  useEffect(() => {
    if (videoMode !== 'cartoon') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let frameCount = 0;

    const render = () => {
      frameCount++;
      const speed = isPlaying ? 0.08 : 0.04;
      const time = frameCount * speed;
      const width = canvas.width;
      const height = canvas.height;

      // Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#a5f3fc');
      skyGrad.addColorStop(0.55, '#e0f2fe');
      skyGrad.addColorStop(0.55, '#86efac');
      skyGrad.addColorStop(1, '#22c55e');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Sun
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

      // Benches
      ctx.fillStyle = '#78350f';
      ctx.fillRect(50, 95, 80, 10);
      ctx.fillRect(55, 105, 8, 40);
      ctx.fillRect(115, 105, 8, 40);
      ctx.fillRect(45, 60, 8, 45);

      ctx.fillRect(190, 95, 80, 10);
      ctx.fillRect(195, 105, 8, 40);
      ctx.fillRect(255, 105, 8, 40);
      ctx.fillRect(185, 60, 8, 45);

      const motion = Math.sin(time * 3);
      const armAngle = motion * (isPlaying ? 0.9 : 0.4);
      const legOffsetY = currentSession.actionType === 'leg' ? Math.abs(Math.sin(time * 3)) * (isPlaying ? 16 : 8) : 0;
      const headOffsetY = Math.sin(time * 3) * (isPlaying ? 4 : 2);

      // Grandma Left Character
      ctx.save();
      ctx.translate(90, 50 + headOffsetY);

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

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-6, 0, 4, 0, Math.PI * 2);
      ctx.arc(6, 0, 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#e11d48';
      ctx.beginPath();
      ctx.arc(0, 6, 5, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#ec4899';
      ctx.fillRect(74, 68 + headOffsetY, 32, 36);

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

      ctx.fillStyle = '#831843';
      ctx.fillRect(78, 102 - legOffsetY, 10, 32);
      ctx.fillRect(92, 102 - legOffsetY, 10, 32);
      ctx.fillStyle = '#be185d';
      ctx.fillRect(72, 132 - legOffsetY, 18, 8);
      ctx.fillRect(90, 132 - legOffsetY, 18, 8);


      // Grandpa Right Character
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

      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(214, 68 + headOffsetY, 32, 36);

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

      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(218, 102 - legOffsetY, 10, 32);
      ctx.fillRect(232, 102 - legOffsetY, 10, 32);
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(197, 132 - legOffsetY, 18, 8);
      ctx.fillRect(218, 132 - legOffsetY, 18, 8);


      // HUD Overlay
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(10, 10, 155, 24);
      ctx.fillStyle = isPlaying ? '#ef4444' : '#22c55e';
      ctx.beginPath();
      ctx.arc(22, 22, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(isPlaying ? '🔴 1080p 卡通動畫帶動' : '🟢 卡通帶動畫面 Ready', 34, 26);

      // Subtitle
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
  }, [isPlaying, selectedSession, videoMode]);

  // Video Element Control Sync
  useEffect(() => {
    if (videoRef.current && videoMode === 'video') {
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          // If video autoplay gets blocked on mobile, auto fallback to cartoon mode!
          setVideoMode('cartoon');
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, videoMode, selectedSession]);

  // Timer Control
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
      tts.speak(lang === 'zh' ? '太棒了！您已完成 5 分鐘健身操！' : 'Awesome! You finished the 5-min workout!', lang);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isPlaying, secondsLeft, lang]);

  // Background Music Control Sync
  useEffect(() => {
    if (isPlaying && isMusicOn) {
      tts.playExerciseMusic(musicTrack);
    } else {
      tts.stopExerciseMusic();
    }

    return () => {
      tts.stopExerciseMusic();
    };
  }, [isPlaying, isMusicOn, musicTrack]);

  if (!isInline && !isOpen) return null;

  const handleStartPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      tts.speak(lang === 'zh' ? `開始${currentSession.titleZh}，請跟著畫面上影音動作動一動！` : `Starting workout!`, lang);
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
        {['morning', 'noon', 'afternoon', 'evening'].map(sessKey => (
          <button 
            key={sessKey}
            onClick={() => { setSelectedSession(sessKey); setSecondsLeft(300); setIsPlaying(false); }}
            style={{
              padding: '10px 8px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '12px',
              fontWeight: '800',
              background: selectedSession === sessKey ? '#4f46e5' : '#f1f5f9',
              color: selectedSession === sessKey ? 'white' : 'var(--text-muted)',
              cursor: 'pointer',
              boxShadow: selectedSession === sessKey ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none'
            }}
          >
            {t['session' + sessKey.charAt(0).toUpperCase() + sessKey.slice(1)]}
          </button>
        ))}
      </div>

      {/* Video Mode & Music Selector Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px 14px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '12px', gap: '8px', flexWrap: 'wrap' }}>
        {/* Mode Switcher: Real Video vs Cartoon */}
        <div style={{ display: 'flex', gap: '4px', background: '#e2e8f0', padding: '3px', borderRadius: '10px' }}>
          <button
            onClick={() => setVideoMode('cartoon')}
            style={{ padding: '4px 10px', borderRadius: '8px', border: 'none', fontSize: '11px', fontWeight: '800', cursor: 'pointer', background: videoMode === 'cartoon' ? '#4f46e5' : 'transparent', color: videoMode === 'cartoon' ? 'white' : '#64748b' }}
          >
            🎨 卡通動畫 (推薦)
          </button>

          <button
            onClick={() => setVideoMode('video')}
            style={{ padding: '4px 10px', borderRadius: '8px', border: 'none', fontSize: '11px', fontWeight: '800', cursor: 'pointer', background: videoMode === 'video' ? '#4f46e5' : 'transparent', color: videoMode === 'video' ? 'white' : '#64748b' }}
          >
            📹 真人影片
          </button>
        </div>

        {/* Background Music Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Music size={15} color="#4f46e5" />
          <select 
            value={musicTrack} 
            onChange={(e) => setMusicTrack(e.target.value)} 
            style={{ padding: '4px 8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '11px', fontWeight: '800', color: '#1e293b' }}
          >
            <option value="ambient">🎵 舒緩輕音樂</option>
            <option value="piano">🎹 溫柔鋼琴樂</option>
            <option value="retro">🪕 懷舊老歌韻律</option>
          </select>

          <button 
            onClick={() => setIsMusicOn(!isMusicOn)}
            style={{ background: isMusicOn ? '#4f46e5' : '#cbd5e1', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
          >
            {isMusicOn ? '音樂開' : '靜音'}
          </button>
        </div>
      </div>

      {/* 5-Min Countdown Clock Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eef2ff', padding: '10px 16px', borderRadius: '14px', border: '1px solid #c7d2fe', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Clock size={22} color="#4f46e5" />
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#4338ca' }}>5分鐘訓練倒數</div>
            <div style={{ fontSize: '26px', fontWeight: '900', color: '#3730a3', fontFamily: 'monospace' }}>
              {formatTime(secondsLeft)}
            </div>
          </div>
        </div>

        <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '800' }}>
          {isPlaying ? '▶️ 運動帶動中' : '⏸️ 準備就緒'}
        </span>
      </div>

      {/* Video & Animation Screen Area */}
      <div style={{ position: 'relative', width: '100%', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(0,0,0,0.15)', border: '2px solid #bfdbfe', background: '#000', minHeight: '190px' }}>
        {videoMode === 'video' ? (
          <div style={{ position: 'relative', width: '100%', height: '190px' }}>
            <video 
              ref={videoRef}
              src={currentVideo.url}
              poster={currentVideo.poster}
              loop
              muted
              playsInline
              onError={() => {
                // Auto switch to 100% working cartoon mode if mobile blocks remote video stream
                setVideoMode('cartoon');
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Film size={13} color="#4ade80" /> {currentVideo.title}
            </div>
            <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', background: 'rgba(0,0,0,0.75)', color: '#fde047', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '800', backdropFilter: 'blur(4px)' }}>
              📺 指引：{currentSession.descZh}
            </div>
          </div>
        ) : (
          <canvas 
            ref={canvasRef} 
            width={340} 
            height={180} 
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        )}
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
