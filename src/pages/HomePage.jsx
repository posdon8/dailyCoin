import Dashboard from '../components/dashboard/Dashboard';

const HomePage = ({ expenses = [] }) => {
  return (
    <div className="container p-3">
      <Dashboard expenses={expenses} />
    </div>
  );
};

export default HomePage;
