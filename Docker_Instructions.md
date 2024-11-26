# Kiruna Explorer Website - Docker Deployment Guide

This guide will walk you through the steps to run the **Kiruna Explorer** website using Docker. Ensure that the ports `3000` and `3001` are free on your device before proceeding.

---

## Prerequisites

Before starting, make sure you have the following installed on your system:
- [Docker](https://www.docker.com/get-started)

---

## Steps to Deploy

Follow the steps below to pull and run the required Docker images for the frontend and backend:

### 1. Pull the Docker Images

Use the commands below to pull the frontend and backend images from Docker Hub:

```bash
docker pull lcpes/se2-kiruna_explorer:frontend
docker pull lcpes/se2-kiruna_explorer:backend
```
### 2. Run frontend and backend with the two following commands
```bash
docker run -d -p 3000:3000 lcpes/se2-kiruna_explorer:frontend

docker run -d -p 3001:3001 lcpes/se2-kiruna_explorer:backend
```
### 3. Access the frontend
In order to access the frontend in the browser, type and search the following url:
```
http://localhost:3000
```