"""Figma variables -> tokens.json + tokens.css.
Usage: python3 figma_to_tokens.py <folder with Figma variable JSON exports> <output folder>
Reads the collections "Primitive: Colors", "Semantic: Colors" and "Semantic: Size" (Desktop mode; Mobile differences go into usage notes).
Type styles are mapped by hand in C/UI lists below; input-height (44px) and Auto line heights come from the PDF styleguide."""
import json, re, sys
import glob, os
SRC=sys.argv[1]  # folder with Figma variable exports (one JSON per collection)
def coll(name):
    for f in glob.glob(os.path.join(SRC,'*.json')):
        d=json.load(open(f))
        if d.get('name')==name: return d
    sys.exit('Missing collection: '+name)
prim=coll('Primitive: Colors'); sem=coll('Semantic: Colors'); size=coll('Semantic: Size')
OUT=sys.argv[2]  # output folder for tokens.json + tokens.css

def slug(n):
    n=n.replace('%','-pct')
    n=re.sub(r'[^A-Za-z0-9]+','-',n).strip('-').lower()
    return n
def hexa(c):
    r,g,b,a=[c[k] for k in 'rgba']
    R,G,B=[round(x*255) for x in (r,g,b)]
    if a>=0.999: return '#%02x%02x%02x'%(R,G,B)
    return 'rgba(%d, %d, %d, %s)'%(R,G,B,('%.4f'%a).rstrip('0').rstrip('.'))

# primitive names
pname={}
for v in prim['variables']:
    n=v['name']
    if n.startswith('Primary/'):
        s='primary-'+slug(n.split('/',1)[1].replace('Primary',''))
    elif n.startswith('tints/'):
        s='tint-'+slug(n.split('/',1)[1]).replace('-pct','')
    elif n.startswith('Status/'):
        s='status-'+slug(n.split('/',1)[1])
    else:
        s=slug(n)
    if s=='status-alert': s='alert'
    pname[v['id']]=s
PUSE={
 'brand':'Varumärkesblå (Brand). Button/Brand, Surface/Brand, Stroke/Blue, Font/Brand, Icon/Brand. Vit text på brand 9.8:1.',
 'brand-tint':'Brand 5 %. Svag varumärkestonad yta.',
 'primary-dark':'Primary Dark. Text och ikoner med hög emfas, mörka ytor, Primary dark-knappen. 19:1 på white.',
 'primary-light':'Primary Light (vit). Sidor, kort, Secondary-knapp, vita konturer.',
 'primary-1000':'Primary 1000. Primary-knappens fyllnad och Stroke/Primary. Vit text 8.3:1.',
 'link':'Link. Länktext, länkikoner och fokus (Surface/Focus). 6.2:1 på white.',
 'link-hover':'Link-hover. Länk i hover, aktiv länkikon. 9.5:1 på white.',
 'alert':'Status/Alert. Feltext, felikon, felkontur, felyta. 7.3:1 på white. Para alltid med ikon eller text.',
 'tint-almost-hidden':'Nästan osynlig fyllnad (alfa 0.0001) för klickytor utan synlig bakgrund.',
}
ctoks=[]; seen=set()
order=['brand','brand-tint','primary-dark','primary-1000','primary-900','primary-800','primary-700','primary-600','primary-500','primary-400','primary-300','primary-200','primary-100','primary-050','primary-light','link','link-hover','alert']
pv={pname[v['id']]:v for v in prim['variables']}
names=order+[n for n in sorted(pv,key=lambda s:(s.split('-')[0]!='tint', s.startswith('tint-light'), float(re.sub(r'\D','',s) or 0))) if n not in order]
for n in names:
    v=pv[n]; val=hexa(list(v['valuesByMode'].values())[0])
    u=PUSE.get(n)
    if not u:
        if n.startswith('primary-'): u=f"Gråskala {n.split('-')[1]}. Ytor, knapptillstånd och avdelare. Primitiv – använd helst den semantiska token som pekar hit."
        elif n.startswith('tint-dark'): u=f"Primary Dark med {n.split('-')[-1]} % opacitet. Primitiv för överlägg, konturer och textemfas på ljus yta."
        elif n.startswith('tint-light'): u=f"Vit med {n.split('-')[-1]} % opacitet. Primitiv för överlägg, konturer och textemfas på mörk yta."
        elif n=='status-ed3b3f': u='Status-röd. Används inte av någon semantisk variabel i Figma.'
        elif n.startswith('status-'): u='Statusprimitiv. Använd via status-*-token.'
        else: u='Primitiv.'
    ctoks.append({'name':n,'value':val,'usage':u}); seen.add(n)

