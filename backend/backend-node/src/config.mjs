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
    myToken: process.env.TOKEN_SECRET || "",
	refreshToken: process.env.REFRESH_TOKEN || "",
    //key_password: process.env.kEY_PASSWORD  || ""
};
