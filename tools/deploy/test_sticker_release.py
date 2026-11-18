import pathlib,tempfile,os,io,json,sys,importlib.util
from unittest.mock import patch
p=pathlib.Path(__file__).with_name('sticker_release.py');s=importlib.util.spec_from_file_location('sender',p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
with tempfile.TemporaryDirectory() as t:
 old=os.getcwd();os.chdir(t)
 try:
  r=pathlib.Path('.publish/build');r.mkdir(parents=True);(r/'index.html').write_text('root');(r/'a.js').write_text('js');(r/'a.css').write_text('css');(r/'asset-manifest.json').write_text(json.dumps({'files':{'mainJs':'a.js','mainCss':'a.css'}}))
  with patch.dict(os.environ,{'BUILD_NUMBER':'11'},clear=True),patch.object(m.subprocess,'check_output',return_value='a'*40):m.pack()
  receipt=json.loads(pathlib.Path('.publish/complete.json').read_text());assert receipt['revision']=='a'*40
  with patch.dict(os.environ,{'BUILD_NUMBER':'11','GIT_COMMIT':'b'*40},clear=True),patch.object(m.subprocess,'check_output',return_value='a'*40):
   try:m.pack()
   except ValueError:pass
   else:raise AssertionError('SCM mismatch accepted')
 finally:os.chdir(old)
print('MISSING_GIT_COMMIT_AND_WRONG_REVISION_FIXTURES_PASS')
