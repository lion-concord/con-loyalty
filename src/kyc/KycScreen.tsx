import { useState, useEffect } from 'react';
import { getKycProfile, saveKycProfile, upgradeLevel, LEVEL_INFO } from './levels';
import type { KycProfile, KycLevel } from './levels';

const field: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.14)',
  background: 'rgba(15,23,42,0.8)',
  color: '#fff',
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  color: '#94a3b8',
  marginBottom: 6,
  fontWeight: 600,
};

const hintStyle: React.CSSProperties = {
  fontSize: 11,
  color: '#64748b',
  marginTop: 4,
};

export function KycScreen({ onClose }: { onClose: () => void }) {
  const [profile, setProfile] = useState<KycProfile>(getKycProfile());
  const [mode, setMode] = useState<'overview' | 'form'>('overview');
  const [targetLevel, setTargetLevel] = useState<KycLevel>(1);

  // поля формы
  const [firstName, setFirstName] = useState(profile.firstName || '');
  const [lastName, setLastName] = useState(profile.lastName || '');
  const [birthDate, setBirthDate] = useState(profile.birthDate || '');
  const [email, setEmail] = useState(profile.email || '');
  const [passport, setPassport] = useState(profile.passportSubmitted || false);
  const [selfie, setSelfie] = useState(profile.selfieSubmitted || false);
  const [source, setSource] = useState(profile.sourceOfFundsSubmitted || false);
  const [error, setError] = useState('');
  const [emailVerifiedLocal, setEmailVerifiedLocal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [sentCode, setSentCode] = useState('');
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [codeError, setCodeError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [shake, setShake] = useState(false);
  const [phone, setPhone] = useState(profile.phone || '');
  const [phoneVerifiedLocal, setPhoneVerifiedLocal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [sentPhoneCode, setSentPhoneCode] = useState('');
  const [phoneCodeDigits, setPhoneCodeDigits] = useState(['', '', '', '', '', '']);
  const [phoneCodeError, setPhoneCodeError] = useState('');
  const [phoneResendTimer, setPhoneResendTimer] = useState(0);
  const [phoneShake, setPhoneShake] = useState(false);

  useEffect(() => {
    const p = getKycProfile();
    setProfile(p);
    setFirstName(p.firstName || '');
    setLastName(p.lastName || '');
    setBirthDate(p.birthDate || '');
    setEmail(p.email || '');
    setPassport(p.passportSubmitted || false);
    setSelfie(p.selfieSubmitted || false);
    setSource(p.sourceOfFundsSubmitted || false);
    setPhone(p.phone || '');
  }, [mode]);

  const currentInfo = LEVEL_INFO[profile.level];
  const nextLevel = (profile.level < 3 ? profile.level + 1 : null) as KycLevel | null;

  const openForm = (lvl: KycLevel) => {
    setTargetLevel(lvl);
    setError('');
    setMode('form');
  };

  const validateBirthDate = (v: string): string => {
    if (!v) return 'Укажите дату рождения';
    const d = new Date(v);
    if (isNaN(d.getTime())) return 'Некорректная дата';
    const now = new Date();
    if (d > now) return 'Дата рождения не может быть в будущем';
    const ms = now.getTime() - d.getTime(); const age = ms / 31557600000;
    if (age < 14) return 'Минимальный возраст — 14 лет';
    if (age > 120) return 'Проверьте дату рождения';
    return '';
  };

  const validateEmail = (v: string): string => {
    if (!v) return 'Укажите email';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Некорректный email';
    return '';
  };

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  useEffect(() => {
    if (profile.emailVerified && profile.email === email) setEmailVerifiedLocal(true);
  }, [profile.emailVerified, profile.email, email]);

  useEffect(() => {
    if (phoneResendTimer <= 0) return;
    const t = setTimeout(() => setPhoneResendTimer(phoneResendTimer - 1), 1000);
    return () => clearTimeout(t);
  }, [phoneResendTimer]);

  useEffect(() => {
    if (profile.phoneVerified && profile.phone === phone) setPhoneVerifiedLocal(true);
  }, [profile.phoneVerified, profile.phone, phone]);

  const validatePhone = (v: string): string => {
    if (!v) return 'Укажите номер телефона';
    const digits = v.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) return 'Некорректный номер';
    return '';
  };

  const sendPhoneCode = () => {
    const err = validatePhone(phone);
    if (err) { setError(err); return; }
    setError('');
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setSentPhoneCode(code);
    setPhoneCodeDigits(['', '', '', '', '', '']);
    setPhoneCodeError('');
    setPhoneResendTimer(60);
    setShowPhoneModal(true);
    setTimeout(() => alert('SMS отправлено на ' + phone + '\n\nВаш код: ' + code), 300);
  };

  const handlePhoneCodeChange = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(0, 1);
    const next = [...phoneCodeDigits];
    next[idx] = digit;
    setPhoneCodeDigits(next);
    setPhoneCodeError('');
if (digit && idx < 5) {
      const el = document.getElementById('phone-code-' + (idx + 1));
      if (el) (el as HTMLInputElement).focus();
    }
  };

  const handlePhoneCodeKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !phoneCodeDigits[idx] && idx > 0) {
      const el = document.getElementById('phone-code-' + (idx - 1));
      if (el) (el as HTMLInputElement).focus();
    }
  };

  const handlePhoneCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const txt = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (txt.length === 6) {
      setPhoneCodeDigits(txt.split(''));
      setPhoneCodeError('');
    }
  };

  const verifyPhoneCode = () => {
    const entered = phoneCodeDigits.join('');
    if (entered.length !== 6) { setPhoneCodeError('Введите все 6 цифр'); return; }
    if (entered !== sentPhoneCode) {
      setPhoneCodeError('Неверный код');
      setPhoneShake(true);
      setTimeout(() => setPhoneShake(false), 400);
      return;
    }
    setPhoneVerifiedLocal(true);
    setShowPhoneModal(false);
  };

  const sendEmailCode = () => {
    const emErr = validateEmail(email);
    if (emErr) { setError(emErr); return; }
    setError('');
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setSentCode(code);
    setCodeDigits(['', '', '', '', '', '']);
    setCodeError('');
    setResendTimer(60);
    setShowEmailModal(true);
    setTimeout(() => alert('Код отправлен на ' + email + '\n\nВаш код: ' + code), 300);
  };

  const handleCodeChange = (idx: number, val: string) => {
    const digit = val.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...codeDigits];
    newDigits[idx] = digit;
    setCodeDigits(newDigits);
    setCodeError('');
    if (digit && idx < 5) document.getElementById('code-' + (idx + 1))?.focus();
  };

  const handleCodeKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeDigits[idx] && idx > 0) {
      document.getElementById('code-' + (idx - 1))?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pasted) return;
    const newDigits = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) newDigits[i] = pasted[i];
    setCodeDigits(newDigits);
    const focusIdx = Math.min(pasted.length, 5);
    setTimeout(() => document.getElementById('code-' + focusIdx)?.focus(), 10);
  };

  const verifyCode = () => {
    const entered = codeDigits.join('');
    if (entered.length < 6) { setCodeError('Введите все 6 цифр'); return; }
    if (entered !== sentCode) {
      setCodeError('Неверный код');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setEmailVerifiedLocal(true);
    setShowEmailModal(false);
    setCodeError('');
  };

  const submit = () => {
    setError('');
    // Уровень 1 — ФИО, email, дата рождения
    if (targetLevel >= 1) {
      if (!firstName.trim()) return setError('Укажите имя');
      if (!lastName.trim()) return setError('Укажите фамилию');
      const bdErr = validateBirthDate(birthDate);
      if (bdErr) return setError(bdErr);
      const emErr = validateEmail(email);
      if (emErr) return setError(emErr);
      if (!emailVerifiedLocal) return setError('Подтвердите email кодом');
    }
    if (targetLevel >= 2) {
      const phErr = validatePhone(phone);
      if (phErr) return setError(phErr);
      if (!phoneVerifiedLocal) return setError('Подтвердите телефон кодом');
      if (!passport) return setError('Загрузите паспорт');
      if (!selfie) return setError('Загрузите селфи');
    }
    if (targetLevel >= 3) {
      if (!source) return setError('Подтвердите источник дохода');
    }

    upgradeLevel(targetLevel, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      birthDate,
      email: email.trim(),
      emailVerified: true,
      phone: phone.trim(),
      phoneVerified: phoneVerifiedLocal,
      passportSubmitted: passport,
      selfieSubmitted: selfie,
      sourceOfFundsSubmitted: source,
    });
    setProfile(getKycProfile());
    setMode('overview');
  };

  const saveWithoutLevelChange = () => {
    setError('');
    if (firstName || lastName || birthDate || email) {
      if (birthDate) {
        const bdErr = validateBirthDate(birthDate);
        if (bdErr) return setError(bdErr);
      }
      if (email) {
        const emErr = validateEmail(email);
        if (emErr) return setError(emErr);
      }
    }
    saveKycProfile({
      ...profile,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      birthDate,
      email: email.trim(),
    });
    setProfile(getKycProfile());
    setMode('overview');
  };

  const resetAll = () => {
    if (!confirm('Сбросить все данные верификации? Уровень станет 0.')) return;
    localStorage.removeItem('con_kyc_profile');
    const fresh = getKycProfile();
    setProfile(fresh);
    setFirstName(''); setLastName(''); setBirthDate(''); setEmail('');
    setPassport(false); setSelfie(false); setSource(false);
    setMode('overview');
  };

  // ===== FORM VIEW =====
  if (mode === 'form') {
    const info = LEVEL_INFO[targetLevel];
    return (
      <Modal onClose={onClose}>
        <button onClick={() => setMode('overview')} style={backBtn}>← Назад</button>
        <h2 style={{ margin: '10px 0 4px', fontSize: 22 }}>Уровень {targetLevel} — {info.title}</h2>
        <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 18px' }}>{info.description}</p>

        <div style={{ display: 'grid', gap: 14 }}>
          {targetLevel >= 1 && (
            <>
              <div>
                <label style={labelStyle}>Имя *</label>
                <input style={field} value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Иван" />
              </div>
              <div>
                <label style={labelStyle}>Фамилия *</label>
                <input style={field} value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Иванов" />
              </div>
              <div>
                <label style={labelStyle}>Дата рождения *</label>
                <BirthDateInput value={birthDate} onChange={setBirthDate} />
                <div style={hintStyle}>Формат: ДД.ММ.ГГГГ. Возраст не младше 14 лет.</div>
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="email"
                    style={{ ...field, flex: 1 }}
                    value={email}
                    onChange={e => { setEmail(e.target.value); setEmailVerifiedLocal(false); }}
                    placeholder="ivan@example.com"
                    disabled={emailVerifiedLocal}
                  />
                  {emailVerifiedLocal ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '0 14px',
                      background: 'rgba(34,197,94,0.15)',
                      border: '1px solid rgba(34,197,94,0.4)',
                      color: '#86efac', borderRadius: 10,
                      fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap'
                    }}>Подтверждён</div>
                  ) : (
                    <button
                      type="button"
                      onClick={sendEmailCode}
                      style={{
                        padding: '0 14px',
                        background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
                        color: '#fff', border: 'none', borderRadius: 10,
                        fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >Подтвердить</button>
                  )}
                </div>
              </div>
            </>
          )}

          {targetLevel >= 2 && (
            <>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
                <label style={labelStyle}>Телефон *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="tel"
                    inputMode="tel"
                    style={{ ...field, flex: 1 }}
                    value={phone}
                    onChange={e => { setPhone(e.target.value); setPhoneVerifiedLocal(false); }}
                    placeholder="+7 900 000 00 00"
                    disabled={phoneVerifiedLocal}
                  />
                  {phoneVerifiedLocal ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '0 14px',
                      background: 'rgba(34,197,94,0.15)',
                      border: '1px solid rgba(34,197,94,0.4)',
                      color: '#86efac', borderRadius: 10,
                      fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap'
                    }}>Подтверждён</div>
                  ) : (
                    <button
                      type="button"
onClick={sendPhoneCode}
                      style={{
                        padding: '0 14px',
                        background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
                        color: '#fff', border: 'none', borderRadius: 10,
                        fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >Подтвердить</button>
                  )}
                </div>
                <div style={hintStyle}>На номер придёт SMS с 6-значным кодом.</div>
              </div>
              <div>
                <label style={labelStyle}>Паспорт *</label>
                <button onClick={() => setPassport(!passport)} style={{
                  ...field, cursor: 'pointer', textAlign: 'left',
                  background: passport ? 'rgba(34,197,94,0.15)' : 'rgba(15,23,42,0.8)',
                  borderColor: passport ? '#22c55e' : 'rgba(255,255,255,0.14)',
                }}>
{passport ? '✓ Паспорт загружен' : '📄 Загрузить скан паспорта'}
                </button>
              </div>
              <div>
                <label style={labelStyle}>Селфи с паспортом *</label>
                <button onClick={() => setSelfie(!selfie)} style={{
                  ...field, cursor: 'pointer', textAlign: 'left',
                  background: selfie ? 'rgba(34,197,94,0.15)' : 'rgba(15,23,42,0.8)',
                  borderColor: selfie ? '#22c55e' : 'rgba(255,255,255,0.14)',
                }}>
                  {selfie ? '✓ Селфи загружено' : '🤳 Загрузить селфи'}
                </button>
              </div>
            </>
          )}

          {targetLevel >= 3 && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
              <label style={labelStyle}>Источник дохода *</label>
              <button onClick={() => setSource(!source)} style={{
                ...field, cursor: 'pointer', textAlign: 'left',
                background: source ? 'rgba(34,197,94,0.15)' : 'rgba(15,23,42,0.8)',
                borderColor: source ? '#22c55e' : 'rgba(255,255,255,0.14)',
              }}>
                {source ? '✓ Документы загружены' : '💼 Загрузить 2-НДФЛ / выписку'}
              </button>
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', padding: '10px 12px', borderRadius: 10, fontSize: 13 }}>
              ⚠ {error}
            </div>
          )}

          <button onClick={submit} style={primaryBtn}>
            Подтвердить и повысить до {info.title}
          </button>
          <button onClick={saveWithoutLevelChange} style={secondaryBtn}>
            Только сохранить данные (без повышения)
          </button>
        </div>

        {showEmailModal && (
          <div onClick={() => setShowEmailModal(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10000, padding: 16
          }}>
            <div onClick={e => e.stopPropagation()} style={{
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: 20, padding: 24, maxWidth: 380, width: '100%',
              animation: shake ? 'shake 0.4s' : 'none'
            }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, textAlign: 'center' }}>Подтверждение email</h3>
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, margin: '8px 0 20px' }}>
                Код отправлен на <span style={{ color: '#a78bfa', fontWeight: 700 }}>{email}</span>
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
                {codeDigits.map((d, i) => (
                  <input
                    key={i}
                    id={'code-' + i}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handleCodeChange(i, e.target.value)}
                    onKeyDown={e => handleCodeKeyDown(i, e)}
                    onPaste={i === 0 ? handleCodePaste : undefined}
                    autoFocus={i === 0}
                    style={{
                      width: 44, height: 52, textAlign: 'center',
                      fontSize: 22, fontWeight: 800,
                      background: d ? 'rgba(139,92,246,0.15)' : 'rgba(15,23,42,0.8)',
                      border: '2px solid ' + (codeError ? '#ef4444' : d ? '#a78bfa' : 'rgba(255,255,255,0.15)'),
                      borderRadius: 10, color: '#fff', outline: 'none'
                    }}
                  />
                ))}
              </div>
              {codeError && (<div style={{ color: '#fca5a5', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>{codeError}</div>)}
              <button onClick={verifyCode} style={{
                width: '100%', padding: 13,
                background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
                color: '#fff', border: 'none', borderRadius: 12,
                fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10
              }}>Подтвердить код</button>
              <button onClick={sendEmailCode} disabled={resendTimer > 0} style={{
                width: '100%', padding: 10, background: 'transparent',
                color: resendTimer > 0 ? '#64748b' : '#a78bfa',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, fontSize: 13, fontWeight: 600,
                cursor: resendTimer > 0 ? 'not-allowed' : 'pointer'
              }}>{resendTimer > 0 ? 'Повторно через ' + resendTimer + ' сек' : 'Отправить код повторно'}</button>
<button onClick={() => setShowEmailModal(false)} style={{
                width: '100%', padding: 8, marginTop: 8,
                background: 'transparent', color: '#64748b',
                border: 'none', fontSize: 12, cursor: 'pointer'
              }}>Отмена</button>
            </div>
          </div>
        )}


        {showPhoneModal && (
          <div onClick={() => setShowPhoneModal(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10000, padding: 16
          }}>
            <div onClick={e => e.stopPropagation()} style={{
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: 20, padding: 24, maxWidth: 380, width: '100%',
              animation: phoneShake ? 'shake 0.4s' : 'none'
            }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, textAlign: 'center' }}>Подтверждение телефона</h3>
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, margin: '8px 0 20px' }}>
                SMS отправлено на <span style={{ color: '#a78bfa', fontWeight: 700 }}>{phone}</span>
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
                {phoneCodeDigits.map((d, i) => (
                  <input
                    key={i}
                    id={'phone-code-' + i}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handlePhoneCodeChange(i, e.target.value)}
                    onKeyDown={e => handlePhoneCodeKeyDown(i, e)}
                    onPaste={i === 0 ? handlePhoneCodePaste : undefined}
                    autoFocus={i === 0}
                    style={{
                      width: 44, height: 52, textAlign: 'center',
                      fontSize: 22, fontWeight: 800,
                      background: d ? 'rgba(139,92,246,0.15)' : 'rgba(15,23,42,0.8)',
                      border: '2px solid ' + (phoneCodeError ? '#ef4444' : d ? '#a78bfa' : 'rgba(255,255,255,0.15)'),
                      borderRadius: 10, color: '#fff', outline: 'none'
                    }}
                  />
                ))}
              </div>
              {phoneCodeError && (<div style={{ color: '#fca5a5', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>{phoneCodeError}</div>)}
              <button onClick={verifyPhoneCode} style={{
                width: '100%', padding: 13,
                background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
                color: '#fff', border: 'none', borderRadius: 12,
                fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10
              }}>Подтвердить код</button>
              <button onClick={sendPhoneCode} disabled={phoneResendTimer > 0} style={{
                width: '100%', padding: 10, background: 'transparent',
                color: phoneResendTimer > 0 ? '#64748b' : '#a78bfa',
                border: '1px solid rgba(255,255,255,0.1)',
borderRadius: 10, fontSize: 13, fontWeight: 600,
                cursor: phoneResendTimer > 0 ? 'not-allowed' : 'pointer'
              }}>{phoneResendTimer > 0 ? 'Повторно через ' + phoneResendTimer + ' сек' : 'Отправить SMS повторно'}</button>
              <button onClick={() => setShowPhoneModal(false)} style={{
                width: '100%', padding: 8, marginTop: 8,
                background: 'transparent', color: '#64748b',
                border: 'none', fontSize: 12, cursor: 'pointer'
              }}>Отмена</button>
            </div>
          </div>
        )}
      </Modal>
    );
  }

  // ===== OVERVIEW =====
  return (
    <Modal onClose={onClose}>
      <button onClick={onClose} style={backBtn}>← Закрыть</button>
      <h2 style={{ margin: '10px 0 18px', fontSize: 22 }}>Моя верификация</h2>

      <div style={{
        background: 'linear-gradient(135deg,rgba(37,99,235,0.2),rgba(124,58,237,0.2))',
        border: '1px solid rgba(147,197,253,0.3)',
        borderRadius: 14, padding: 16, marginBottom: 16,
      }}>
        <div style={{ fontSize: 12, color: '#93c5fd', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Текущий уровень</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>
          Уровень {profile.level} — {currentInfo.title}
        </div>
        <div style={{ fontSize: 13, color: '#cbd5e1', marginTop: 4 }}>{currentInfo.description}</div>

        {(profile.firstName || profile.email || profile.birthDate) && (
          <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(0,0,0,0.25)', borderRadius: 10, fontSize: 12, color: '#cbd5e1', display: 'grid', gap: 4 }}>
            {(profile.firstName || profile.lastName) && <div><span style={{ color: '#94a3b8' }}>ФИО:</span> {profile.lastName} {profile.firstName}</div>}
            {profile.birthDate && <div><span style={{ color: '#94a3b8' }}>Дата рождения:</span> {new Date(profile.birthDate).toLocaleDateString('ru-RU')}</div>}
            {profile.email && <div><span style={{ color: '#94a3b8' }}>Email:</span> {profile.email}</div>}
          </div>
        )}

        {profile.level >= 1 && (
          <button onClick={() => openForm(profile.level)} style={{ ...secondaryBtn, marginTop: 12, padding: 10, fontSize: 13 }}>
            ✏ Изменить данные
          </button>
        )}
      </div>
{nextLevel !== null && (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: '#a78bfa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Следующий уровень</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>
            Уровень {nextLevel} — {LEVEL_INFO[nextLevel].title}
          </div>
          <div style={{ fontSize: 13, color: '#cbd5e1', marginTop: 4 }}>{LEVEL_INFO[nextLevel].description}</div>
          <ul style={{ margin: '10px 0 0', paddingLeft: 20, fontSize: 13, color: '#cbd5e1' }}>
            {LEVEL_INFO[nextLevel].features.map((f, i) => <li key={i} style={{ marginBottom: 3 }}>{f}</li>)}
          </ul>
          <button onClick={() => openForm(nextLevel)} style={{ ...primaryBtn, marginTop: 14 }}>
            Повысить до уровня {nextLevel}
          </button>
        </div>
      )}

      <button onClick={resetAll} style={{ ...secondaryBtn, color: '#fca5a5', borderColor: 'rgba(239,68,68,0.3)' }}>
        🗑 Сбросить все данные верификации
      </button>
    </Modal>
  );
}


function BirthDateInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [mode, setMode] = useState<'select' | 'text'>('select');
  const parse = (v: string) => {
    const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return m ? { y: m[1], mo: m[2], d: m[3] } : { y: '', mo: '', d: '' };
  };
  const initial = parse(value);
  const [d, setD] = useState(initial.d);
  const [mo, setMo] = useState(initial.mo);
  const [y, setY] = useState(initial.y);
  const [textVal, setTextVal] = useState(
    value ? `${parse(value).d}.${parse(value).mo}.${parse(value).y}` : ''
  );

  const pushUp = (nd: string, nm: string, ny: string) => {
    if (nd && nm && ny) {
      onChange(`${ny}-${nm.padStart(2, '0')}-${nd.padStart(2, '0')}`);
    } else {
      onChange('');
    }
  };
  const onD = (v: string) => { setD(v); pushUp(v, mo, y); };
  const onMo = (v: string) => { setMo(v); pushUp(d, v, y); };
  const onY = (v: string) => { setY(v); pushUp(d, mo, v); };

  const applyText = (t: string) => {
    setTextVal(t);
    const m = t.match(/^(\d{1,2})[.\/\-](\d{1,2})[.\/\-](\d{4})$/);
    if (m) {
      const dd = m[1].padStart(2, '0');
      const mm = m[2].padStart(2, '0');
      onChange(`${m[3]}-${mm}-${dd}`);
    } else {
      onChange('');
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => String(currentYear - 14 - i));
  const months = [
    { v: '01', n: 'Январь' }, { v: '02', n: 'Февраль' }, { v: '03', n: 'Март' },
    { v: '04', n: 'Апрель' }, { v: '05', n: 'Май' }, { v: '06', n: 'Июнь' },
    { v: '07', n: 'Июль' }, { v: '08', n: 'Август' }, { v: '09', n: 'Сентябрь' },
    { v: '10', n: 'Октябрь' }, { v: '11', n: 'Ноябрь' }, { v: '12', n: 'Декабрь' },
  ];
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  const selectStyle: React.CSSProperties = {
    padding: '12px 8px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(15,23,42,0.8)',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    appearance: 'none',
    textAlign: 'center',
    cursor: 'pointer',
  };

  return (
    <div>
      {mode === 'select' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr', gap: 6 }}>
          <select style={selectStyle} value={d} onChange={e => onD(e.target.value)}>
            <option value="">День</option>
            {days.map(x => <option key={x} value={x}>{x}</option>)}
          </select>
          <select style={selectStyle} value={mo} onChange={e => onMo(e.target.value)}>
            <option value="">Месяц</option>
            {months.map(x => <option key={x.v} value={x.v}>{x.n}</option>)}
          </select>
          <select style={selectStyle} value={y} onChange={e => onY(e.target.value)}>
            <option value="">Год</option>
            {years.map(x => <option key={x} value={x}>{x}</option>)}
          </select>
        </div>
      ) : (
        <input
          type="text"
          inputMode="numeric"
          placeholder="15.03.1990"
          value={textVal}
onChange={e => applyText(e.target.value)}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.14)',
            background: 'rgba(15,23,42,0.8)', color: '#fff',
            fontSize: 15, outline: 'none', boxSizing: 'border-box',
          }}
        />
      )}
      <button
        type="button"
        onClick={() => setMode(mode === 'select' ? 'text' : 'select')}
        style={{
          background: 'transparent', color: '#93c5fd', border: 'none',
          fontSize: 12, cursor: 'pointer', padding: '6px 0 0', textDecoration: 'underline',
        }}
      >
        {mode === 'select' ? '✍ Ввести вручную (15.03.1990)' : '📋 Выбрать из списка'}
      </button>
    </div>
  );
}

// === helpers ===
const backBtn: React.CSSProperties = {
  background: 'transparent', color: '#93c5fd', border: 'none',
  fontSize: 14, cursor: 'pointer', padding: 4,
};
const primaryBtn: React.CSSProperties = {
  width: '100%', padding: '14px', borderRadius: 12,
  background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
  color: '#fff', border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer',
};
const secondaryBtn: React.CSSProperties = {
  width: '100%', padding: '12px', borderRadius: 12,
  background: 'rgba(255,255,255,0.04)', color: '#fff',
  border: '1px solid rgba(255,255,255,0.14)',
  fontWeight: 600, fontSize: 14, cursor: 'pointer',
};

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '20px 12px', overflowY: 'auto',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(to bottom,#0f172a,#020617)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 18, padding: 20,
          width: '100%', maxWidth: 500,
          color: '#fff', fontFamily: 'system-ui,sans-serif',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
