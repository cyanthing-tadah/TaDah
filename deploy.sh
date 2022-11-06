#/bin/bash
docker stop ta_dah
docker rm ta_dah
docker rmi ccr.ccs.tencentyun.com/ta_dah/ta_dah
docker pull jpccr.ccs.tencentyun.com/ta_dah/ta_dah
docker run -d --name ta_dah -p 80:3000 jpccr.ccs.tencentyun.com/ta_dah/ta_dah
