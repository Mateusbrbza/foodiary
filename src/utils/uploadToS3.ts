import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { s3Client } from '~/clients/s3Client';

interface UploadParams {
  fileType: 'audio/m4a' | 'image/jpeg';
  expiresIn?: number;
}

export const uploadToS3 = async ({ fileType, expiresIn = 300 }: UploadParams): Promise<{ uploadUrl: string; fileKey: string }> => {
  const fileId = randomUUID();
  const ext = fileType === 'audio/m4a' ? '.m4a' : '.jpg';
  const fileKey = `${fileId}${ext}`;

  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: fileKey,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });
  return { uploadUrl, fileKey };
};

