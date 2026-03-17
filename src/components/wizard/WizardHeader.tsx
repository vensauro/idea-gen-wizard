import React, { useState } from 'react';
import { Lightbulb, Copy, Check } from 'lucide-react';
import { useWizard } from '../../contexts/WizardContext';
import { useMultiplayer } from '../../contexts/MultiplayerContext';
import { Facehash } from 'facehash';

export function WizardHeader() {
  const { currentStep, STEPS } = useWizard();
  const { room, users, me } = useMultiplayer();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (room?.id) {
      navigator.clipboard.writeText(room.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600">
          <Lightbulb className="w-6 h-6 shrink-0" />
          <span className="font-bold text-lg tracking-tight text-slate-900 truncate max-w-[200px] md:max-w-xs">
            {room ? `Equipe ${room.teamName}` : "Assistente de Inovação"}
          </span>
          {room && (
            <button 
              onClick={handleCopyCode}
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors shadow-sm group"
              title="Copiar código da sala"
            >
              <span className="text-xs font-semibold tracking-wider">Sala: {room.id}</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              )}
            </button>
          )}
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex -space-x-2">
            {users.map(u => (
              <div 
                key={u.identity.toHexString()} 
                className={`relative rounded-full border-2 ${u.identity.isEqual(me?.identity!) ? 'border-indigo-500 z-10 ring-2 ring-indigo-200' : 'border-white'} flex items-center justify-center overflow-hidden`}
                title={`${u.name} ${u.isHost ? '(Host)' : ''}`}
              >
                <Facehash 
                  name={u.name} 
                  size={32} 
                  colorClasses={["bg-red-500", "bg-orange-500", "bg-emerald-500", "bg-cyan-500", "bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500"]} 
                />
              </div>
            ))}
          </div>
          
          <div className="text-sm font-medium text-slate-500 hidden sm:block">
            Passo {currentStep} de {STEPS.length}
          </div>
        </div>
      </div>
    </header>
  );
}
