import { HttpError } from "wasp/server";
import type {
  ListAdminFiles,
  GetAdminFileDownloadUrl,
  CreateAdminFileUploadUrl,
  DeleteAdminFile,
  CreateAdminFolder,
} from "wasp/server/operations";
import {
  listFilesInS3,
  getDownloadFileSignedURLFromS3,
  getAdminUploadSignedURLFromS3,
  deleteFileFromS3,
  putEmptyObjectInS3,
  type S3FileEntry,
} from "../file-upload/s3Utils";

const ADMIN_UPLOAD_MAX_BYTES = 50 * 1024 * 1024; // 50 MB cap for admin uploads (PDFs, images)

function assertAdmin(user: any) {
  if (!user?.isAdmin) {
    throw new HttpError(401, "Unauthorized");
  }
}

function sanitizeKey(key: string) {
  // Block path traversal and leading slashes; keep folders as forward slashes.
  const trimmed = key.trim().replace(/^\/+/, "");
  if (!trimmed) throw new HttpError(400, "Empty key");
  if (trimmed.includes("..")) throw new HttpError(400, "Invalid key");
  return trimmed;
}

export const listAdminFiles: ListAdminFiles<
  { prefix?: string },
  { files: S3FileEntry[]; prefix: string }
> = async ({ prefix }, context) => {
  assertAdmin(context.user);
  const cleanPrefix = prefix ? prefix.replace(/^\/+/, "") : "";
  const files = await listFilesInS3({ prefix: cleanPrefix });
  return { files, prefix: cleanPrefix };
};

export const getAdminFileDownloadUrl: GetAdminFileDownloadUrl<
  { s3Key: string },
  { url: string }
> = async ({ s3Key }, context) => {
  assertAdmin(context.user);
  const key = sanitizeKey(s3Key);
  const url = await getDownloadFileSignedURLFromS3({ s3Key: key });
  return { url };
};

export const createAdminFileUploadUrl: CreateAdminFileUploadUrl<
  { s3Key: string; fileType: string },
  { uploadUrl: string; uploadFields: Record<string, string>; s3Key: string }
> = async ({ s3Key, fileType }, context) => {
  assertAdmin(context.user);
  const key = sanitizeKey(s3Key);
  if (!fileType || typeof fileType !== "string") {
    throw new HttpError(400, "Missing fileType");
  }
  const { uploadUrl, uploadFields } = await getAdminUploadSignedURLFromS3({
    s3Key: key,
    fileType,
    maxBytes: ADMIN_UPLOAD_MAX_BYTES,
  });
  return { uploadUrl, uploadFields, s3Key: key };
};

export const deleteAdminFile: DeleteAdminFile<
  { s3Key: string },
  { ok: true }
> = async ({ s3Key }, context) => {
  assertAdmin(context.user);
  const key = sanitizeKey(s3Key);
  await deleteFileFromS3({ s3Key: key });
  return { ok: true };
};

export const createAdminFolder: CreateAdminFolder<
  { prefix?: string; name: string },
  { ok: true; folderKey: string }
> = async ({ prefix, name }, context) => {
  assertAdmin(context.user);
  const cleanPrefix = prefix ? sanitizeKey(prefix.endsWith("/") ? prefix : prefix + "/") : "";
  const cleanName = name.trim().replace(/^\/+|\/+$/g, "");
  if (!cleanName) throw new HttpError(400, "Empty folder name");
  if (cleanName.includes("/")) throw new HttpError(400, "Folder name cannot contain '/'");
  if (cleanName.includes("..")) throw new HttpError(400, "Invalid folder name");
  const folderKey = `${cleanPrefix}${cleanName}/`;
  await putEmptyObjectInS3({ s3Key: folderKey });
  return { ok: true, folderKey };
};
