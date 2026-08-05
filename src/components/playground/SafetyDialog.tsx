"use client";

import React from "react";
import { AlertTriangle, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type SafetyAction = "manual" | "suggested" | "force";

interface SafetyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingMessage: string | null;
  pendingEdit: string;
  onPendingEditChange: (value: string) => void;
  suggestion: string | null;
  isLoading: boolean;
  onConfirm: (action: SafetyAction) => void;
}

export function SafetyDialog({
  open,
  onOpenChange,
  pendingMessage,
  pendingEdit,
  onPendingEditChange,
  suggestion,
  isLoading,
  onConfirm,
}: SafetyDialogProps) {
  // Keep the edit field in sync when the dialog opens with a new message.
  React.useEffect(() => {
    if (open && pendingMessage) {
      onPendingEditChange(pendingMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pendingMessage]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[oklch(0.06_0.01_260)] border-white/10 text-foreground max-w-md rounded-3xl">
        <DialogHeader>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-4 border border-amber-500/30">
            <AlertTriangle className="text-amber-500" size={24} />
          </div>
          <DialogTitle className="text-xl font-black uppercase tracking-tighter">
            Potentially Harmful Content
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
            Our AI detected that your message may violate community guidelines.
            Consider editing it before sending.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Edit yourself */}
          <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl">
            <p className="text-[10px] font-black uppercase text-muted-foreground mb-2 tracking-widest">
              Edit your message
            </p>
            <Input
              value={pendingEdit}
              onChange={(e) => onPendingEditChange(e.target.value)}
              className="bg-black/40 border-white/10 text-white"
            />
          </div>

          {/* LLM suggestion */}
          <div className="p-4 bg-primary/[0.07] border border-primary/20 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-black uppercase text-primary tracking-widest">
                <Sparkles size={10} className="inline mr-1 -mt-0.5" />
                Suggested Safe Alternative
              </p>
              <span className="text-[8px] font-black bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                AI OPTIMIZED
              </span>
            </div>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-3 w-full bg-white/10" />
                <Skeleton className="h-3 w-3/4 bg-white/10" />
              </div>
            ) : (
              <p className="text-sm font-medium text-foreground/90">
                &quot;{suggestion ?? pendingMessage}&quot;
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="grid grid-cols-1 gap-2">
          <Button
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 text-xs font-bold uppercase tracking-widest h-11 rounded-xl"
            onClick={() => onConfirm("force")}
          >
            Send Anyway
          </Button>
          <Button
            variant="outline"
            className="border-white/10 text-foreground hover:bg-white/[0.04] text-xs font-bold uppercase tracking-widest h-11 rounded-xl"
            onClick={() => onConfirm("manual")}
            disabled={!pendingEdit.trim()}
          >
            Send Edited
          </Button>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold uppercase tracking-widest h-11 rounded-xl shadow-lg shadow-primary/20"
            onClick={() => onConfirm("suggested")}
            disabled={isLoading || !suggestion}
          >
            Apply Suggestion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
