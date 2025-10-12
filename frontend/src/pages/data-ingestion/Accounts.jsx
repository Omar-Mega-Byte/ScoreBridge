import { Wallet } from 'lucide-react';

const Accounts = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Wallet className="text-success-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Bank Accounts</h1>
        </div>
        <p className="text-gray-600">
          Account management coming soon. You'll be able to add and manage all your bank accounts here.
        </p>
      </div>
    </div>
  );
};

export default Accounts;
