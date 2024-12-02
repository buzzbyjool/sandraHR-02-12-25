import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import { OrganizationUser } from '../../types/organization';
import UserList from '../../components/admin/UserList';
import UserModificationDialog from '../../components/admin/UserModificationDialog';
import { useUserModification } from '../../hooks/useUserModification';

export default function UserManagement() {
  const { users, loading } = useUsers();
  const { modifyUser } = useUserModification();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<OrganizationUser | null>(null);
  const [isModifying, setIsModifying] = useState(false);

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user: OrganizationUser) => {
    setSelectedUser(user);
    setIsModifying(true);
  };

  const handleDelete = (user: OrganizationUser) => {
    // Implement delete functionality
    console.log('Delete user:', user);
  };

  const handleSaveModification = async (data: any) => {
    if (!selectedUser?.id) return;
    await modifyUser({
      userId: selectedUser.id,
      ...data
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        <button
          onClick={() => {}}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus size={20} />
          Add User
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : (
        <UserList
          users={filteredUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <UserModificationDialog
        user={selectedUser}
        isOpen={isModifying}
        onClose={() => {
          setIsModifying(false);
          setSelectedUser(null);
        }}
        onSave={handleSaveModification}
      />
    </div>
  );
}