const request = require('then-request');
const {google} = require('googleapis');
const {Storage} = require("@google-cloud/storage");

exports.publish_gsheet = async (req, res) => {

  const DataprepJobID = req.body.jobid;

  console.log("DataprepJobID : "+DataprepJobID);

  const spreadsheetId = "1WiGd.........4tuoc";

  const DataprepToken ="eyJhbGc........bcOwTQ";

  // block on auth + getting the sheets API object
  const auth = await google.auth.getClient({
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/devstorage.read_only"
    ]
  });
  const sheetsAPI = google.sheets({version: 'v4',auth});
  
  // ------------------ GET DATAPREP JOB AND CSV FILE NAME GENERATED IN GCS --------------------------------

  const dataprep_job_endpoint = "https://api.clouddataprep.com/v4/jobGroups/"+DataprepJobID+"?embed=jobs.fileWriterJob.writeSetting";

  var res_job = await request('GET', dataprep_job_endpoint, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ DataprepToken
    },
  });
      
  const jsonresult = JSON.parse(res_job.getBody());

  var outputFileURI=""
  for (key in jsonresult.jobs.data) {
    if (jsonresult.jobs.data[key].jobType == "filewriter") {
       outputFileURI = jsonresult.jobs.data[key].writeSetting.path;
    }
  };

  //gs://dataprep-staging-0b9ad034-9473-4777-98f1-0f3e643d0dce/vcoustenoble@trifacta.com/jobrun/Sales_Data_small.csv
  //console.log("outputFileURI : "+outputFileURI);

  const outputFilepathArray = outputFileURI.split('/');

  const outputBucket=outputFilepathArray[2];
  console.log("Bucket : "+outputBucket);

  var outputFilepath='';
  for (key in outputFilepathArray) {
    if (key > 2) {
      outputFilepath = outputFilepath + outputFilepathArray[key]+'/';
    }
  };
  outputFilepath=outputFilepath.slice(0,-1);
  console.log("Output Filepath : "+outputFilepath);

  const filename = outputFilepathArray.slice(-1).toString();
  //console.log("Filename : "+filename);
  const sheetName = filename.slice(0,-4)+"_"+DataprepJobID;
  console.log("Sheet Name : "+sheetName);

  const FileData = await readCSVContent(outputBucket,outputFilepath);

  sheetid = await createEmptySheet(sheetName,spreadsheetId);
  await populateAndStyle(FileData,sheetid,spreadsheetId);

  res.send(`Spreadsheet ${sheetName} created`);

  // ------------------ READ CSV FILE CONTENT FROM GCS --------------------------------

  function readCSVContent(mybucket,myfilepath) {
    return new Promise((resolve, reject) => {
      const storage = new Storage();
      const bucket = storage.bucket(mybucket);
      const file = bucket.file(myfilepath);

      let fileContents = Buffer.from('');

      file.createReadStream()
      .on('error', function(err) {
        reject('The Storage API returned an error: ' + err);
      })
      .on('data', function(chunk) {
        fileContents = Buffer.concat([fileContents, chunk]);
      })  
      .on('end', function() {
        let content = fileContents.toString('utf8');
        //console.log("CSV content read as string : " + content );
        resolve(content);
      });
    });
  }

// ------------------ CREATE EMPTY NEW SHEET  --------------------------------

  function createEmptySheet(MySheetName,Myspreadsheetid) {
    return new Promise((resolve, reject) => {

      const emptySheetParams = {
        spreadsheetId: Myspreadsheetid,
        resource: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: MySheetName,
                  index: 1,
                  gridProperties: {
                    rowCount: 10,
                    columnCount: 10,
                    frozenRowCount: 1
                  }
                }
              }
            }
          ]
        }
      };
      sheetsAPI.spreadsheets.batchUpdate( emptySheetParams, function(err, response) {
          if (err) {
            reject("The Sheets API returned an error: " + err);
          } else {
            const sheetId = response.data.replies[0].addSheet.properties.sheetId;
            console.log("Created empty sheet: " + sheetId);
            resolve(sheetId);
          }
        });
    });
  }

  // ------------------ WRITE DATA IN THE NEW EMPTY SHEET  --------------------------------

  function populateAndStyle(FileData,MySheetId,MySpreadsheetId) {
    return new Promise((resolve, reject) => {
      // Using 'batchUpdate' allows for multiple 'requests' to be sent in a single batch.
      // Populate the sheet referenced by its ID with the data received (a CSV string)
      // Style: set first row font size to 11 and to Bold. Exercise left for the reader: resize columns
      const dataAndStyle = {
        spreadsheetId: MySpreadsheetId,
        resource: {
          requests: [
            {
              pasteData: {
                coordinate: {
                  sheetId: MySheetId,
                  rowIndex: 0,
                  columnIndex: 0
                },
                data: FileData,
                delimiter: ","
              }
            },
            {
              repeatCell: {
                range: {
                  sheetId: MySheetId,
                  startRowIndex: 0,
                  endRowIndex: 1
                },
                cell: {
                  userEnteredFormat: {
                    textFormat: {
                      fontSize: 11,
                      bold: true
                    }
                  }
                },
                fields: "userEnteredFormat(textFormat)"
              }
            }       
          ]
        }
      };
    
      sheetsAPI.spreadsheets.batchUpdate(dataAndStyle, function(err, response) {
        if (err) {
          reject("The Sheets API returned an error: " + err);
        } else {
          console.log(MySheetId + " sheet populated with " + FileData.length + " rows and column style set.");
          resolve();
        }
      });    
    });
  }

}
