import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ScheduleView from './components/ScheduleView';
import RecipesView from './components/RecipesView';
import HealthTracker from './components/HealthTracker';
import BathroomLog from './components/BathroomLog';
import UltrasoundLog from './components/UltrasoundLog';
import ExercisePopup from './components/ExercisePopup';
import FamilyShareModal from './components/FamilyShareModal';

import { translations } from './locales/i18n';
import { Calendar, Utensils, Pill, Activity, Camera, Dumbbell, UserCheck, X, ShieldCheck } from 'lucide-react';
import { tts } from './services/ttsService';
import './styles/theme.css';

export default function App() {
  const [lang, setLang] = useState('zh');
  const [isVoiceOn, setIsVoiceOn] = useState(true);
  const [isLargeFont, setIsLargeFont] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule');
  const [appleCount, setAppleCount] = useState(3);

  // Care Recipient Profile State
  const [elderProfile, setElderProfile] = useState({
    name: '張奶奶',
    age: '82',
    gender: 'female',
    weight: '58'
  });

  // Caregiver Code / Alias State (照顧者代號)
  const [caregiverCode, setCaregiverCode] = useState('CG-8821 (小美)');

  // Profile Edit Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileInputName, setProfileInputName] = useState('張奶奶');
  const [profileInputAge, setProfileInputAge] = useState('82');
  const [profileInputGender, setProfileInputGender] = useState('female');
  const [profileInputWeight, setProfileInputWeight] = useState('58');
  const [inputCaregiverCode, setInputCaregiverCode] = useState('CG-8821 (小美)');

  // Modals state
  const [isExerciseOpen, setIsExerciseOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    if (isLargeFont) {
      document.body.classList.add('large-font');
    } else {
      document.body.classList.remove('large-font');
    }
  }, [isLargeFont]);

  const handleEarnApple = () => {
    setAppleCount(prev => prev + 1);
  };

  const handleOpenProfileModal = () => {
    setProfileInputName(elderProfile.name);
    setProfileInputAge(elderProfile.age);
    setProfileInputGender(elderProfile.gender);
    setProfileInputWeight(elderProfile.weight);
    setInputCaregiverCode(caregiverCode);
    setIsProfileModalOpen(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedProfile = {
      name: profileInputName || '長者',
      age: profileInputAge || '80',
      gender: profileInputGender,
      weight: profileInputWeight || '60'
    };
    setElderProfile(updatedProfile);
    setCaregiverCode(inputCaregiverCode || 'CG-8821');
    setIsProfileModalOpen(false);

    tts.playChime('success');
    const msg = lang === 'zh' 
      ? `設定已更新：照顧者代號 ${inputCaregiverCode}，被照顧者 ${updatedProfile.name}`
      : `Settings updated: Caregiver ${inputCaregiverCode}, Recipient ${updatedProfile.name}`;
    tts.speak(msg, lang);
  };

  const t = translations[lang];

  return (
    <div className="app-container">
      {/* Top iOS Status Bar */}
      <div className="ios-notch">
        <span>09:41</span>
        <span>CareMate App</span>
        <span>📶 100% 🔋</span>
      </div>

      {/* Main App Header */}
      <Header 
        lang={lang} 
        setLang={setLang}
        isVoiceOn={isVoiceOn}
        setIsVoiceOn={setIsVoiceOn}
        isLargeFont={isLargeFont}
        setIsLargeFont={setIsLargeFont}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenProfile={handleOpenProfileModal}
        elderProfile={elderProfile}
        caregiverCode={caregiverCode}
        appleCount={appleCount}
        t={t}
      />

      {/* Main Dynamic View Content */}
      <main className="main-content">
        {/* Quick Launch Exercise Reminder Alert Banner */}
        <div 
          onClick={() => setIsExerciseOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(255,255,255,0.25)', padding: '8px', borderRadius: '12px' }}>
              <Dumbbell size={20} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800' }}>{t.startExerciseBtn}</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>{t.exerciseSubtitle}</div>
            </div>
          </div>
          <span style={{ background: 'white', color: '#b45309', padding: '4px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '800' }}>
            開始
          </span>
        </div>

        {activeTab === 'schedule' && <ScheduleView lang={lang} t={t} caregiverCode={caregiverCode} onEarnApple={handleEarnApple} />}
        {activeTab === 'recipes' && <RecipesView lang={lang} t={t} />}
        {activeTab === 'health' && <HealthTracker lang={lang} t={t} caregiverCode={caregiverCode} />}
        {activeTab === 'bathroom' && <BathroomLog lang={lang} t={t} caregiverCode={caregiverCode} />}
        {activeTab === 'ultrasound' && <UltrasoundLog lang={lang} t={t} />}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <Calendar className="nav-icon" size={20} />
          <span>{t.tabSchedule}</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          <Utensils className="nav-icon" size={20} />
          <span>{t.tabRecipes}</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'health' ? 'active' : ''}`}
          onClick={() => setActiveTab('health')}
        >
          <Pill className="nav-icon" size={20} />
          <span>{t.tabHealth}</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'bathroom' ? 'active' : ''}`}
          onClick={() => setActiveTab('bathroom')}
        >
          <Activity className="nav-icon" size={20} />
          <span>{t.tabBathroom}</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'ultrasound' ? 'active' : ''}`}
          onClick={() => setActiveTab('ultrasound')}
        >
          <Camera className="nav-icon" size={20} />
          <span>{t.tabDailyLog}</span>
        </button>
      </nav>

      {/* Profile & Caregiver Code Edit Modal */}
      {isProfileModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserCheck size={18} color="var(--primary)" /> {t.editProfileTitle}
              </h3>
              <button onClick={() => setIsProfileModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              {/* Caregiver Code / ID Input Field */}
              <div style={{ marginBottom: '12px', background: '#eef2ff', padding: '10px', borderRadius: '12px', border: '1px solid #c7d2fe' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#3730a3', marginBottom: '4px' }}>
                  🆔 {t.inputCaregiverCode}
                </label>
                <input 
                  type="text" 
                  value={inputCaregiverCode}
                  onChange={(e) => setInputCaregiverCode(e.target.value)}
                  placeholder="例如: CG-8821 或 小美 (女兒)"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #a5b4fc', fontSize: '15px', fontWeight: '700' }}
                  required
                />
              </div>

              {/* Recipient Info */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{t.inputName}</label>
                <input 
                  type="text" 
                  value={profileInputName}
                  onChange={(e) => setProfileInputName(e.target.value)}
                  placeholder="例如: 張奶奶 或 王爺爺"
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{t.inputGender}</label>
                <select 
                  value={profileInputGender}
                  onChange={(e) => setProfileInputGender(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', fontWeight: '600' }}
                >
                  <option value="female">{t.genderFemale}</option>
                  <option value="male">{t.genderMale}</option>
                  <option value="other">{t.genderOther}</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{t.inputAge}</label>
                  <input 
                    type="number" 
                    value={profileInputAge}
                    onChange={(e) => setProfileInputAge(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{t.inputWeight}</label>
                  <input 
                    type="number" 
                    value={profileInputWeight}
                    onChange={(e) => setProfileInputWeight(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsProfileModalOpen(false)} style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: '#e2e8f0', fontWeight: '700' }}>
                  取消
                </button>
                <button type="submit" className="btn-primary">
                  {t.saveProfileBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Exercise Pop-up Modal */}
      <ExercisePopup 
        isOpen={isExerciseOpen} 
        onClose={() => setIsExerciseOpen(false)}
        lang={lang}
        t={t}
      />

      {/* Family Care Share Modal */}
      <FamilyShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        lang={lang}
        t={t}
      />
    </div>
  );
}
