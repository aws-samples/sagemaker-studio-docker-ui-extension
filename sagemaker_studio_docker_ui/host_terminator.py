import os
       
def terminate_host(instance_type):
    is_bash_profile = os.path.isfile("/home/sagemaker-user/.bash_profile")
    is_bashrc = os.path.isfile("/home/sagemaker-user/.bashrc")
    command = f"sdocker terminate-host --instance-type {instance_type} &>> /home/sagemaker-user/.sagemaker_studio_docker_cli/ui_commands.log &"
    bash_comm = ""
    if is_bash_profile:
        bash_comm = "source ~/.bash_profile && "
    elif is_bashrc:
        bash_comm = "source ~/.bash_profile && "
    
    os.system(bash_comm + command)
