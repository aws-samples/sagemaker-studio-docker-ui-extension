import subprocess
import logging as log
       
def switch_context(context_name):
        log.info(f"Switching context to {context_name}")
        subprocess.Popen(["docker","context","use", context_name])