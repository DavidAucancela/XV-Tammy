import { S3Client, GetObjectCommand, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const MAX_BYTES = 50 * 1024 * 1024;

let _client: S3Client | null = null;

function client() {
  if (!_client) {
    _client = new S3Client({
      region: process.env.S3_REGION || "auto",
      endpoint: process.env.S3_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    });
  }
  return _client;
}

const bucket = () => process.env.S3_BUCKET!;

export function signUpload(key: string, contentType: string) {
  return getSignedUrl(client(), new PutObjectCommand({ Bucket: bucket(), Key: key, ContentType: contentType }), { expiresIn: 600 });
}

export function signDownload(key: string) {
  return getSignedUrl(client(), new GetObjectCommand({ Bucket: bucket(), Key: key }), { expiresIn: 3600 });
}

export async function headObject(key: string): Promise<{ size: number } | null> {
  try {
    const r = await client().send(new HeadObjectCommand({ Bucket: bucket(), Key: key }));
    return { size: r.ContentLength ?? 0 };
  } catch {
    return null;
  }
}

export async function deleteObject(key: string) {
  await client().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));
}
