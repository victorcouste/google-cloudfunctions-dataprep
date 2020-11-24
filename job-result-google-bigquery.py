import requests
import json
from google.cloud import bigquery
from datetime import datetime

def publish_bigquery(request):

    request_json = request.get_json()
    if request_json and 'job_id' in request_json:
        job_id = request_json['job_id']
        job_status=request_json['job_status']
    else:
        return 'No Job Id to publish'

    datataprep_auth_token='xxxxxxxx'
    dataprep_headers = {"Authorization": "Bearer "+datataprep_auth_token}        

    print('Dataprep Job ID {} and Status {}'.format(job_id,job_status))

    job_url="https://clouddataprep.com/jobs/"+job_id;
    job_result_profile="https://clouddataprep.com/v4/jobGroups/"+job_id+"/pdfResults"

    dataprep_job_endpoint = "https://api.clouddataprep.com/v4/jobGroups/"+job_id+"?embed=wrangledDataset.recipe,creator,jobs"
        
    resp = requests.get(
        url=dataprep_job_endpoint,
        headers=dataprep_headers
    )
    job_object=resp.json()
    print('Status Code Get Job: {}'.format(resp.status_code))
    #print('Result : {}'.format(job_object))

    output_name = job_object["wrangledDataset"]["recipe"]["name"]
    print('Output Name : {}'.format(output_name))
    
    user = job_object["creator"]["email"]
    print('User : {}'.format(user))
    
   createdAt = job_object["jobs"]["data"][0]["createdAt"]

    if "cpJobId" in job_object["jobs"]["data"][0]:
	dataflow_jobid = job_object["jobs"]["data"][0]["cpJobId"]
        updatedAt = job_object["jobs"]["data"][1]["updatedAt"]
    else:
        # there is an ingest or convert job before the dataflow transform job
	dataflow_jobid = job_object["jobs"]["data"][1]["cpJobId"]
        updatedAt = job_object["jobs"]["data"][2]["updatedAt"]

    print('Dataflow jobId : {}'.format(dataflow_jobid))
    
    start_job = datetime.strptime(createdAt, "%Y-%m-%dT%H:%M:%S.000Z")
    end_job = datetime.strptime(updatedAt, "%Y-%m-%dT%H:%M:%S.000Z")
    job_duration = (end_job - start_job)
    print('Duration : {}'.format(job_duration))

    datetime_string = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")

    # Instantiates a client
    bigquery_client = bigquery.Client()

    # Prepares a reference to the dataset
    dataset_ref = bigquery_client.dataset('default')

    table_ref = dataset_ref.table('dataprep_jobs')
    table = bigquery_client.get_table(table_ref)  # API call
    row_to_insert = [{
    "job_run_date":datetime_string,
    "job_id":int(job_id),
    "output_name":output_name,
    "job_status":job_status,
    "job_url":job_url,
    "user":user,
    "dataflow_job_id":dataflow_jobid,
    "job_duration":str(job_duration)
    }]
    errors = bigquery_client.insert_rows(table, row_to_insert)  # API request
    assert errors == []

    return 'JobId {} - {} - {} published in BigQuery'.format(job_id,job_status,output_name)
