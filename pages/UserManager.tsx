

import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit, Trash2, ArrowLeft, Save, 
  Shield, CheckCircle, XCircle, Lock, User as UserIcon, RefreshCw
} from 'lucide-react';
import { getUsers, createUser, updateUser, deleteUser, resetUserPassword } from '../services/apiService';
import { User, UserRole } from '../types';

const UserManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<'LIST' | 'FORM'>('LIST');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const initialFormState: Partial<User> = {
    username: '',
    email: '',
    role: 'VIEWER',
    status: 'ACTIVE',
  };
  const [formData, setFormData] = useState<Partial<User>>(initialFormState);
  const [password, setPassword] = useState(''); // Only used for create

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleCreateNew = () => {
    setFormData(initialFormState);
    setPassword('');
    setViewMode('FORM');
  };

  const handleEdit = (user: User) => {
    setFormData({ ...user });
    setPassword(''); // Don't show password on edit
    setViewMode('FORM');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      await deleteUser(id);
      fetchUsers();
    }
  };

  const handleResetPassword = async (id: string) => {
      if (window.confirm('Send password reset email to this user?')) {
          await resetUserPassword(id);
          alert('Password reset instructions sent.');
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email) return;

    if (formData.id) {
        await updateUser(formData.id, formData);
    } else {
        if (!password) {
            alert('Password is required for new users.');
            return;
        }
        await createUser({ ...formData, role: formData.role || 'VIEWER' } as User); // In real app, send password
    }

    await fetchUsers();
    setViewMode('LIST');
  };

  // --- RENDERERS ---

  const RoleBadge = ({ role }: { role: UserRole }) => {
      switch (role) {
          case 'SUPER_ADMIN': return <span className="bg-red-500/10 text-red-500 px-2 py-1 rounded text-xs font-bold border border-red-500/20">SUPER ADMIN</span>;
          case 'ADMIN': return <span className="bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded text-xs font-bold border border-indigo-500/20">ADMIN</span>;
          case 'EDITOR': return <span className="bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded text-xs font-bold border border-cyan-500/20">EDITOR</span>;
          default: return <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-bold">VIEWER</span>;
      }
  };

  if (viewMode === 'FORM') {
      return (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 z-10">
                <div className="flex items-center">
                    <button onClick={() => setViewMode('LIST')} className="mr-4 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-xl font-bold text-white">
                        {formData.id ? 'Edit User' : 'Create New User'}
                    </h2>
                </div>
                <button 
                    onClick={handleSubmit} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <Save size={18} className="mr-2" />
                    Save User
                </button>
            </div>

            <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Username <span className="text-red-400">*</span></label>
                            <input 
                                type="text" 
                                required
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                value={formData.username}
                                onChange={e => setFormData({...formData, username: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Email Address <span className="text-red-400">*</span></label>
                            <input 
                                type="email" 
                                required
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    {!formData.id && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Initial Password <span className="text-red-400">*</span></label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 text-slate-500" size={18}/>
                                <input 
                                    type="password" 
                                    required
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Set a strong password"
                                />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Role <span className="text-red-400">*</span></label>
                            <select 
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                            >
                                <option value="VIEWER">Viewer</option>
                                <option value="EDITOR">Editor</option>
                                <option value="ADMIN">Admin</option>
                                <option value="SUPER_ADMIN">Super Admin</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Status</label>
                            <div className="flex items-center space-x-4 mt-2">
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        className="sr-only"
                                        checked={formData.status === 'ACTIVE'} 
                                        onChange={() => setFormData({...formData, status: 'ACTIVE'})}
                                    />
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-2 ${formData.status === 'ACTIVE' ? 'border-green-500' : 'border-slate-600'}`}>
                                        {formData.status === 'ACTIVE' && <div className="w-2 h-2 rounded-full bg-green-500" />}
                                    </div>
                                    <span className={formData.status === 'ACTIVE' ? 'text-green-400' : 'text-slate-400'}>Active</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        className="sr-only"
                                        checked={formData.status === 'INACTIVE'} 
                                        onChange={() => setFormData({...formData, status: 'INACTIVE'})}
                                    />
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-2 ${formData.status === 'INACTIVE' ? 'border-red-500' : 'border-slate-600'}`}>
                                        {formData.status === 'INACTIVE' && <div className="w-2 h-2 rounded-full bg-red-500" />}
                                    </div>
                                    <span className={formData.status === 'INACTIVE' ? 'text-red-400' : 'text-slate-400'}>Inactive</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-white">User Management</h1>
           <p className="text-slate-400 mt-1">Manage system access and permissions.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-indigo-500/20"
        >
            <Plus size={20} className="mr-2" /> Create User
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                    <tr>
                        <th className="px-6 py-4 font-semibold">User</th>
                        <th className="px-6 py-4 font-semibold">Role</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold">Last Login</th>
                        <th className="px-6 py-4 font-semibold">Created</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {loading ? (
                        <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading users...</td></tr>
                    ) : users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-800/50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full mr-3 border border-slate-700" />
                                    <div>
                                        <div className="font-bold text-white text-sm">{user.username}</div>
                                        <div className="text-xs text-slate-500">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <RoleBadge role={user.role} />
                            </td>
                            <td className="px-6 py-4">
                                {user.status === 'ACTIVE' ? (
                                    <span className="flex items-center text-xs font-bold text-green-400"><CheckCircle size={12} className="mr-1" /> Active</span>
                                ) : (
                                    <span className="flex items-center text-xs font-bold text-slate-500"><XCircle size={12} className="mr-1" /> Inactive</span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-slate-400 text-sm">
                                {user.lastLogin || 'Never'}
                            </td>
                             <td className="px-6 py-4 text-slate-400 text-sm">
                                {user.createdAt}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleResetPassword(user.id)}
                                        className="p-2 text-slate-400 hover:text-yellow-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                        title="Reset Password"
                                    >
                                        <RefreshCw size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleEdit(user)}
                                        className="p-2 text-slate-400 hover:text-indigo-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user.id)}
                                        className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default UserManager;