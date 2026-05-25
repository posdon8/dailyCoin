import { useState } from 'react';

const AuthPage = ({ onLogin, onRegister, loading, authError }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
        };
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
    
    try {
      if (isRegister) {
        await onRegister(name, email, password);
      } else {
        await onLogin(email, password);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>{isRegister ? 'Đăng ký' : 'Đăng nhập'}</h2>
        {authError && <div className="auth-error">{authError}</div>}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label htmlFor="name">Tên</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tên của bạn"
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={submitting || loading}>
            {submitting || loading ? 'Đang xử lý...' : isRegister ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </form>
        <div style={{ textAlign: 'center', margin: '16px 0' }}>
    <span style={{ color: '#999' }}>── hoặc ──</span>
    </div>

    <button
    type="button"
    onClick={handleGoogleLogin}
    style={{
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontSize: '15px',
        fontWeight: '500',
    }}
    >
    <img 
        src="https://www.google.com/favicon.ico" 
        width="20" 
        height="20" 
        alt="Google"
    />
    Đăng nhập với Google
    </button>
        <div className="auth-toggle">
          <span>{isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}</span>
          <button type="button" className="btn btn-link" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
