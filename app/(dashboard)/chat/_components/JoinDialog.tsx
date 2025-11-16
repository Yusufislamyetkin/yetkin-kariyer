import { ReactNode } from "react";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { cn } from "@/lib/utils";

type JoinDialogProps = {
  open: boolean;
  title: string;
  description: string;
  icon?: ReactNode;
  loading?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  requiresInviteCode?: boolean;
  inviteCodeValue?: string;
  inviteCodeError?: string | null;
  onInviteCodeChange?: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export function JoinDialog({
  open,
  title,
  description,
  icon,
  loading,
  confirmLabel = "Onayla",
  cancelLabel = "Vazgeç",
  requiresInviteCode,
  inviteCodeValue,
  inviteCodeError,
  onInviteCodeChange,
  onConfirm,
  onCancel,
}: JoinDialogProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 transition-opacity duration-200",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-gray-950 border border-gray-200/70 dark:border-gray-800/60 shadow-2xl p-6 space-y-4">
        {icon ? <div className="flex items-center gap-3 text-blue-500">{icon}</div> : null}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        {requiresInviteCode ? (
          <div className="space-y-2">
            <Input
              label="Davet Kodu"
              placeholder="Örn. AB12CD34"
              value={inviteCodeValue ?? ""}
              onChange={(event) => onInviteCodeChange?.(event.target.value.toUpperCase())}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Grup yöneticinizden aldığınız davet kodunu girerek katılabilirsiniz.
            </p>
            {inviteCodeError ? (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs text-red-600 dark:text-red-300">
                {inviteCodeError}
              </div>
            ) : null}
          </div>
        ) : null}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant="gradient"
            size="sm"
            onClick={onConfirm}
            isLoading={loading}
            disabled={loading || (requiresInviteCode ? !(inviteCodeValue && inviteCodeValue.length > 0) : false)}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

