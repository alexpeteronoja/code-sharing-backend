# 🖥️ NoteCode Backend – Code Sharing API

This is the backend API service for **NoteCode**, a web-based code sharing platform that allows users to write, save, and share code snippets using a unique link. Built with **Node.js**, **Express.js**, and **MongoDB**, this server handles snippet storage, retrieval, and basic API security.

---

## Features

- Save and retrieve code snippets using unique IDs
- Auto-generate UUIDs for each snippet
- Secure API access using API key authentication
- CORS protection to allow requests only from approved domains
- Request rate limiting to prevent abuse
- MongoDB integration for cloud-based data storage

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Backend    | Node.js, Express                  |
| Database   | MongoDB Atlas                     |
| Security   | API Key, CORS, express-rate-limit |
| Deployment | Render.com                        |
