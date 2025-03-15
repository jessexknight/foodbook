import os
from http.server import SimpleHTTPRequestHandler, test
# custom handler to assume default extension is html
class Handler(SimpleHTTPRequestHandler):
  # with open('404.html','r') as f:
  #   error_message_format = f.read()
  def translate_path(self,path):
    print(path)
    # pop off search query if any
    q = '?q='
    if q in path:
      path,qstr = path.split(q)
    else:
      path,qstr = path,None
    # append the default extension: '.html'
    if os.path.splitext(path)[1] == '' and path != '/':
      path = path+'.html'
    # add back search query if any
    if qstr:
      path = path+q+qstr
    # call parent method
    return super().translate_path(path)
# run on http://localhost:4000
test(Handler,port=4000)
