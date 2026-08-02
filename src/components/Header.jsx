import React from 'react';
import { Volume2, VolumeX, Type, Share2, Globe, Heart, ShieldCheck, UserCheck } from 'lucide-react';

export default function Header({ 
  lang, 
  setLang, 
  isVoiceOn, 
  setIsVoiceOn, 
  isLargeFont, 
  setIsLargeFont, 
  onOpenShare,
  onOpenProfile,
  elderProfile,
  caregiverCode,
  appleCount,
  t 
}) {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #eef2ff 100%)',
      padding: '16px',
      borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
      boxShadow: '0 4px 16px rgba(79, 70, 229, 0.08)'
    }}>
      {/* Top Main Brand Header with Cute Jelly Mascot */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Cute Jelly 3D Mascot Image */}
          <div style={{ position: 'relative' }}>
            <img 
              src="./jelly_mascot.jpg" 
              alt="CareMate Jelly Mascot" 
              onError={(e) => {
                // Fallback to cute avatar if image missing
                e.target.style.display = 'none';
              }}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                objectFit: 'cover',
                border: '2px solid #818cf8',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
              }}
            />
            <span style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: '#ef4444', color: 'white', borderRadius: '50%', padding: '2px 4px', fontSize: '9px', fontWeight: '900' }}>
              💖
            </span>
          </div>

          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {t.appName}
            </h1>
            <p style={{ fontSize: '11px', color: '#6366f1', fontWeight: '700' }}>{t.appSubtitle}</p>
          </div>
        </div>

        {/* Apple Counter Badge */}
        <div style={{
          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
          border: '1px solid #fca5a5',
          padding: '6px 12px',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 4px 10px rgba(239, 68, 68, 0.15)'
        }}>
          <span style={{ fontSize: '16px' }}>🍎</span>
          <span style={{ fontSize: '13px', fontWeight: '900', color: '#991b1b' }}>{appleCount}</span>
        </div>
      </div>

      {/* Recipient Profile & Caregiver Code Card */}
      <div 
        onClick={onOpenProfile}
        style={{
          background: '#ffffff',
          padding: '10px 14px',
          borderRadius: '16px',
          border: '1px solid #c7d2fe',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.08)',
          marginBottom: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: '#eef2ff', padding: '6px', borderRadius: '10px', color: '#4f46e5' }}>
            <UserCheck size={18} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '900', color: '#1e1b4b' }}>
              {elderProfile.name} ({elderProfile.age}歲)
            </div>
            <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: '800' }}>
              🆔 責任照顧者：{caregiverCode}
            </div>
          </div>
        </div>

        <span style={{ background: '#eef2ff', color: '#4f46e5', padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '800' }}>
          ✏️ 編輯
        </span>
      </div>

      {/* Utility Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
        {/* Language Switch */}
        <button
          onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
          style={{
            background: 'white',
            border: '1px solid #cbd5e1',
            padding: '6px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: '#334155'
          }}
        >
          <Globe size={14} color="#4f46e5" /> {lang === 'zh' ? 'EN' : '中文'}
        </button>

        {/* Voice Reminders Toggle */}
        <button
          onClick={() => setIsVoiceOn(!isVoiceOn)}
          style={{
            background: isVoiceOn ? '#eef2ff' : '#f1f5f9',
            border: '1px solid #c7d2fe',
            color: isVoiceOn ? '#4f46e5' : '#64748b',
            padding: '6px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {isVoiceOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
          {isVoiceOn ? t.voiceOn : t.voiceOff}
        </button>

        {/* Font Size Toggle */}
        <button
          onClick={() => setIsLargeFont(!isLargeFont)}
          style={{
            background: isLargeFont ? '#eef2ff' : '#f1f5f9',
            border: '1px solid #c7d2fe',
            color: isLargeFont ? '#4f46e5' : '#64748b',
            padding: '6px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Type size={14} />
          {isLargeFont ? t.fontLarge : t.fontNormal}
        </button>

        {/* Share Button */}
        <button
          onClick={onOpenShare}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '900',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
          }}
        >
          <Share2 size={14} /> 家人群組
        </button>
      </div>
    </header>
  );
}
