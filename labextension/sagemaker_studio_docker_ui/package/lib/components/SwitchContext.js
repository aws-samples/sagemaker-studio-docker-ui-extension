import { requestAPIServer } from "../sagemaker-studio-docker-ui";

async function switchContext(instance, instanceType, instanceId){
  console.log(`Switching to context ${instanceType}_${instanceId}`);
  const dataToSend = {
    context_name: `${instanceType}_${instanceId}`
  };
  try {
    const reply = await requestAPIServer("switch_context", {
      body: JSON.stringify(dataToSend),
      method: 'POST',
    });
    console.log(reply);
    instance.addAlert({ message: `Switching to host ${instanceId}`, wait: 5000 });
  }
  catch (reason) {
    console.error(`Error on POST /docker-host/switch_context ${JSON.stringify(dataToSend)}.\n${reason}`);
    instance.addAlert({
        type: "error",
        message: `Error checking switching context! "`,
        wait: 5000
    });
  };
}

export class ContextSwitcher {
  constructor(instance, instanceType, instanceId) {
    this.instanceId = instanceId;
    this.instanceType = instanceType;
    this.switcher = () => {
      switchContext(instance, this.instanceType, this.instanceId);
    }
  }
}