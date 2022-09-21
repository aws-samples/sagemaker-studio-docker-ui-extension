#!/bin/bash

set -eux

cd ~/sagemaker-studio-docker-ui-extension/labextension/sagemaker_studio_docker_ui/

tar -czvf sagemaker_studio_docker_ui-0.1.0.tgz --exclude=.* --exclude=__py* package/

mkdir -p labextension

mv sagemaker_studio_docker_ui-0.1.0.tgz labextension/

cd

tar -czvf sagemaker_studio_docker_ui-0.1.0.tar.gz sagemaker-studio-docker-ui-extension/

pip install sagemaker_studio_docker_ui-0.1.0.tar.gz

jlpm config set cache-folder /tmp/yarncache

jupyter lab build --debug --minimize=False

nohup supervisorctl -c /etc/supervisor/conf.d/supervisord.conf restart jupyterlabserver