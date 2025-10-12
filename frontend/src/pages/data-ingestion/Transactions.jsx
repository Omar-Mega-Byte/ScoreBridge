import { Receipt } from 'lucide-react';

const Transactions = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Receipt className="text-warning-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        </div>
        <p className="text-gray-600">
          Transaction tracking coming soon. View all your financial transactions in one place.
        </p>
      </div>
    </div>
  );
};

export default Transactions;
