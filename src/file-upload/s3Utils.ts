import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import * as path from "path";
import { MAX_FILE_SIZE_BYTES } from "./validation";

const endpoint = process.env.AWS_ENDPOINT_URL?.trim() || undefined;

export const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  ...(endpoint ? { endpoint, forcePathStyle: true } : {}),
});

const BUCKET = process.env.AWS_S3_BUCKET_NAME;

type S3Upload = {
  fileType: string;
  fileName: string;
  userId: string;
};

export const getUploadFileSignedURLFromS3 = async ({
  fileName,
  fileType,
  userId,
}: S3Upload) => {
  const s3Key = getS3Key(fileName, userId);

  const { url: s3UploadUrl, fields: s3UploadFields } =
    await createPresignedPost(s3Client, {
      Bucket: BUCKET!,
      Key: s3Key,
      Conditions: [["content-length-range", 0, MAX_FILE_SIZE_BYTES]],
      Fields: {
        "Content-Type": fileType,
      },
      Expires: 3600,
    });

  return { s3UploadUrl, s3Key, s3UploadFields };
};

export const getAdminUploadSignedURLFromS3 = async ({
  s3Key,
  fileType,
  maxBytes = MAX_FILE_SIZE_BYTES,
}: {
  s3Key: string;
  fileType: string;
  maxBytes?: number;
}) => {
  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: BUCKET!,
    Key: s3Key,
    Conditions: [["content-length-range", 0, maxBytes]],
    Fields: { "Content-Type": fileType },
    Expires: 3600,
  });
  return { uploadUrl: url, uploadFields: fields };
};

export const getDownloadFileSignedURLFromS3 = async ({
  s3Key,
}: {
  s3Key: string;
}) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: s3Key,
  });
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

export const deleteFileFromS3 = async ({ s3Key }: { s3Key: string }) => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: s3Key,
  });
  await s3Client.send(command);
};

export const checkFileExistsInS3 = async ({ s3Key }: { s3Key: string }) => {
  const command = new HeadObjectCommand({
    Bucket: BUCKET,
    Key: s3Key,
  });
  try {
    await s3Client.send(command);
    return true;
  } catch (error) {
    if (error instanceof S3ServiceException && error.name === "NotFound") {
      return false;
    }
    throw error;
  }
};

export type S3FileEntry = {
  key: string;
  size: number;
  lastModified: string | null;
};

export const listFilesInS3 = async ({
  prefix,
  maxKeys = 1000,
}: { prefix?: string; maxKeys?: number } = {}): Promise<S3FileEntry[]> => {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: prefix || undefined,
    MaxKeys: maxKeys,
  });
  const response = await s3Client.send(command);
  return (response.Contents || [])
    .filter((o) => !!o.Key)
    .map((o) => ({
      key: o.Key!,
      size: o.Size || 0,
      lastModified: o.LastModified ? o.LastModified.toISOString() : null,
    }));
};

export const putEmptyObjectInS3 = async ({ s3Key }: { s3Key: string }) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: s3Key,
    Body: "",
    ContentLength: 0,
  });
  await s3Client.send(command);
};

function getS3Key(fileName: string, userId: string) {
  const ext = path.extname(fileName).slice(1);
  return `${userId}/${randomUUID()}.${ext}`;
}
