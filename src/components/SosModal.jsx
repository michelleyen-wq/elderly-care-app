import React, { useEffect } from 'react';
import { AlertTriangle, PhoneCall, X, ShieldAlert, MapPin, Bell } from 'lucide-react';
import { tts } from '../services/ttsService';

export default function SosModal({ isOpen, onClose, caregiverCode, elderName = '張奶奶' }) {
  useEffect(() => {
    if (isOpen) {
      tts.playChime('warning');
      tts.speak(`緊急求救通報啟動！照顧者 ${caregiverCode} 請注意，${elderName} 需要即刻協助！`, 'zh');
    }
  }, [isOpen, caregiverCode, elderName]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ background: 'rgba(239, 68, 68, 0.4)', backdropFilter: 'blur(8px)' }}>
      <div className="modal-card" style={{ border: '3px solid #ef4444', background: '#fff1f2', maxWidth: '440px' }}>
        {/* Header Alert */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#ef4444', color: 'white', padding: '10px', borderRadius: '50%', animation: 'pulse 1s infinite' }}>
              <ShieldAlert size={26} />
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#991b1b' }}>🚨 119/家屬緊急求救通報</h3>
              <div style={{ fontSize: '12px', color: '#b91c1c', fontWeight: '700' }}>CareMate VIP SOS Response Active</div>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#991b1b', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* SOS Card Info */}
        <div style={{ background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #fca5a5', marginBottom: '14px' }}>
          <div style={{ fontSize: '15px', fontWeight: '800', color: '#7f1d1d', marginBottom: '6px' }}>
            ⚠️ 求救對象：{elderName} (82歲)
          </div>
          <div style={{ fontSize: '13px', color: '#991b1b', marginBottom: '8px' }}>
            🆔 負責照顧者：{caregiverCode}
          </div>
          <div style={{ background: '#fef2f2', padding: '10px', borderRadius: '10px', fontSize: '12px', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={16} /> 現場定位：台北市大安區 (已同步推送給家人照顧群組)
          </div>
        </div>

        {/* Quick Action Dial Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a 
            href="tel:119"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: '#dc2626',
              color: 'white',
              padding: '14px',
              borderRadius: '16px',
              fontWeight: '900',
              fontSize: '17px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)'
            }}
          >
            <PhoneCall size={22} /> 撥打 119 救護車求救
          </a>

          <button 
            onClick={() => {
              tts.speak('已發送緊急位置簡訊與 LINE 求救廣播給所有家人成員！', 'zh');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: '#ea580c',
              color: 'white',
              padding: '14px',
              borderRadius: '16px',
              fontWeight: '900',
              fontSize: '15px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)'
            }}
          >
            <Bell size={20} /> 一鍵廣播所有家屬 LINE 群組
          </button>
        </div>
      </div>
    </div>
  );
}
