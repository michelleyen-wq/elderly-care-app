import React from 'react';
import { Volume2, VolumeX, Globe, Type, Share2, Heart, Edit3 } from 'lucide-react';
import { tts } from '../services/ttsService';

export default function Header({ lang, setLang, isVoiceOn, setIsVoiceOn, isLargeFont, setIsLargeFont, onOpenShare, onOpenProfile, elderProfile, appleCount, t }) {
  
  const toggleVoice = () => {
    const nextState = !isVoiceOn;
    setIsVoiceOn(nextState);
    tts.setVoiceEnabled(nextState);
    if (nextState) {
      tts.speak(lang === 'zh' ? '語音提醒已開啟' : 'Voice alerts turned ON', lang);
    }
  };

  const toggleLang = () => {
    const nextLang = lang === 'zh' ? 'en' : 'zh';
    setLang(nextLang);
    tts.speak(nextLang === 'zh' ? '已切換為中文' : 'Switched to English', nextLang);
  };

  const toggleFontSize = () => {
    setIsLargeFont(!isLargeFont);
  };

  // Determine avatar icon by gender
  const genderIcon = elderProfile.gender === 'male' ? '👴' : (elderProfile.gender === 'female' ? '👵' : '👤');

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand-title">
          <Heart fill="#ef4444" color="#ef4444" size={24} />
          {t.appName}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Apple Rewards Badge */}
          <div style={{ background: '#fef08a', color: '#854d0e', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
            🍎 {appleCount}
          </div>
          {/* Editable Elder Recipient Badge */}
          <div 
            onClick={onOpenProfile}
            className="elder-badge"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            title={t.editProfileTitle}
          >
            <span>{genderIcon}</span> {elderProfile.name} ({elderProfile.age} 歲)
            <Edit3 size={13} style={{ marginLeft: '2px', opacity: 0.8 }} />
          </div>
        </div>
      </div>

      <div className="controls-bar">
        <button className={`ctrl-btn ${isVoiceOn ? 'active' : ''}`} onClick={toggleVoice} title="Voice TTS">
          {isVoiceOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span>{isVoiceOn ? t.voiceOn : t.voiceOff}</span>
        </button>

        <button className="ctrl-btn" onClick={toggleLang} title="Switch Language">
          <Globe size={16} />
          <span>{lang === 'zh' ? 'EN' : '繁中'}</span>
        </button>

        <button className={`ctrl-btn ${isLargeFont ? 'active' : ''}`} onClick={toggleFontSize} title="Font Size">
          <Type size={16} />
          <span>{isLargeFont ? t.fontLarge : t.fontNormal}</span>
        </button>

        <button className="ctrl-btn" onClick={onOpenShare} style={{ background: '#f59e0b', color: 'white' }}>
          <Share2 size={16} />
        </button>
      </div>
    </header>
  );
}
