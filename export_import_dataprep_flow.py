import requests
import json
from google.cloud import storage

def import_export_dataprep_flow(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    request_json = request.get_json()
    if request_json and 'flowid' in request_json:
        dataprep_flowid = request_json['flowid']
    else:
        return 'No FlowId to export'

    #dataprep_flowid=9999999

    print('FlowId {} to export/import'.format(dataprep_flowid))

    datataprep_export_auth_token = 'xxxxxxxxx'
    dataprep_exportflow_endpoint = 'https://api.clouddataprep.com/v4/flows/{}/package'.format(dataprep_flowid)
    dataprep_exportflow_headers = {"Authorization": "Bearer "+datataprep_export_auth_token}        
    
    resp_export = requests.get(
        url=dataprep_exportflow_endpoint,
        headers=dataprep_exportflow_headers
    )
    print('Export Flow Status Code : {}'.format(resp_export.status_code))

    # Option to save Flow package in a GCS folder
    flowfile_path="flows/flow_{}.zip".format(dataprep_flowid)
    storage_client = storage.Client()
    bucket = storage_client.bucket("dataprep-staging-0b9ad034-9473-4777-98f1-0f3e643d0dce")
    blob = bucket.blob(flowfile_path)
    blob.upload_from_string(resp_export.content,content_type="application/zip")
    
    # Option to get Flow package from a GCS folder 
    #flowfile = blob.download_as_string()
    
    # Get Flow package directly from the export
    flowfile = resp_export.content

    datataprep_import_auth_token = 'yyyyyyy'
    dataprep_importflow_endpoint = 'https://api.clouddataprep.com/v4/flows/package'
    dataprep_importflow_headers = {"Authorization": "Bearer "+datataprep_import_auth_token}
    dataprep_importflow_files={"archive": ("flow.zip", flowfile)}

    resp_import = requests.post(
        url=dataprep_importflow_endpoint,
        headers=dataprep_importflow_headers,
        files=dataprep_importflow_files
    )
    
    print('Import flow Status Code : {}'.format(resp_import.status_code))
    print('Result Import: {}'.format(resp_import.json()))

    return 'FlowId {} export/import'.format(dataprep_flowid)
