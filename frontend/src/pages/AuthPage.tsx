
import SignupForm from '../components/SignupForm';
import LoginForm from '../components/LoginForm';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const AuthPage = () => {
  const auth = getAuth();

  const handleForgotPassword = async () => {
    const email = prompt('Please enter your email to reset password:');
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        alert('Password reset email sent! Check your inbox.');
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        alert(`Error sending password reset email: ${errorMessage}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Login para Kreakodo
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Signup Form - Left Side */}
          <div className="w-full p-8 bg-white shadow-lg rounded-2xl">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Cadastro</h2>
            <SignupForm />
          </div>

          {/* Login Form - Right Side */}
          <div className="w-full p-8 bg-white shadow-lg rounded-2xl">
            <h2 className="text-3xl font-bold text-center mb-6 text-green-600">Login</h2>
            <LoginForm />
            <button
              onClick={handleForgotPassword}
              className="mt-4 text-blue-500 hover:text-blue-700 hover:underline text-sm w-full text-center transition-colors"
            >
              Esqueci a senha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
