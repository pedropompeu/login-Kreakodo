
import { useAuth } from '../hooks/useAuth';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const UserPage = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
      <div className="flex justify-between items-center w-full max-w-2xl mb-8">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
      <div className="p-8 bg-white shadow-md rounded-xl text-center max-w-2xl">
        <p className="text-2xl font-bold mb-4">
          Olá, {userProfile?.username}! Bem-Vindo(a) ao nosso sistema.
        </p>
        <p className="text-lg mt-4 text-gray-700">
          Em breve terá nova atualização. Obrigado pela paciência!
        </p>
        <div className="mt-6 flex flex-col items-center">
          <p className="text-xl mb-4">Um grande Beijos da equipe KreaKodo!</p>
          <div className="kiss-animation text-6xl">
            😘
          </div>
        </div>
      </div>
      <style>{`
        @keyframes kiss {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.2) rotate(-10deg); }
          50% { transform: scale(1.3) rotate(10deg); }
          75% { transform: scale(1.2) rotate(-10deg); }
        }
        .kiss-animation {
          animation: kiss 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default UserPage;
