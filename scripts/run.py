import sys,csv,time,re,html,urllib.request,json,subprocess
def get(url):
    req=urllib.request.Request(url,headers={"User-Agent":"Mozilla/5.0"})
    return urllib.request.urlopen(req,timeout=30).read().decode("utf-8","replace")

print("[1/4] products.js を取得中...")
RAW="https://raw.githubusercontent.com/gagalife04291225-lab/kame-life-guide-/main/data/products.js"
src=get(RAW)
# node不要でPRODUCTS配列から必要フィールドを正規表現で抽出
# 各商品ブロック { ... } の中から id/category/tier/asin/affiliateUrl/name/priceRange/rakuten* を拾う
objs=re.findall(r"\{[^{}]*?id:\s*['\"][^'\"]+['\"][^{}]*?\}", src, re.S)
def field(block,key):
    m=re.search(key+r"\s*:\s*(?:'([^']*)'|\"([^\"]*)\"|(null))",block)
    if not m: return None
    if m.group(3)=="null": return None
    return m.group(1) if m.group(1) is not None else m.group(2)
prods=[]
for b in objs:
    pid=field(b,"id"); 
    if not pid: continue
    prods.append({
        "id":pid,"category":field(b,"category"),"tier":field(b,"tier"),
        "asin":field(b,"asin"),"affiliateUrl":field(b,"affiliateUrl"),
        "name":(field(b,"name") or "").replace("|","／"),
        "priceRange":field(b,"priceRange") or "",
        "rakutenUrl":field(b,"rakutenUrl"),"rakutenStatus":field(b,"rakutenStatus"),
        "rakutenSearchTerm":field(b,"rakutenSearchTerm") or "",
    })
PRIO={"enclosure":1,"filter":2,"lighting_uvb":3,"lighting_basking":4,"heating":5,"thermometer":6}
amz=[p for p in prods if p["asin"] and p["affiliateUrl"] and p["affiliateUrl"]!="#"]
amz.sort(key=lambda p:(PRIO.get(p["category"],9),p["category"] or "",p["id"]))
print("  ASIN保有商品:",len(amz),"件")

H={"User-Agent":"Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36","Accept-Language":"ja-JP,ja;q=0.9"}
DISC=["現在お取り扱いできません","入荷時期は未定です"]
def fetch(a):
    u="https://www.amazon.co.jp/dp/"+a
    try:
        req=urllib.request.Request(u,headers=H)
        b=urllib.request.urlopen(req,timeout=25).read().decode("utf-8","replace")
        s=200
    except urllib.error.HTTPError as e:
        return{"http":e.code,"title":"","sig":"HTTP_%d"%e.code,"url":u}
    except Exception as e:
        return{"http":"ERR","title":"","sig":"ERR:%s"%str(e)[:40],"url":u}
    if "ロボットではありません" in b or "captcha" in b.lower():
        return{"http":s,"title":"","sig":"BLOCKED","url":u}
    m=re.search(r'id="productTitle"[^>]*>(.*?)</span>',b,re.S)
    t=html.unescape(re.sub(r"\s+"," ",m.group(1))).strip()[:120] if m else ""
    if not t:
        m2=re.search(r"<title>(.*?)</title>",b,re.S)
        t=html.unescape(re.sub(r"\s+"," ",m2.group(1))).strip()[:120] if m2 else ""
    sg=[x for x in DISC if x in b]
    return{"http":s,"title":t,"sig":" | ".join(sg) or "OK","url":u}

print("[2/4] Amazon %d件を確認中（約%d分）..."%(len(amz),len(amz)*4//60+1))
with open("asin_checklist_result.csv","w",encoding="utf-8-sig",newline="") as f:
    w=csv.writer(f)
    w.writerow(["id","category","tier","asin","registered_name","priceRange","auto_http","auto_title","auto_signal","name_match","verdict","note","dp_url"])
    for i,p in enumerate(amz,1):
        print("  [%d/%d] %s %s"%(i,len(amz),p["asin"],p["name"][:22]),flush=True)
        r=fetch(p["asin"])
        toks=re.findall(r"[A-Za-z0-9]{3,}",p["name"])
        mt="U(blocked)" if r["sig"]=="BLOCKED" else ("Y?" if (r["title"] and any(x.lower() in r["title"].lower() for x in toks)) else "CHECK")
        w.writerow([p["id"],p["category"],p["tier"],p["asin"],p["name"],p["priceRange"],r["http"],r["title"],r["sig"],mt,"","",r["url"]])
        f.flush(); time.sleep(4)

rak=[p for p in prods if p["rakutenStatus"] in ("available","search")]
print("[3/4] 楽天 %d件を確認中..."%len(rak))
from urllib.parse import quote
def rget(u):
    req=urllib.request.Request(u,headers=H); return urllib.request.urlopen(req,timeout=25)
with open("rakuten_result.csv","w",encoding="utf-8-sig",newline="") as f:
    w=csv.writer(f); w.writerow(["id","category","status","term_or_url","http","result","final_or_url","note"])
    for i,p in enumerate(rak,1):
        st=p["rakutenStatus"]; print("  [%d/%d] %s (%s)"%(i,len(rak),p["id"],st),flush=True)
        try:
            if st=="available" and p["rakutenUrl"]:
                resp=rget(p["rakutenUrl"]); fn=resp.geturl()
                top=bool(re.fullmatch(r"https?://(www\.)?rakuten\.co\.jp/?",fn.strip()))
                w.writerow([p["id"],p["category"],st,p["rakutenUrl"][:55],resp.status,"TOP_FALLBACK!" if top else "ok",fn[:110],""])
            elif st=="search" and p["rakutenSearchTerm"]:
                u="https://search.rakuten.co.jp/search/mall/"+quote(p["rakutenSearchTerm"])+"/"
                b=rget(u).read().decode("utf-8","replace")
                zero="見つかりませんでした" in b or "該当する商品がございません" in b
                w.writerow([p["id"],p["category"],st,p["rakutenSearchTerm"],200,("0" if zero else ">0")+" hits",u,"ZERO_HITS" if zero else "ok"])
            else:
                w.writerow([p["id"],p["category"],st,"","-","no_target","","pending/none"])
        except Exception as e:
            w.writerow([p["id"],p["category"],st,"","ERR","err","",str(e)[:50]])
        f.flush(); time.sleep(3)

print("[4/4] 完了！ 結果ファイル: asin_checklist_result.csv / rakuten_result.csv")
for d in ["/data/data/com.termux/files/home/storage/downloads","/data/data/com.termux/files/home/storage/shared/Download"]:
    try:
        import shutil,os
        if os.path.isdir(d):
            shutil.copy("asin_checklist_result.csv",d); shutil.copy("rakuten_result.csv",d)
            print("  ダウンロードフォルダにもコピー:",d); break
    except: pass
