#/bin/bash
docker stop 镜像名称
docker rm 镜像名称
docker rmi ccr.ccs.tencentyun.com/命名空间/镜像名称
docker pull ccr.ccs.tencentyun.com/命名空间/镜像名称
docker run -d --name 镜像名称 -p 7001:7001 ccr.ccs.tencentyun.com/命名空间/镜像名称
