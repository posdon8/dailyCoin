const Loading = ({ message = 'Đang tải...' }) => {
  return (
    <div className="loading-container">
      <div className="loader"></div>
      <p>{message}</p>
      <style>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          gap: 16px;
        }

        .loading-container p {
          color: #7f8c8d;
          font-size: 0.95rem;
        }
      `}</style>
    </div>
  );
};

export default Loading;
