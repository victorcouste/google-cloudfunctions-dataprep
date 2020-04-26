import os
import requests
import json

def dataprep_job_gcs_trigger(event, context):

    """Background Cloud Function to be triggered by Cloud Storage.
    Args:
        event (dict): The Cloud Functions event payload.
        context (google.cloud.functions.Context): Metadata of triggering event."""

    head_tail = os.path.split(event['name'])
    newfilename = head_tail[1]
    newfilepath = head_tail[0]

    datataprep_auth_token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiMWQ3ZjNiZjYtYTNhYS00YWUyLTk4OGQtZDYzMWZmYmUzODBjIiwiaWF0IjoxNTg3OTAwNjc0LCJhdWQiOiJ0cmlmYWN0YSIsImlzcyI6ImRhdGFwcmVwLWFwaS1hY2Nlc3MtdG9rZW5AdHJpZmFjdGEtZ2Nsb3VkLXByb2QuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJzdWIiOiJkYXRhcHJlcC1hcGktYWNjZXNzLXRva2VuQHRyaWZhY3RhLWdjbG91ZC1wcm9kLmlhbS5nc2VydmljZWFjY291bnQuY29tIn0.YM2S2sx9RAdj4P_HSMjRjoYvS1qukKfZq53PVxqK05WG2AjHOteJTTEUrVoVhkLVrhIQ5zH6dFvukCzQA883AnVwsqKZW5NFkHDWpXP-b5308ytklDOcF_WgGA8QpIZDkl0EsJbEbn3Xr-40p6hunp5-KJkvi8XLocbSD_YgmEdo-JB0B8J5iBVvfVBQnr0LIHOvF55kXcv4zAeN6OyNmhti-SwsoCXqjFcjHwxgz8IXykaao7iW0eKDfiyDUhdRGsCL5VaSpBIKHbMgWEDZMZp7lykiEZlK3poC72_CjAlcOw-XJfA6oBG8vdEoZpBeXmVYkoMamiu9W5z8S-OCZw'
    dataprep_jobid = 1393576

    if context.event_type == 'google.storage.object.finalize' and newfilepath == 'landingzone':

        print('Run Dataprep job on new file: {}'.format(newfilename))

        dataprep_runjob_endpoint = 'https://api.clouddataprep.com/v4/jobGroups'
        datataprep_job_param = {
            "wrangledDataset": {"id": dataprep_jobid},
            "runParameters": {"overrides": {"data": [{"key": "FileName","value": newfilename}]}}
        }
        print('Run Dataprep job param: {}'.format(datataprep_job_param))
        dataprep_headers = {
            "Content-Type":"application/json",
            "Authorization": "Bearer "+datataprep_auth_token
        }        

        resp = requests.post(
            url=dataprep_runjob_endpoint,
            headers=dataprep_headers,
            data=json.dumps(datataprep_job_param)
        )

        print('Status Code : {}'.format(resp.status_code))      
        print('Result : {}'.format(resp.json()))

    return 'End File event'.format(newfilename)
