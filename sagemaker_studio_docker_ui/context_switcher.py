import subprocess
       
def switch_context(context_name):
        subprocess.Popen(["docker","context","use", context_name])