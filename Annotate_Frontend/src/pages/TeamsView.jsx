import React, { useEffect, useState, useCallback } from 'react';
import { Users, Plus, X } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import useAuth from '../hooks/useAuth';

export default function TeamsView() {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTeams = useCallback(async () => {
    try {
      const data = await api.teams.getAll();
      setTeams(data);
    } catch (err) {
      console.error('Failed to load teams', err);
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.teams.create(newTeam);
      setNewTeam({ name: '', description: '' });
      setShowCreateForm(false);
      loadTeams();
    } catch (err) {
      console.error('Failed to create team', err);
      setError(err.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Teams</h1>
        {user.role === 'ADMIN' && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center space-x-2"
          >
            {showCreateForm ? (
              <>
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Create Team</span>
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {showCreateForm && (
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">Create New Team</h2>
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <input
              type="text"
              placeholder="Team Name"
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              required
            />
            <textarea
              placeholder="Team Description"
              value={newTeam.description}
              onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 min-h-[100px]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Team'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.length === 0 ? (
          <div className="col-span-full bg-black/40 backdrop-blur-xl rounded-2xl p-12 border border-white/10 text-center">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No teams available</p>
          </div>
        ) : (
          teams.map((team) => (
            <div
              key={team.id}
              className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-purple-600/20 rounded-lg">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{team.name}</h3>
                  <p className="text-sm text-gray-400">
                    {team.members?.length || 0} members
                  </p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">{team.description || 'No description'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