# semantic
sid={}
for v in sem['variables']:
    sid[v['id']]=slug(v['name'].replace('STATUS color','status'))
SUSE={'font':'Text','surface':'Yta','stroke':'Kontur','icon':'Ikon','button':'Knappfyllnad','focus':'Fokus/tillstånd','status':'Status'}
skip={'Toolbox/Depricated'}
flags={
 'Surface/Primary  900':'Obs: pekar på Primary 800 i Figma, inte Primary 900.',
 'STATUS color/Tint/Schedule':'Obs: pekar på samma ton som Tint/Done (#CCEBD4) i Figma; Status/D0EFF1 finns men används inte.',
}
TEXT={
 'font-high-emphasis-dark':'Primär text på white och ljusa ytor (19:1).',
 'font-medium-emphasis-dark':'Sekundär text, hjälptext, platshållare på white (≈7.1:1).',
 'font-disable-dark':'Inaktiv text på white. Når medvetet inte 4.5:1.',
 'font-high-emphasis-light':'Primär text på primary-dark, primary-1000 och brand.',
 'font-medium-emphasis-light':'Sekundär text på primary-dark.',
 'font-disable-light':'Inaktiv text på primary-dark. Når medvetet inte 4.5:1.',
 'font-brand':'Varumärkesfärgad text på white (9.8:1).',
 'font-alert':'Feltext på white (7.3:1).',
 'font-link':'Länktext på white (6.2:1).',
 'font-link-hover':'Länk i hover på white (9.5:1).',
 'focus-black-5-pct':'Hover-/fokusöverlägg på ljus yta.',
}
for v in sem['variables']:
    if v['name'] in skip: continue
    n=sid[v['id']]
    val=list(v['valuesByMode'].values())[0]
    if isinstance(val,dict) and val.get('type')=='VARIABLE_ALIAS':
        tgt=pname.get(val['id']) or sid.get(val['id'])
        value='{'+tgt+'}'
        an=list(v['resolvedValuesByMode'].values())[0]['aliasName']
    else:
        value=hexa(val); an=None
    cat=n.split('-')[0]
    u=TEXT.get(n) or f"{SUSE.get(cat,'Semantisk')}: {v['name']}" + (f" → {an}." if an else ".")
    if v['name'] in flags: u+=' '+flags[v['name']]
    if v['hiddenFromPublishing']: u+=' Dold från publicering i Figma.'
    assert n not in seen, n
    ctoks.append({'name':n,'value':value,'usage':u}); seen.add(n)

CAT=['font','icon','surface','button','stroke','focus','status']
prims=[t for t in ctoks if not t['value'].startswith('{') or False][:0]
np=len(names)
semt=ctoks[np:]
semt.sort(key=lambda t: CAT.index(t['name'].split('-')[0]) if t['name'].split('-')[0] in CAT else 99)
ctoks[np:]=semt
# accent kept per user decision
pass

