import os
       
def create_host(instance_type):
    is_bash_profile = os.path.isfile("/home/sagemaker-user/.bash_profile")
    is_bashrc = os.path.isfile("/home/sagemaker-user/.bashrc")
    command = f"sdocker create-host --instance-type {instance_type} &"
    bash_comm = ""
    if is_bash_profile:
        bash_comm = "/bin/bash /home/sagemaker-user/.bash_profile &&"
    elif is_bashrc:
        bash_comm = "/bin/bash /home/sagemaker-user/.bashrc &&"
    os.system(bash_comm + command)
