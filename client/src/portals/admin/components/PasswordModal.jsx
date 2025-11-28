import React, { useState } from 'react';
import { Input } from '../../../common/components/ui/input';
import { Button } from '../../../common/components/ui/button';
import { X } from 'lucide-react';

const PasswordModal = ({ onSubmit, onClose }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(password);
    setPassword(''); // Clear password after submission
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 w-96"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-zinc-100">Admin Verification</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-zinc-300 mb-2">Enter Admin Password</label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              className="bg-zinc-800 text-zinc-200 border-zinc-700"
              autoFocus
              required
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
              Verify
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
