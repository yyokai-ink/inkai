#!/usr/bin/env python3
"""INKAI — зміна версії збірки одним рухом.
Запуск у папці з грою:  python3 bump.py 20261101a
Оновлює: INK_BUILD і ?v= у game1.html, штампи INKV.* у кожному .js, версію кешу в sw.js.
Після цього залий ВСІ файли на сайт — телефони не візьмуть старі копії з кешу, а червона плашка підкаже, якщо щось не залито."""
import re,sys,glob
if len(sys.argv)<2 or not re.fullmatch(r"[0-9A-Za-z\-]+",sys.argv[1]): sys.exit("Використання: python3 bump.py НОВА_ВЕРСІЯ  (напр. 20261101a)")
v=sys.argv[1];n=0
def sub(path,fn):
    global n
    s=open(path,encoding="utf-8").read();t=fn(s)
    if t!=s: open(path,"w",encoding="utf-8").write(t);n+=1;print("оновлено",path)
sub("game1.html",lambda s:re.sub(r'\?v=[0-9A-Za-z\-]+','?v='+v,re.sub(r'INK_BUILD="[^"]+"','INK_BUILD="'+v+'"',s)))
for p in glob.glob("*.js"):
    sub(p,lambda s:re.sub(r'(INKV\.\w+=)"[^"]+"',r'\1"'+v+'"',s))
sub("sw.js",lambda s:re.sub(r'const V="[^"]+"','const V="inkai-'+v+'"',s))
print("Готово. Версія",v,"| змінено файлів:",n)
