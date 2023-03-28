import os
import logging as log

log_cmd = "&>> /home/sagemaker-user/.sagemaker_studio_docker_cli/ui_extension.log"
       
def terminate_host(instance_id):
    log.info(f"Terminating host with instance id: {instance_id}")
    is_bash_profile = os.path.isfile("/home/sagemaker-user/.bash_profile")
    is_bashrc = os.path.isfile("/home/sagemaker-user/.bashrc")
    command = f"sdocker terminate-host --instance-id {instance_id} {log_cmd} &"
    bash_comm = ""
    if is_bash_profile:
        bash_comm = f"source ~/.bash_profile {log_cmd} && "
    elif is_bashrc:
        bash_comm = f"source ~/.bashrc {log_cmd} && "
    
    os.system(bash_comm + command)