# sizes
sp=[];rad=[];sz=[]
def m(v): return v['resolvedValuesByMode']['3102:1']['resolvedValue']
RU={'none':'Inga hörn.','subtile':'Subtil rundning.','secondary':'Mindre element, t.ex. checkbox.','primary':'Fält (44px), Mini- och Small-knappar.','heavy':'Default-, Large- och Xlarge-knappar, kort, dialoger.','strong':'Stora ytor.','rounded':'Piller och cirklar: chips, segmenterade knappar, runda ikonknappar.'}
for v in size['variables']:
    n=v['name']
    if n.startswith('typography/'): continue
    val=m(v); g,rest=n.split('/',1)
    if g=='gap':
        sp.append({'name':slug(rest),'value':f'{val}px','usage':f'Gap: {rest}.'})
    elif g=='Padding':
        sp.append({'name':slug(rest),'value':f'{val}px','usage':f'Padding: {rest}.'})
    elif g=='radius':
        k=slug(rest); rad.append({'name':'radius-'+k,'value':f'{val}px','usage':RU.get(k,'')+(' 999px i Figma.' if k=='rounded' else '')})
    elif g=='button':
        sz.append({'name':slug('button-'+rest.replace('button-','')),'value':f'{val}px','usage':f'Knapphöjd, {rest}.'})
    elif g=='icons':
        sz.append({'name':slug('icons-'+rest),'value':f'{val}px','usage':f'Ikonstorlek, {rest}.'})
    elif g=='stroke':
        sz.append({'name':'stroke-'+rest,'value':f'{val}px','usage':'Konturbredd.'+(' Fokusring.' if rest=='2' else '')})
    elif g=='Spalt':
        sz.append({'name':slug('spalt-'+rest.split()[0]),'value':f'{val}px','usage':f'Spaltbredd i {rest.lower()}-rutnät.'})
key=lambda t: float(t['value'][:-2])
sp.sort(key=lambda t:(not t['name'].startswith('spacing'),key(t)))
rad.sort(key=key)
sz.append({'name':'input-height','value':'44px','usage':'Höjd på textfält, datum, sök och select. Uppmätt i stilguiden, ingen variabel.'})

# typography
S={v['name']:(v['resolvedValuesByMode']['3102:1']['resolvedValue'],v['resolvedValuesByMode']['13119:4']['resolvedValue']) for v in size['variables']}
W={'Bold':(700,None),'Regular':(400,None),'Semi Bold':(600,None),'Semibold':(600,None),'Italic':(400,'italic'),'Bold Italic':(700,'italic'),'Medium':(500,None)}
def style(path,label,fs_style,fam='sans',autolh=1.21,extra=''):
    b='typography/'+path+'/'
    fs=S[b+'font-size']; lh=S.get(b+'line-height')
    w,it=W[fs_style]
    st={'name':slug(path.replace('legacy/','legacy-').replace('/','-')),'fontSize':f'{fs[0]}px','lineHeight':(f'{lh[0]}px' if lh else autolh),'fontWeight':w}
    if fam!='sans': st['family']=fam
    if it: st['fontStyle']=it
    u=f'{label}. {fs_style}.'
    if fs[0]!=fs[1]: u+=f' Mobil {fs[1]}px'+(f'/{lh[1]}px' if lh and lh[0]!=lh[1] else '')+'.'
    if not lh: u+=' Radhöjd Auto i Figma.'
    ps=S.get(b+'paragraph-spacing')
    if ps and ps[0]: u+=f' Styckeavstånd {ps[0]}px'+(f' (mobil {ps[1]}px)' if ps[1]!=ps[0] else '')+'.'
    st['usage']=(u+' '+extra).strip()
    return st
