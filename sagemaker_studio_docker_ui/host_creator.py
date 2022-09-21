import subprocess
       
def create_host(instance_type):
        subprocess.Popen(["sdocker","create-host","--instance-type", instance_type])