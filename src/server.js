import express from 'express';
import cors from 'cors';
// const apiRoute = require('./routes/api')
const app = express();
const { log, error } = console;
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

const router = express.Router();

//import routes
import movieRoutes from './routes/movie.route';


app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

//middleware to utilize routes
router.use('/movie', movieRoutes);

app.use('/api', router)


app.listen(port, () => log('server is running'));
export default app;