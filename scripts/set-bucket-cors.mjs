#!/usr/bin/env node
/**
 * Configura CORS en el bucket de recuerdos (el panel de Railway no lo ofrece).
 * Uso: railway run -s XV-Tammy node scripts/set-bucket-cors.mjs
 * Lee S3_* y NEXT_PUBLIC_APP_URL del entorno del servicio.
 */
import { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } from "@aws-sdk/client-s3";

const origins = ["http://localhost:3050"];
if (process.env.NEXT_PUBLIC_APP_URL) origins.push(process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, ""));

const client = new S3Client({
  region: process.env.S3_REGION || "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY },
});

await client.send(
  new PutBucketCorsCommand({
    Bucket: process.env.S3_BUCKET,
    CORSConfiguration: {
      CORSRules: [{ AllowedOrigins: origins, AllowedMethods: ["PUT", "GET", "HEAD"], AllowedHeaders: ["*"], ExposeHeaders: ["ETag"], MaxAgeSeconds: 3600 }],
    },
  })
);
console.log("✓ CORS aplicado para:", origins.join(", "));
console.log(JSON.stringify((await client.send(new GetBucketCorsCommand({ Bucket: process.env.S3_BUCKET }))).CORSRules));
