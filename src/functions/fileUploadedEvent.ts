import { S3Event } from 'aws-lambda';

export async function handler(event: S3Event) {
  await Promise.all(
    event.Records.map((record) => {
      const key = record.s3.object.key;

      return key;
    }),
  );
}
