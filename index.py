import os,json

foods = []
for root,dirs,files in os.walk('food'):
  for file in files:
    if file == 'template.json': continue
    if root[-4:] == '.old': continue
    id = os.path.splitext(file)[0]
    with open(os.path.join(root,file),'r') as f:
      foods += [{'id':id,**json.load(f)}]
with open('index.json','w') as f:
  json.dump(foods,f,indent=1)
