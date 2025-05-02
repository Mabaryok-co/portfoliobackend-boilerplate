# Gunakan Node.js versi terbaru sebagai base image
FROM node:22-slim

# Set direktori kerja di dalam container
WORKDIR /app

# Copy file package.json dan package-lock.json ke dalam container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh kode aplikasi ke dalam container
COPY . .

# Set variabel environment
ENV NODE_ENV=development

# Expose port sesuai ENV
EXPOSE ${APP_PORT}

# Jalankan aplikasi
CMD ["node", "main.js"]