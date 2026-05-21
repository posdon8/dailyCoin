const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="flex-between p-2">
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            © {currentYear} Ứng dụng Quản Lý Chi Tiêu
          </p>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            v1.0.0
          </p>
        </div>
      </div>
      <style>{`
        .footer {
          background-color: #2c3e50;
          color: #ecf0f1;
          text-align: center;
          padding: 20px 0;
          margin-top: 40px;
          border-top: 1px solid #34495e;
        }

        .footer p {
          color: #ecf0f1;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
