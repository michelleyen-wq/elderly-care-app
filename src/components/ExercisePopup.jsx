import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Music, Sparkles, CheckCircle2, Activity } from 'lucide-react';
import { tts } from '../services/ttsService';

export default function ExercisePopup({ lang, t, isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(true);

  const stepsList = [
    {
      titleZh: '1. 深呼吸與肩部擺動 (動態動畫)',
      titleEn: '1. Breathing & Shoulder Rolls (Animated)',
      guideZh: '請奶奶坐穩在椅子上，吸氣時將肩膀向上抬高，吐氣時向後旋轉放鬆。',
      guideEn: 'Sit tall, raise shoulders while inhaling, roll back while exhaling.'
    },
    {
      titleZh: '2. Chair Stretch 腳踏板活絡 (動態動畫)',
      titleEn: '2. Seated Leg Lifts & Pedaling (Animated)',
      guideZh: '雙手握住椅子兩側，雙腳在空中做踩腳踏車運動，活絡膝蓋關節。',
      guideEn: 'Hold chair arms, gently pedal legs in air to warm up knee joints.'
    },
    {
      titleZh: '3. 手腕與手指關節伸展 (動態動畫)',
      titleEn: '3. Wrist & Finger Stretch (Animated)',
      guideZh: '雙手向前伸直，手指張開如花朵，再用力握緊拳頭，增強手部血液循環。',
      guideEn: 'Extend arms forward, open fingers wide, then clench fists gently.'
    }
  ];

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      if (currentStep < stepsList.length - 1) {
        setCurrentStep(prev => prev + 1);
        setTimeLeft(60);
        const nextStepText = lang === 'zh' ? stepsList[currentStep + 1].guideZh : stepsList[currentStep + 1].guideEn;
        tts.speak(nextStepText, lang);
      } else {
        setIsRunning(false);
        setIsCompleted(true);
        tts.stopExerciseMusic();
        tts.playChime('success');
        tts.speak(lang === 'zh' ? '太棒了！恭喜奶奶完成今天的椅上運動課程！' : 'Awesome! Workout completed today!', lang);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, currentStep, lang]);

  const toggleTimer = () => {
    const nextState = !isRunning;
    setIsRunning(nextState);
    if (nextState) {
      if (isMusicOn) tts.startExerciseMusic();
      const text = lang === 'zh' ? stepsList[currentStep].guideZh : stepsList[currentStep].guideEn;
      tts.speak(text, lang);
    } else {
      tts.stopExerciseMusic();
    }
  };

  const toggleMusic = () => {
    const nextState = !isMusicOn;
    setIsMusicOn(nextState);
    if (nextState && isRunning) {
      tts.startExerciseMusic();
    } else {
      tts.stopExerciseMusic();
    }
  };

  const resetExercise = () => {
    setIsRunning(false);
    tts.stopExerciseMusic();
    setCurrentStep(0);
    setTimeLeft(60);
    setIsCompleted(false);
  };

  const handleClose = () => {
    setIsRunning(false);
    tts.stopExerciseMusic();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ borderTop: '8px solid var(--accent)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={22} color="var(--accent)" /> {t.exerciseAlertTitle}
          </h3>
          <button onClick={handleClose} style={{ background: '#e2e8f0', border: 'none', padding: '6px 12px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>
            關閉
          </button>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
          {t.exerciseAlertBody}
        </p>

        {!isCompleted ? (
          <div>
            {/* Step Progress Pills */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
              {stepsList.map((step, idx) => (
                <div 
                  key={idx}
                  style={{
                    flex: 1,
                    height: '8px',
                    borderRadius: '4px',
                    background: idx === currentStep ? 'var(--accent)' : (idx < currentStep ? 'var(--success)' : '#cbd5e1')
                  }}
                />
              ))}
            </div>

            {/* Dynamic Exercise SVG Figure Animation Container */}
            <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', padding: '16px', borderRadius: '16px', marginBottom: '14px', textAlign: 'center' }}>
              <div style={{ height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                {currentStep === 0 && (
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    {/* Head */}
                    <circle cx="50" cy="25" r="12" fill="#f59e0b" />
                    {/* Torso */}
                    <rect x="44" y="38" width="12" height="35" rx="6" fill="#3b82f6" />
                    {/* Animated Shoulder / Arms */}
                    <circle cx="34" cy="45" r="8" fill="#ef4444">
                      <animate attributeName="cy" values="45;38;45" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="66" cy="45" r="8" fill="#ef4444">
                      <animate attributeName="cy" values="45;38;45" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                )}

                {currentStep === 1 && (
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="25" r="12" fill="#f59e0b" />
                    <rect x="44" y="38" width="12" height="30" rx="6" fill="#3b82f6" />
                    {/* Animated Seated Legs */}
                    <line x1="44" y1="65" x2="25" y2="85" stroke="#10b981" strokeWidth="6" strokeLinecap="round">
                      <animate attributeName="y2" values="85;70;85" dur="1.2s" repeatCount="indefinite" />
                    </line>
                    <line x1="56" y1="65" x2="75" y2="85" stroke="#10b981" strokeWidth="6" strokeLinecap="round">
                      <animate attributeName="y2" values="70;85;70" dur="1.2s" repeatCount="indefinite" />
                    </line>
                  </svg>
                )}

                {currentStep === 2 && (
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="25" r="12" fill="#f59e0b" />
                    <rect x="44" y="38" width="12" height="35" rx="6" fill="#3b82f6" />
                    {/* Animated Hand/Finger Flex */}
                    <circle cx="20" cy="45" r="10" fill="#8b5cf6">
                      <animate attributeName="r" values="10;4;10" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="80" cy="45" r="10" fill="#8b5cf6">
                      <animate attributeName="r" values="10;4;10" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                )}
              </div>

              <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#b45309', marginBottom: '6px' }}>
                {lang === 'zh' ? stepsList[currentStep].titleZh : stepsList[currentStep].titleEn}
              </h4>
              <p style={{ fontSize: '13px', color: '#78350f', lineHeight: '1.4' }}>
                {lang === 'zh' ? stepsList[currentStep].guideZh : stepsList[currentStep].guideEn}
              </p>
            </div>

            {/* Countdown Display */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '42px', fontWeight: '900', color: 'var(--accent)', fontFamily: 'monospace' }}>
                00:{timeLeft.toString().padStart(2, '0')}
              </div>
            </div>

            {/* Controls Bar with Background Music Toggle */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
              <button 
                onClick={toggleTimer}
                className="btn-primary"
                style={{ background: isRunning ? 'var(--danger)' : 'var(--accent)', padding: '10px 24px', fontSize: '15px' }}
              >
                {isRunning ? <Pause size={18} /> : <Play size={18} />}
                <span>{isRunning ? t.pauseTimer : t.startTimer}</span>
              </button>

              <button 
                onClick={toggleMusic}
                style={{ background: isMusicOn ? '#fef08a' : '#e2e8f0', color: '#854d0e', border: 'none', padding: '10px 14px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}
              >
                <Music size={16} /> {isMusicOn ? t.musicOn : t.musicOff}
              </button>

              <button 
                onClick={resetExercise}
                style={{ background: '#e2e8f0', border: 'none', padding: '10px 14px', borderRadius: '12px', cursor: 'pointer' }}
                title="Reset"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Sparkles size={48} color="var(--accent)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
              🎉 太棒了！課程完成！
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              張奶奶今日已完成 5 分鐘椅上動一動！獲贈 🍎 健康蘋果大禮包
            </p>
            <button className="btn-primary" onClick={handleClose} style={{ width: '100%' }}>
              <CheckCircle2 size={18} /> {t.finishExercise}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
