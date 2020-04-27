# google-cloudfunctions-dataprep

![image](CloudFunctions_Dataprep.png)

Google Cloud Functions examples for Google Cloud Dataprep

- **[gcs_trigger_dataprep_job.py](https://github.com/victorcouste/google-cloudfunctions-dataprep/blob/master/gcs_trigger_dataprep_job.py)** : Background Python function to trigger a Dataprep job when a file is created in a Google Cloud Storage bucket folder. Dataprep job started with REST API call and new file as parameter.

- **[job-result-google-sheet.js](https://github.com/victorcouste/google-cloudfunctions-dataprep/blob/master/job-result-google-sheet.js)** : HTTP Node.js function to write in a Google Sheet a Dataprep job result info (id, status). This HTTP Cloud function is called from a Dataprep Webhook when jobs are finished (success or failure). Next step coming is to publish in a Google Sheet the file published by Dataprep.

Google Cloud Functions https://cloud.google.com/functions

Google Cloud Dataprep by Trifacta https://cloud.google.com/dataprep

Google Cloud Dataprep API https://cloud.google.com/dataprep/docs/html/API-Overview_145281442
