const {google} = require('googleapis');
const request = require('request');

exports.jobresultgsheet = async (req, res) => {

  var jobID = req.body.jobid;
  var jobStatus = req.body.jobstatus;
  
  var jobURL = "https://clouddataprep.com/jobs/"+jobID;
  
  var jobProfileFormula = '=LIEN_HYPERTEXTE("https://clouddataprep.com/v4/jobGroups/'+jobID+'/pdfResults";"Profile PDF")';
  
  var jobEndpoint = "https://clouddataprep.com/v4/jobGroups/"+jobID;
  
  var DataprepToken = "vl67kXw.........fhtertgerjg567VB";
  
  var options = {
    url: jobendpoint,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ DataprepToken
  }};
    
  request(options, function(err, res, body) {
    let json = JSON.parse(body);
    console.log(json);
  });

  // block on auth + getting the sheets API object
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });
  const sheetsAPI = await google.sheets({ version: "v4", auth });
  const JobSheetId = "1X63lT...........wm3SKx-Ro";
  
  sheetsAPI.spreadsheets.values.append({
    key:"AIza........... qu8qlXUA",
    spreadsheetId: JobSheetId,
    range: 'A1:E1',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values: [
        [new Date().toISOString().replace('T', ' ').substr(0, 19), jobID, jobStatus, jobURL,jobProfileFormula]
      ],
    },
  }, (err, response) => {
    if (err) res.send(err)
  })
  res.status(200).send("job "+jobID+" "+jobStatus); 
  console.log("job "+jobID+" "+jobStatus);
}
