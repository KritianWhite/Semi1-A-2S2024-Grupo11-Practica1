import cors from "cors"
import router from "./Routes/api.mjs";
import express from 'express';
import path from 'path';
const app = express();

/*app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));*/

app.use(cors());
app.use(express.json());
//app.use('/api', router);
app.use(router);

//app.use('/uploads', express.static(new URL('./uploads', import.meta.url).pathname));
app.set("port", 4000);


export default app;