import React, { useState } from 'react';
import { Users, Copy, Check, X, Share2, MessageCircle } from 'lucide-react';
import { tts } from '../services/ttsService';

export default function FamilyShareModal({ isOpen, onClose, lang, t }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    setCopied(true);
    tts.playChime('success');
    tts.speak(lang === 'zh' ? '照顧日誌連結已複製到剪貼簿！' : 'Care log link copied!', lang);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={22} color="var(--primary)" /> {t.familyShareTitle}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
          {t.familyShareDesc}
        </p>

        {/* Member Status List */}
        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px' }}>
            👥 共同紀錄成員：
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>👧 小美 (主要照顧者)</span>
              <span style={{ color: 'var(--success)', fontWeight: '700' }}>在線紀錄中</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>👨 大明 (兒子)</span>
              <span style={{ color: 'var(--text-muted)' }}>10 分鐘前查看</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>👩‍⚕️ 林護理師 (長照照專)</span>
              <span style={{ color: 'var(--text-muted)' }}>今天 09:00 查看</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={handleCopy} style={{ flex: 1 }}>
            {copied ? <><Check size={16} /> 已複製！</> : <><Copy size={16} /> {t.copyLink}</>}
          </button>
          <button onClick={onClose} style={{ padding: '10px 16px', borderRadius: '12px', border: 'none', background: '#e2e8f0', fontWeight: '700' }}>
            {t.closeModal}
          </button>
        </div>
      </div>
    </div>
  );
}
