import { useRef, useState } from "react";
import { Download, Upload, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { exportBackup, importBackup, validateBackup } from "@/repository";
import { useAthleteStore } from "@/store/athleteStore";

type Status = { tone: "success" | "danger"; message: string } | null;

export function DataBackupCard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  async function handleExport() {
    setBusy(true);
    setStatus(null);
    try {
      const backup = await exportBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `training-engine-backup-${format(new Date(), "yyyy-MM-dd")}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus({ tone: "success", message: "Backup downloaded." });
    } catch (e) {
      setStatus({ tone: "danger", message: "Export failed — try again." });
    } finally {
      setBusy(false);
    }
  }

  async function handleImportFile(file: File) {
    setBusy(true);
    setStatus(null);
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!validateBackup(parsed)) {
        setStatus({ tone: "danger", message: "That file isn't a valid Training Engine backup." });
        return;
      }
      const confirmed = window.confirm(
        "Restoring replaces ALL current data (profile, benchmarks, workouts, logs, plans) with the backup's contents. Continue?"
      );
      if (!confirmed) return;
      await importBackup(parsed);
      // Refresh in-memory state from the restored database.
      await useAthleteStore.getState().init();
      await useAthleteStore.getState().refreshOneRepMaxes();
      setStatus({ tone: "success", message: "Backup restored." });
    } catch {
      setStatus({ tone: "danger", message: "Restore failed — the file couldn't be read." });
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data backup</CardTitle>
        <CardDescription>
          All data lives only in this browser. Download a backup regularly — restoring replaces
          everything with the file's contents.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={handleExport} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download backup
          </Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={busy}>
            <Upload className="h-4 w-4" /> Restore from file
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            aria-label="Choose a backup file to restore"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImportFile(file);
            }}
          />
        </div>
        {status && (
          <p role="status" className={`text-sm ${status.tone === "success" ? "text-success" : "text-danger"}`}>
            {status.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
