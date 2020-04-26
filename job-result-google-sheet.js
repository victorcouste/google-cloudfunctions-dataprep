const {google} = require('googleapis');

exports.jobresultgsheet = async (req, res) => {

  var jobID = req.body.jobid;
  var jobStatus = req.body.jobstatus;
  
  // block on auth + getting the sheets API object
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });
  const sheetsAPI = await google.sheets({ version: "v4", auth });
  const JobSheetId = "xxxxxxx";
  
  sheetsAPI.spreadsheets.values.append({
    key:"yyyyyy",
    spreadsheetId: JobSheetId,
    range: 'A1:C1',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values: [
        [new Date().toISOString().replace('T', ' ').substr(0, 19), jobID, jobStatus]
      ],
    },
  }, (err, response) => {
    if (err) res.send(err)
  })
  res.status(200).send("job "+jobID+" "+jobStatus); 
  console.log("job "+jobID+" "+jobStatus);
}
