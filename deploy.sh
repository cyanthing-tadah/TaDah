#/bin/bash
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker rmi jpccr.ccs.tencentyun.com/ta_dah/ta_dah
docker pull jpccr.ccs.tencentyun.com/ta_dah/ta_dah
docker run -d --name 镜像名称 -p 80:3000 jpccr.ccs.tencentyun.com/ta_dah/ta_dah
