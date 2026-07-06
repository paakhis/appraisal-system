import { useNavigate } from 'react-router-dom';
import { ShieldX } from 'lucide-react';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F8FF]">
      <div className="card text-center max-w-sm">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldX size={32} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-sm text-gray-500 mb-6">You don't have permission to view this page.</p>
        <button onClick={() => navigate("/login"  )} className="btn-primary">Go Back</button>
      </div>
    </div>
  );
};
