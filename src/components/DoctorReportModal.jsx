import React from 'react';
import { X, Printer, FileText, Download, ShieldCheck, UserCheck, Calendar } from 'lucide-react';
import { tts } from '../services/ttsService';

export default function DoctorReportModal({ isOpen, onClose, elderProfile, caregiverCode, lang }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    tts.speak('正在準備診所就醫健康報告列印或匯出 PDF...', 'zh');
    window.print();
  };

  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '520px', padding: '20px', background: '#ffffff' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#4f46e5', color: 'white', padding: '8px', borderRadius: '10px' }}>
              <FileText size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-main)' }}>📋 診所就醫專用 - 健康綜合報告</h3>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>CareMate Pro Medical Report System</div>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Print Printable Sheet Container */}
        <div id="printable-report" style={{ background: '#fafafa', border: '1px solid #cbd5e1', padding: '16px', borderRadius: '14px', fontSize: '13px', color: '#1e293b' }}>
          {/* Sheet Title */}
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1e1b4b' }}>CareMate 居家長者健康照顧看診摘要</h2>
            <div style={{ fontSize: '12px', color: '#64748b' }}>產出日期：{currentDate} | 授權單位：CareMate 商業專業版</div>
          </div>

          {/* Patient & Caregiver Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0', fontWeight: '800', background: '#f1f5f9', width: '25%' }}>被照顧者</td>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{elderProfile.name} ({elderProfile.age}歲 / {elderProfile.weight}kg)</td>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0', fontWeight: '800', background: '#f1f5f9', width: '25%' }}>責任照顧者</td>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{caregiverCode}</td>
              </tr>
            </tbody>
          </table>

          {/* Section 1: Medication & Hydration */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontWeight: '800', color: '#4338ca', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              💊 近期服藥與水分打卡紀錄
            </div>
            <ul style={{ paddingLeft: '20px', margin: '0', fontSize: '12px', lineHeight: '1.6' }}>
              <li>早餐劑量：降血壓藥 (1錠) - 已依時段打卡按時服用</li>
              <li>晚餐劑量：綜合維他命 (1錠) - 已依時段打卡按時服用</li>
              <li>每日飲水達成率：85% (目標 1,500ml / 今日已喝 1,250ml)</li>
            </ul>
          </div>

          {/* Section 2: Digestive & Vitals */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontWeight: '800', color: '#065f46', marginBottom: '4px' }}>
              💩 腸胃排洩與生理數值追蹤
            </div>
            <ul style={{ paddingLeft: '20px', margin: '0', fontSize: '12px', lineHeight: '1.6' }}>
              <li>大便型態：香蕉狀 (健康正常) | 小便顏色：淡黃清澈</li>
              <li>最新血壓測量照片：122/78 mmHg，心率 72 bpm (正常)</li>
            </ul>
          </div>

          {/* Doctor Signature Line */}
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: '10px', fontSize: '12px', color: '#64748b' }}>
            <div>醫師簽章：____________________</div>
            <div>日期：____年____月____日</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <button 
            onClick={handlePrint}
            className="btn-primary"
            style={{ flex: 1, padding: '12px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <Printer size={18} /> 列印 / 儲存為 PDF
          </button>

          <button 
            onClick={() => {
              tts.speak('報告連結已成功複製，可傳送給醫師與家人群組！', 'zh');
            }}
            style={{
              padding: '12px 16px',
              borderRadius: '16px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              fontWeight: '800',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            複製分享連結
          </button>
        </div>
      </div>
    </div>
  );
}
