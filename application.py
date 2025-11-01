# AWS Elastic Beanstalk Application Entry Point

from api_server import app

# AWS Elastic Beanstalk looks for 'application' variable
application = app

if __name__ == "__main__":
    # For local testing
    import uvicorn
    uvicorn.run(application, host="0.0.0.0", port=8000)