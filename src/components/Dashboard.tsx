'use client';

import React, { useMemo } from 'react';
import { 
  ShieldAlert, ShieldCheck, Activity, Database, AlertCircle, 
  TrendingUp, BarChart3, Clock, AlertTriangle, FileText, CheckCircle2 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Legend 
} from 'recharts';
import { AnalysisResult } from '../lib/firewallEngine';

interface DashboardProps {
  logs: AnalysisResult[];
}

export default function Dashboard({ logs }: DashboardProps) {
  
  // Calculate statistics from current logs
  const stats = useMemo(() => {
    const total = logs.length;
    const blocked = logs.filter(l => l.blocked).length;
    const sanitized = logs.filter(l => l.sanitized).length;
    const allowed = logs.filter(l => l.allowed).length;
    
    const avgRisk = total > 0 
      ? Math.round(logs.reduce((acc, l) => acc + l.riskScore, 0) / total) 
      : 0;

    return { total, blocked, sanitized, allowed, avgRisk };
  }, [logs]);

  // Compute compliance scorecards
  const compliance = useMemo(() => {
    const total = logs.length;
    if (total === 0) {
      return { hipaa: 100, gdpr: 100, hicp: 100 };
    }

    const hipaaViolations = logs.filter(l => l.complianceChecked.hipaa === 'Violation Detected').length;
    const gdprViolations = logs.filter(l => l.complianceChecked.gdpr === 'Violation Detected').length;
    const hicpViolations = logs.filter(l => l.complianceChecked.hicp === 'Violation Detected').length;

    return {
      hipaa: Math.max(0, Math.round(((total - hipaaViolations) / total) * 100)),
      gdpr: Math.max(0, Math.round(((total - gdprViolations) / total) * 100)),
      hicp: Math.max(0, Math.round(((total - hicpViolations) / total) * 100))
    };
  }, [logs]);

  // Format data for chart 1: Threat distribution
  const threatData = useMemo(() => {
    const types: Record<string, number> = {
      'Prompt Injection': 0,
      'PHI Leakage': 0,
      'Bias Manipulation': 0,
      'Jailbreak': 0,
      'Policy Violation': 0
    };

    logs.forEach(l => {
      if (l.threatType !== 'None' && types[l.threatType] !== undefined) {
        types[l.threatType]++;
      }
    });

    return Object.keys(types).map(name => ({
      name,
      value: types[name]
    })).filter(item => item.value > 0);
  }, [logs]);

  // Fallback threat data in case logs are empty, to demonstrate visual excellence
  const displayThreatData = threatData.length > 0 ? threatData : [
    { name: 'Prompt Injection', value: 12 },
    { name: 'PHI Leakage', value: 8 },
    { name: 'Bias Manipulation', value: 5 },
    { name: 'Jailbreak', value: 7 },
    { name: 'Policy Violation', value: 2 }
  ];

  // Format data for chart 2: Scan trend over time (mocked based on actual log times or static steps)
  const trendData = useMemo(() => {
    if (logs.length === 0) {
      return [
        { time: '08:00', risk: 10, blocked: 0 },
        { time: '10:00', risk: 24, blocked: 0 },
        { time: '12:00', risk: 35, blocked: 0 },
        { time: '14:00', risk: 42, blocked: 0 },
        { time: '16:00', risk: 58, blocked: 0 },
        { time: '18:00', risk: 65, blocked: 0 }
      ];
    }

    // Dynamic extraction of logs grouped by their local time slice
    return logs.slice().reverse().map((l, i) => {
      const timeStr = new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      return {
        time: timeStr,
        risk: l.riskScore,
        blocked: l.blocked ? 1 : 0
      };
    });
  }, [logs]);

  const COLORS = ['#8b5cf6', '#ef4444', '#f59e0b', '#06b6d4', '#a1a1aa'];

  return (
    <div className="space-y-6">
      
      {/* 4 Core Statistics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scanned */}
        <div className="glass-panel rounded-2xl p-5 border border-brand-border bg-brand-card flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-brand-muted uppercase">Total Requests Scanned</span>
            <h3 className="text-2xl font-black text-brand-text mt-1">{stats.total}</h3>
            <p className="text-[9px] text-safe flex items-center gap-1 mt-1 font-medium">
              <ShieldCheck className="w-3 h-3" /> Live protection active
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-cyber-blue/10 border border-cyber-blue/20 flex items-center justify-center text-cyber-blue">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Threats Blocked */}
        <div className="glass-panel rounded-2xl p-5 border border-brand-border bg-brand-card flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-brand-muted uppercase">Adversarial Blocks</span>
            <h3 className="text-2xl font-black text-danger mt-1">{stats.blocked}</h3>
            <p className="text-[9px] text-brand-muted flex items-center gap-1 mt-1 font-medium">
              <span className="text-danger font-bold">●</span> Stopped pre-inference
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-danger/10 border border-danger/20 flex items-center justify-center text-danger">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* Inputs Sanitized */}
        <div className="glass-panel rounded-2xl p-5 border border-brand-border bg-brand-card flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-brand-muted uppercase">Sanitized / Redacted</span>
            <h3 className="text-2xl font-black text-warning mt-1">{stats.sanitized}</h3>
            <p className="text-[9px] text-brand-muted flex items-center gap-1 mt-1 font-medium">
              <span className="text-warning font-bold">●</span> Modified and allowed
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-warning/10 border border-warning/20 flex items-center justify-center text-warning">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Avg Risk Score */}
        <div className="glass-panel rounded-2xl p-5 border border-brand-border bg-brand-card flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-brand-muted uppercase">Average Risk Rating</span>
            <h3 className={`text-2xl font-black mt-1 ${
              stats.avgRisk > 60 ? 'text-danger' : stats.avgRisk > 30 ? 'text-warning' : 'text-safe'
            }`}>
              {stats.avgRisk}%
            </h3>
            <p className="text-[9px] text-brand-muted flex items-center gap-1 mt-1 font-medium">
              Across overall data ingestion
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-brand-bg border border-brand-border flex items-center justify-center text-brand-text">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Compliance Scorecards */}
      <div className="glass-panel rounded-2xl p-5 border border-brand-border bg-brand-card">
        <h2 className="text-sm font-semibold tracking-wider text-brand-muted uppercase mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-safe" /> Compliance & Regulatory Scorecard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* HIPAA (Patient Health Info Privacy) */}
          <div className="bg-brand-bg/40 border border-brand-border rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-xs font-bold text-brand-text">HIPAA (Privacy & Security)</h4>
                <p className="text-[9px] text-brand-muted mt-0.5">Standards for PHI disclosure safeguards</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                compliance.hipaa === 100 ? 'bg-safe/10 text-safe border border-safe/25' : 'bg-warning/10 text-warning border border-warning/25'
              }`}>
                {compliance.hipaa === 100 ? 'Compliant' : 'Audit Advised'}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 bg-brand-border h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${compliance.hipaa > 80 ? 'bg-safe' : 'bg-warning'}`}
                  style={{ width: `${compliance.hipaa}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold font-mono text-brand-text">{compliance.hipaa}%</span>
            </div>
          </div>

          {/* GDPR (Data Protection / De-identification) */}
          <div className="bg-brand-bg/40 border border-brand-border rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-xs font-bold text-brand-text">GDPR (Article 32 Security)</h4>
                <p className="text-[9px] text-brand-muted mt-0.5">Integrity and redaction metrics</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                compliance.gdpr === 100 ? 'bg-safe/10 text-safe border border-safe/25' : 'bg-warning/10 text-warning border border-warning/25'
              }`}>
                {compliance.gdpr === 100 ? 'Compliant' : 'Audit Advised'}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 bg-brand-border h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${compliance.gdpr > 80 ? 'bg-safe' : 'bg-warning'}`}
                  style={{ width: `${compliance.gdpr}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold font-mono text-brand-text">{compliance.gdpr}%</span>
            </div>
          </div>

          {/* HICP (Health Industry Cybersecurity Practices) */}
          <div className="bg-brand-bg/40 border border-brand-border rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-xs font-bold text-brand-text">HICP (Adversarial Defense)</h4>
                <p className="text-[9px] text-brand-muted mt-0.5">Malicious input override blocks</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                compliance.hicp === 100 ? 'bg-safe/10 text-safe border border-safe/25' : 'bg-warning/10 text-warning border border-warning/25'
              }`}>
                {compliance.hicp === 100 ? 'Compliant' : 'Warning'}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 bg-brand-border h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${compliance.hicp > 80 ? 'bg-safe' : 'bg-danger'}`}
                  style={{ width: `${compliance.hicp}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold font-mono text-brand-text">{compliance.hicp}%</span>
            </div>
          </div>

        </div>
      </div>

      {/* Visual Monitoring Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Threat Velocity Trend */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-5 border border-brand-border bg-brand-card flex flex-col min-h-[350px]">
          <h2 className="text-sm font-semibold tracking-wider text-brand-muted uppercase mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyber-blue" /> Scan Risk & Threat Velocity
          </h2>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey={logs.length === 0 ? "time" : "time"} stroke="#a1a1aa" fontSize={9} />
                <YAxis stroke="#a1a1aa" fontSize={9} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121215', borderColor: '#27272a', borderRadius: '8px' }}
                  labelStyle={{ color: '#a1a1aa', fontSize: '10px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#f4f4f5', fontSize: '11px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="risk" 
                  name="Risk Rating (%)"
                  stroke="#ef4444" 
                  fillOpacity={1} 
                  fill="url(#colorRisk)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Threat Distribution Pie/Bar Chart */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-5 border border-brand-border bg-brand-card flex flex-col min-h-[350px]">
          <h2 className="text-sm font-semibold tracking-wider text-brand-muted uppercase mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-cyber-blue" /> Threat Category Profile
          </h2>
          <div className="flex-1 w-full min-h-[200px] flex items-center justify-center">
            {displayThreatData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayThreatData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                  <XAxis type="number" stroke="#a1a1aa" fontSize={9} />
                  <YAxis dataKey="name" type="category" stroke="#a1a1aa" fontSize={9} width={95} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#121215', borderColor: '#27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#f4f4f5', fontSize: '11px' }}
                  />
                  <Bar dataKey="value" name="Occurrences" radius={[0, 4, 4, 0]}>
                    {displayThreatData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-brand-muted text-xs text-center">No threats recorded yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* High Severity Security Alerts Feed */}
      <div className="glass-panel rounded-2xl p-5 border border-brand-border bg-brand-card">
        <h2 className="text-sm font-semibold tracking-wider text-brand-muted uppercase mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-danger" /> Critical High-Risk Incident Feed
        </h2>
        
        {logs.filter(l => l.blocked || l.sanitized).length === 0 ? (
          <div className="bg-brand-bg/30 border border-brand-border border-dashed rounded-xl p-8 text-center text-brand-muted text-xs">
            No security incidents or policy sanitizations have been triggered yet.
          </div>
        ) : (
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {logs
              .filter(l => l.blocked || l.sanitized)
              .map((log) => (
                <div 
                  key={log.id} 
                  className={`p-3 rounded-lg border flex items-center justify-between gap-4 text-xs transition duration-150 bg-brand-bg/50 ${
                    log.blocked 
                      ? 'border-danger/20 hover:border-danger/45' 
                      : 'border-warning/20 hover:border-warning/45'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${log.blocked ? 'bg-danger' : 'bg-warning'}`}></span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-brand-text">{log.id}</span>
                        <span className="text-[10px] text-brand-muted">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                          log.blocked ? 'bg-danger/10 text-danger border border-danger/25' : 'bg-warning/10 text-warning border border-warning/25'
                        }`}>
                          {log.threatType}
                        </span>
                      </div>
                      <p className="text-[10px] text-brand-muted truncate mt-0.5 max-w-xl">
                        "{log.originalPrompt}"
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-brand-bg px-2 py-0.5 rounded border border-brand-border text-brand-text flex-shrink-0">
                    Score: {log.riskScore}%
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>

    </div>
  );
}
