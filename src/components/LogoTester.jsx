import React, { useMemo } from 'react';
import teamsData from '../data/national_teams.json';
import { ClubLogo } from './FootballPitch';

const LogoTester = () => {
  const allClubs = useMemo(() => {
    const clubs = new Map();
    teamsData.forEach(t => {
      t.players.forEach(p => {
        if (!clubs.has(p.club)) {
          clubs.set(p.club, {
            name: p.club,
            clubDomain: p.clubDomain,
            team: t.team,
            year: t.year
          });
        }
      });
    });
    return Array.from(clubs.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <header className="mb-8 border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Logo Audit System
        </h1>
        <p className="text-slate-400 mt-2">
          Verifying {allClubs.length} unique clubs across all historical and current squads.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {allClubs.map((club, idx) => (
          <div 
            key={idx} 
            className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex flex-col items-center gap-3 hover:bg-slate-800 transition-colors group"
          >
            <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center p-2 shadow-inner group-hover:scale-110 transition-transform">
              <ClubLogo player={club} size="md" />
            </div>
            <div className="text-center w-full">
              <p className="text-xs font-semibold truncate text-slate-200" title={club.name}>
                {club.name}
              </p>
              <p className="text-[10px] text-slate-500 truncate" title={club.clubDomain}>
                {club.clubDomain || 'No Domain'}
              </p>
              <p className="text-[9px] text-cyan-500/70 mt-1 uppercase tracking-tighter">
                {club.team} {club.year}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoTester;
