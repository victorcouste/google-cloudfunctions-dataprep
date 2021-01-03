# Google Cloud Functions for Cloud Dataprep

<img src="https://github.com/victorcouste/google-cloudfunctions-dataprep/blob/master/CloudFunctions_Dataprep.png" width="70%" height="70%">

Google Cloud Functions examples for [Google Cloud Dataprep](https://cloud.google.com/dataprep)

- **[gcs_trigger_dataprep_job.py](https://github.com/victorcouste/google-cloudfunctions-dataprep/blob/master/gcs_trigger_dataprep_job.py)** : Background Python function to trigger a Dataprep job when a file is created in a Google Cloud Storage bucket folder. Dataprep job started with REST API call and new file as parameter. Implementation details in the blog post [How to Automate a Cloud Dataprep Pipeline When a File Arrives](https://medium.com/google-cloud/how-to-automate-a-cloud-dataprep-pipeline-when-a-file-arrives-9b85f2745a09)

- **[job-result-google-sheet.js](https://github.com/victorcouste/google-cloudfunctions-dataprep/blob/master/job-result-google-sheet.js)** : HTTP Node.js function to write in a Google Sheet a Dataprep job result info (id, status) with recipe name, link to the job page and link to PDF of result's profile. This HTTP Cloud function is called from a Dataprep Webhook when jobs are finished (success or failure). Implementation details in the blog post [Leverage Cloud Functions and APIs to Monitor Cloud Dataprep Jobs Status in a Google Sheet](https://towardsdatascience.com/leverage-cloud-functions-and-apis-to-monitor-cloud-dataprep-jobs-status-in-a-google-sheet-b412ee2b9acc).

- **[publishing_googlesheet.js](https://github.com/victorcouste/google-cloudfunctions-dataprep/blob/master/publishing_googlesheet.js)** : HTTP Node.js function to publish Dataprep output in a Google Sheet. Google sheet name created will based on default CSV file name generated in GSC + Dataprep Job id. In the Cloud Function code, you need to update your [Dataprep Token Access](https://docs.trifacta.com/display/DP/Access+Tokens+Page) (to call REST API) and the [Google Spreadsheet ID](https://developers.google.com/sheets/api/guides/concepts#spreadsheet_id). And this Cloud Function can be triggered when a Dataprep job is finished via a [Dataprep Webhook](https://docs.trifacta.com/display/DP/Create+Flow+Webhook+Task).

- **[job-result-google-bigquery.py](https://github.com/victorcouste/google-cloudfunctions-dataprep/blob/master/job-result-google-bigquery.py)** : HTTP Python function to write in a Google BigQuery table a Dataprep job result info (id, status) with dataset output name (recipe name), Google user and link to the job page. This HTTP Cloud function is called from a Dataprep Webhook when jobs are finished (success or failure). Implementation details in the blog post [Monitor your BigQuery Data Warehouse Dataprep Pipeline with Data Studio](https://medium.com/google-cloud/monitor-your-bigquery-data-warehouse-dataprep-pipeline-with-data-studio-8e46b2beda1).

- **[export_import_dataprep_flow.py](https://github.com/victorcouste/google-cloudfunctions-dataprep/blob/master/export_import_dataprep_flow.py)** : Export a Dataprep flow from a project and import it in another project. Option to save or get the flow package (zip file) in a GCS bucket folder.

- **[Update Google Cloud Data Catalog](https://github.com/victorcouste/google-data-catalog-dataprep)** : A Cloud Function to create or update Google Cloud Data Catalog tags on BigQuery tables with Cloud Dataprep Metadata and Column's Profile.


Google Cloud Functions https://cloud.google.com/functions

Google Cloud Dataprep by Trifacta https://cloud.google.com/dataprep

Google Cloud Dataprep Standard API https://api.trifacta.com/dataprep-standard

Google Cloud Dataprep Premium API https://api.trifacta.com/dataprep-premium
