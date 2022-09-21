import asyncio
import traceback
from contextlib import suppress
import subprocess
import requests
import json
from enum import Enum


def get_context():
    cmd = ["docker", "context",  "list", "--format={{.Current}},{{.DockerEndpoint}},{{.Name}}"]
    contexts_raw = subprocess.run(cmd, stdout=subprocess.PIPE)
    contexts = contexts_raw.stdout.decode("utf-8").split("\n")[:-1]
    response = []
    for context in contexts:
        context_list = context.split(",")
        if not context_list[2] == "default":
            if "_" in context_list[2]:
                json_context = {
                    "Current": context_list[0],
                    "DockerEndpoint": context_list[1],
                    "InstanceId": context_list[2].split("_")[1],
                    "InstanceType": context_list[2].split("_")[0]
                }
                response.append(json_context)
    return response


class ContextChecker(object):
    def __init__(self):
        self.interval = 1  # frequency for checking contexts in seconds
        self._running = False
        self.count = 0
        self.task = None
        self.errors = None
        self.ignore_connections = True
        self.tornado_client = None
        self.base_url = None
        self.app_url = "http://0.0.0.0:8888"
        self.contexts = []
        self.current_instance_id = ""

    # Invoke context_checks() function
    async def run_context_checks(self):
        while True:
            self.count += 1
            await asyncio.sleep(self.interval)
            try:
                await self.context_checks()
            except Exception:
                self.errors = traceback.format_exc()
                self.log.error(self.errors)

    # Entrypoint function to get the value from handlers(POST API call) and start background job
    def start(self, base_url, log_handler, client):
        self.tornado_client = client
        self.base_url = base_url
        self.log = log_handler
        self.errors = None  # clear error array at start

        if not self._running:
            self.count += 1
            self._running = True
            self.task = asyncio.ensure_future(self.run_context_checks())

    async def stop(self):
        if self._running:
            self._running = False
            if self.task:
                self.task.cancel()
                with suppress(asyncio.CancelledError):
                    await self.task

    def get_runcounts(self):
        return self.count

    def get_runerrors(self):
        return self.errors
    
    async def context_checks(self):     
        self.contexts = get_context()
        current_flag = False
        for context in self.contexts:
            if context["Current"] == "true":
                current_flag = True
                if self.current_instance_id != context["InstanceId"]:
                    await checkers.image_checker.stop()
                    await checkers.container_checker.stop()
                    await checkers.ping_checker.stop()
                    checkers.image_checker.start(self.base_url, self.log, self.tornado_client, context["InstanceId"])
                    checkers.container_checker.start(self.base_url, self.log, self.tornado_client, context["InstanceId"])
                    checkers.ping_checker.start(self.base_url, self.log, self.tornado_client, context["InstanceId"])
                    self.current_instance_id = context["InstanceId"]

        if not current_flag:
            await checkers.image_checker.stop()
            await checkers.container_checker.stop()
            self.current_instance_id = ""

class ContainerChecker(object):
    def __init__(self):
        self.interval = 1  # frequency for checking containers in seconds
        self._running = False
        self.count = 0
        self.task = None
        self.errors = None
        self.ignore_connections = True
        self.tornado_client = None
        self.base_url = None
        self.app_url = "http://0.0.0.0:8888"
        self.containers = []

    # Invoke context_checks() function
    async def run_container_checks(self, instance_id):
        while True:
            self.count += 1
            await asyncio.sleep(self.interval)
            try:
                await self.container_checks(instance_id)
            except Exception:
                self.errors = traceback.format_exc()
                self.log.error(self.errors)

    # Entrypoint function to get the value from handlers(POST API call) and start background job
    def start(self, base_url, log_handler, client, instance_id):
        self.tornado_client = client
        self.base_url = base_url
        self.log = log_handler
        self.errors = None  # clear error array at start

        if not self._running:
            self.count += 1
            self._running = True
            self.task = asyncio.ensure_future(self.run_container_checks(instance_id))

    async def stop(self):
        self.containers = []
        if self._running:
            self._running = False
            if self.task:
                self.task.cancel()
                with suppress(asyncio.CancelledError):
                    await self.task

    def get_runcounts(self):
        return self.count

    def get_runerrors(self):
        return self.errors

    async def container_checks(self, instance_id):
        contexts = get_context()
        reponse = []
        dns_address = None
        port = 1111
        for context in contexts:
            if context["InstanceId"] == instance_id:
                # tcp://ip-172-31-76-33.ap-southeast-2.compute.internal:1111
                dns_address = context["DockerEndpoint"].split(":")[1].split("//")[1]
                instance_type = context["InstanceType"]
        if dns_address:
            try:
                path_to_cert = f"/home/sagemaker-user/.sagemaker_studio_docker_cli/{instance_type}_{instance_id}/certs/client/"
                cert=(path_to_cert + "cert.pem", path_to_cert + "key.pem")
                response = json.loads(requests.get(f"https://{dns_address}:{port}/containers/json", cert=cert, verify=False).content.decode("utf-8"))
            except:
                response = []
        self.containers = response\

