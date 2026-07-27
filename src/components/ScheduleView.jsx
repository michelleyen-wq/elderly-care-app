import React, { useState } from 'react';
import { CheckCircle2, Circle, Volume2, Plus, Calendar, Clock, UserCheck, Camera, Edit3, Sparkles, ShieldCheck, Trash2 } from 'lucide-react';
import { tts } from '../services/ttsService';

export default function ScheduleView({ lang, t, caregiverCode, onEarnApple }) {
  const [schedules, setSchedules] = useState([
    { id: 1, time: '07:30', period: 'morning', textZh: '晨起溫水 200ml 與血壓打卡', textEn: 'Morning warm water (200ml) & BP check', done: true, photo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80', loggedBy: 'CG-8821 (小美)' },
    { id: 2, time: '08:30', period: 'morning', textZh: '享用早餐：紅豆燕麥粥 + 蒸蛋白', textEn: 'Breakfast: Oatmeal Porridge + Steamed Egg', done: true, photo: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=400&q=80', loggedBy: 'CG-8821 (小美)' },
    { id: 3, time: '10:00', period: 'morning', textZh: '客廳椅上溫和伸展運動 (5分鐘)', textEn: 'Seated chair stretches in living room (5m)', done: false, photo: null, loggedBy: null },
    { id: 4, time: '12:30', period: 'afternoon', textZh: '午餐及飯後服用降壓藥 1 顆', textEn: 'Lunch & BP medication (1 pill)', done: false, photo: null, loggedBy: null },
    { id: 5, time: '15:00', period: 'afternoon', textZh: '陽台曬太陽與補充水分 (250ml)', textEn: 'Balcony sunshine & Hydration (250ml)', done: false, photo: null, loggedBy: null }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [inputTime, setInputTime] = useState('14:00');
  const [inputText, setInputText] = useState('');
  const [inputPhoto, setInputPhoto] = useState(null);
  const [showAppleToast, setShowAppleToast] = useState(false);

  const toggleDone = (id) => {
    setSchedules(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.done;
        if (nextState) {
          tts.playChime('apple');
          onEarnApple();
          setShowAppleToast(true);
          setTimeout(() => setShowAppleToast(false), 2500);

          const title = lang === 'zh' ? item.textZh : item.textEn;
          tts.speak(t.appleEarned + ' ' + title, lang);
        }
        return { ...item, done: nextState, loggedBy: nextState ? caregiverCode : null };
      }
      return item;
    }));
  };

  const handleDeleteSchedule = (id, e) => {
    e.stopPropagation();
    const itemToDelete = schedules.find(s => s.id === id);
    setSchedules(prev => prev.filter(s => s.id !== id));
    tts.playChime('notification');
    const title = itemToDelete ? (lang === 'zh' ? itemToDelete.textZh : itemToDelete.textEn) : '';
    tts.speak((lang === 'zh' ? '已刪除行程：' : 'Deleted schedule: ') + title, lang);
  };

  const speakItem = (item, e) => {
    e.stopPropagation();
    const text = lang === 'zh' ? `${item.time} ${item.textZh}` : `${item.time} ${item.textEn}`;
    tts.speak(text, lang);
  };

  const openAddModal = () => {
    setEditingId(null);
    setInputTime('14:00');
    setInputText('');
    setInputPhoto(null);
    setShowModal(true);
  };

  const openEditModal = (item, e) => {
    e.stopPropagation();
    setEditingId(item.id);
    setInputTime(item.time);
    setInputText(lang === 'zh' ? item.textZh : item.textEn);
    setInputPhoto(item.photo);
    setShowModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (editingId) {
      setSchedules(prev => prev.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            time: inputTime,
            textZh: inputText,
            textEn: inputText,
            photo: inputPhoto
          };
        }
        return item;
      }));
      tts.speak(lang === 'zh' ? '行程更新成功' : 'Schedule updated', lang);
    } else {
      const newItem = {
        id: Date.now(),
        time: inputTime,
        period: parseInt(inputTime.split(':')[0]) < 12 ? 'morning' : 'afternoon',
        textZh: inputText,
        textEn: inputText,
        done: false,
        photo: inputPhoto || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80',
        loggedBy: caregiverCode
      };
      setSchedules([...schedules, newItem]);
      tts.speak(lang === 'zh' ? '新增行程成功' : 'Schedule added', lang);
    }
    setShowModal(false);
  };

  const handleSimulatePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setInputPhoto(url);
    } else {
      setInputPhoto('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80');
    }
  };

  return (
    <div className="schedule-view">
      {/* Apple Toast Banner */}
      {showAppleToast && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)',
          color: '#854d0e',
          padding: '12px 24px',
          borderRadius: '30px',
          fontWeight: '900',
          fontSize: '15px',
          boxShadow: '0 10px 25px rgba(250, 204, 21, 0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <Sparkles size={20} color="#ca8a04" />
          {t.appleEarned}
        </div>
      )}

      {/* Header Card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', borderColor: '#c7d2fe' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#3730a3', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={20} /> {t.scheduleTitle}
            </h3>
            <p style={{ fontSize: '13px', color: '#4338ca', marginTop: '2px', fontWeight: '700' }}>
              <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px' }} />
              {t.caregiver} <span style={{ color: '#1e1b4b', background: 'white', padding: '2px 8px', borderRadius: '8px' }}>{caregiverCode}</span>
            </p>
          </div>
          <button 
            className="btn-primary" 
            onClick={() => {
              const pending = schedules.filter(s => !s.done);
              const text = lang === 'zh'
                ? `待完成 ${pending.length} 項行程`
                : `${pending.length} routines pending`;
              tts.speak(text, lang);
            }} 
            style={{ padding: '8px 12px', fontSize: '13px' }}
          >
            <Volume2 size={16} /> {t.readAloud}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)' }}>
          {schedules.filter(s => s.done).length} / {schedules.length} {t.completed} (獲得 🍎 {schedules.filter(s => s.done).length})
        </span>
        <button 
          onClick={openAddModal}
          style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', padding: '8px 14px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Plus size={16} /> {t.addScheduleBtn}
        </button>
      </div>

      {/* Schedule Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {schedules.map(item => (
          <div 
            key={item.id}
            onClick={() => toggleDone(item.id)}
            className="card"
            style={{
              padding: '14px',
              marginBottom: 0,
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              borderLeft: item.done ? '6px solid var(--success)' : '6px solid var(--primary)',
              opacity: item.done ? 0.8 : 1,
              background: item.done ? '#f8fafc' : 'white'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: item.photo || item.loggedBy ? '8px' : '0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                {item.done ? (
                  <CheckCircle2 color="var(--success)" size={26} style={{ flexShrink: 0 }} />
                ) : (
                  <Circle color="var(--primary)" size={26} style={{ flexShrink: 0 }} />
                )}
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {item.time}
                    {item.done && <span style={{ marginLeft: '6px', color: '#eab308' }}>🍎 +1</span>}
                  </div>
                  <div style={{ 
                    fontSize: '15px', 
                    fontWeight: '700', 
                    color: item.done ? 'var(--text-muted)' : 'var(--text-main)',
                    textDecoration: item.done ? 'line-through' : 'none'
                  }}>
                    {lang === 'zh' ? item.textZh : item.textEn}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <button 
                  onClick={(e) => openEditModal(item, e)}
                  style={{ background: '#f1f5f9', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
                  title={t.editScheduleBtn}
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={(e) => speakItem(item, e)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '6px' }}
                >
                  <Volume2 size={20} />
                </button>
                <button 
                  onClick={(e) => handleDeleteSchedule(item.id, e)}
                  style={{ background: '#fee2e2', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
                  title="刪除行程"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Caregiver Code Stamp */}
            {item.loggedBy && (
              <div style={{ fontSize: '11px', color: '#4f46e5', fontWeight: '800', background: '#eef2ff', padding: '2px 8px', borderRadius: '6px', width: 'fit-content', marginBottom: '6px' }}>
                🆔 打卡照顧者代號：{item.loggedBy}
              </div>
            )}

            {/* Attached Photo Log */}
            {item.photo && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#f8fafc', padding: '8px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <img src={item.photo} alt="Care photo" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>
                  <Camera size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  {t.photoAttached}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add / Edit Schedule Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px' }}>
              {editingId ? t.editScheduleBtn : t.addScheduleBtn}
            </h3>
            <form onSubmit={handleFormSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{t.medTime}</label>
                <input 
                  type="time" 
                  value={inputTime} 
                  onChange={(e) => setInputTime(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '16px' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{t.scheduleTitle}</label>
                <input 
                  type="text" 
                  placeholder="例如: 服用午餐降壓藥" 
                  value={inputText} 
                  onChange={(e) => setInputText(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{t.attachPhoto}</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleSimulatePhotoUpload}
                  style={{ width: '100%', fontSize: '13px' }}
                />
                {inputPhoto && (
                  <div style={{ marginTop: '8px' }}>
                    <img src={inputPhoto} alt="Preview" style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: '#e2e8f0', fontWeight: '700' }}
                >
                  取消
                </button>
                <button type="submit" className="btn-primary">
                  儲存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
