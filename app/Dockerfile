# Use official Python image as base
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy the requirements file
COPY app/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire app folder
COPY app/ .

# Set environment variable for Django to run in production mode
ENV PYTHONUNBUFFERED 1

# Expose port for Django (usually 8000)
EXPOSE 8000

# Command to run Django app (make sure to have gunicorn or similar)
CMD ["gunicorn", "app.wsgi:application", "--bind", "0.0.0.0:8000"]
