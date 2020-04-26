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

    datataprep_auth_token = 'xxxxxxxxxxxxxxx'
    dataprep_jobid = 99999999

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
