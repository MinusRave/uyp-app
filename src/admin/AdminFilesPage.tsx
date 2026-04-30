import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { type AuthUser } from "wasp/auth";
import {
  useQuery,
  useAction,
  listAdminFiles,
  getAdminFileDownloadUrl,
  createAdminFileUploadUrl,
  deleteAdminFile,
  createAdminFolder,
} from "wasp/client/operations";
import {
  Loader2,
  FolderOpen,
  FolderPlus,
  Folder,
  FileText,
  Upload,
  Download,
  Trash2,
  ChevronRight,
  Home,
  RefreshCw,
} from "lucide-react";
import DefaultLayout from "./layout/DefaultLayout";

type Row =
  | { kind: "folder"; name: string; fullPrefix: string }
  | { kind: "file"; name: string; key: string; size: number; lastModified: string | null };

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function AdminFilesPage({ user }: { user: AuthUser }) {
  const [prefix, setPrefix] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data, isLoading, error, refetch } = useQuery(listAdminFiles, { prefix });

  const createUploadUrl = useAction(createAdminFileUploadUrl);
  const deleteFileAction = useAction(deleteAdminFile);
  const createFolderAction = useAction(createAdminFolder);

  // Group files by current "folder" level: derive folders from keys that have a deeper /.
  const rows: Row[] = useMemo(() => {
    if (!data?.files) return [];
    const folderSet = new Set<string>();
    const fileRows: Row[] = [];
    const base = prefix; // already normalized server-side

    for (const f of data.files) {
      const rest = base ? f.key.slice(base.length) : f.key;
      if (!rest) continue;
      const slashIdx = rest.indexOf("/");
      if (slashIdx >= 0) {
        const folderName = rest.slice(0, slashIdx);
        folderSet.add(folderName);
      } else {
        fileRows.push({
          kind: "file",
          name: rest,
          key: f.key,
          size: f.size,
          lastModified: f.lastModified,
        });
      }
    }
    const folderRows: Row[] = Array.from(folderSet)
      .sort()
      .map((name) => ({
        kind: "folder",
        name,
        fullPrefix: (base ? base : "") + name + "/",
      }));
    fileRows.sort((a, b) => (a.kind === "file" && b.kind === "file" ? a.name.localeCompare(b.name) : 0));
    return [...folderRows, ...fileRows];
  }, [data, prefix]);

  const breadcrumbs = useMemo(() => {
    if (!prefix) return [] as { label: string; goto: string }[];
    const parts = prefix.split("/").filter(Boolean);
    const list: { label: string; goto: string }[] = [];
    let acc = "";
    for (const p of parts) {
      acc += p + "/";
      list.push({ label: p, goto: acc });
    }
    return list;
  }, [prefix]);

  async function handleDownload(key: string) {
    try {
      const res = await getAdminFileDownloadUrl({ s3Key: key });
      window.open(res.url, "_blank", "noopener,noreferrer");
    } catch (e) {
      console.error(e);
      alert("Could not get download link.");
    }
  }

  async function handleDelete(key: string) {
    if (!confirm(`Delete this file?\n\n${key}\n\nThis can't be undone.`)) return;
    try {
      await deleteFileAction({ s3Key: key });
      await refetch();
    } catch (e) {
      console.error(e);
      alert("Could not delete the file.");
    }
  }

  async function handleCreateFolder() {
    const name = window.prompt("New folder name:");
    if (!name) return;
    try {
      await createFolderAction({ prefix, name });
      await refetch();
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "Could not create folder.");
    }
  }

  async function handleUpload(file: File) {
    setUploadError(null);
    setIsUploading(true);
    try {
      const safeName = file.name.replace(/\s+/g, "-");
      const s3Key = (prefix || "") + safeName;
      const { uploadUrl, uploadFields } = await createUploadUrl({
        s3Key,
        fileType: file.type || "application/octet-stream",
      });
      const form = new FormData();
      Object.entries(uploadFields).forEach(([k, v]) => form.append(k, v));
      form.append("file", file);
      const res = await fetch(uploadUrl, { method: "POST", body: form });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Upload failed (${res.status}). ${text.slice(0, 200)}`);
      }
      await refetch();
    } catch (e: any) {
      console.error(e);
      setUploadError(e?.message || "Upload failed.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <DefaultLayout user={user}>
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FolderOpen className="text-primary" />
            Files
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload, browse and manage files in the S3 bucket.
          </p>
        </div>
        <Link
          to="/admin"
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center flex-wrap gap-1 text-sm mb-4 bg-muted/30 border border-border/50 rounded-lg px-3 py-2">
        <button
          onClick={() => setPrefix("")}
          className="inline-flex items-center gap-1 hover:text-primary"
        >
          <Home size={14} />
          <span>root</span>
        </button>
        {breadcrumbs.map((b) => (
          <React.Fragment key={b.goto}>
            <ChevronRight size={14} className="text-muted-foreground" />
            <button onClick={() => setPrefix(b.goto)} className="hover:text-primary">
              {b.label}
            </button>
          </React.Fragment>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
            title="Refresh"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* Upload + new folder */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm mb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-semibold">Add to this folder</p>
            <p className="text-xs text-muted-foreground">
              Current folder: <code className="text-foreground">{prefix || "/"}</code>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCreateFolder}
              className="inline-flex items-center gap-2 border border-border bg-background hover:bg-muted/50 text-foreground font-medium text-sm px-4 py-2 rounded-md"
            >
              <FolderPlus size={16} />
              New folder
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm px-4 py-2 rounded-md disabled:opacity-60"
            >
              {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {isUploading ? "Uploading..." : "Upload file"}
            </button>
          </div>
        </div>
        {uploadError && (
          <p className="mt-2 text-sm text-red-600">{uploadError}</p>
        )}
      </div>

      {/* Files table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-red-600">
            Could not load files. Check S3 settings and try again.
          </div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No files in <code>{prefix || "/"}</code>. Upload one above.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr className="text-left">
                <th className="py-2 px-4 font-medium">Name</th>
                <th className="py-2 px-4 font-medium w-28">Size</th>
                <th className="py-2 px-4 font-medium w-48">Modified</th>
                <th className="py-2 px-4 font-medium w-32 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={(row.kind === "folder" ? "f-" : "k-") + (row.kind === "folder" ? row.fullPrefix : row.key) + idx}
                  className="border-t border-border/50 hover:bg-muted/20"
                >
                  <td className="py-2 px-4">
                    {row.kind === "folder" ? (
                      <button
                        onClick={() => setPrefix(row.fullPrefix)}
                        className="inline-flex items-center gap-2 hover:text-primary"
                      >
                        <Folder size={16} className="text-yellow-600" />
                        <span className="font-medium">{row.name}/</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <FileText size={16} className="text-muted-foreground" />
                        <span>{row.name}</span>
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4 text-muted-foreground">
                    {row.kind === "file" ? humanSize(row.size) : "—"}
                  </td>
                  <td className="py-2 px-4 text-muted-foreground">
                    {row.kind === "file" ? formatDate(row.lastModified) : "—"}
                  </td>
                  <td className="py-2 px-4 text-right">
                    {row.kind === "file" ? (
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleDownload(row.key)}
                          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-primary"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(row.key)}
                          className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Tip: to put a file inside a folder, open that folder first, then upload.
      </p>
    </div>
    </DefaultLayout>
  );
}
