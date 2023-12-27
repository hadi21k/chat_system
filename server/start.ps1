$env:UPSTASH_REDIS_REST_URL = "redis://default:93018a0822ff4556aafcf0c45530183f@daring-moray-33364.upstash.io:33364"
$env:CORS_ORIGIN = "http://localhost:3000"
Set-Location $PSScriptRoot
docker-compose up -d --build
