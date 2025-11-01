// AWS Configuration for Frontend
// This file will be used to configure API endpoints for different environments

const config = {
  development: {
    API_BASE_URL: 'http://localhost:8000',
    ENVIRONMENT: 'development'
  },
  production: {
    // This will be updated after backend deployment
    API_BASE_URL: 'https://your-eb-app.us-east-1.elasticbeanstalk.com',
    ENVIRONMENT: 'production'
  }
};

// Detect environment
const environment = process.env.NODE_ENV || 'development';

export default config[environment];