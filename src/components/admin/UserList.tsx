import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, User } from 'lucide-react';
import { OrganizationUser } from '../../types/organization';

interface UserListProps {
  users: OrganizationUser[];
  onEdit: (user: OrganizationUser) => void;
  onDelete: (user: OrganizationUser) => void;
}

export default function UserList({ users, onEdit, onDelete }: UserListProps) {
  if (!users.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No users found. Please make sure you have the correct permissions.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <User className="text-indigo-600" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(user)}
                className="p-1 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete(user)}
                className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <div className="mt-2">
            {user.roles?.map((role, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2"
              >
                {role.role}
              </span>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </motion.div>
      ))}
    </div>
  );
}