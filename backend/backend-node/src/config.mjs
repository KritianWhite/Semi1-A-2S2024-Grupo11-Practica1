import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });


export default {
    host: process.env.HOST || "",
    port: process.env.PORT || 0,
    database: process.env.DATABASE || "",
    userdatab: process.env.USERDATAB || "",
    password: process.env.PASSWORD || "",
    // credenciales S3
    accessKeyId: process.env.ACCESS_KEY_ID || "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
    region: process.env.REGION || "",
    bucket: process.env.BUCKET || ""
};


