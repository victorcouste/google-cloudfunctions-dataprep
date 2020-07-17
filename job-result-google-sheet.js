const {google} = require('googleapis');
const request = require('sync-request');

exports.jobresultgsheet = async (req, res) => {

  var jobID = req.body.jobid;
  var jobStatus = req.body.jobstatus;
  
  var jobURL = "https://clouddataprep.com/jobs/"+jobID;
  
  var jobProfileForumula = '=LIEN_HYPERTEXTE("https://clouddataprep.com/v4/jobGroups/'+jobID+'/pdfResults";"Profile PDF")';
   
  var DataprepToken = "eyJhbGciOiJSUzI.................7VQLSPH3mteFmQfOPBCrJPqGWErQ";
  
  // ------------------ GET DATAPREP JOB OBJECT --------------------------------

  var job_endpoint = "https://api.clouddataprep.com/v4/jobGroups/"+jobID+"?embed=wrangledDataset";

  var res_job = request('GET', job_endpoint, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ DataprepToken
    },
  });
  var jsonjob = JSON.parse(res_job.getBody());
  var recipeID = jsonjob.wrangledDataset.id;
  console.log("Recipe ID : "+recipeID);

  // ------------------ GET DATAPREP RECIPE OBJECT --------------------------------

  var recipe_endpoint = "https://api.clouddataprep.com/v4/wrangledDatasets/"+recipeID;

  var res_recipe = request('GET', recipe_endpoint, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ DataprepToken
    },
  });
  var jsonrecipe = JSON.parse(res_recipe.getBody());
  var recipeName = jsonrecipe.name
  console.log("Recipe Name : "+recipeName);

  // ------------------ ADD ALL RESULTS TO A GOOGLE SHEET  --------------------------------

  // block on auth + getting the sheets API object
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });
  const sheetsAPI = await google.sheets({ version: "v4", auth });
  const JobSheetId = "1X63lT7...........VbwiDN0wm3SKx-Ro";
  
  sheetsAPI.spreadsheets.values.append({
    key:"AIza............0qu8qlXUA",
    spreadsheetId: JobSheetId,
    range: 'A1:F1',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values: [
        [new Date().toISOString().replace('T', ' ').substr(0, 19), jobID, recipeName, jobStatus, jobURL,jobProfileForumula]
      ],
    },
  }, (err, response) => {
    if (err) res.send(err)
  })
  res.status(200).send("job "+jobID+" "+jobStatus); 
  console.log("job "+jobID+" "+jobStatus);
}
