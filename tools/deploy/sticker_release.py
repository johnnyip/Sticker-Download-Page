#!/usr/bin/env python3
"""Package completed static build, publish via fixed SSH command, verify served bytes."""
import hashlib,io,json,os,pathlib,re,subprocess,sys,tarfile,urllib.request
BASE='https://johnnyip.com/wp-content/reactpress/apps/sticker/build/'
def sha(b):return hashlib.sha256(b).hexdigest()
def pack():
 revision=os.environ['GIT_COMMIT'];number=os.environ['BUILD_NUMBER']
 if not re.fullmatch('[0-9a-f]{40}',revision) or not re.fullmatch('[1-9][0-9]{0,8}',number):raise ValueError('bad build identity')
 root=pathlib.Path('.publish/build');files={}
 for p in sorted(root.rglob('*')):
  if p.is_symlink():raise ValueError('symlink in build')
  if p.is_file():files[str(p.relative_to(root))]=p.read_bytes()
 if not {'index.html','asset-manifest.json'}<=set(files):raise ValueError('incomplete build')
 meta={'format':1,'revision':revision,'build':number,'files':{p:sha(b) for p,b in files.items()}}
 manifest=json.loads(files['asset-manifest.json'])
 for k in ['mainJs','mainCss']:
  if manifest['files'][k].lstrip('/') not in files:raise ValueError('entrypoint missing')
 target=pathlib.Path('.publish/release.tar.gz')
 if target.exists():raise ValueError('already sealed, reconcile rather than rebuild')
 with tarfile.open(target,'w:gz') as tar:
  for p,b in [('release.json',json.dumps(meta,sort_keys=True).encode())]+[('build/'+p,b) for p,b in files.items()]:
   info=tarfile.TarInfo(p);info.size=len(b);info.mode=0o644;info.mtime=0;tar.addfile(info,io.BytesIO(b))
 digest=sha(target.read_bytes());pathlib.Path('.publish/complete.json').write_text(json.dumps({'sha256':digest,'revision':revision,'build':number},indent=2));print('RELEASE_SEALED '+digest)
def publish():
 p=pathlib.Path('.publish/release.tar.gz');receipt=json.loads(pathlib.Path('.publish/complete.json').read_text())
 if sha(p.read_bytes())!=receipt['sha256']:raise ValueError('sealed archive changed')
 state=pathlib.Path('/var/jenkins_home/.sticker-dmz-publish')
 args=['ssh','-T','-i',str(state/'id_ed25519'),'-o','IdentitiesOnly=yes','-o','BatchMode=yes','-o','ConnectTimeout=10','-o','StrictHostKeyChecking=yes','-o','UserKnownHostsFile='+str(state/'known_hosts'),'johnny@192.168.3.10','publish-sticker']
 with p.open('rb') as source:result=subprocess.run(args,stdin=source,capture_output=True,timeout=240)
 if result.returncode:
  print(result.stderr.decode(errors='replace'),file=sys.stderr);raise RuntimeError('publish outcome requires inspection; no automatic retry')
 result=json.loads(result.stdout)
 if not result.get('complete') or result['revision']!=receipt['revision'] or result['build']!=receipt['build'] or result['archiveSha256']!=receipt['sha256']:raise ValueError('receipt mismatch')
 pathlib.Path('.publish/deployed.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
def verify():
 r=json.loads(pathlib.Path('.publish/deployed.json').read_text())
 def fetch(url):
  with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Jenkins-Sticker-Release/2'}),timeout=30) as response:
   if response.status!=200:raise ValueError('not HTTP200')
   return response.read()
 html=fetch('https://johnnyip.com/sticker/').decode()
 if 'id="root"' not in html:raise ValueError('missing React root')
 for path,digest in r['assets'].items():
  if '/wp-content/reactpress/apps/sticker/build/'+path not in html or sha(fetch(BASE+path))!=digest:raise ValueError('served revision differs')
 print('VERIFIED_STICKER_RELEASE '+r['revision']+' build='+r['build'])
if __name__=='__main__':
 {'pack':pack,'publish':publish,'verify':verify}[sys.argv[1]]()
