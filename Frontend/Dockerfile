# 1. Đổi sang Node 20
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 2. TẠM THỜI XÓA dòng này nếu bạn chỉ muốn chạy dev mode
RUN npm run build 

EXPOSE 5173

# Chạy lệnh dev
CMD ["npm", "run", "dev"]