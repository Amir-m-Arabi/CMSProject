import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes';
import path from 'path';
// import swaggerOutput from './swagger-output.json';


const app = express();
dotenv.config();


app.use(bodyParser.json());
app.use(cors({
    credentials : true,
}))
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/CMS', routes());
app.use('/uploads' , express.static(path.join(__dirname, '../uploads')))
app.use("/api-docs" , swaggerUi.serve , swaggerUi.setup())

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
    if (err) return console.log(err);
    console.log(`Server is running on port ${process.env.PORT}`);
});
