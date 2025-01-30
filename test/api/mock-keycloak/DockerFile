# Use a lightweight base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy mock Keycloak files (update this path as needed)
COPY test/api/mock-keycloak /app

# Expose port 8080
EXPOSE 8080

# Run the mock Keycloak server
CMD ["python3", "-m", "http.server", "8080", "--bind", "0.0.0.0"]
