import { requestAPIServer } from "../sagemaker-studio-docker-ui";

async function terminateHost(instance, instanceId){
  console.log(`Terminating Host ${instanceId}`);
  const dataToSend = {
    instance_id: instanceId
  };
  try {
    const reply = await requestAPIServer("terminate_host", {
      body: JSON.stringify(dataToSend),
      method: 'POST',
    });
    console.log(reply);
    instance.addAlert({message: `Terminating host ${instanceId}`, wait: 5000 });
  }
  catch (reason) {
    console.error(`Error on POST /docker-host/terminate_host ${JSON.stringify(dataToSend)}.\n${reason}`);
    instance.addAlert({
        type: "error",
        message: `Error terminating host! "`,
        wait: 5000
    });
  };
}

export class HostTerminator {
  constructor(instance, instanceId) {
    this.instanceId = instanceId
    this.terminator = () => {
      terminateHost(instance, this.instanceId);
    }
  }
}