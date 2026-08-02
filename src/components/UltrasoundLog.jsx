import React, { useState } from 'react';
import { Camera, Activity, FileText, Heart, Volume2, Plus, Share2, X, Eye, Trash2, Calendar, Stethoscope } from 'lucide-react';
import { tts } from '../services/ttsService';

export default function UltrasoundLog({ lang, t }) {
  const [logs, setLogs] = useState([
    {
      id: 1,
      category: 'DailyCare', // 'DailyCare', 'Vitals', 'Prescription', 'Ultrasound'
      titleZh: '公園晨間散步與氣色記錄',
      titleEn: 'Morning Walk & Vitality Photo',
      logDate: '2026-07-26',
      recordedBy: 'CG-8821 (小美)',
      severity: 'normal',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      aiSummaryZh: '🤖 智照白話備註：張奶奶今天氣色非常好！晨間散步 20 分鐘步態穩健，心情愉悅，水分補充充足。',
      aiSummaryEn: '🤖 AI Summary: Grandma Chang had a great morning walk! Steady posture and good energy.'
    },
    {
      id: 2,
      category: 'Vitals',
      titleZh: '晨起血壓與心跳測量照 (122/78 mmHg)',
      titleEn: 'Morning Blood Pressure & Heart Rate Log',
      logDate: '2026-07-26',
      recordedBy: 'CG-8821 (小美)',
      severity: 'normal',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      aiSummaryZh: '🤖 智照白話備註：收縮壓 122 mmHg / 舒張壓 78 mmHg，心拍 72 次/分，數值非常標準完美！',
      aiSummaryEn: '🤖 AI Summary: BP 122/78 mmHg and HR 72 bpm are well within normal target range.'
    },
    {
      id: 3,
      category: 'Prescription',
      titleZh: '心臟內科慢性病連續處方籤',
      titleEn: 'Cardiology Prescription Receipt',
      logDate: '2026-07-20',
      recordedBy: '陳主任醫師',
      severity: 'monitor',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      aiSummaryZh: '🤖 智照白話備註：連續處方籤第 2 劑，包含降壓藥與抗凝血藥，請按時每日飯後服用。',
      aiSummaryEn: '🤖 AI Summary: Chronic refill prescription #2. Take BP medication after meals daily.'
    },
    {
      id: 4,
      category: 'Ultrasound',
      titleZh: '腹部超音波檢查 - 肝膽胰脾腎',
      titleEn: 'Abdominal Ultrasound Scan',
      logDate: '2026-07-15',
      recordedBy: '臺大醫院 影像醫學部',
      severity: 'monitor',
      imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      aiSummaryZh: '🤖 智照白話備註：超音波顯示僅有輕微脂肪肝，膽囊無結石，飲食保持少油高纖即可。',
      aiSummaryEn: '🤖 AI Summary: Mild fatty liver on abdominal ultrasound. Maintain low-fat diet.'
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedLog, setSelectedLog] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New Log Form State
  const [newCategory, setNewCategory] = useState('DailyCare');
  const [newTitle, setNewTitle] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newImageUrl, setNewImageUrl] = useState(null);

  const filteredLogs = activeFilter === 'All' 
    ? logs 
    : logs.filter(l => l.category === activeFilter);

  const handleDeleteLog = (id, e) => {
    if (e) e.stopPropagation();
    const itemToDelete = logs.find(l => l.id === id);
    setLogs(prev => prev.filter(l => l.id !== id));
    if (selectedLog && selectedLog.id === id) {
      setSelectedLog(null);
    }
    tts.playChime('notification');
    const title = itemToDelete ? itemToDelete.titleZh : '';
    tts.speak((lang === 'zh' ? '已刪除日常紀錄：' : 'Deleted daily log: ') + title, lang);
  };

  const handleSimulateUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewImageUrl(url);
    } else {
      setNewImageUrl('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80');
    }
  };

  const handleSaveLog = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const createdLog = {
      id: Date.now(),
      category: newCategory,
      titleZh: newTitle,
      titleEn: newTitle,
      logDate: new Date().toISOString().split('T')[0],
      recordedBy: 'CG-8821 (小美)',
      severity: 'normal',
      imageUrl: newImageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      aiSummaryZh: `🤖 智照白話備註：${newNotes || '今日日常照顧狀態良好，照片與觀察紀錄已完成存檔！'}`,
      aiSummaryEn: `🤖 AI Summary: ${newNotes || 'Daily care log recorded successfully.'}`
    };

    setLogs([createdLog, ...logs]);
    setShowUploadModal(false);
    setNewTitle('');
    setNewNotes('');
    setNewImageUrl(null);
    tts.playChime('success');
    tts.speak(lang === 'zh' ? '日常紀錄已成功拍照上傳！' : 'Daily log saved successfully!', lang);
  };

  const speakNotes = (log) => {
    const summary = lang === 'zh' ? log.aiSummaryZh : log.aiSummaryEn;
    tts.speak(summary, lang);
  };

  const getCategoryBadge = (category) => {
    if (category === 'DailyCare') return <span style={{ background: '#dbeafe', color: '#1e40af', padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '800' }}>📷 日常生活照</span>;
    if (category === 'Vitals') return <span style={{ background: '#fee2e2', color: '#991b1b', padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '800' }}>🩸 生理數值照</span>;
    if (category === 'Prescription') return <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '800' }}>📜 處方籤就醫</span>;
    return <span style={{ background: '#d1fae5', color: '#065f46', padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '800' }}>🩺 超音波影像</span>;
  };

  return (
    <div className="daily-log-view">
      {/* Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', borderColor: '#86efac' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Camera size={20} color="#15803d" /> {t.dailyLogTitle}
            </h3>
            <p style={{ fontSize: '13px', color: '#15803d', marginTop: '2px' }}>{t.dailyLogSubtitle}</p>
          </div>

          <button 
            onClick={() => setShowUploadModal(true)}
            style={{ background: '#16a34a', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '13px' }}
          >
            {t.uploadDailyLog}
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '14px', paddingBottom: '4px' }}>
        {[
          { key: 'All', label: t.filterAll },
          { key: 'DailyCare', label: t.filterDailyCare },
          { key: 'Vitals', label: t.filterVitals },
          { key: 'Prescription', label: t.filterPrescription },
          { key: 'Ultrasound', label: t.filterUltrasound }
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveFilter(cat.key)}
            style={{
              padding: '6px 14px',
              borderRadius: '16px',
              border: 'none',
              fontSize: '13px',
              fontWeight: '800',
              whiteSpace: 'nowrap',
              background: activeFilter === cat.key ? '#16a34a' : 'white',
              color: activeFilter === cat.key ? 'white' : 'var(--text-muted)',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Daily Logs List Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredLogs.map(log => (
          <div key={log.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
            {/* Log Image Banner */}
            <div 
              style={{ position: 'relative', width: '100%', height: '190px', cursor: 'pointer', background: '#000' }}
              onClick={() => setSelectedLog(log)}
            >
              <img src={log.imageUrl} alt={log.titleZh} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                {getCategoryBadge(log.category)}
              </div>
              <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '6px' }}>
                <button 
                  onClick={(e) => handleDeleteLog(log.id, e)}
                  style={{ background: 'rgba(239, 68, 68, 0.85)', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                  title="刪除紀錄"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Eye size={14} /> {t.viewFullScreen}
              </div>
            </div>

            {/* Log Details */}
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
                    {lang === 'zh' ? log.titleZh : log.titleEn}
                  </h4>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    🆔 紀錄者：{log.recordedBy}
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>
                  📅 {log.logDate}
                </span>
              </div>

              {/* AI Summary / Notes */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#166534' }}>
                    {t.aiAssistantTitle}
                  </span>
                  <button 
                    onClick={() => speakNotes(log)}
                    style={{ background: '#dcfce7', color: '#15803d', border: 'none', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                  >
                    <Volume2 size={14} /> {t.listenLog}
                  </button>
                </div>
                <p style={{ fontSize: '13px', color: '#14532d', lineHeight: '1.5' }}>
                  {lang === 'zh' ? log.aiSummaryZh : log.aiSummaryEn}
                </p>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '6px' }}>
                <button 
                  onClick={() => {
                    tts.speak(lang === 'zh' ? '已將日常紀錄同步分享至家人照顧群組' : 'Log shared with family', lang);
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                >
                  <Share2 size={14} /> {t.shareWithFamily}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Daily Log Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px' }}>{t.uploadDailyLog}</h3>
            <form onSubmit={handleSaveLog}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{t.logCategoryLabel}</label>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: '700' }}>
                  <option value="DailyCare">📷 日常生活照 (用餐/散步/笑容)</option>
                  <option value="Vitals">🩸 生理數值照 (血壓/血糖計照片)</option>
                  <option value="Prescription">📜 處方籤就醫 (診所單據/處方)</option>
                  <option value="Ultrasound">🩺 超音波與醫學影像</option>
                </select>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{t.logTitleLabel}</label>
                <input type="text" placeholder="例如: 陽台散步曬太陽與心情紀錄" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px' }} required />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{t.logNotesLabel}</label>
                <textarea rows="2" placeholder="填寫照護備註與觀察細節..." value={newNotes} onChange={(e) => setNewNotes(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px' }}></textarea>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>📷 拍照上傳紀錄相片</label>
                <input type="file" accept="image/*" onChange={handleSimulateUpload} style={{ width: '100%', fontSize: '13px' }} />
                {newImageUrl && (
                  <div style={{ marginTop: '8px', textAlign: 'center' }}>
                    <img src={newImageUrl} alt="Preview" style={{ width: '100px', height: '100px', borderRadius: '10px', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: '#e2e8f0', fontWeight: '700' }}>取消</button>
                <button type="submit" className="btn-primary">儲存日常紀錄</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fullscreen View Modal */}
      {selectedLog && (
        <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
          <div className="modal-card" style={{ background: '#000', color: 'white' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '15px', fontWeight: '800' }}>{selectedLog.titleZh}</span>
              <button onClick={() => setSelectedLog(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <img src={selectedLog.imageUrl} alt="Log photo" style={{ width: '100%', borderRadius: '12px', maxHeight: '50vh', objectFit: 'contain', marginBottom: '14px' }} />

            <div style={{ background: '#1e293b', padding: '12px', borderRadius: '12px', fontSize: '13px', lineHeight: '1.5' }}>
              <div style={{ color: '#4ade80', fontWeight: '800', marginBottom: '4px' }}>AI 智照白話備註：</div>
              {selectedLog.aiSummaryZh}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
