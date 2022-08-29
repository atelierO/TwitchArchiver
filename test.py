import re

a = "https://static-cdn.jtvnw.net/cf_vods/d3vd9lfkzbru3h/1e634d516645bd179dd5_oh__dawn_39613877463_1661687453//thumb/thumb0-%{width}x%{height}.jpg"
p = re.compile("%{width}x%{height}")
m = p.search(a)
print(m.start())
print(a[0:m.start()] + "1x1"+a[m.end():len(a)])
print()