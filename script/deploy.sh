#!/bin/bash


SERVER_USER="ftpuser"
SERVER_IP="140.99.171.87"
SERVER_PORT="5829"  
SERVER_DEST_DIR="/var/www/zolablog"
ARCHIVE_NAME="build.tar.gz"

# 构建项目
echo "Building project..."
zola build

# 压缩构建目录
echo "Compressing build directory..."
tar -czf $ARCHIVE_NAME -C ./public .

# 清理服务器上的部署目录
echo "Cleaning up previous build on server..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "rm -rf $SERVER_DEST_DIR/*"

# 传输压缩文件到服务器
echo "Transferring compressed build files to server..."
scp -P $SERVER_PORT $ARCHIVE_NAME $SERVER_USER@$SERVER_IP:$SERVER_DEST_DIR

# 在服务器上解压缩文件
echo "Extracting build files on server..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "tar -xzf $SERVER_DEST_DIR/$ARCHIVE_NAME -C $SERVER_DEST_DIR && rm $SERVER_DEST_DIR/$ARCHIVE_NAME"

# # 设置服务器上部署目录的权限
# echo "Setting permissions on server..."
# ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "chmod -R 775 $SERVER_DEST_DIR"

# 删除本地压缩文件
echo "Cleaning up local compressed file..."
rm $ARCHIVE_NAME

echo "Deployment complete!"