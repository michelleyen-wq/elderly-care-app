import React, { useState } from 'react';
import { Pill, Droplets, Check, Plus, Bell, Volume2, Sparkles, Award, Calculator, Camera, Edit3, X, Clock, Utensils, Trash2 } from 'lucide-react';
import { tts } from '../services/ttsService';

export default function HealthTracker({ lang, t, caregiverCode }) {
  const [meds, setMeds] = useState([
    {
      id: 1,
      nameZh: '氨氯地平 (降血壓藥 5mg)',
      nameEn: 'Amlodipine (BP 5mg)',
      period: 'breakfast',
      timing: 'after',
      time: '08:30',
      dose: '1 顆',
      taken: true,
      photo: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
      loggedBy: 'CG-8821 (小美)'
    },
    {
      id: 2,
      nameZh: '阿斯匹靈 (抗凝血 100mg)',
      nameEn: 'Aspirin (100mg)',
      period: 'lunch',
      timing: 'after',
      time: '12:30',
      dose: '1 顆',
      taken: false,
      photo: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&q=80',
      loggedBy: null
    },
    {
      id: 3,
      nameZh: '鈣片 + 維生素 D3',
      nameEn: 'Calcium + Vit D3',
      period: 'dinner',
      timing: 'after',
      time: '18:30',
      dose: '1 錠 (咬碎服)',
      taken: false,
      photo: 'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=400&q=80',
      loggedBy: null
    }
  ]);

  // Water hydration state
  const [waterGoal, setWaterGoal] = useState(1750);
  const [waterCurrent, setWaterCurrent] = useState(950);

  // Modals state
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [inputWeight, setInputWeight] = useState(58);
  const [inputAge, setInputAge] = useState(82);

  // Rainbow celebration toast
  const [showRainbow, setShowRainbow] = useState(false);

  // Edit / Add Medication Modal State
  const [showMedModal, setShowMedModal] = useState(false);
  const [editingMedId, setEditingMedId] = useState(null);
  const [medInputName, setMedInputName] = useState('');
  const [medInputPeriod, setMedInputPeriod] = useState('breakfast');
  const [medInputTiming, setMedInputTiming] = useState('after');
  const [medInputTime, setMedInputTime] = useState('08:00');
  const [medInputDose, setMedInputDose] = useState('1 顆');
  const [medInputPhoto, setMedInputPhoto] = useState(null);

  const toggleMed = (id) => {
    setMeds(prev => prev.map(m => {
      if (m.id === id) {
        const nextState = !m.taken;
        if (nextState) {
          setShowRainbow(true);
          tts.playChime('rainbow');
          setTimeout(() => setShowRainbow(false), 3000);

          const medName = lang === 'zh' ? m.nameZh : m.nameEn;
          tts.speak(t.rainbowCelebration + ' ' + medName, lang);
        }
        return { ...m, taken: nextState, loggedBy: nextState ? caregiverCode : null };
      }
      return m;
    }));
  };

  const handleDeleteMed = (id, e) => {
    e.stopPropagation();
    const itemToDelete = meds.find(m => m.id === id);
    setMeds(prev => prev.filter(m => m.id !== id));
    tts.playChime('notification');
    const name = itemToDelete ? (lang === 'zh' ? itemToDelete.nameZh : itemToDelete.nameEn) : '';
    tts.speak((lang === 'zh' ? '已刪除藥物提醒：' : 'Deleted medication: ') + name, lang);
  };

  const openAddMedModal = () => {
    setEditingMedId(null);
    setMedInputName('');
    setMedInputPeriod('breakfast');
    setMedInputTiming('after');
    setMedInputTime('08:00');
    setMedInputDose('1 顆');
    setMedInputPhoto(null);
    setShowMedModal(true);
  };

  const openEditMedModal = (m, e) => {
    e.stopPropagation();
    setEditingMedId(m.id);
    setMedInputName(lang === 'zh' ? m.nameZh : m.nameEn);
    setMedInputPeriod(m.period);
    setMedInputTiming(m.timing);
    setMedInputTime(m.time);
    setMedInputDose(m.dose);
    setMedInputPhoto(m.photo);
    setShowMedModal(true);
  };

  const handleMedFormSubmit = (e) => {
    e.preventDefault();
    if (!medInputName.trim()) return;

    if (editingMedId) {
      setMeds(prev => prev.map(m => {
        if (m.id === editingMedId) {
          return {
            ...m,
            nameZh: medInputName,
            nameEn: medInputName,
            period: medInputPeriod,
            timing: medInputTiming,
            time: medInputTime,
            dose: medInputDose,
            photo: medInputPhoto
          };
        }
        return m;
      }));
      tts.speak(lang === 'zh' ? '藥物設定與照片已更新' : 'Medication updated', lang);
    } else {
      const newMed = {
        id: Date.now(),
        nameZh: medInputName,
        nameEn: medInputName,
        period: medInputPeriod,
        timing: medInputTiming,
        time: medInputTime,
        dose: medInputDose,
        taken: false,
        photo: medInputPhoto || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
        loggedBy: caregiverCode
      };
      setMeds([...meds, newMed]);
      tts.speak(lang === 'zh' ? '新增藥物提醒成功' : 'New medication added', lang);
    }
    setShowMedModal(false);
  };

  const handlePillPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMedInputPhoto(url);
    } else {
      setMedInputPhoto('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80');
    }
  };

  const handleCalcWater = (e) => {
    e.preventDefault();
    const weight = parseFloat(inputWeight) || 60;
    const age = parseInt(inputAge) || 80;

    let calculated = Math.round(weight * 30);
    if (age > 75) calculated = Math.round(weight * 28 + 100);
    calculated = Math.max(1200, Math.min(2500, calculated));

    setWaterGoal(calculated);
    setShowCalcModal(false);
    tts.playChime('success');
    tts.speak(`${t.calculatedResult} ${calculated} ml`, lang);
  };

  const addWater = (amount) => {
    const nextWater = Math.min(waterGoal, waterCurrent + amount);
    setWaterCurrent(nextWater);
    tts.playChime('success');
    
    if (nextWater >= waterGoal && waterCurrent < waterGoal) {
      tts.speak(t.waterCelebration, lang);
    } else {
      const msg = lang === 'zh' 
        ? `補充水分 ${amount} 毫升，今天已累積 ${nextWater} 毫升`
        : `Added ${amount} ml! Total: ${nextWater} ml`;
      tts.speak(msg, lang);
    }
  };

  const waterPercent = Math.min(100, Math.round((waterCurrent / waterGoal) * 100));

  const getPeriodLabel = (p) => {
    if (p === 'breakfast') return t.periodBreakfast;
    if (p === 'lunch') return t.periodLunch;
    if (p === 'dinner') return t.periodDinner;
    return t.periodBedtime;
  };

  const getTimingLabel = (tm) => {
    return tm === 'before' ? t.timingBefore : t.timingAfter;
  };

  return (
    <div className="health-tracker">
      {/* 🌈 Rainbow Celebration Overlay */}
      {showRainbow && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'rgba(15,23,42,0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 3000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          animation: 'popIn 0.3s ease-out'
        }}>
          <div style={{
            fontSize: '80px',
            animation: 'pulse-ring 1.5s infinite',
            textAlign: 'center',
            marginBottom: '10px'
          }}>
            🌈✨🎉
          </div>
          <div style={{
            background: 'linear-gradient(90deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '24px',
            fontWeight: '900',
            textAlign: 'center',
            marginBottom: '12px'
          }}>
            {t.rainbowCelebration}
          </div>
          <p style={{ color: 'white', fontSize: '15px', fontWeight: '700' }}>
            按時吃藥真棒！送您最美麗的七彩彩虹祝福 🌈
          </p>
        </div>
      )}

      {/* Hydration Tracker Section */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', borderColor: '#7dd3fc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Droplets size={20} color="#0284c7" /> {t.waterTitle}
          </h3>
          <button 
            onClick={() => setShowCalcModal(true)}
            style={{ background: 'white', color: '#0284c7', border: '1px solid #7dd3fc', padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Calculator size={14} /> {t.calcWaterBtn}
          </button>
        </div>

        {/* Circular Progress Ring */}
        <div className="water-ring-container">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="58" stroke="#cbd5e1" strokeWidth="12" fill="none" />
            <circle 
              cx="70" 
              cy="70" 
              r="58" 
              stroke="#0284c7" 
              strokeWidth="12" 
              fill="none" 
              strokeDasharray={364.4}
              strokeDashoffset={364.4 - (364.4 * waterPercent) / 100}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              transform="rotate(-90 70 70)"
            />
          </svg>
          <div className="water-ring-text">
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#0284c7' }}>{waterCurrent}</div>
            <div style={{ fontSize: '11px', color: '#0369a1', fontWeight: '700' }}>/ {waterGoal} ml</div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#0284c7', marginTop: '2px' }}>{waterPercent}%</div>
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          <button onClick={() => addWater(150)} style={{ background: 'white', border: '1px solid #7dd3fc', padding: '10px 4px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', color: '#0369a1', cursor: 'pointer' }}>
            {t.addWater150}
          </button>
          <button onClick={() => addWater(250)} style={{ background: 'white', border: '1px solid #7dd3fc', padding: '10px 4px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', color: '#0369a1', cursor: 'pointer' }}>
            {t.addWater250}
          </button>
          <button onClick={() => addWater(350)} style={{ background: 'white', border: '1px solid #7dd3fc', padding: '10px 4px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', color: '#0369a1', cursor: 'pointer' }}>
            {t.addWater350}
          </button>
        </div>
      </div>

      {/* Medication Reminders Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Pill size={20} color="var(--primary)" /> {t.medTitle}
            </h3>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              早中晚餐 • 飯前/飯後時機對照
            </div>
          </div>

          <button 
            onClick={openAddMedModal}
            style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', padding: '8px 12px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
          >
            <Plus size={14} /> {t.setMedAlarm}
          </button>
        </div>

        {/* Medication Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {meds.map(m => (
            <div 
              key={m.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '14px',
                borderRadius: '16px',
                background: m.taken ? '#f8fafc' : '#eef2ff',
                border: m.taken ? '1px solid #e2e8f0' : '1px solid #c7d2fe'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  {/* Period & Timing Badges */}
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                    <span style={{ background: '#4f46e5', color: 'white', padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' }}>
                      {getPeriodLabel(m.period)}
                    </span>
                    <span style={{ background: '#3b82f6', color: 'white', padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' }}>
                      {getTimingLabel(m.timing)}
                    </span>
                    <span style={{ background: '#f59e0b', color: 'white', padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' }}>
                      ⏰ {m.time}
                    </span>
                  </div>

                  <div style={{ fontSize: '16px', fontWeight: '800', color: m.taken ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: m.taken ? 'line-through' : 'none' }}>
                    {lang === 'zh' ? m.nameZh : m.nameEn}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    💊 劑量：{m.dose}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <button 
                    onClick={(e) => openEditMedModal(m, e)}
                    style={{ background: 'white', border: '1px solid #cbd5e1', padding: '6px', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-muted)' }}
                    title={t.editMedTitle}
                  >
                    <Edit3 size={16} />
                  </button>

                  <button 
                    onClick={() => toggleMed(m.id)}
                    style={{
                      background: m.taken ? 'var(--success)' : 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {m.taken ? <><Check size={14} /> 🌈 {t.taken}</> : t.takeMedBtn}
                  </button>

                  <button 
                    onClick={(e) => handleDeleteMed(m.id, e)}
                    style={{ background: '#fee2e2', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
                    title="刪除藥物提醒"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Pill & Package Photo Attachment Display */}
              {m.photo && (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'white', padding: '8px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <img src={m.photo} alt="Pill photo" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)' }}>
                      📷 藥品/藥袋實體相片
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      拿藥時請核對包裝外觀
                    </div>
                  </div>
                </div>
              )}

              {m.loggedBy && (
                <div style={{ fontSize: '11px', color: '#4f46e5', fontWeight: '800' }}>
                  🆔 服藥確認者：{m.loggedBy}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Edit / Add Medication Modal */}
      {showMedModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800' }}>
                {editingMedId ? t.editMedTitle : t.setMedAlarm}
              </h3>
              <button onClick={() => setShowMedModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleMedFormSubmit}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{t.medName}</label>
                <input 
                  type="text" 
                  value={medInputName}
                  onChange={(e) => setMedInputName(e.target.value)}
                  placeholder="例如: 降血壓藥 5mg 或 胃藥"
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{t.medPeriod}</label>
                  <select 
                    value={medInputPeriod}
                    onChange={(e) => setMedInputPeriod(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: '700' }}
                  >
                    <option value="breakfast">{t.periodBreakfast}</option>
                    <option value="lunch">{t.periodLunch}</option>
                    <option value="dinner">{t.periodDinner}</option>
                    <option value="bedtime">{t.periodBedtime}</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{t.medTiming}</label>
                  <select 
                    value={medInputTiming}
                    onChange={(e) => setMedInputTiming(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: '700' }}
                  >
                    <option value="before">{t.timingBefore}</option>
                    <option value="after">{t.timingAfter}</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{t.medTime}</label>
                  <input 
                    type="time" 
                    value={medInputTime}
                    onChange={(e) => setMedInputTime(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{t.medDose}</label>
                  <input 
                    type="text" 
                    value={medInputDose}
                    onChange={(e) => setMedInputDose(e.target.value)}
                    placeholder="例: 1 顆"
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{t.pillPhotoLabel}</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePillPhotoUpload} 
                  style={{ width: '100%', fontSize: '13px' }} 
                />
                {medInputPhoto && (
                  <div style={{ marginTop: '8px' }}>
                    <img src={medInputPhoto} alt="Pill preview" style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowMedModal(false)} style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: '#e2e8f0', fontWeight: '700' }}>
                  取消
                </button>
                <button type="submit" className="btn-primary">
                  {t.saveMedBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hydration Calculator Modal */}
      {showCalcModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px' }}>{t.calcModalTitle}</h3>
            <form onSubmit={handleCalcWater}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{t.inputWeight}</label>
                <input 
                  type="number" 
                  value={inputWeight} 
                  onChange={(e) => setInputWeight(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '16px' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{t.inputAge}</label>
                <input 
                  type="number" 
                  value={inputAge} 
                  onChange={(e) => setInputAge(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '16px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowCalcModal(false)} style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: '#e2e8f0', fontWeight: '700' }}>
                  取消
                </button>
                <button type="submit" className="btn-primary">
                  {t.calculateBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
