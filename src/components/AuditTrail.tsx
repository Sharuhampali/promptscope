'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, ShieldCheck, ShieldAlert, ShieldX, Clock, 
  ArrowRight, FileText, Download, CheckCircle, AlertTriangle, 
  ExternalLink, Code, Info, ChevronRight, X, Calendar 
} from 'lucide-react';
import { AnalysisResult } from '../lib/firewallEngine';

interface AuditTrailProps {
  logs: AnalysisResult[];
}

export default function AuditTrail({ logs }: AuditTrailProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'allowed' | 'sanitized' | 'blocked'>('all');
  const [threatFilter, setThreatFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<AnalysisResult | null>(null);

  // Extract unique threat types dynamically for filter options
  const threatTypes = useMemo(() => {
    const types = new Set<string>();
    logs.forEach(l => {
      if (l.threatType !== 'None') {
        types.add(l.threatType);
      }
    });
    return Array.from(types);
  }, [logs]);

  // Filter logs based on search + filters
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.originalPrompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.explanation.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'allowed' && log.allowed) ||
        (statusFilter === 'sanitized' && log.sanitized) ||
        (statusFilter === 'blocked' && log.blocked);

      const matchesThreat = 
        threatFilter === 'all' || 
        log.threatType === threatFilter;

      return matchesSearch && matchesStatus && matchesThreat;
    });
  }, [logs, searchTerm, statusFilter, threatFilter]);

  const handleDownloadReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `PromptScope_Audit_Trail_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Options */}
      <div className="glass-panel rounded-2xl p-5 border border-brand-border bg-brand-card">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-muted" />
            <input
              type="text"
              placeholder="Search by Log ID or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-brand-bg border border-brand-border rounded-lg pl-9 pr-4 py-2 text-xs text-brand-text placeholder-brand-muted/50 focus:outline-none focus:border-brand-border-glow transition-colors duration-150"
            />
          </div>

          {/* Status filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            
            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5 bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-xs text-brand-muted">
              <Filter className="w-3.5 h-3.5" />
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e: any) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none text-brand-text text-xs focus:outline-none ml-1 cursor-pointer font-medium"
              >
                <option value="all" className="bg-brand-card">All Statuses</option>
                <option value="allowed" className="bg-brand-card text-safe">Allowed</option>
                <option value="sanitized" className="bg-brand-card text-warning">Sanitized</option>
                <option value="blocked" className="bg-brand-card text-danger">Blocked</option>
              </select>
            </div>

            {/* Threat Dropdown */}
            <div className="flex items-center gap-1.5 bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-xs text-brand-muted">
              <span>Category:</span>
              <select
                value={threatFilter}
                onChange={(e) => setThreatFilter(e.target.value)}
                className="bg-transparent border-none text-brand-text text-xs focus:outline-none ml-1 cursor-pointer font-medium"
              >
                <option value="all" className="bg-brand-card">All Categories</option>
                {threatTypes.map(t => (
                  <option key={t} value={t} className="bg-brand-card">{t}</option>
                ))}
              </select>
            </div>

            {/* Download Audit Button */}
            <button
              onClick={handleDownloadReport}
              disabled={logs.length === 0}
              className="ml-auto md:ml-0 px-3.5 py-1.5 rounded-lg border border-brand-border bg-brand-bg hover:border-brand-border-glow text-xs text-brand-text flex items-center gap-1.5 transition duration-150 hover:bg-brand-card disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Ledger</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Audit Logs Table / Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Logs Table */}
        <div className={`glass-panel rounded-2xl border border-brand-border bg-brand-card overflow-hidden ${
          selectedLog ? 'lg:col-span-7' : 'lg:col-span-12'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border bg-brand-bg/40 text-[10px] uppercase font-bold text-brand-muted tracking-wider">
                  <th className="py-3.5 px-4">Event ID</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Threat Type</th>
                  <th className="py-3.5 px-4 text-center">Risk Score</th>
                  <th className="py-3.5 px-4">Security Action</th>
                  <th className="py-3.5 px-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border text-xs">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-brand-muted">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-35 text-cyber-blue" />
                      <p className="font-semibold">No audit logs found matching criteria</p>
                      <p className="text-[10px] mt-1 opacity-70">Evaluate prompts in the Playground simulator to generate logs.</p>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr 
                      key={log.id} 
                      onClick={() => setSelectedLog(log)}
                      className={`hover:bg-brand-bg/40 cursor-pointer transition-colors duration-150 ${
                        selectedLog?.id === log.id ? 'bg-brand-bg/50' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-text">
                        {log.id}
                      </td>
                      <td className="py-3.5 px-4 text-brand-muted">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          log.threatType === 'None' 
                            ? 'bg-brand-bg border border-brand-border text-brand-muted' 
                            : 'bg-danger/10 text-danger border border-danger/20'
                        }`}>
                          {log.threatType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold">
                        <span className={log.riskScore > 60 ? 'text-danger' : log.riskScore > 30 ? 'text-warning' : 'text-safe'}>
                          {log.riskScore}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider text-[10px] ${
                          log.allowed ? 'text-safe' : log.sanitized ? 'text-warning' : 'text-danger'
                        }`}>
                          {log.allowed && <ShieldCheck className="w-3.5 h-3.5" />}
                          {log.sanitized && <AlertTriangle className="w-3.5 h-3.5" />}
                          {log.blocked && <ShieldX className="w-3.5 h-3.5" />}
                          {log.allowed ? 'Allowed' : log.sanitized ? 'Sanitized' : 'Blocked'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <ChevronRight className="w-4 h-4 text-brand-muted inline-block" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Log Detail Card */}
        {selectedLog && (
          <div className="lg:col-span-5 glass-panel rounded-2xl p-5 border border-brand-border bg-brand-card flex flex-col space-y-4 animate-fade-in">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted">Inspection Metadata</h3>
                <h4 className="text-sm font-mono font-black text-brand-text mt-0.5">{selectedLog.id}</h4>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="text-brand-muted hover:text-brand-text p-1 rounded hover:bg-brand-bg transition duration-150"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Audit compliance checksum hash */}
            <div className="p-2.5 rounded bg-brand-bg border border-brand-border">
              <span className="text-[8px] font-bold text-brand-muted uppercase flex items-center gap-1 mb-1 tracking-wider">
                <Code className="w-3 h-3 text-cyber-blue" /> Compliant Cryptographic Ledger Checksum
              </span>
              <p className="text-[10px] font-mono text-brand-text truncate select-all">{selectedLog.hash}</p>
            </div>

            {/* General Log details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded bg-brand-bg/50 border border-brand-border/60">
                <span className="text-[9px] font-bold text-brand-muted uppercase block">Security Action</span>
                <span className={`font-bold mt-1 inline-block ${
                  selectedLog.allowed ? 'text-safe' : selectedLog.sanitized ? 'text-warning' : 'text-danger'
                }`}>
                  {selectedLog.allowed ? 'Allowed' : selectedLog.sanitized ? 'Sanitized' : 'Blocked'}
                </span>
              </div>
              <div className="p-3 rounded bg-brand-bg/50 border border-brand-border/60">
                <span className="text-[9px] font-bold text-brand-muted uppercase block flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-muted" /> Scan Date
                </span>
                <span className="text-brand-text font-medium mt-1 inline-block">
                  {new Date(selectedLog.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>

            {/* Compliance verification scorecard */}
            <div className="p-3 rounded bg-brand-bg/50 border border-brand-border/60 space-y-2">
              <span className="text-[9px] font-bold text-brand-muted uppercase block">Compliance Scoring</span>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="p-1 rounded bg-brand-bg border border-brand-border">
                  <div className="font-bold text-brand-muted">HIPAA</div>
                  <div className={`font-semibold mt-0.5 ${selectedLog.complianceChecked.hipaa === 'Violation Detected' ? 'text-danger' : 'text-safe'}`}>
                    {selectedLog.complianceChecked.hipaa === 'Violation Detected' ? 'FAIL' : 'PASS'}
                  </div>
                </div>
                <div className="p-1 rounded bg-brand-bg border border-brand-border">
                  <div className="font-bold text-brand-muted">GDPR</div>
                  <div className={`font-semibold mt-0.5 ${selectedLog.complianceChecked.gdpr === 'Violation Detected' ? 'text-danger' : 'text-safe'}`}>
                    {selectedLog.complianceChecked.gdpr === 'Violation Detected' ? 'FAIL' : 'PASS'}
                  </div>
                </div>
                <div className="p-1 rounded bg-brand-bg border border-brand-border">
                  <div className="font-bold text-brand-muted">HICP</div>
                  <div className={`font-semibold mt-0.5 ${selectedLog.complianceChecked.hicp === 'Violation Detected' ? 'text-danger' : 'text-safe'}`}>
                    {selectedLog.complianceChecked.hicp === 'Violation Detected' ? 'FAIL' : 'PASS'}
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Risk Ratings Breakdown */}
            <div className="p-3 rounded bg-brand-bg/50 border border-brand-border/60">
              <span className="text-[9px] font-bold text-brand-muted uppercase block mb-2">Threat Vector breakdown</span>
              <div className="space-y-2 text-[10px]">
                {/* System Override Score */}
                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-brand-text">System Override / Injection</span>
                    <span className="font-bold font-mono">{selectedLog.metrics.injectionScore}%</span>
                  </div>
                  <div className="w-full bg-brand-border h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyber-blue h-full" style={{ width: `${selectedLog.metrics.injectionScore}%` }}></div>
                  </div>
                </div>
                {/* Jailbreak Score */}
                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-brand-text">Jailbreak / Persona Bypass</span>
                    <span className="font-bold font-mono">{selectedLog.metrics.jailbreakScore}%</span>
                  </div>
                  <div className="w-full bg-brand-border h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyber-purple h-full" style={{ width: `${selectedLog.metrics.jailbreakScore}%` }}></div>
                  </div>
                </div>
                {/* PHI Disclosure Score */}
                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-brand-text">PHI Privacy Leakage</span>
                    <span className="font-bold font-mono">{selectedLog.metrics.phiScore}%</span>
                  </div>
                  <div className="w-full bg-brand-border h-1.5 rounded-full overflow-hidden">
                    <div className="bg-danger h-full" style={{ width: `${selectedLog.metrics.phiScore}%` }}></div>
                  </div>
                </div>
                {/* Bias Override Score */}
                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-brand-text">Clinical Bias Override</span>
                    <span className="font-bold font-mono">{selectedLog.metrics.biasScore}%</span>
                  </div>
                  <div className="w-full bg-brand-border h-1.5 rounded-full overflow-hidden">
                    <div className="bg-warning h-full" style={{ width: `${selectedLog.metrics.biasScore}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt comparisons */}
            <div className="space-y-2 flex-1">
              {/* Original Prompt */}
              <div>
                <span className="text-[9px] font-bold text-brand-muted uppercase block">Original Ingested Prompt</span>
                <div className="bg-brand-bg/85 border border-brand-border p-2.5 rounded text-[10px] font-mono text-brand-text whitespace-pre-wrap max-h-[120px] overflow-y-auto leading-relaxed mt-1">
                  {selectedLog.originalPrompt}
                </div>
              </div>

              {/* Processed/Sanitized Prompt */}
              {(selectedLog.sanitized || selectedLog.blocked) && (
                <div>
                  <span className="text-[9px] font-bold text-brand-muted uppercase block flex items-center gap-1">
                    {selectedLog.sanitized ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                        Sanitized Ingested Prompt
                      </>
                    ) : (
                      <>
                        <ShieldX className="w-3.5 h-3.5 text-danger" />
                        Blocked Ingested Prompt
                      </>
                    )}
                  </span>
                  <div className={`p-2.5 rounded text-[10px] font-mono whitespace-pre-wrap max-h-[120px] overflow-y-auto leading-relaxed mt-1 border bg-brand-bg/85 ${
                    selectedLog.sanitized ? 'border-warning/35 text-warning/90' : 'border-danger/35 text-danger/90'
                  }`}>
                    {selectedLog.processedPrompt}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
