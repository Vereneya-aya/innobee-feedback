# Backend Dockerfile
FROM python:3.11-slim

# Set workdir
WORKDIR /app

# Install deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

# Expose Flask port
EXPOSE 5050

# Run app
CMD ["python", "app.py"]