class ImageChecker(object):
    def __init__(self):
        self.interval = 1  # frequency for checking images in seconds
        self._running = False
        self.count = 0
        self.task = None
        self.errors = None
        self.ignore_connections = True
        self.tornado_client = None
        self.base_url = None
        self.app_url = "http://0.0.0.0:8888"
        self.images = []
        self.instance_id = ""

    # Invoke image_checks() function
    async def run_image_checks(self, instance_id):
        while True:
            self.count += 1
            await asyncio.sleep(self.interval)
            try:
                await self.image_checks(instance_id)
            except Exception:
                self.errors = traceback.format_exc()
                self.log.error(self.errors)

    # Entrypoint function to get the value from handlers(POST API call) and start background job
    def start(self, base_url, log_handler, client, instance_id):
        self.tornado_client = client
        self.base_url = base_url
        self.log = log_handler
        self.errors = None  # clear error array at start
        
        if instance_id != self.instance_id:
            if self._running:
                self.stop()
            self.instance_id = ""

        if not self._running:
            self.count += 1
            self._running = True
            self.task = asyncio.ensure_future(self.run_image_checks(instance_id))
            self.instance_id = instance_id

    async def stop(self):
        self.images = []
        if self._running:
            self._running = False
            self.instance_id = ""
            if self.task:
                self.task.cancel()
                with suppress(asyncio.CancelledError):
                    await self.task

    def get_runcounts(self):
        return self.count

    def get_runerrors(self):
        return self.errors
        
    async def image_checks(self, instance_id):
        contexts = get_context()
        dns_address = None
        port = 1111
        for context in contexts:
            if context["InstanceId"] == instance_id:
                # example: tcp://ip-172-31-76-33.ap-southeast-2.compute.internal:1111
                dns_address = context["DockerEndpoint"].split(":")[1].split("//")[1]
                instance_type = context["InstanceType"]
        if dns_address:
            try:
                path_to_cert = f"/home/sagemaker-user/.sagemaker_studio_docker_cli/{instance_type}_{instance_id}/certs/client/"
                cert=(path_to_cert + "cert.pem", path_to_cert + "key.pem")
                response = json.loads(requests.get(f"https://{dns_address}:{port}/images/json", cert=cert, verify=False).content.decode("utf-8"))
            except:
                response = []
        self.images = response

class HostStatus(Enum):
    HEALTHY = 1
    UNHEALTHY = 0

class PingChecker(object):
    def __init__(self):
        self.interval = 10  # frequency for checking idle sessions in seconds
        self._running = False
        self.count = 0
        self.task = None
        self.errors = None
        self.ignore_connections = True
        self.tornado_client = None
        self.base_url = None
        self.app_url = "http://0.0.0.0:8888"
        self.status = HostStatus(0)

    # Invoke context_checks() function
    async def run_health_checks(self, instance_id):
        while True:
            self.count += 1
            await asyncio.sleep(self.interval)
            try:
                await self.ping_checks(instance_id)
            except Exception:
                self.errors = traceback.format_exc()
                self.log.error(self.errors)

    # Entrypoint function to get the value from handlers(POST API call) and start background job
    def start(self, base_url, log_handler, client, instance_id):
        self.tornado_client = client
        self.base_url = base_url
        self.log = log_handler
        self.errors = None  # clear error array at start

        if not self._running:
            self.count += 1
            self._running = True
            self.task = asyncio.ensure_future(self.run_health_checks(instance_id))

    async def stop(self):
        if self._running:
            self._running = False
            if self.task:
                self.task.cancel()
                with suppress(asyncio.CancelledError):
                    await self.task

    def get_runcounts(self):
        return self.count

    def get_runerrors(self):
        return self.errors

    async def ping_checks(self, instance_id):
        contexts = get_context()
        dns_address = None
        port = 1111
        current_context = ""
        instance_type = ""
        for context in contexts:
            if context["InstanceId"] == instance_id:
                dns_address = context["DockerEndpoint"].split(":")[1].split("//")[1]
                current_context = context
                instance_type = context["InstanceType"]
        if dns_address:
            try:
                path_to_cert = f"/home/sagemaker-user/.sagemaker_studio_docker_cli/{instance_type}_{instance_id}/certs/client/"
                cert=(path_to_cert + "cert.pem", path_to_cert + "key.pem")
                response = json.loads(requests.get(f"https://{dns_address}:{port}/version", cert=cert, verify=False).content.decode("utf-8"))
                self.status = HostStatus(1)
            except:
                self.status = HostStatus(0)
                cmd = ["docker", "context",  "use", "default"]
                contexts_raw = subprocess.run(cmd, stdout=subprocess.PIPE)
                cmd = ["docker", "context",  "rm", f"{current_context['InstanceType']}_{current_context['InstanceId']}"]
                contexts_raw = subprocess.run(cmd, stdout=subprocess.PIPE)
                await checkers.image_checker.stop()
                await checkers.container_checker.stop()
                await checkers.ping_checker.stop()



class CheckersClass:
    def __init__(self):
        self.context_checker = ContextChecker()
        self.container_checker = ContainerChecker()
        self.image_checker = ImageChecker()
        self.ping_checker = PingChecker()

checkers = CheckersClass()