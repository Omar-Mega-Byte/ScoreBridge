import { User } from 'lucide-react';

const FinancialProfile = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <User className="text-primary-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Financial Profile</h1>
        </div>
        <p className="text-gray-600">
          Financial profile management coming soon. This module will allow you to manage your complete financial information.
        </p>
      </div>
    </div>
  );
};

export default FinancialProfile;
