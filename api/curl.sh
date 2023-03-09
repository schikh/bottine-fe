mongodb:
https://learn.microsoft.com/en-us/azure/cosmos-db/mongodb/connect-using-mongoose



# local function API
func init MyFunctionProj
func new --template "Http Trigger" --name blogpost
powershell $(az functionapp list --query "[0].name" -o tsv)
func azure functionapp publish bottine-func  --no-build --nozip
func azure functionapp logstream bottine-func




curl -X GET  http://localhost:7071/api/blogpost -H "Content-Type: application/json" --verbose
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
