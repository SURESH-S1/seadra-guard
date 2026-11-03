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
  GitCompare,
  Lock,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { PremiumText } from '@/components/ui/PremiumEmoji';

const fireConfetti = async (opts: Record<string, unknown>) => {
  try {
    const confetti = (await import('canvas-confetti')).default;
    confetti(opts);
  } catch {
    // fallback if canvas is not available
  }
};

interface ReviewWorkflowFooterProps {
  role: UserRole;
  status: DocumentWorkflowStatus;
  setStatus: (status: DocumentWorkflowStatus) => void;
  comments: AuditComment[];
  onAddComment: (text: string) => void;
  complianceScore: number;
  onOpenDiff?: () => void;
}

export const ReviewWorkflowFooter: React.FC<ReviewWorkflowFooterProps> = ({
  role,
  status,
  setStatus,
  comments,
  onAddComment,
  complianceScore,
  onOpenDiff,
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
    onAddComment(':check: Approved for Publication: All brand guidelines and facts verified.');
    fireConfetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.85 },
      colors: ['#6366f1', '#10b981', '#38bdf8', '#f8fafc'],
    });
  };

  const handleRequestChanges = () => {
    setStatus('Changes Requested');
    onAddComment(':return: Changes Requested: Please remediate high-priority governance flags.');
  };

  const handleSubmitForReview = () => {
    setStatus('In Review');
    onAddComment(':clipboard: Submitted for Review: Creator completed initial revisions.');
  };

  const isReviewer = role === 'reviewer';

  return (
    <>
      {/* 1. AUDIT TRAIL & COLLABORATIVE COMMENT CARD */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mt-6 mb-20 space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-4 h-4 text-indigo-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Governance Trail & Activity
            </h3>
          </div>

          <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
            <span>Status:</span>
            <span
              className={`font-semibold px-2.5 py-0.5 rounded-full border ${
                status === 'Approved for Publication'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                  : status === 'In Review'
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                  : status === 'Changes Requested'
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        {/* Activity Thread */}
        <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/60 text-sm flex items-start gap-3"
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold text-white shadow-xs ${
                  comment.role === 'reviewer'
                    ? 'bg-emerald-600'
                    : 'bg-indigo-600'
                }`}
              >
                {comment.role === 'reviewer' ? 'R' : 'C'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    {comment.author}
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {comment.timestamp}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-sans">
                  <PremiumText text={comment.text} />
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Comment Input Strip */}
        <form onSubmit={handleSubmitComment} className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder={`Add a remark as ${role === 'reviewer' ? 'Reviewer' : 'Creator'}...`}
            className="flex-1 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-medium text-sm transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Post</span>
          </button>
        </form>
      </div>

      {/* 2. DOCKED BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800/90 py-3.5 px-4 lg:px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left info pill */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
                Workflow:
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {isReviewer ? '🛡️ Reviewer Sign-off Mode' : '✍️ Creator Authoring Mode'}
              </span>
            </div>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
            <div className="text-xs text-slate-500 hidden sm:flex items-center gap-1.5 font-mono">
              <span>Score:</span>
              <span className={`font-bold ${complianceScore >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {complianceScore}/100
              </span>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 flex-wrap justify-end">
            {!isReviewer ? (
              /* Creator Action */
              <button
                onClick={handleSubmitForReview}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-indigo-600/20 active:scale-95"
              >
                <span>Submit to Reviewer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              /* Reviewer Mode: Anchored drawer with [ ⇄ View Visual Diff ] and [ ✅ Approve for Publication ] */
              <div className="flex items-center gap-3 flex-wrap">
                {onOpenDiff && (
                  <button
                    type="button"
                    onClick={onOpenDiff}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <GitCompare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>View Visual Diff</span>
                  </button>
                )}

                <button
                  onClick={handleRequestChanges}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-300 dark:border-rose-800/60 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Request Changes</span>
                </button>

                <button
                  onClick={handleApprove}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 transition-all shadow-md shadow-emerald-600/25 cursor-pointer active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve for Publication</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
