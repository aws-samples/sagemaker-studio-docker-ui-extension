# Sagemaker Studio Docker UI Extension

This JupyterLab extension interacts with docker hosts and SageMaker Studio Docker CLI to provide customers with interactive UI to launch and manage docker hosts from within SageMaker Studio.

![image](https://github.com/aws-samples/sagemaker-studio-docker-ui-extension/raw/main/SageMaker-Studio-Docker-UI.png)

This extension is composed of a Python package named `sagemaker_studio_docker_ui`
for the server extension and a NPM package named `sagemaker-studio-docker-ui`
for the frontend extension.

## Requirements

* Please ensure your JupyterLab version is >= v1.2.18 and < 2.0. You can check the version by opening a terminal window in SageMaker Studio (File > New -> Terminal) and running the following command: 'jupyter lab --version'

## Installation Steps

Use Studio LifeCycle configuration

### Uninstall

```bash
pip uninstall sagemaker_studio_docker_ui
jupyter labextension uninstall sagemaker-studio-docker-ui
```

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the MIT-0 License.
