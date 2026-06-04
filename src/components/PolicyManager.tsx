'use client';

import React, { useState } from 'react';
import { 
  Sliders, ShieldCheck, ShieldAlert, Check, Shield, AlertTriangle, 
  HelpCircle, Lock, Key, RefreshCw, EyeOff 
} from 'lucide-react';

interface PolicyManagerProps {
  policyMode: 'strict' | 'balanced' | 'permissive';
  setPolicyMode: (mode: 'strict' | 'balanced' | 'permissive') => void;
  enabledRules: {
    phiLeakage: boolean;
    biasManipulation: boolean;
    systemOverride: boolean;
    jailbreak: boolean;
  };
  setEnabledRules: React.Dispatch<React.SetStateAction<{
    phiLeakage: boolean;
    biasManipulation: boolean;
    systemOverride: boolean;
    jailbreak: boolean;
  }>>;
}

export default function PolicyManager({
  policyMode,
  setPolicyMode,
  enabledRules,
  setEnabledRules
}: PolicyManagerProps) {
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggleRule = (key: keyof typeof enabledRules) => {
    setEnabledRules(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Operating Security Profiles */}
      <div className="lg:col-span-6 space-y-6">
        <div className="glass-panel rounded-2xl p-6 border border-brand-border bg-brand-card">
          <div className="flex items-center gap-2 border-b border-brand-border pb-3 mb-4">
            <Sliders className="w-5 h-5 text-cyber-blue" />
            <div>
              <h2 className="text-sm font-semibold tracking-wider text-brand-text uppercase">Firewall Operating Profile</h2>
              <p className="text-[10px] text-brand-muted">Select standard zero-trust threshold rules</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Strict Profile */}
            <button
              onClick={() => setPolicyMode('strict')}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 ${
                policyMode === 'strict'
                  ? 'bg-danger/5 border-danger glow-danger'
                  : 'bg-brand-bg/40 border-brand-border hover:border-brand-border-glow'
              }`}
            >
              <div className={`p-2 rounded-lg ${policyMode === 'strict' ? 'bg-danger/10 text-danger' : 'bg-brand-bg text-brand-muted'}`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-text">Strict Protection Mode</span>
                  {policyMode === 'strict' && <span className="text-[9px] px-1.5 py-0.5 rounded bg-danger/15 text-danger border border-danger/25 font-bold uppercase">ACTIVE</span>}
                </div>
                <p className="text-[10px] text-brand-muted leading-relaxed mt-1">
                  Enforces zero-tolerance rules. Blocks prompts scoring <span className="text-danger font-bold">&gt;30%</span> and sanitizes <span className="text-warning font-bold">&gt;15%</span>. Recommended for primary clinical diagnosis and diagnostics ingestion.
                </p>
              </div>
            </button>

            {/* Balanced Profile */}
            <button
              onClick={() => setPolicyMode('balanced')}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 ${
                policyMode === 'balanced'
                  ? 'bg-cyber-blue/5 border-cyber-blue'
                  : 'bg-brand-bg/40 border-brand-border hover:border-brand-border-glow'
              }`}
            >
              <div className={`p-2 rounded-lg ${policyMode === 'balanced' ? 'bg-cyber-blue/10 text-cyber-blue' : 'bg-brand-bg text-brand-muted'}`}>
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-text">Balanced Defense Mode</span>
                  {policyMode === 'balanced' && <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyber-blue/15 text-cyber-blue border border-cyber-blue/25 font-bold uppercase">ACTIVE</span>}
                </div>
                <p className="text-[10px] text-brand-muted leading-relaxed mt-1">
                  Balanced defense. Blocks prompts scoring <span className="text-danger font-bold">&gt;60%</span> and sanitizes <span className="text-warning font-bold">&gt;30%</span>. Ideal for primary patient chatbots and prescription summary validations.
                </p>
              </div>
            </button>

            {/* Permissive Profile */}
            <button
              onClick={() => setPolicyMode('permissive')}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 ${
                policyMode === 'permissive'
                  ? 'bg-safe/5 border-safe glow-safe'
                  : 'bg-brand-bg/40 border-brand-border hover:border-brand-border-glow'
              }`}
            >
              <div className={`p-2 rounded-lg ${policyMode === 'permissive' ? 'bg-safe/10 text-safe' : 'bg-brand-bg text-brand-muted'}`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-text">Permissive Auditor Mode</span>
                  {policyMode === 'permissive' && <span className="text-[9px] px-1.5 py-0.5 rounded bg-safe/15 text-safe border border-safe/25 font-bold uppercase">ACTIVE</span>}
                </div>
                <p className="text-[10px] text-brand-muted leading-relaxed mt-1">
                  High model flexibility. Blocks scoring <span className="text-danger font-bold">&gt;85%</span> and sanitizes <span className="text-warning font-bold">&gt;60%</span>. Reserved for internal administrative support chats and back-office documentation assistance.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Rules Engine and Configuration */}
      <div className="lg:col-span-6 space-y-6">
        <div className="glass-panel rounded-2xl p-6 border border-brand-border bg-brand-card">
          <div className="flex items-center justify-between border-b border-brand-border pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyber-blue" />
              <div>
                <h2 className="text-sm font-semibold tracking-wider text-brand-text uppercase">Inspection Rule Categories</h2>
                <p className="text-[10px] text-brand-muted">Configure active analysis layers</p>
              </div>
            </div>
            <button 
              onClick={handleSave}
              className="px-3.5 py-1.5 rounded bg-cyber-blue text-brand-bg text-[10px] font-bold uppercase tracking-wider hover:bg-cyber-blue/80 transition duration-150 cursor-pointer flex items-center gap-1"
            >
              {saveSuccess ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : 'Apply Policy'}
            </button>
          </div>

          <div className="space-y-4">
            {/* System Override Defenses */}
            <div className="flex items-start justify-between gap-4 p-3 bg-brand-bg/30 border border-brand-border/60 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-text">System Override Protection</span>
                  <span title="Detects attempts to ignore developer or doctor prompts." className="cursor-help text-brand-muted/70 flex items-center">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="text-[9.5px] text-brand-muted leading-normal mt-0.5">
                  Blocks semantic prompts like "ignore previous safety guidelines", "override protocol", or huge white-space padding attempts.
                </p>
              </div>
              <button 
                onClick={() => handleToggleRule('systemOverride')}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  enabledRules.systemOverride ? 'bg-cyber-blue' : 'bg-brand-border'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-brand-bg shadow ring-0 transition duration-200 ease-in-out ${
                  enabledRules.systemOverride ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Jailbreak Defenses */}
            <div className="flex items-start justify-between gap-4 p-3 bg-brand-bg/30 border border-brand-border/60 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-text">Jailbreak & Persona Defense</span>
                  <span title="Stops roleplay simulations that bypass safety filters." className="cursor-help text-brand-muted/70 flex items-center">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="text-[9.5px] text-brand-muted leading-normal mt-0.5">
                  Neutralizes adversarial jailbreak phrases ("let's play a roleplay game", "hypothetically speaking you are Dr. Death").
                </p>
              </div>
              <button 
                onClick={() => handleToggleRule('jailbreak')}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  enabledRules.jailbreak ? 'bg-cyber-blue' : 'bg-brand-border'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-brand-bg shadow ring-0 transition duration-200 ease-in-out ${
                  enabledRules.jailbreak ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* PHI Leakage Prevention */}
            <div className="flex items-start justify-between gap-4 p-3 bg-brand-bg/30 border border-brand-border/60 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-text">HIPAA/GDPR PHI Leak Protection</span>
                  <span title="Prevents unauthorized extraction of Patient Health Information." className="cursor-help text-brand-muted/70 flex items-center">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="text-[9.5px] text-brand-muted leading-normal mt-0.5">
                  Scans and redacts Social Security Numbers (SSN), credit cards, medical record IDs, and limits patient history dump commands.
                </p>
              </div>
              <button 
                onClick={() => handleToggleRule('phiLeakage')}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  enabledRules.phiLeakage ? 'bg-cyber-blue' : 'bg-brand-border'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-brand-bg shadow ring-0 transition duration-200 ease-in-out ${
                  enabledRules.phiLeakage ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Clinical & Pharmacological Bias Controls */}
            <div className="flex items-start justify-between gap-4 p-3 bg-brand-bg/30 border border-brand-border/60 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-text">Treatment & Commercial Bias Controls</span>
                  <span title="Ensures decisions remain clinical rather than commercial." className="cursor-help text-brand-muted/70 flex items-center">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="text-[9.5px] text-brand-muted leading-normal mt-0.5">
                  Filters attempts to force AI into promoting expensive brand-name drugs, pharmaceutical commissions, or downplaying generic medications.
                </p>
              </div>
              <button 
                onClick={() => handleToggleRule('biasManipulation')}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  enabledRules.biasManipulation ? 'bg-cyber-blue' : 'bg-brand-border'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-brand-bg shadow ring-0 transition duration-200 ease-in-out ${
                  enabledRules.biasManipulation ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

          </div>
          
          {saveSuccess && (
            <div className="mt-4 p-2.5 rounded bg-safe/10 border border-safe/25 text-safe text-[10px] font-bold text-center flex items-center justify-center gap-1.5 animate-pulse">
              <Key className="w-3.5 h-3.5" /> Firewall policies successfully updated and synced across inference edge servers.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
