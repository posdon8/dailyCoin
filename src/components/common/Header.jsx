const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="flex-between p-2">
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
              💰 Quản Lý Chi Tiêu
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#7f8c8d', fontSize: '0.875rem' }}>
              Theo dõi chi tiêu hàng ngày của bạn
            </p>
          </div>
        </div>
      </div>
      <style>{`
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: var(--shadow);
          padding: 12px 0;
        }

        .header h1 {
          color: white;
        }

        .header p {
          color: rgba(255, 255, 255, 0.9) !important;
        }
      `}</style>
    </header>
  );
};

export default Header;
