#!/bin/bash

set -eux

# Before installing extension
export AWS_SAGEMAKER_JUPYTERSERVER_IMAGE="${AWS_SAGEMAKER_JUPYTERSERVER_IMAGE:-'jupyter-server'}"
if [ "$AWS_SAGEMAKER_JUPYTERSERVER_IMAGE" = "jupyter-server-3" ]
then
    eval "$(conda shell.bash hook)"
    conda activate studio
    cd ~/sagemaker-studio-docker-ui-extension/labextension/sagemaker_studio_docker_ui/
    tar -czvf sagemaker_studio_docker_ui_component.tgz --exclude=.* --exclude=__py* package/
    mkdir -p labextension
    mv sagemaker_studio_docker_ui_component.tgz labextension/
    cd
    tar -czvf sagemaker_studio_docker_ui_extension.tar.gz --exclude=.* sagemaker-studio-docker-ui-extension/
    PACKAGE=sagemaker_studio_docker_ui_extension.tar.gz
else
    PACKAGE=https://github.com/aws-samples/sagemaker-studio-docker-ui-extension/releases/download/v0.1.0/sagemaker_studio_docker_ui_extension.tar.gz
fi;

pip install $PACKAGE
jlpm config set cache-folder /tmp/yarncache
jupyter lab build --debug --minimize=False
nohup supervisorctl -c /etc/supervisor/conf.d/supervisord.conf restart jupyterlabserver