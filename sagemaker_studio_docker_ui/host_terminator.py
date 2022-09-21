import subprocess
       
def terminate_host(instance_id):
        subprocess.Popen(["sdocker","terminate-host","--instance-id", instance_id])