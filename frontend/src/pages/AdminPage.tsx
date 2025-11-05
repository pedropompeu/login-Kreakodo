import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import UserListItem from '../components/UserListItem';
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';

type FirestoreTimestamp = { seconds: number; toDate: () => Date };

interface User {
  uid: string;
  email: string;
  fullName: string;
  username: string;
  role: 'user' | 'admin' | 'superadmin';
  active: boolean;
  createdAt: FirestoreTimestamp | Date | string | null;
  lastLoginAt: FirestoreTimestamp | Date | string | null;
}

const AdminPage = () => {
  const { userProfile, currentUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const auth = getAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'lastLoginAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const token = await currentUser?.getIdToken();
      const response = await fetch('http://localhost:4000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    let result = [...users];

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by active status
    if (filterActive !== 'all') {
      result = result.filter((user) => user.active === (filterActive === 'active'));
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.fullName.localeCompare(b.fullName);
      } else if (sortBy === 'createdAt') {
        const aSeconds = (a.createdAt && typeof a.createdAt === 'object' && 'seconds' in a.createdAt) ? a.createdAt.seconds : 0;
        const bSeconds = (b.createdAt && typeof b.createdAt === 'object' && 'seconds' in b.createdAt) ? b.createdAt.seconds : 0;
        comparison = aSeconds - bSeconds;
      } else if (sortBy === 'lastLoginAt') {
        const aLastSeconds = (a.lastLoginAt && typeof a.lastLoginAt === 'object' && 'seconds' in a.lastLoginAt) ? a.lastLoginAt.seconds : 0;
        const bLastSeconds = (b.lastLoginAt && typeof b.lastLoginAt === 'object' && 'seconds' in b.lastLoginAt) ? b.lastLoginAt.seconds : 0;
        comparison = aLastSeconds - bLastSeconds;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredUsers(result);
  }, [users, searchQuery, sortBy, sortOrder, filterActive]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleToggleActive = async (uid: string, currentStatus: boolean) => {
    const action = currentStatus ? 'desativar' : 'ativar';
    if (!confirm(`Tem certeza que deseja ${action} este usuário?`)) return;

    try {
      const token = await currentUser?.getIdToken();
      const endpoint = currentStatus ? 'deactivate' : 'activate';
      const response = await fetch(`http://localhost:4000/api/users/${uid}/${endpoint}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} user`);
      }

      toast.success(`Usuário ${action === 'desativar' ? 'desativado' : 'ativado'} com sucesso!`);
      fetchUsers();
    } catch (error) {
      console.error(`Error ${action} user:`, error);
      toast.error(`Erro ao ${action} usuário`);
    }
  };

  const handlePromote = async (uid: string) => {
    if (!confirm('Tem certeza que deseja promover este usuário a admin?')) return;

    try {
      const token = await currentUser?.getIdToken();
      const response = await fetch(`http://localhost:4000/api/users/${uid}/promote`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to promote user');
      }

      toast.success('Usuário promovido para admin com sucesso!');
      fetchUsers();
    } catch (error) {
      console.error('Error promoting user:', error);
      toast.error('Erro ao promover usuário');
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSendInvite = () => {
    toast.info('Funcionalidade de envio de convite em desenvolvimento');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel Admin</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Sair
        </button>
      </div>

      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <p className="text-lg">
          Bem-vindo, <span className="font-bold">{userProfile?.fullName}</span> (
          {userProfile?.username})
        </p>
        <p className="text-sm text-gray-600">Função: {userProfile?.role}</p>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Gerenciamento de Usuários</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              + Adicionar Usuário
            </button>
            <button
              onClick={handleSendInvite}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              📧 Enviar Convite
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por nome, username ou email..."
            className="px-4 py-2 border rounded-lg col-span-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-lg"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sort, order] = e.target.value.split('-');
              setSortBy(sort as 'name' | 'createdAt' | 'lastLoginAt');
              setSortOrder(order as 'asc' | 'desc');
            }}
          >
            <option value="name-asc">Nome (A-Z)</option>
            <option value="name-desc">Nome (Z-A)</option>
            <option value="createdAt-asc">Data de Cadastro (Antiga)</option>
            <option value="createdAt-desc">Data de Cadastro (Recente)</option>
            <option value="lastLoginAt-asc">Último Login (Antigo)</option>
            <option value="lastLoginAt-desc">Último Login (Recente)</option>
          </select>
          <select
            className="px-4 py-2 border rounded-lg"
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value as 'all' | 'active' | 'inactive')}
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>

        {/* User Table */}
        {loading ? (
          <div className="text-center py-8">Carregando usuários...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Nome</th>
                  <th className="px-4 py-3 text-left">Username</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Função</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Cadastro</th>
                  <th className="px-4 py-3 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <UserListItem
                    key={user.uid}
                    user={user}
                    onEdit={handleEdit}
                    onToggleActive={handleToggleActive}
                    onPromote={handlePromote}
                    isSuperAdmin={userProfile?.role === 'superadmin'}
                  />
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum usuário encontrado
              </div>
            )}
          </div>
        )}
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUserAdded={fetchUsers}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        user={selectedUser}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onUserUpdated={fetchUsers}
        authToken={currentUser?.getIdToken || ''}
      />
    </div>
  );
};

export default AdminPage;
