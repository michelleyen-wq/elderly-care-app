import React, { useState } from 'react';
import { FileImage, Activity, AlertCircle, CheckCircle2, ChevronRight, Volume2, Plus, Share2, X, Eye, ShieldAlert, Heart, Stethoscope, Trash2 } from 'lucide-react';
import { tts } from '../services/ttsService';

export default function UltrasoundLog({ lang, t }) {
  const [scans, setScans] = useState([
    {
      id: 1,
      category: 'Abdomen',
      titleZh: '腹部超音波檢查 - 肝膽胰脾腎',
      titleEn: 'Abdominal Ultrasound - Liver & Gallbladder',
      scanDate: '2026-07-20',
      hospital: '臺大醫院 影像醫學部',
      doctor: '林主治醫師',
      nextAppt: '2026-10-20 (3個月後追蹤)',
      severity: 'monitor', // 'normal', 'monitor', 'attention'
      imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      
      // Sonographic & Clinical Parameters
      parameters: {
        echogenicityZh: '肝臟回聲稍增強，提示輕度脂肪肝趨勢；膽囊壁光滑無結石。',
        echogenicityEn: 'Mild increase in liver echogenicity; smooth gallbladder wall.',
        dopplerFlowZh: '門靜脈血流暢通 (Vmax: 24 cm/s)，無異常迴流。',
        dopplerFlowEn: 'Patent portal vein flow (Vmax: 24 cm/s).',
        organSizeZh: '右肝跨徑 12.8 cm (標準範圍)，脾臟長軸 8.5 cm (正常)。',
        organSizeEn: 'Right liver lobe 12.8 cm, spleen 8.5 cm (Normal).'
      },

      // AI Caregiver Plain-Language Summary
      aiSummaryZh: '🤖 智照白話解讀：張奶奶的肝膽超音波整體良好！僅有「輕微脂肪肝」，代表平時飲食要稍微減少油膩煎炸物，多吃高纖蔬菜與多喝水。三個月後定時回診複查即可，家人不必過度擔心。',
      aiSummaryEn: '🤖 AI Caregiver Summary: Grandma Chang\'s abdominal scan looks overall good! Only mild fatty liver found. We recommend light low-fat meals and hydration.'
    },
    {
      id: 2,
      category: 'Cardiac',
      titleZh: '心臟彩色多普勒超音波 (ECHO)',
      titleEn: 'Echocardiogram (Cardiac Color Doppler)',
      scanDate: '2026-06-15',
      hospital: '榮民總醫院 心臟內科',
      doctor: '陳主任醫師',
      nextAppt: '2026-12-15 (半年定期複查)',
      severity: 'normal',
      imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      
      parameters: {
        echogenicityZh: '左心室收縮功能良好，射血分數 (LVEF): 65% (標準 > 55%)。',
        echogenicityEn: 'Preserved LV systolic function, LVEF: 65%.',
        dopplerFlowZh: '二尖瓣輕度逆流 (Mild MR)，主動脈瓣血流速正常。',
        dopplerFlowEn: 'Mild mitral regurgitation, aortic flow normal.',
        organSizeZh: '左心房內徑 3.4 cm，心室壁厚度 0.9 cm (未見肥厚)。',
        organSizeEn: 'LA diameter 3.4 cm, LV wall thickness 0.9 cm.'
      },

      aiSummaryZh: '🤖 智照白話解讀：張奶奶的心臟幫浦收縮能力非常好 (65%)！只有高齡常見的「輕微心臟瓣膜微逆流」，屬於正常退化現象。平時保持適度運動與定時量血壓即可。',
      aiSummaryEn: '🤖 AI Caregiver Summary: Heart contraction power is strong (65%)! Only age-related mild mitral regurgitation.'
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedScan, setSelectedScan] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New Scan Form State
  const [newCategory, setNewCategory] = useState('Abdomen');
  const [newTitle, setNewTitle] = useState('');
  const [newDoctor, setNewDoctor] = useState('');
  const [newFindings, setNewFindings] = useState('');
  const [newImageUrl, setNewImageUrl] = useState(null);

  const filteredScans = activeFilter === 'All' 
    ? scans 
    : scans.filter(s => s.category === activeFilter);

  const handleDeleteScan = (id, e) => {
    if (e) e.stopPropagation();
    const itemToDelete = scans.find(s => s.id === id);
    setScans(prev => prev.filter(s => s.id !== id));
    if (selectedScan && selectedScan.id === id) {
      setSelectedScan(null);
    }
    tts.playChime('notification');
    const title = itemToDelete ? (lang === 'zh' ? itemToDelete.titleZh : itemToDelete.titleEn) : '';
    tts.speak((lang === 'zh' ? '已刪除超音波紀錄：' : 'Deleted scan record: ') + title, lang);
  };

  const handleSimulateUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewImageUrl(url);
    } else {
      setNewImageUrl('https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80');
    }
  };

  const handleSaveScan = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const createdScan = {
      id: Date.now(),
      category: newCategory,
      titleZh: newTitle,
      titleEn: newTitle,
      scanDate: new Date().toISOString().split('T')[0],
      hospital: '常規居家健檢合作診所',
      doctor: newDoctor || '主治醫師',
      nextAppt: '依醫囑定期回診',
      severity: 'normal',
      imageUrl: newImageUrl || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      parameters: {
        echogenicityZh: newFindings || '超音波影像結構完整，未見明顯急性異狀。',
        echogenicityEn: newFindings || 'Normal structure, no acute findings.',
        dopplerFlowZh: '血流多普勒訊號正常。',
        dopplerFlowEn: 'Doppler signals normal.',
        organSizeZh: '器官尺寸於正常參考值範圍內。',
        organSizeEn: 'Organ measurements within reference range.'
      },
      aiSummaryZh: `🤖 智照白話解讀：最新上傳的${newTitle}影像已完成紀錄，建議定期給主治醫師追蹤！`,
      aiSummaryEn: `🤖 AI Summary: Uploaded ultrasound ${newTitle} recorded successfully.`
    };

    setScans([createdScan, ...scans]);
    setShowUploadModal(false);
    tts.playChime('success');
    tts.speak(lang === 'zh' ? '超音波影像上傳成功！' : 'Ultrasound uploaded successfully!', lang);
  };

  const speakInterpretation = (scan) => {
    const summary = lang === 'zh' ? scan.aiSummaryZh : scan.aiSummaryEn;
    tts.speak(summary, lang);
  };

  const getSeverityBadge = (severity) => {
    if (severity === 'normal') {
      return <span style={{ background: '#d1fae5', color: '#047857', padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '800' }}>{t.severityNormal}</span>;
    }
    if (severity === 'monitor') {
      return <span style={{ background: '#fef3c7', color: '#b45309', padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '800' }}>{t.severityMonitor}</span>;
    }
    return <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '800' }}>{t.severityAttention}</span>;
  };

  return (
    <div className="ultrasound-log">
      {/* Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', borderColor: '#86efac' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Stethoscope size={20} color="#15803d" /> {t.ultrasoundTitle}
            </h3>
            <p style={{ fontSize: '13px', color: '#15803d', marginTop: '2px' }}>{t.ultrasoundSubtitle}</p>
          </div>

          <button 
            onClick={() => setShowUploadModal(true)}
            style={{ background: '#16a34a', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '13px' }}
          >
            {t.uploadUltrasound}
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '14px', paddingBottom: '4px' }}>
        {['All', 'Abdomen', 'Cardiac', 'Carotid'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: '16px',
              border: 'none',
              fontSize: '13px',
              fontWeight: '800',
              whiteSpace: 'nowrap',
              background: activeFilter === cat ? '#16a34a' : 'white',
              color: activeFilter === cat ? 'white' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            {cat === 'All' ? t.filterAll : cat === 'Abdomen' ? t.filterAbdomen : cat === 'Cardiac' ? t.filterCardiac : t.filterCarotid}
          </button>
        ))}
      </div>

      {/* Ultrasound Scans List Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredScans.map(scan => (
          <div key={scan.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
            {/* Scan Image Header with Overlay Badge & Delete button */}
            <div 
              style={{ position: 'relative', width: '100%', height: '180px', cursor: 'pointer', background: '#000' }}
              onClick={() => setSelectedScan(scan)}
            >
              <img src={scan.imageUrl} alt={scan.titleZh} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                {getSeverityBadge(scan.severity)}
              </div>
              <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '6px' }}>
                <button 
                  onClick={(e) => handleDeleteScan(scan.id, e)}
                  style={{ background: 'rgba(239, 68, 68, 0.85)', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                  title="刪除影像紀錄"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Eye size={14} /> {t.viewFullScreen}
              </div>
            </div>

            {/* Scan Details & Diagnostic Parameters */}
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
                    {lang === 'zh' ? scan.titleZh : scan.titleEn}
                  </h4>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    🏥 {scan.hospital} • {scan.doctor}
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>
                  📅 {scan.scanDate}
                </span>
              </div>

              {/* Clinical Interpretation Parameters */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', marginBottom: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  🩺 {t.interpretationTitle}
                </div>
                <div style={{ fontSize: '12px', color: '#334155', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><strong>• {t.echogenicity}:</strong> {lang === 'zh' ? scan.parameters.echogenicityZh : scan.parameters.echogenicityEn}</div>
                  <div><strong>• {t.dopplerFlow}:</strong> {lang === 'zh' ? scan.parameters.dopplerFlowZh : scan.parameters.dopplerFlowEn}</div>
                  <div><strong>• {t.organSize}:</strong> {lang === 'zh' ? scan.parameters.organSizeZh : scan.parameters.organSizeEn}</div>
                </div>
              </div>

              {/* AI Plain-Language Summary Box */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#166534' }}>
                    {t.aiAssistantTitle}
                  </span>
                  <button 
                    onClick={() => speakInterpretation(scan)}
                    style={{ background: '#dcfce7', color: '#15803d', border: 'none', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                  >
                    <Volume2 size={14} /> {t.listenInterpretation}
                  </button>
                </div>
                <p style={{ fontSize: '13px', color: '#14532d', lineHeight: '1.5' }}>
                  {lang === 'zh' ? scan.aiSummaryZh : scan.aiSummaryEn}
                </p>
              </div>

              {/* Footer Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px stroke #f1f5f9', fontSize: '12px', fontWeight: '700', color: '#ca8a04' }}>
                <span>⏰ 下次複診：{scan.nextAppt}</span>
                <button 
                  onClick={() => {
                    tts.speak(lang === 'zh' ? '已將超音波報告備份分享至家庭群組' : 'Report shared with family', lang);
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Share2 size={14} /> {t.shareWithDoctor}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Scan Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px' }}>{t.uploadUltrasound}</h3>
            <form onSubmit={handleSaveScan}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>檢查項目類別</label>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px' }}>
                  <option value="Abdomen">腹部超音波</option>
                  <option value="Cardiac">心臟超音波</option>
                  <option value="Carotid">頸動脈超音波</option>
                </select>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>檢查名稱</label>
                <input type="text" placeholder="例如: 腹部超音波追蹤" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px' }} required />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>主治醫師</label>
                <input type="text" placeholder="例如: 陳醫師" value={newDoctor} onChange={(e) => setNewDoctor(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>診斷摘要或觀察</label>
                <textarea rows="2" placeholder="填寫醫師說明的注意事項..." value={newFindings} onChange={(e) => setNewFindings(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px' }}></textarea>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>選擇超音波相片檔案</label>
                <input type="file" accept="image/*" onChange={handleSimulateUpload} style={{ width: '100%', fontSize: '13px' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: '#e2e8f0', fontWeight: '700' }}>取消</button>
                <button type="submit" className="btn-primary">儲存超音波紀錄</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fullscreen View Modal */}
      {selectedScan && (
        <div className="modal-overlay" onClick={() => setSelectedScan(null)}>
          <div className="modal-card" style={{ background: '#000', color: 'white' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '15px', fontWeight: '800' }}>{selectedScan.titleZh}</span>
              <button onClick={() => setSelectedScan(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <img src={selectedScan.imageUrl} alt="Ultrasound scan" style={{ width: '100%', borderRadius: '12px', maxHeight: '50vh', objectFit: 'contain', marginBottom: '14px' }} />

            <div style={{ background: '#1e293b', padding: '12px', borderRadius: '12px', fontSize: '13px', lineHeight: '1.5' }}>
              <div style={{ color: '#4ade80', fontWeight: '800', marginBottom: '4px' }}>AI 家屬白話翻譯：</div>
              {selectedScan.aiSummaryZh}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
