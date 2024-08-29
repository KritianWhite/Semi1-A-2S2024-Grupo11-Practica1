
import config from "./config.mjs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

//recibe un buffer y lo sube a S3
const uploadImageS3 = async (buff, path) => {
    const client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  
    const command = new PutObjectCommand({
      Bucket: config.bucket,
      Key: path,
      Body: buff,
      ContentType: "image/jpeg",
    });
  
    try {
      const response = await client.send(command);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

const uploadMP3S3 = async (buff, path) => {
    const client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  
    const command = new PutObjectCommand({
      Bucket: config.bucket,
      Key: path,
      Body: buff,
      ContentType: "audio/mpeg",
    });
  
    try {
      const response = await client.send(command);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

export { uploadImageS3, uploadMP3S3 };