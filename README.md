# Sagemaker Studio Docker UI Extension - UI to manage Docker integration for SageMaker Studio

This JupyterLab extension interacts with docker hosts and SageMaker Studio Docker CLI to provide customers with interactive UI to launch and manage docker hosts from within SageMaker Studio.

![image](https://github.com/aws-samples/sagemaker-studio-docker-ui-extension/raw/main/SageMaker-Studio-Docker-UI.png)

This extension is composed of a Python package named `sagemaker-studio-docker-ui`
for the server extension and a NPM package named `sagemaker-studio-docker-ui`
for the frontend extension.

## Requirements
* Requires [SageMaker Studio Docker CLI Extension](https://github.com/aws-samples/sagemaker-studio-docker-cli-extension) to be installed.
* Compatible with *JupyterServer* running *Jupyter Lab* v1.0 or v3.0

## Installation Steps

Use Studio LifeCycle configuration and attach it to *JupyterServer* app.
```
#!/bin/bash

set -eux

cd ~
if cd sagemaker-studio-docker-cli-extension
then
    git reset --hard
    git pull
else
    git clone https://github.com/aws-samples/sagemaker-studio-docker-cli-extension.git
    cd sagemaker-studio-docker-cli-extension
fi
nohup ./setup.sh > docker_setup.out 2>&1 &

if cd ~/sagemaker-studio-docker-ui-extension
then
    git reset --hard
    git pull
    cd
else
    cd
    git clone https://github.com/aws-samples/sagemaker-studio-docker-ui-extension.git
fi

nohup ~/sagemaker-studio-docker-ui-extension/setup.sh > docker_setup.out 2>&1 &
```

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the MIT-0 License.
