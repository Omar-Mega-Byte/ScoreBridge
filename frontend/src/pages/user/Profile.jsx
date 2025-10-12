import { User } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Profile = () => {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <User className="text-primary-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm mb-1">Name</label>
            <div className="text-lg font-medium text-gray-900">
              {user?.name || 'N/A'}
            </div>
          </div>
          
          <div>
            <label className="block text-gray-600 text-sm mb-1">Email</label>
            <div className="text-lg font-medium text-gray-900">{user?.email || 'N/A'}</div>
          </div>
          
          <div>
            <label className="block text-gray-600 text-sm mb-1">Phone</label>
            <div className="text-lg font-medium text-gray-900">{user?.phoneNumber || 'Not provided'}</div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-600">Profile editing coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