C=[('content/display','Content/Hero','Bold'),('content/heading-1','Content/H1 – Headline','Bold'),('content/heading-2','Content/H2 – Drophead','Regular'),('content/heading-2-strong','Content/H2 – Drophead alt','Bold'),('content/heading-3','Content/H3 – Leadin','Semi Bold'),('content/heading-4','Content/H4 – Subheadline','Semi Bold'),('content/heading-5','Content/H5 – Title','Bold'),('content/body','Content/Body','Regular'),('content/body-list','Content/Body – Punktlista','Regular'),('content/body-strong','Content/Body B','Bold'),('content/body-link','Content/Body Link, färg font-link','Bold'),('content/quote','Content/Quotation','Italic'),('content/image-caption','Content/Image text','Italic'),('content/caption','Content/Caption','Regular'),('content/caption-strong','Content/Caption Bold','Bold')]
UI=[('ui/label','Inputs & Buttons/Label','Semi Bold'),('ui/helper','Inputs & Buttons/Caption (hjälptext)','Regular'),('ui/input','Inputs & Buttons/Input text','Regular'),('ui/button/small','Inputs & Buttons/Small button','Semi Bold'),('ui/button/default','Inputs & Buttons/Default button','Bold'),('ui/button/large','Inputs & Buttons/Large button','Bold'),('ui/heading','Inputs & Buttons/Headline','Bold Italic'),('ui/breadcrumb','Breadcrumb','Medium')]
groups=[{'name':'Content','family':'sans','styles':[style(*c) for c in C]},
        {'name':'UI','family':'sans','styles':[style(*c) for c in UI]},
        {'name':'Documentation','family':'rounded','styles':[style('documentation/description','Documentation/Description','Semibold',fam='rounded',extra='Bara i dokumentationssidor.')]},
        {'name':'Legacy','family':'roboto','styles':[
            style('legacy/ui/label-xs','Legacy UI/Label XS','Bold',fam='roboto',autolh=1.17,extra='Legacy – använd inte i nytt.'),
            style('legacy/ui/input-large','Legacy UI/Input large','Regular',fam='roboto',autolh=1.17,extra='Legacy – använd inte i nytt.'),
            style('legacy/content/caption-link','Legacy Content/Caption link','Bold',fam='roboto',autolh=1.17,extra='Legacy – använd inte i nytt.'),
            style('legacy/content/body-link-small','Legacy Content/Body link small','Bold',fam='roboto',extra='Legacy – använd inte i nytt.')]}]
for g in groups:
    if g['family']!='sans':
        for s in g['styles']: s.pop('family',None)

out={'name':'Design System','version':2,
 'meta':{'source':'Figma-variabler: Primitive: Colors, Semantic: Colors, Semantic: Size, Primitives: Size, Primitives: Typography, Typography: Fonts, Customer brand specifics (export 2026-10-22). Radhöjder Auto och fälthöjd 44px från stilguide-PDF.'},
 'color':{'themes':[{'id':'light','name':'Light'}],'tokens':ctoks},
 'type':{'fonts':[],'families':{'sans':'"Inter", system-ui, sans-serif','rounded':'"SF Compact Rounded", ui-rounded, system-ui, sans-serif','roboto':'"Roboto", system-ui, sans-serif'},'groups':groups},
 'spacing':{'tokens':sp},'radius':{'tokens':rad},'size':{'tokens':sz}}
# uniqueness
alln=[t['name'] for f in ('color','spacing','radius','size') for t in out[f]['tokens']]
d=[x for x in alln if alln.count(x)>1]; assert not d, set(d)
for t in alln: assert re.match(r'^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$',t),t
names=set(t['name'] for t in ctoks)
for t in ctoks:
    if t['value'].startswith('{'): assert t['value'][1:-1] in names, t
json.dump(out,open(os.path.join(OUT,'tokens.json'),'w'),ensure_ascii=False,indent=1)
# tokens.css
t=out
L=['/* Design System — generated from tokens.json */']
def cv(x):
    val=x['value']; return f"var(--{val[1:-1]})" if isinstance(val,str) and val.startswith('{') else val
L.append(':root, [data-theme="light"] {'); L+=[f"  --{x['name']}: {cv(x)};" for x in t['color']['tokens']]; L.append('}')
L.append(':root {')
for f in ('spacing','radius','size'): L+=[f"  --{x['name']}: {x['value']};" for x in t[f]['tokens']]
for k,val in t['type']['families'].items(): L.append(f"  --font-{k}: {val};")
L.append('}')
for g in t['type']['groups']:
    for st in g['styles']:
        fam=st.get('family',g['family'])
        r=[f"font-family: var(--font-{fam})",f"font-size: {st['fontSize']}",f"line-height: {st['lineHeight']}",f"font-weight: {st['fontWeight']}"]
        if st.get('fontStyle'): r.append(f"font-style: {st['fontStyle']}")
        L.append(f".{st['name']} {{ "+'; '.join(r)+"; }")
open(os.path.join(OUT,'tokens.css'),'w').write('\n'.join(L)+'\n')
print(len(ctoks),'colors',len(sp),'spacing',len(rad),'radius',len(sz),'size',sum(len(g['styles']) for g in groups),'styles')
