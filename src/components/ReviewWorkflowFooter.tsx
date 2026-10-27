'use client';

import React, { useState } from 'react';
import {
  UserRole,
  DocumentWorkflowStatus,
  AuditComment,
} from '@/types/brandVault';
import {
  Send,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Clock,
  ArrowRight,
  ShieldCheck,
  User,
  PartyPopper,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReviewWorkflowFooterProps {
  role: UserRole;
  status: DocumentWorkflowStatus;
  setStatus: (status: DocumentWorkflowStatus) => void;
  comments: AuditComment[];
  onAddComment: (text: string) => void;
  complianceScore: number;
}

export const ReviewWorkflowFooter: React.FC<ReviewWorkflowFooterProps> = ({
  role,
  status,
  setStatus,
  comments,
  onAddComment,
  complianceScore,
}) => {
  const [commentInput, setCommentInput] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(commentInput.trim());
    setCommentInput('');
  };

  const handleApprove = () => {
    setStatus('Approved for Publication');
    onAddComment('✅ Approved for Publication: All brand guidelines and facts verified.');
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.8 },
        colors: ['#00A896', '#0F4C81', '#10B981', '#38BDF8'],
      });
    } catch (e) {
      // safe fallback if canvas is unavailable
    }
  };

  const handleRequestChanges = () => {
    setStatus('Changes Requested');
    onAddComment('↩️ Changes Requested: Please remediate high-priority governance flags.');
  };

  const handleSubmitForReview = () => {
    setStatus('In Review');
    onAddComment('📋 Submitted for Review: Creator completed initial revisions.');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 mt-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-teal-400" />
          <h3 className="text-sm font-semibold text-white">
            Governance Audit Trail & Multi-Role Review Thread
          </h3>
        </div>

        {/* Current Role Context Notice */}
        <div className="text-xs text-slate-400 font-mono">
          Current Persona:{' '}
          <span
            className={`font-semibold px-2 py-0.5 rounded ${
              role === 'reviewer'
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-teal-500/20 text-teal-300'
            }`}
          >
            {role === 'reviewer' ? 'Authorised Brand Reviewer' : 'Content Creator'}
          </span>
        </div>
      </div>

      {/* Comment & Revision History */}
      <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs flex items-start gap-3"
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold ${
                comment.role === 'reviewer'
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                  : 'bg-teal-600/30 text-teal-300 border border-teal-500/40'
              }`}
            >
              {comment.role === 'reviewer' ? 'R' : 'C'}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="font-semibold text-slate-200">{comment.author}</span>
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {comment.timestamp}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Bar (Role Dependent) */}
      <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Comment input form */}
        <form onSubmit={handleSubmitComment} className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder={`Add a governance remark as ${role === 'reviewer' ? 'Reviewer' : 'Creator'}...`}
            className="flex-1 bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
            title="Post comment"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Workflow Transition Buttons */}
        <div className="flex items-center gap-2">
          {role === 'creator' ? (
            <button
              onClick={handleSubmitForReview}
              className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Submit Draft to Reviewer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleRequestChanges}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-semibold bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>↩️ Request Changes</span>
              </button>

              <button
                onClick={handleApprove}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>✅ Approve for Publication</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

