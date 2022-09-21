import json

import tornado
import urllib3
from notebook.base.handlers import APIHandler
from notebook.utils import url_path_join
from .host_creator import create_host
from .host_terminator import terminate_host
from .context_switcher import switch_context
from .checkers import checkers

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
base_url = None

context_checker = checkers.context_checker
container_checker = checkers.container_checker
image_checker = checkers.image_checker
ping_checker = checkers.ping_checker

class HostCreateHandler(APIHandler):

    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
       
    @tornado.web.authenticated
    async def post(self):
        global base_url

        client = tornado.httpclient.AsyncHTTPClient()
        input_data = self.get_json_body()

        try:
            instance_type = input_data["instance_type"]
            data = {
                "instance_type": instance_type
            }
            create_host(instance_type)
            self.finish(json.dumps(data))
        except Exception as e:
            # Other errors are possible, such as IOError.
            self.log.error("Error: " + str(e))
            self.finish('["Error"]')

class HostTerminateHandler(APIHandler):

    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
       
    @tornado.web.authenticated
    async def post(self):
        global base_url

        client = tornado.httpclient.AsyncHTTPClient()
        input_data = self.get_json_body()

        try:
            instance_id = input_data["instance_id"]
            data = {
                "instance_id": instance_id 
            }
            terminate_host(instance_id)
            self.finish(json.dumps(data))
        except Exception as e:
            # Other errors are possible, such as IOError.
            self.log.error(f"Error on POST /docker-host/terminate_host for instance {instance_id}\n{e}")
            self.finish(f'["Error": {e}]')
            
class ContextSwitchHandler(APIHandler):

    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
       
    @tornado.web.authenticated
    async def post(self):
        global base_url

        client = tornado.httpclient.AsyncHTTPClient()
        input_data = self.get_json_body()
        context_name = ''
        try:
            context_name = input_data["context_name"]
            data = {
                "context_name": context_name
            }
            switch_context(context_name)
            self.finish(json.dumps(data))
        except Exception as e:
            # Other errors are possible, such as IOError.
            self.log.error(f"Error on POST /docker-host/switch_context for context {context_name}\n{e}")
            self.finish(f'["Error": {e}]')
            
class ContextHandler(APIHandler):

    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    async def get(self):
        global context_checker

        self.finish(json.dumps(context_checker.contexts))

    @tornado.web.authenticated
    async def post(self):
        global base_url
        global context_checker

        client = tornado.httpclient.AsyncHTTPClient()
        input_data = self.get_json_body()

        try:
            data = {
                "greetings": "Hello, from JupyterLab Sagemaker Studio Docker UI Extension!"
            }
            # start background job
            context_checker.start(
                self.base_url, self.log, client
            )
            data["count"] = context_checker.get_runcounts()
            self.finish(json.dumps(data))
        except Exception as e:
            # Other errors are possible, such as IOError.
            self.log.error(f"Error on POST /docker-host/contexts\n{e}")
            self.finish(f'["Error": {e}]')

class ImageHandler(APIHandler):

    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    async def get(self):
        global image_checker

        self.finish(json.dumps(image_checker.images))

    @tornado.web.authenticated
    async def post(self):
        global base_url
        global image_checker

        client = tornado.httpclient.AsyncHTTPClient()
        input_data = self.get_json_body()

        try:
            instance_id = input_data["instance_id"]
            # stop any previous running job
            await image_checker.stop()
            # start background job
            image_checker.start(
                self.base_url, self.log, client, instance_id
            )
            self.finish(json.dumps(image_checker.images))
        except Exception as e:
            # Other errors are possible, such as IOError.
            self.log.error(f"Error on POST /docker-host/images for instance {instance_id}\n{e}")
            self.finish(f'["Error": {e}]')

class ContainerHandler(APIHandler):

    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    async def get(self):
        global container_checker

        self.finish(json.dumps(container_checker.containers))

    @tornado.web.authenticated
    async def post(self):
        global base_url
        global container_checker

        client = tornado.httpclient.AsyncHTTPClient()
        input_data = self.get_json_body()

        try:
            instance_id = input_data["instance_id"]
            # stop any previous running job
            await container_checker.stop()
            # start background job
            container_checker.start(
                self.base_url, self.log, client, instance_id
            )
            self.finish(json.dumps(container_checker.containers))
        except Exception as e:
            # Other errors are possible, such as IOError.
            self.log.error(f"Error on POST /docker-host/containers for instance {instance_id}\n{e}")
            self.finish(f'["Error": {e}]')
            
class PingHandler(APIHandler):

    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    async def get(self):
        global ping_checker

        self.finish(json.dumps(ping_checker.status.name))

    @tornado.web.authenticated
    async def post(self):
        global base_url
        global ping_checker

        client = tornado.httpclient.AsyncHTTPClient()
        input_data = self.get_json_body()

        try:
            instance_id = input_data["instance_id"]
            # stop any previous running job
            await ping_checker.stop()
            # start background job
            ping_checker.start(
                self.base_url, self.log, client, instance_id
            )
            self.finish(json.dumps(ping_checker.status.name))
        except Exception as e:
            # Other errors are possible, such as IOError.
            self.log.error(f"Error on POST /docker-host/ping\n{e}")
            self.finish(f'["Error": {e}]')

# Function to setup the web handdlers
def setup_handlers(web_app, url_path):
    global base_url

    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    context_pattern = url_path_join(base_url, url_path, "contexts")
    images_pattern = url_path_join(base_url, url_path, "images")
    containers_pattern = url_path_join(base_url, url_path, "containers")
    create_host_pattern = url_path_join(base_url, url_path, "create_host")    
    terminate_host_pattern = url_path_join(base_url, url_path, "terminate_host")    
    switch_context_pattern = url_path_join(base_url, url_path, "switch_context")
    ping_host_pattern = url_path_join(base_url, url_path, "ping")
    handlers = [
        (context_pattern, ContextHandler),
        (images_pattern, ImageHandler),
        (containers_pattern, ContainerHandler),
        (create_host_pattern, HostCreateHandler),        
        (terminate_host_pattern, HostTerminateHandler),        
        (switch_context_pattern, ContextSwitchHandler),
        (ping_host_pattern, PingHandler)
    ]
    web_app.add_handlers(host_pattern, handlers)
