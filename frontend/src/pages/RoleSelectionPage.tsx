
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const handleRoleSelection = (role: 'admin' | 'user') => {
    navigate(role === 'admin' ? '/admin' : '/user');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full p-8 bg-white shadow-md rounded-xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          Olá, {userProfile?.fullName}!
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Como SuperAdmin, você pode acessar tanto o painel de administração quanto a área de usuário.
          Escolha como deseja continuar:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => handleRoleSelection('admin')}
            className="p-8 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors duration-200 flex flex-col items-center justify-center"
          >
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-2xl font-bold">Painel Admin</span>
            <span className="text-sm mt-2 opacity-90">Gerenciar usuários e sistema</span>
          </button>
          <button
            onClick={() => handleRoleSelection('user')}
            className="p-8 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors duration-200 flex flex-col items-center justify-center"
          >
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-2xl font-bold">Área do Usuário</span>
            <span className="text-sm mt-2 opacity-90">Acessar como usuário comum</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
