import React, { useState } from 'react';
import { Activity, Droplet, Plus, Clock, FileText, Check, Volume2, ShieldCheck, Trash2 } from 'lucide-react';
import { tts } from '../services/ttsService';

export default function BathroomLog({ lang, t, caregiverCode }) {
  const [logs, setLogs] = useState([
    { id: 1, type: 'stool', stoolType: 'normal', time: '08:15', note: '形狀香蕉狀，量適中無便秘', loggedBy: 'CG-8821 (小美)' },
    { id: 2, type: 'urine', urineColor: 'clear', time: '10:30', note: '淡黃色清澈，水分補充充足', loggedBy: 'CG-8821 (小美)' },
    { id: 3, type: 'urine', urineColor: 'dark', time: '14:20', note: '顏色偏深，已提醒補充 250ml 溫水', loggedBy: 'CG-8821 (小美)' }
  ]);

  const [activeType, setActiveType] = useState('stool'); // 'stool' or 'urine'
  const [selectedStoolType, setSelectedStoolType] = useState('normal');
  const [selectedUrineColor, setSelectedUrineColor] = useState('clear');
  const [inputNote, setInputNote] = useState('');

  const handleAddLog = (e) => {
    e.preventDefault();
    const newLog = {
      id: Date.now(),
      type: activeType,
      stoolType: activeType === 'stool' ? selectedStoolType : null,
      urineColor: activeType === 'urine' ? selectedUrineColor : null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      note: inputNote || (activeType === 'stool' ? '正常打卡' : '小便打卡'),
      loggedBy: caregiverCode
    };

    setLogs([newLog, ...logs]);
    setInputNote('');
    tts.playChime('success');

    const msg = lang === 'zh' 
      ? `已成功打卡 ${activeType === 'stool' ? '大便紀錄' : '小便紀錄'}`
      : `Bathroom log added successfully`;
    tts.speak(msg, lang);
  };

  const handleDeleteLog = (id) => {
    const itemToDelete = logs.find(l => l.id === id);
    setLogs(prev => prev.filter(l => l.id !== id));
    tts.playChime('notification');
    const typeLabel = itemToDelete ? (itemToDelete.type === 'stool' ? '大便紀錄' : '小便紀錄') : '';
    tts.speak((lang === 'zh' ? '已刪除排泄紀錄：' : 'Deleted bathroom log: ') + typeLabel, lang);
  };

  const getStoolText = (st) => {
    if (st === 'normal') return t.stoolTypeNormal;
    if (st === 'soft') return t.stoolTypeSoft;
    return t.stoolTypeHard;
  };

  const getUrineText = (uc) => {
    if (uc === 'clear') return t.urineClear;
    return t.urineDark;
  };

  return (
    <div className="bathroom-log">
      {/* Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', borderColor: '#f472b6' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#9d174d', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={20} color="#be185d" /> {t.bathroomTitle}
        </h3>
        <p style={{ fontSize: '13px', color: '#be185d', marginTop: '2px' }}>{t.bathroomSubtitle}</p>
      </div>

      {/* Record Input Form */}
      <div className="card">
        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
          <button 
            className={`veg-tab ${activeType === 'stool' ? 'active' : ''}`}
            onClick={() => setActiveType('stool')}
            style={{ flex: 1, padding: '10px', fontSize: '14px', background: activeType === 'stool' ? '#b45309' : '#f1f5f9' }}
          >
            {t.recordStool}
          </button>
          <button 
            className={`veg-tab ${activeType === 'urine' ? 'active' : ''}`}
            onClick={() => setActiveType('urine')}
            style={{ flex: 1, padding: '10px', fontSize: '14px', background: activeType === 'urine' ? '#0284c7' : '#f1f5f9' }}
          >
            {t.recordUrine}
          </button>
        </div>

        <form onSubmit={handleAddLog}>
          {activeType === 'stool' ? (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-main)' }}>
                便便狀態 (Bristol 分級)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['normal', 'soft', 'hard'].map(type => (
                  <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: selectedStoolType === type ? '#fef3c7' : '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="stool" 
                      checked={selectedStoolType === type}
                      onChange={() => setSelectedStoolType(type)}
                    />
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#92400e' }}>
                      {getStoolText(type)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-main)' }}>
                尿液顏色觀察
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['clear', 'dark'].map(color => (
                  <label key={color} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: selectedUrineColor === color ? '#e0f2fe' : '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="urine" 
                      checked={selectedUrineColor === color}
                      onChange={() => setSelectedUrineColor(color)}
                    />
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#0369a1' }}>
                      {getUrineText(color)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>照護觀察備註</label>
            <input 
              type="text" 
              placeholder={t.notePlaceholder} 
              value={inputNote} 
              onChange={(e) => setInputNote(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', background: activeType === 'stool' ? '#b45309' : '#0284c7' }}>
            + 打卡送出紀錄
          </button>
        </form>
      </div>

      {/* History Log List with Delete button */}
      <div className="card">
        <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px', color: 'var(--text-main)' }}>
          今日健康排泄紀錄歷史
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {logs.map(log => (
            <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '900', color: log.type === 'stool' ? '#854d0e' : '#0284c7' }}>
                    {log.type === 'stool' ? '💩 大便' : '💧 小便'}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>
                    ⏰ {log.time}
                  </span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>
                  {log.type === 'stool' ? getStoolText(log.stoolType) : getUrineText(log.urineColor)}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  備註: {log.note}
                </div>
                {log.loggedBy && (
                  <div style={{ fontSize: '11px', color: '#4f46e5', fontWeight: '800', marginTop: '2px' }}>
                    🆔 打卡照顧者代號：{log.loggedBy}
                  </div>
                )}
              </div>

              <button 
                onClick={() => handleDeleteLog(log.id)}
                style={{ background: '#fee2e2', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
                title="刪除紀錄"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
