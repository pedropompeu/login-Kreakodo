import React from 'react';

interface User {
  uid: string;
  email: string;
  fullName: string;
  username: string;
  role: 'user' | 'admin' | 'superadmin';
  active: boolean;
  createdAt: any;
  lastLoginAt: any;
}

interface UserListItemProps {
  user: User;
  onEdit: (user: User) => void;
  onToggleActive: (uid: string, currentStatus: boolean) => void;
  onPromote: (uid: string) => void;
  isSuperAdmin: boolean;
}

const UserListItem: React.FC<UserListItemProps> = ({
  user,
  onEdit,
  onToggleActive,
  onPromote,
  isSuperAdmin,
}) => {
  return (
    <tr className={`border-b ${!user.active ? 'bg-gray-100 opacity-60' : ''}`}>
      <td className="px-4 py-3">{user.fullName}</td>
      <td className="px-4 py-3">{user.username}</td>
      <td className="px-4 py-3">{user.email}</td>
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            user.role === 'superadmin'
              ? 'bg-purple-200 text-purple-800'
              : user.role === 'admin'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-green-200 text-green-800'
          }`}
        >
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            user.active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
          }`}
        >
          {user.active ? 'Ativo' : 'Inativo'}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {user.createdAt?.toDate?.()?.toLocaleDateString('pt-BR') || 'N/A'}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => onEdit(user)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm transition-colors"
            title="Editar usuário"
          >
            ✏️ Editar
          </button>
          <button
            onClick={() => onToggleActive(user.uid, user.active)}
            className={`px-3 py-1 text-white rounded text-sm transition-colors ${
              user.active
                ? 'bg-orange-500 hover:bg-orange-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
            title={user.active ? 'Desativar usuário' : 'Ativar usuário'}
          >
            {user.active ? '🔒 Desativar' : '✅ Ativar'}
          </button>
          {isSuperAdmin && user.role === 'user' && (
            <button
              onClick={() => onPromote(user.uid)}
              className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm transition-colors"
              title="Promover para admin"
            >
              ⬆️ Promover
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default UserListItem;
