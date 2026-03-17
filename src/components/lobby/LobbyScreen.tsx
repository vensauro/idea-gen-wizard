import React, { useState } from 'react';
import { useMultiplayer } from '../../contexts/MultiplayerContext';
import { Users, LogIn, Plus } from 'lucide-react';

export function LobbyScreen() {
  const { createRoom, joinRoom, connected } = useMultiplayer();
  const [userName, setUserName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName && teamName) {
      createRoom(teamName, userName);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName && roomCode) {
      joinRoom(roomCode.toUpperCase(), userName);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-8">
          <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Assistente de Inovação com IA</h1>
          <p className="text-slate-500">
            {connected ? "Conectado. Escolha como deseja começar." : "Conectando ao servidor..."}
          </p>
        </div>

        {!connected && (
          <div className="flex justify-center my-8">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        )}

        {connected && mode === 'select' && (
          <div className="space-y-4">
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">Seu Nome</label>
              <input 
                type="text" 
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all placeholder:text-slate-400"
                placeholder="Ex: João Silva"
              />
            </div>

            <button
              onClick={() => setMode('create')}
              disabled={!userName.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
              Criar Nova Equipe
            </button>
            <button
              onClick={() => setMode('join')}
              disabled={!userName.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-600 border border-indigo-200 font-medium rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50"
            >
              <LogIn className="w-5 h-5" />
              Entrar em Equipe Existente
            </button>
          </div>
        )}

        {connected && mode === 'create' && (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Equipe</label>
              <input 
                type="text" 
                autoFocus
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all placeholder:text-slate-400"
                placeholder="Ex: Equipe Alpha"
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMode('select')}
                className="flex-1 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={!teamName.trim()}
                className="flex-[2] bg-indigo-600 text-white font-medium px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                Criar e Começar
              </button>
            </div>
          </form>
        )}

        {connected && mode === 'join' && (
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Código da Sala</label>
              <input 
                type="text" 
                autoFocus
                value={roomCode}
                onChange={e => setRoomCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all placeholder:text-slate-400 uppercase tracking-widest text-center text-lg"
                placeholder="XXXXXX"
                maxLength={6}
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMode('select')}
                className="flex-1 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={roomCode.length !== 6}
                className="flex-[2] bg-indigo-600 text-white font-medium px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                Entrar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
