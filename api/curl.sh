mongodb:
https://learn.microsoft.com/en-us/azure/cosmos-db/mongodb/connect-using-mongoose



# local function API
func init MyFunctionProj
func new --template "Http Trigger" --name blogpost
powershell $(az functionapp list --query "[0].name" -o tsv)
func azure functionapp publish bottine-func  --no-build --nozip
func azure functionapp logstream bottine-func




curl -X GET  http://localhost:7071/api/blogpost/6406eccf41639f56577d7411 -H "Content-Type: application/json" --verbose
curl -X POST http://localhost:7071/api/blogpost -d "{""document"":{""text"":""John"",""title"":""John""}}"  -H "Content-Type: application/json" --verbose

curl -X GET  https://bottine-func.azurewebsites.net/api/blogpost?code=AAh9hWnMNlNPmMhTHCBq0kOt_Lk-GerVqa5yyvQXNQ7eAzFuPj3cBg== -H "Content-Type: application/json" --verbose
curl -X POST https://bottine-func.azurewebsites.net/api/blogpost?code=AAh9hWnMNlNPmMhTHCBq0kOt_Lk-GerVqa5yyvQXNQ7eAzFuPj3cBg== -d "{""document"":{""text"":""John"",""title"":""John""}}"  -H "Content-Type: application/json" --verbose



curl -X GET http://localhost:7071/api/blogpost   

curl -X GET http://localhost:7071/api/blogpost \
   -H 'Content-Type: application/json' \
   -d '{"id":"DOCUMENT_ID"}' --verbose

curl -X DELETE http://localhost:7071/api/blogpost \
   -H 'Content-Type: application/json' \
   -d '{"id":"DOCUMENT_ID"}' --verbose
   
# remote function API   
   
curl -X POST YOUR-FUNCTION-URL \
   -H 'Content-Type: application/json' \
   -d '{"document":{"name":"John"}}' --verbose

curl -X POST YOUR-FUNCTION-URL \
   -H 'Content-Type: application/json' \
   -d '{"document":{"name":"Sally"}}' --verbose

curl -X GET YOUR-FUNCTION-URL \
   -H 'Content-Type: application/json' --verbose

curl -X GET YOUR-FUNCTION-URL \
   -H 'Content-Type: application/json' \
   -d '{"id":"DOCUMENT_ID"}' --verbose

curl -X DELETE YOUR-FUNCTION-URL \
   -H 'Content-Type: application/json' \
   -d '{"id":"DOCUMENT_ID"}' --verbose


Open your workflow at .github/workflows/azure-static-web-apps-<DEFAULT-HOSTNAME>.yml.
Search for the property api_location and set the value to api.

npm install -g @azure/static-web-apps-cli
swa start dist/client --api-location api


swa start http://localhost:4200 --api-location api


==========================================

req: {
	"method": "GET",
	"url": "http://localhost:7071/api/blogpost/?page=1&pageSize=100&totalPages=0&previousPageAvailable=false&nextPageAvailable=false",
	"originalUrl": "http://localhost:7071/api/blogpost/?page=1&pageSize=100&totalPages=0&previousPageAvailable=false&nextPageAvailable=false",
	"headers": {
		"accept":"*/*",
		"connection":"close",
		"host":"localhost:7071",
		"user-agent":"curl/7.83.1",
		"content-type":"application/json"
	},
	"query": { "page":"1","pageSize":"100","totalPages":"0","previousPageAvailable":"false","nextPageAvailable":"false" },
	"params": {}
}



#!/bin/bash
FUNCTION_URL="https://YOUR-RESOURCE-NAME.azurewebsites.net/api/upload?code=YOUR-FUNCTION-KEY"

curl -X POST -F "filename=@README.md" -H "Content-Type: text/plain" "http://localhost:7071/api/upload&filename=test-file.txt&username=jsmith" --verbose






curl -X GET  http://localhost:7071/api/auth --verbose