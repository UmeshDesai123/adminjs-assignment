import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import express from 'express';
import Whether from './whether.js';
import mongoose from 'mongoose';
import { Database, Resource } from '@adminjs/mongoose';
import { buildRouter } from '@adminjs/express';
import * as AdminJSMongoose from '@adminjs/mongoose';
import dotenv from 'dotenv';
dotenv.config();

const PORT = 3000

const start = async () => {
  const app = express();

  //Connect DB
  mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

  // Register Mongoose Adapter for AdminJS
  AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
  });

  const admin = new AdminJS({
    resources: [
      {
        resource: Whether,
        options: {
          // You can customize the AdminJS interface here
          listProperties: ['name', 'description', 'requestCount', 'temperature'],
          editProperties: ['name', 'description', 'requestCount'],
          showProperties: ['name', 'description', 'requestCount', 'temperature'],
        },
      },
    ],
    rootPath: '/admin',
  });

// Fetch weather data from API
const fetchWeatherData = async (cityName) => {
  try {
    const response = await axios.get('http://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: cityName,
        appid: '',
        units: 'metric', // 'imperial' for Fahrenheit
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};


  const adminRouter = AdminJSExpress.buildRouter(admin)
  app.use(admin.options.rootPath, adminRouter)

  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
  })
}

start()