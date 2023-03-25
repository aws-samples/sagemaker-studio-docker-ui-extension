import os
import logging as log

log_cmd = "&>> /home/sagemaker-user/.sagemaker_studio_docker_cli/ui_extension.log"
       
def create_host(instance_type):
    log.info(f"Creating host with instance type: {instance_type}")
    is_bash_profile = os.path.isfile("/home/sagemaker-user/.bash_profile")
    is_bashrc = os.path.isfile("/home/sagemaker-user/.bashrc")
    command = f"sdocker create-host --instance-type {instance_type} {log_cmd} &"
    bash_comm = ""
    if is_bash_profile:
        bash_comm = f"source ~/.bash_profile {log_cmd} && "
    elif is_bashrc:
        bash_comm = f"source ~/.bashrc {log_cmd} && "
    
    os.system(bash_comm + command)
