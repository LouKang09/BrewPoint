import { useEffect, useMemo, useState } from "react";
import { Navigate, Link, Route, Routes, useNavigate } from "react-router-dom";
import {
  ArrowRight, BarChart3, Boxes, Building2, CalendarClock, Check, CircleDollarSign,
  Coffee, CreditCard, LayoutDashboard, LogOut, Minus, PackagePlus, Plus, ReceiptText,
  Search, ShieldCheck, ShoppingBag, Store, Tags, Trash2, Users, WalletCards
} from "lucide-react";

const ICON = "/brewpoint-icon.svg";
const LOGO = "data:image/webp;base64,UklGRvatAABXRUJQVlA4IOqtAAAwAwOdASqEA4QDPikUiEMhoSIkofHJAJAFCWduBuMnPDhTimhkq131llfyFvtpz4Xcitdu25nGUXdxj4oP6y+rR28IVPnef8H+2v9x/eHtjOQ/vH6X/sf7P/c1/Z/3nrn195hHkf6V/ov7j/nP+p/pP///8vuf/y/9h/iPe/+hP9j/lv3r+gL+O/0L/Wf3n/Qf9X/D//////V3+x/vl/cX/vftB8Bf6b/bv/F/h/9j////T9P3+h/539u/f/5M/2f/G/+T/K/9L5AP6p/fv+z+f/xs+xb/nP+//9fcH/pX+d/8/rlfuV+//0lf1D/a//L/af8////Q7/P/8L/4P2/////S+gD/ue13/AP+36gHoL+C//v/a+t/4X/u/4X8m/7v/7Pgn8S9m32H/s//X/33tn+6CJH8g+6P3n+5ftN/gf/l/yfbI8s+oB9BH4t/Lv7l/bf2f/u//h/3/PXbj/wP+p+YHwF+5f07/I/4b9sP7j6jf91+XXvN9n/8r+ZP+V+wD+ff0r+5f3L9tP77///+T+Hf8v/j+OV9//7f/H9wH+Xf1P/Mf2//O/tR9Mv85/y/8j/pv2p9xP5v/hf+J/mf9N/8P8z////p+hX8n/pv+l/vH+b/73+W////h+9n/6e679wfZF/Y3/1iRvPB0ezNenlZogXUWYlOPcka0xUFXat2UnppVuyk9M9W0Dt5bkmwIitmiOkgIA0FSvqeKPgN/aiPUfFjJlFgeoMmYjNXdkuqH0vBQ0y5Cq7Ci4dsC8OqN+peX8KoT/ubbLzFqg0RPilPrImsez9ynCdeiLv7mQHESGTcSS3qwSQZbZ5hSMj+iLaKlKYwctR+8sPoUGMeKpDqPcl7vI2k+CnTAXF3conTGRcwwEQgb9u8LjkGa5UIm8+ExC8XOLAufJPw29F7rZfDYOKGS7VlYX5oeteF8yDgm+stEvrgm5j6VziivCvnD8Z5hWO4jgjsclcelpPKHKRk6MHdXKfLFDVuYrHH8bHVdeM53+4bNtOwlT8nb/4c0k1MSgYn+lnJaOEXw+hrGA0GoHFjK9f6p4fi2JwFY9WG9OSA8JFyVkeVYgmsiXFEEnyaZNiwNiG85zWurZSNTZNxvuzMcSOlSkS6D8FAagAuEkWVwNQuC7nPrfFBmC5ciEFjAcn2hOmsqXE2w+zxbl0v6qPn/VYvAoUAHrfCY5dvSa23qheBdG742TsLD0izJu6IVIbHSbBl5uOqqzR/Dv4nNFAweFBG9owIo40KTo6oL1mTRJj9LTEqXqdxcUf+dcP0icuy7DqTFVrFla9MWTCZ3W/JBPfh9K/zejU7XQPEW2ovVaRIwtmTAW0XNtAMsi92UABz5cYHaa5JYJq2Ee0r4g8PFl6CwMF6VGJnqEVhyHgDUSrMcqtlWFwrejVQN+CjNaCqG/aLZL9xNqCi2viOOlPfjgA/BL13LemumJTGQjEqrw5pRLX9CZmuMl+P1EkHG3VHBk/fXDOi9glwO2k0Y3zqpVG0F+OZtQrjoQB9YMj6IdfPlOYS0fBMyhJxwLdc62oXelHT/xj/sznS6cSEMVtKVbifIw7a9Voh1QiDAAJCHPY0eDHmLqnbLn4AIULPp8jy3CRsCAyd+44A0WPKr5ztacRjZmNZvsIj6XDaQf/SE4iZH4Ji2oB5KdHogW4aryZOMbzrnPFARHNGmJr9TP/WsWZzQ8kTIQG6PBQ39OR8szJutwVYs6FQp1yrk+gEFG4H3pZJeIpo92EsU0bXuusUfH5Zbl8WqR8GC1vZheacrzQsOwiPlQ3ecB+77GB2bs8CfGFm80yja/vqRJpkCo7L27cnMiJr1yDBdJqwFgazDap5gti2CymRucnSD82mRmLGovA2IS9wuQHjJ1a7kVlJOXedfUOimqoZMFkBG0P1j5+xnTpus7PztvD14jEpkfj6QZtdvpFf+Ad93J99FGvGdq3nApHxBzn+zGnNeShcVxhQ5/Bln6rVmmwju7SS0XlxJbEs4xqY+IOsXQgVcbko/kdkism0kA6uorjgJO0ML1cZ6H/mxJifUqGtKcL0C7CdjT4+fG/mPGNZ3pJVNzxTLdswkDSzAJq1KsabH8kI9I4S+Jq+tEUSlgU1izV9pB7IIiG6wxHWuB+Wfz/Q8kr/5m1aJaTH0OuXc2A//Nv/bRagKV9kB6fCRUKF8NjY1Wv9ZLq1aGoiBKc+VgmTr67q+N/vHeKYDN3KZgVBMC1QQY+R4JeosqQvTi29WbAARkIA+P4PWo7Mq5FuhOocwga7ar97sF36W0FKKiRLtjoLqP/sNOp8t4gV5w5s618hoU/QIp5apoX8U/0CXe7LzcYrcd2nDIHq7kRG4d1xCpBsHSJB6J53c7TCaaQanz6O6x46VmfK3LNTakdzrs58yeAbnebGXmRUQTqFLCBMSrywFo9gRqHurXVA67sUk8Ixk6xVcdM+G2w4S6//92DcWk9D3e25A2btWv3FpTqrUHRWoh9FLhOQNsXO6asy1vX5a69qvyAr+AZz1Z8oFmn9Cv0VVE2Tj7FqckMf2hTK31qY8NwKLBQMlLT55sO1sNNQIaefGp6tztFqrAPuTB5vVC7Qs40PV1v8muEhCDkZvAcvdyXpAK4C0VfOVAXXSCN3lC4smAaYkEA3IOmT2m2Yjrz7M7aaoEg/3BccZxJKvnhm4wjGhKLcqsKzQ11MEYpdrDMbO0jXImc+M6jjoLgOIKibIk4xxvx2d2fJRcq+/zJqZYOiuUPFP+zSN3/kMX1l2cR/6UPdGbP9oqoJf0qxkwk8ny2HuuTl4Ekr89GHweLHI2ELF6304S+HUVZ7R+4r1w+TzREdhYWQzZLI9CkWuEdRfCwTZwEKTw8qI1/JtEzg1KPRCdaw7VlkiEn4WmOK3rHkMtZBsRSmHgESeT+K33ygFHakhUJjlXrz5fgAqwGwUVLAChevYdwfvqNZEA793rG49Y2CyL0R75nRrtg0teecvaYyOkiNQRDMTKzev0hTKaWl1dY0XQsFJJHckaAqYm2k1a5/mrmxkQDy56zXdrgpzfcTfrZL79C4EyH8pZG7rjTOPo4lLYjZQZdnVFJ3DyiunuNb8xqHhtIbQy61k0PGp+kvoFMatsbl7GHdEJv1JEjny+HBS7qWMmZaiQ1qbJ8xjFFr2fxPSSTuvLfjDWLpCYeBoUrH8zbMgwVKQIJjXq1qtPA2Q0eqYvA2aio200bYe+88nGaFJiCXBhG7YKEple/jwo8Yme2XyXHVK4AmXzpbNwMbCwf/6I4Ln6hQn6tvFUljoC2+/6evpZo0acnWb30XXSr/ryefnAoVpDeJpM/GCmBPSGtWG403QhtD4GADC0AJ504YYDWBadgzCE9Ec41xq59Yfd/qRLsnl4kV3my+R0au+2JweOYy9kjXe6xgCuwPy4I8HFC5A5I95KzOMtSgNGrKHctcgLHJyrjCGOAf9dRMa8+UKbnly7Rr37R2qPMXHHPq99RpumrYuZr1wAkhnloGLmP0W9jq2LcFoDeh0VOs+Ghy25nJJVCGw+4vWUdpnIwoujwE/1oePYMcpAoDX50odArUOY1e6SmpPyDjsTBsZfEwFu/Y4I4b26TKn0nt8eYsd+nh5RUNSSMipFhvJqW818EPQyHZsOwaIh3h9XpnqBrrWXEJvRBCbFZyOGTKAHjwQ7CjKxpfN+/OQ+svQz4z9uFl3oXBEBzFjOO/McTiS6EYz+0It6XrE4rRxUhRbz4BP3ROUL4ilKUFgDfBpdxDaOBqiJPjrfBgkL5sLVZ5b9V86Ts66t5LKVx81HKDC0QVmPdwj8mIvl84XdMhn32THl0RMtT42RNepaSiOtERQ9ZzQoUWCnxdT5hWaYe1Jnr9GdAIsh+Nf50lCuxxouVkSgkiUewbp+o1/D//xlViodcyRWZn7/C64+Uf1ot4xbKTyDsrpFYtMKZ0xaqrHpiERa8Bt5OyVsHTpg4TVV1iepDpBsozfFa/TKVcEctPJCJulKc5VcS7VTaB/FjOww3Nh9VPzhoHtC61tPMXTFCQatgA9KqvecRcE3IhsgR61ikoXZMrHxR8DCfqddldvXeLYIBzxIZ6XBCwOnta1tWqkfuH5DxTNw8cPGi7d8HspGx/4fPr/e6y2qxH6TbWpgb2ggPjZI2Gr8S2e8VjATv7EqEpuhzFF+gfztuv+EzIbiAVMJ/tOAQ4aT3ylYvBJ1z0jJodmbKQBqq5rJ/N40s1SKtEDN5isZQTY6AH+Hhgc9cNS2YPzVWwm6+FdJdVTKVbVaAt9EbaE3J7/RSWOyhaX5G27yMOtms+i4VedBcg27oVi8/IrzcoJsurFzV4pvJNiVTG8Vo+NRCfnJQcbcO9mv0fBLYdymzYluPFRsGPjvs7JK7wZ3k5XoPwf4wxKkQhZuCZlomKvqpuFAJ22mcQqeRzj+IxR5IRRcQEWop/mmup8T0Ckfh0I9VuOE5K6G2UxOKRr+o/357qQQAIA2SHCvQ5BpQIsxC57cvqtggelsnVlyO3e4eUOtGTlxhyuT6tJNO/pc8NgxrhFdEmUD5fTvyzQcsFDQG9Px6yVoocKWRldkVSMWy7hg7kcegJm36V9SnKT18VOIX0EI3Lltql0qVIf84AwPc1Skn8mk9SXLpaEQba0Ij45IbNs75L/dqZhsNjd8yNQJ4/iDkOXXhPqYCuWWTIGoe21LSBU8mxzkqaAwVZ6/X7GW9evtx2ILLspJ62IN4ML0wZbXwXk9EQHYa3dSgXuWgFI9iF2CMpuQCAeAuM1Y85KC7JlmrlhuKCDCVVU9Mv/BUG5Rf0nFTm32HYMKo/KRZaAjB93aSuK1OLUB0vAGSX5bzJijGxLJDqMuob0XB9R5QGLE3tkXowzpI6JyJ/bzmDKKd+jLRZeSRcrvsBb/QF8T1R3lkXskwCsjgwqNK8RwaYUR+5fbwG651M+m22SNo4y4ck5P8mLLPrn6uv9HDQ0cvTtYa87ZJ8CL2VoWCab2QQUzLm8av9trqguU2k7yekX0+smgRfwKQii1qvxiNLhMIIKKomMgqseVIP71DS+fJ8SmXEB6ui0qH4tm+pTCiL5VW50pA4v8UpSCcnK5zdvp5On9r62JVLWpmteF8lw3ssl3Zv/Od7HLl9AfH9ADnVdQWdAXJz+E3Mf9HCHFTOOP6k4XIudabltq3oX0a5Zt4ketyy4zn1rd/b4gfMGzQRSsvL6dDd0DD0D6WqL/wKU75AdrYPLLGYiPhfj11i1Aa0Rcvvastgon4/b4tcL5D/qx+T/MTQ+JTCn+92CbH6APatboP4eponXgQPKMrThXeT8H1VUyR50gHqF5CGwT9DzMEYNBZIWMuH4k3N2IPv3P6nalc8Z/iLSmCOti5cOVteigCXPJYmYbRx58OtpLneErYcLbTdRDCoG17NU1m1UFwEayEH89jRSMM4teEGZKIa/S3HyE4Mc/tsEgAPVNtsGagiZqH+SmpLEc4jbKgvpnDqfk2zB9HuQvMAzE9bx/H33/s2FTInQoMAvbBu1wg4keJvSQj58qqMSDdJftfbTr0/8iwv2iMe3slKwbuJIBWfZz1t8pA83ke/YMwsksdYaj+uZv3miebCYCXkxKDVF4uP/kb1zLKjbYgKxouz8460QBSIJwR7/V5XcsDwt37vS+VmV9lR4v7uhpB3DZZ3oFCzUSvYUuVnIPI3PZZDRzcjGIe9aS8LEAdkaGI7/X7/eJqigCMo7hhSt3kFcEJakCVhVON7DwhSU9goQ/5hGlW9xKP8sN91jU7SJRMj/VK6O6Xxx0+lVezT+xs1dQwQ0VH/0M2htGtUUBt16Rg1ym15w+E+DC45DhC33AWJcfXFkJtpodhZDOM83ztRyKRVZntVKgdm1ptYHBxCfk+tvO4wzAxtfeI2cwUvLiIaybuhQX2dVqFMm1wO01LQV7Y+Pp2ZxETNBi+zu5DyewPrg7C2udPkaBtmY9d+lj0SAxdy3HQYlz3bxVaaDi5MAIQLUXCJp1tz57j86MFmaO4qJFcIV8tw4j4sQfcJ7OJJBaEqO68Xp4OIS5m86spzTZJYbONSqk4u+kgIYBpsZCT7f0oc/J35GNbnlJEd/m4HXWhZjnf+yqSTf5sUA1usEx6ZM4EiEglLu9wtVYZEMNQkUiggyq9K/5qu48+boDgkt/uLcfGO15E/CRoQ5iiBthREiVmvJDauo3OPRjH0qWyFurMzrQ27p1/qGFROYp8O3zbz/kU/YixLv0D5Pnn6b7A9J1NghndO7Lb+RWucAg6ahMzle9rNqmzsfV7rSm93gxhygp+70wUZqvkPlpPhNfsdaIx3+eZD4NDA3Zq9x2do/syWfC00TJjePsBDn36Wq/ZdNjW3c60UYaXkXH8yMW7LXBALvfeiWKYpQplJ1TGABtR38IprADVQ5oqMdwFqDEMv94Ko72GgwVLbHhwFpstSMuvDHkWeremFMbxtvtsPxoASJUSHW4bLHFZpkGM+QZ1ITH3mRCAZ95ZEeHZMoJPiymiPF7wDN6VUMdSzh5kmNCENozKx+qqqFrQjV/K9imHl8sLJIhfS88uzkQNTKp3T5yCObQxeCxu7rBFjTLc3aqO4fHeFNWX5Bvf7vTc+keXt9u8t1HYj9jEDwGXhDnhXcq+yPcy2LeNWHSptmdBLCG4sAYpfD3xgyKcUEeXY3Qf/Pj+GIRQW10rtfu/8EH6+n7F2emHHT1jH3Y2cKQXEAEbK3bmwQRZVJVoDqpHO2hBFw2lrTP1dCwRWNW/c1WCAeMaafTuDl1/sIjvi3VdZjohq8oCbPzVmUe2iyG7VbC+sWlpNGcfkyYyaiIYect7z1p6xs+OSN0Y1SRoH6EBuwKuJ3660XAdBFWrR2e7oXpniM+XtXLdtIZMcsX3Pftb1va0GINTQatVA0F1/kOiIVGlDJvOp5ryw/iAOEzWCy10bBUkXsyVHPmV1fz511VYjXyj2v8XK9/1yYjXnjL3NcE/m2o2woR6P4IcGhIiMsaPzk+p2lMymREeuwDGuEhGYlGOxJ6YNevHKdcGczcPzTx1EL+wl5sDxDSRgLm10bpcVPflW1ZSFEqULHYW5+wDnLa0n5nTOpPLXaGbTKHHMBa68MojifbWY/YMsD4vsiiK6s+BgDIFPJwoE6t8VPKEWIbfi2U7Sto2jWvzAmf34pCNfXTLxMJpaGD7GOkOPdvG0rge7iMP16VhOdfOoUDmJGiPfPupWKBgtApzRGAjTLvwXprm7fN+BRzU6K3v29VAQVT0An1sC3kFgp7YaIewRqBPnvnmE641qBt/AcFsL/XcQNgQW4SGfiMHbENnHJ10jQTWruwOZ4L2Ao52wdQ6Bb/PS8KhpaLTxr4SOkSHmSl3YwgsX+rS0Uws4DzjFkGCYsOo0Y+sqW2vQVEDGkBz5IIOP/5OiVT3gdgg1B/iiKtlJaEk/6EV+h5RTaBKKW+BTVo1PzOkkVIKicstguXaox3e0hTKZIYJcL5K0wyQ5ehQRH92bcp0ISP5/ModoJRpQq/FECUsqlSqUlUqH4D6VeU5oHnDnz3zkpTLkBT5UnYuziizT+oYuK8p2KptV0g6ckujriOEvq8aYJ5oV+TVxYfDeG5paPZeoHEAb2h4KAs3qYTMVwVZKUwQjoP91nEECFHVEUJJibdRVZ8/GgXPNqdW0ciU3BXWdEtzmYmZePVyoSy8R/Vx9tpCISCSKhlV1taXPCkncD8BHpkEp2296HM/iw1o5HUVrLHV8y5xG9dtF8KHqcVKstfV5uzTX3+YsZ8ooQrRJffOWRdEfHWKNKtj0pauAPaFo3YLpxEqEwOEn1Qhk8EoBgNRGOBmWDlyu5+RHdb5SFUtowrrFweH0CEjOtDSDixl3grYf7A69Ju1BwGlVze9x+c3gPPviWlgCvH0o2pfN7RKY3HM4aPPDbrjp0PhcKpBuhHKWqsrxTBfbKP4QI65X3aJUbZvGr/G2TKjs/KNL5fDdxtA+ZQ7kdjHIsWivP4t7TKhBNt/9bF9G57hf29ZfHQf6Jm/1vORuhF+BdryDs7OhH7O73wFmT3/1oLDneTAkM9cixrKC9EicBnEKsBkBImWY9zKvh91nRkfnZ8T4BSZ01gdi/sb1zwSRMU0Ad7+hxDhZtrnZtlNxkf8bB/SYTeJIZRki54+Jyk/KIxY/985wIO0KZK7pIOjqZ2y0f9UYnVhCxnfz5ewiB7eNZjCgX7hKgvgwf/JA6k+AfU8Vpw6MezgGBwl+kV1f2+8kUCZzip2CQ0AAAP787NtKtj/nQfhj5D/Tf+HUyt3yowE0HOXvF0qpScweD/4L7KSCxzmCjlk/ebs5XdTDXvlaDZ19fAG5tCMdCjNcY56NEyEK4NJJLQeNZMBdAutZyXSwMJlKMrFh74Muh1+5B08WIThoKUI897SwQ2EjL00AAAU64wqIqhtoaSnQnuc+GD0w91Bv4OJFPMNw/11pVN/sXL/CW6In0CBQ/2i40FP4IyT63GClcmpAVawv0RQyct9k74DRaGyX/SKTs9Gs/dbJAA/0zGKkphMCuINAFn0kqaskMDbUf0wNITXtae8Q8meCf4d/TNIFDCY2w1JR/p5hAmtyWReVeQ4TF01VvVJUdsQPMEwCAAAdJorspZAsThph0c3oCHDPixC2XUIBeqKWU4CMFxRbzTRv0/LnI8QFZnQjzc+/xMgQMSjA7aciO3vp/jEGrejd6Gl8fheG2rtUIEQWL2gR2GyBUl0x6Q490h0pzV7h2UyaBSGd3dGK+r3I3LKCiJjGS1dYuXmlh2Ec32zOeixjmoQddU9tnWg63BhxOEkYLGdKBk72RnxcpCXOwECZmtuuKW57FLO6aCAoMSee6AbsR2JyOveUs6OjvbPf1P6AlmxJ/yJXIbk04ULXCnpILTq5KTPRQEJnku6VvV6b/uG5SRqoTCMmzj8t1zB676YK6ZK06eT5t9dQGGVM9FDl15OtAhgzuaOEpllf3EibFa9/Et+J/J7A9l1MrtkYMwAGqm/hgXofdJF5+ZEuOXg7Q5P1ronZhCetWidXBJW0pHTaxv8MQFupDZwJ8VUj1pgvA93EB82W6CkYf4krPCTwGipmhrGY3Q/9FaGURQO+wqsDpVniVHQgy36hnQw2syNJTlxgpeFNfREgjU/vPzF050EJ/CwCHgCsndbphbzP6Y0qOm7MmRZByQIFdQSOIOzJkgTapt0o0DPyvRMDzxIns3xKTWj9eGC76C0Knu0jImezpvDEUJLEmcQAWXWbsby66NuzrEjlNWNf4G5ErBCSRBVShf6AGP7uQY6GCrw/UuiAdwVbQSShMN4WFNWPd6krhF8cSZkRBJilDGg8BqbP+Rt8ErBZasWwh+4b9OBprXEVX++wiy5q7NT+QmB2CmxGZ7gW6gDiFg0o1u2NLHvIXtSjuuANQT5gXwt6ISSnJF17zCQvXC9buo2e+q5tDgwk4aDSYNS1IbqnOcjZoIuEY+Z3Wn3YWmWfw4v8YgDFgVkjkQgV/C+e4rNDPujnz3hce9YlUZqclocauKnV8H9bS8JXU+Lgn4HtMPdgZ919DWbO7Y6RvmkgvHtX4QTsGdLXZSZEbNRLjrhh3kbsHNAMvnU2IbLjxWiRadzhVyGRgc9i0litC3XDOWelBpj6bdXngpPEqJsruHUzcOA80BQmV74wYOotoDpOMXIYJavo0HzMQmsjBb2KHfpgUWDc+mn689rXOwBmaddl5ouTZXlnKaZyrwQkg6cIhpJJnvvwMPqmYuFFugW20ZIBbMcnDmEjeBndcC0hKqcanrBfZVTQ8pKIShGxOTwBko0eL2lRtDZ5qIGhVZh/7rwLiVEumqGstZskX8kX4+yTGuGGM8Nw2qeGZ2TSmsEmg6BK5K1+agQXuX7krXZDWu1YHUXlait8GogsebLxGwXOXvbfeyzyE94dfWLtD04Bk9dsrryyz+LIW3fELzwfpxHJm7TsV+lB06qUsv3kc27cEwLJHamGU79x9FMmvWoEEjedDqOigXkRy1oAAA==";

const plans = {
  starter: { name:"Starter", price:799, branches:1, staff:3, features:["1 branch","3 staff accounts","POS + Cash/GCash","Products & recipes","Ingredient deduction","Inventory alerts","Basic costing","Daily/weekly/monthly reports","Customers & basic promos"] },
  pro: { name:"Pro", price:1199, branches:3, staff:10, features:["Everything in Starter","Up to 3 branches","10 staff accounts","Role permissions","Inventory transfers workflow","Suppliers & stock history","Unlimited promos/packages","Expenses & profit reporting","Daily to yearly reporting","CSV export","Branch comparison-ready data"] },
  business: { name:"Business", price:1999, branches:10, staff:25, features:["Everything in Pro","Up to 10 branches","25 staff accounts","Company dashboard","Central inventory oversight","Advanced permissions","Full audit trail","Multi-branch pricing controls","Priority onboarding","Priority support","Early integration access"] }
};

const money = value => "₱" + Number(value || 0).toLocaleString("en-PH",{minimumFractionDigits:2,maximumFractionDigits:2});
const dateTime = value => value ? new Intl.DateTimeFormat("en-PH",{dateStyle:"medium",timeStyle:"short",timeZone:"Asia/Manila"}).format(new Date(value)) : "—";

async function api(path, options={}) {
  const response = await fetch("/api"+path,{
    credentials:"include",
    headers:{"Content-Type":"application/json",...(options.headers||{})},
    ...options,
    body: options.body && typeof options.body !== "string" ? JSON.stringify(options.body) : options.body
  });
  const data = await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

function Toast({toast,onClear}) {
  useEffect(()=>{ if(toast){ const t=setTimeout(onClear,3200); return()=>clearTimeout(t); } },[toast,onClear]);
  if(!toast)return null;
  return <div className={"toast "+(toast.type||"")}>{toast.message}</div>;
}

function Brand({compact=false}) {
  return <Link to="/" className={"brand "+(compact?"compact":"")}><img src={ICON} alt="BrewPoint"/><span><b>BrewPoint</b>{!compact&&<small>BREW IDEAS. DRIVE GROWTH.</small>}</span></Link>;
}

function Landing() {
  return <div className="marketing">
    <header className="nav"><Brand compact/><nav><a href="#features">Features</a><a href="#pricing">Pricing</a><Link to="/login">Sign in</Link><Link className="btn primary small" to="/signup">Start 30 days free</Link></nav></header>
    <section className="hero">
      <div className="hero-copy">
        <span className="pill">30-day free trial · built for coffee businesses</span>
        <h1>Your coffee shop.<br/><em>Your POS.</em><br/>Your growth.</h1>
        <p>BrewPoint combines fast checkout with recipes, ingredient inventory, costing, expenses, staff, branches, reports, customers, promos, and subscription management—all in one cloud workspace.</p>
        <div className="hero-actions"><Link className="btn primary" to="/signup">Start free trial <ArrowRight size={17}/></Link><Link className="btn secondary" to="/login">Open BrewPoint</Link></div>
        <div className="checks"><span><Check size={14}/>30 days free</span><span><Check size={14}/>No setup fee</span><span><Check size={14}/>Cash & GCash</span></div>
      </div>
      <div className="hero-art"><img src={LOGO} alt="BrewPoint"/><div className="hero-card"><Coffee/><div><b>Built around café operations</b><span>Recipe costing + automatic ingredient deduction</span></div></div></div>
    </section>
    <section className="stat-strip"><div><strong>30 days</strong><span>Free trial</span></div><div><strong>3 plans</strong><span>Starter · Pro · Business</span></div><div><strong>24/7</strong><span>Cloud back office</span></div><div><strong>1 system</strong><span>POS to landlord console</span></div></section>
    <section id="features" className="section"><div className="section-title"><span className="eyebrow">COFFEE-FIRST OPERATIONS</span><h2>More than a cashier screen.</h2><p>BrewPoint turns the strongest ideas from a spreadsheet-based coffee POS into a proper multi-tenant web platform.</p></div>
      <div className="feature-grid">
        {[
          [ShoppingBag,"Fast POS","Categories, cart, Cash and GCash checkout with transaction references."],
          [Boxes,"Recipe inventory","Ingredients deduct automatically from recipe quantities after every completed sale."],
          [CircleDollarSign,"Costing & profit","Recipe cost, inventory value, expenses, COGS estimates, and profit views."],
          [Tags,"Customers & promos","Customer records plus set-price, fixed-discount, and percentage promos."],
          [Users,"Staff & branches","Role-based accounts and plan-based branch/staff limits."],
          [BarChart3,"Reports & audit","Daily to yearly reporting, transaction logs, voids, CSV export, and audit history."]
        ].map(([Icon,title,text])=><article key={title}><span className="feature-icon"><Icon/></span><h3>{title}</h3><p>{text}</p></article>)}
      </div>
    </section>
    <section id="pricing" className="section pricing"><div className="section-title"><span className="eyebrow">LAUNCH PRICING</span><h2>Start small. Upgrade when the café grows.</h2><p>Every plan starts with a 30-day free trial.</p></div>
      <div className="plan-grid">{Object.entries(plans).map(([key,plan])=><article className={"pricing-card "+(key==="pro"?"popular":"")} key={key}>{key==="pro"&&<span className="popular-label">MOST POPULAR</span>}<h3>{plan.name}</h3><div className="price">{money(plan.price)}<small>/month</small></div><p>{plan.branches} branch{plan.branches>1?"es":""} · {plan.staff} staff accounts</p><ul>{plan.features.map(f=><li key={f}><Check size={14}/>{f}</li>)}</ul><Link className="btn primary wide" to="/signup">Try {plan.name} free</Link></article>)}</div>
    </section>
    <footer><Brand compact/><span>© 2026 BrewPoint. Brew Ideas. Drive Growth.</span></footer>
  </div>;
}

function AuthPage({mode}) {
  const nav=useNavigate();
  const [form,setForm]=useState({displayName:"",email:"",password:"",accessCode:""});
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const submit=async e=>{
    e.preventDefault();setError("");setLoading(true);
    try{
      await api(mode==="signup"?"/auth/register":"/auth/login",{method:"POST",body:form});
      nav("/app");
    }catch(err){setError(err.message);}finally{setLoading(false);}
  };
  return <div className="auth-page">
    <aside className="auth-side"><img className="auth-official-logo" src={LOGO} alt="BrewPoint"/><h1>{mode==="signup"?"Build a calmer back office for your café.":"Welcome back to BrewPoint."}</h1><p>Sales, recipes, inventory, expenses, customers, staff, branches, and reporting in one workspace.</p><div className="auth-benefits"><span><Check/>30-day trial</span><span><Check/>Private tenant workspace</span><span><Check/>No real payment in testing mode</span></div></aside>
    <main className="auth-main"><form className="auth-card" onSubmit={submit}><span className="pill">{mode==="signup"?"START FREE":"SIGN IN"}</span><h2>{mode==="signup"?"Create your BrewPoint account":"Open your workspace"}</h2>
      {mode==="signup"&&<label>Full name<input value={form.displayName} onChange={e=>setForm({...form,displayName:e.target.value})} placeholder="Your name" required/></label>}
      {mode==="signup"&&<label>Beta access code<input value={form.accessCode} onChange={e=>setForm({...form,accessCode:e.target.value})} placeholder="Private test access code" required/></label>}
      <label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@coffee.com" required/></label>
      <label>Password<input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="At least 8 characters" minLength="8" required/></label>
      {error&&<div className="form-error">{error}</div>}
      <button className="btn primary wide" disabled={loading}>{loading?"Please wait…":mode==="signup"?"Create account":"Sign in"}</button>
      <p className="auth-switch">{mode==="signup"?<>Already have an account? <Link to="/login">Sign in</Link></>:<>New to BrewPoint? <Link to="/signup">Start free</Link></>}</p>
    </form></main>
  </div>;
}

function Loading({text="Loading BrewPoint…"}) { return <div className="loading"><img src={ICON}/><b>{text}</b></div>; }

function StoreSetup({onDone}) {
  const [name,setName]=useState("");
  const [plan,setPlan]=useState("pro");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const submit=async e=>{
    e.preventDefault();setLoading(true);setError("");
    try{await api("/business/setup",{method:"POST",body:{businessName:name,plan}});onDone();}
    catch(err){setError(err.message);}finally{setLoading(false);}
  };
  return <div className="setup-page"><div className="setup-logo"><img src={LOGO}/><h1>Open your coffee shop workspace.</h1><p>We’ll seed sample coffee products, ingredients, recipes, a main branch, and the 143 Promo so you can test immediately.</p></div><form className="setup-card" onSubmit={submit}><span className="pill">30-DAY FREE TRIAL</span><h2>Create your store</h2><label>Business name<input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Daily Grind Coffee" required/></label><label>Trial plan<select value={plan} onChange={e=>setPlan(e.target.value)}>{Object.entries(plans).map(([key,p])=><option key={key} value={key}>{p.name} · {money(p.price)}/mo after trial</option>)}</select></label>{error&&<div className="form-error">{error}</div>}<button className="btn primary wide" disabled={loading}>{loading?"Creating…":"Start 30-day trial"}</button><small>No real payment is collected in this testing build.</small></form></div>;
}

const sections = [
  ["dashboard","Dashboard",LayoutDashboard],["pos","Point of Sale",ShoppingBag],["inventory","Inventory",Boxes],
  ["products","Products & Recipes",PackagePlus],["customers","Customers & Promos",Tags],["expenses","Expenses",WalletCards],
  ["reports","Reports",BarChart3],["team","Team & Branches",Users],["billing","Plan & Billing",CreditCard]
];

function AppShell() {
  const nav=useNavigate();
  const [me,setMe]=useState(null);
  const [workspace,setWorkspace]=useState(null);
  const [section,setSection]=useState("dashboard");
  const [toast,setToast]=useState(null);
  const [loading,setLoading]=useState(true);

  const notify=(message,type="")=>setToast({message,type});
  const load=async()=>{
    try{
      const meData=await api("/me");
      setMe(meData);
      if(meData.business){
        const ws=await api("/workspace");
        setWorkspace(ws);
      }else setWorkspace(null);
    }catch(err){
      if(err.message.includes("sign")||err.message.includes("session")) nav("/login");
      else notify(err.message,"error");
    }finally{setLoading(false);}
  };
  useEffect(()=>{load();},[]);
  const logout=async()=>{await api("/auth/logout",{method:"POST"});nav("/login");};

  if(loading)return <Loading/>;
  if(!me)return <Navigate to="/login"/>;
  if(!me.business)return <><StoreSetup onDone={load}/><Toast toast={toast} onClear={()=>setToast(null)}/></>;

  const business=workspace?.business || me.business;
  if(!workspace)return <Loading text="Opening your store…"/>;
  const active=sections.find(s=>s[0]===section);
  return <div className="app-shell">
    <aside className="sidebar">
      <button className="side-brand" onClick={()=>setSection("dashboard")}><img src={ICON}/><span><b>BrewPoint</b><small>COFFEE POS</small></span></button>
      <div className="tenant"><small>WORKSPACE</small><b><Store size={15}/>{business.name}</b><span>{workspace.branches?.[0]?.name||"Main Branch"}</span></div>
      <nav>{sections.map(([id,label,Icon])=><button key={id} className={section===id?"active":""} onClick={()=>setSection(id)}><Icon size={17}/>{label}</button>)}</nav>
      <div className="side-bottom"><div className="user-mini"><span>{me.user.displayName.slice(0,2).toUpperCase()}</span><div><b>{me.user.displayName}</b><small>{business.memberRole} · {plans[business.plan]?.name}</small></div></div><button className="logout" onClick={logout}><LogOut size={14}/>Sign out</button></div>
    </aside>
    <main className="workspace">
      <header className="workspace-head"><div><h1>{active?.[1]}</h1><p>{business.name}</p></div><span className={"status "+business.subscriptionStatus}>{business.subscriptionStatus==="trialing"?"Trial · "+workspace.summary.trialDaysLeft+" days left":business.subscriptionStatus}</span></header>
      <div className="workspace-body">
        {section==="dashboard"&&<Dashboard ws={workspace} go={setSection}/>}
        {section==="pos"&&<POS ws={workspace} reload={load} notify={notify}/>}
        {section==="inventory"&&<Inventory ws={workspace} reload={load} notify={notify}/>}
        {section==="products"&&<Products ws={workspace} reload={load} notify={notify}/>}
        {section==="customers"&&<CustomersPromos ws={workspace} reload={load} notify={notify}/>}
        {section==="expenses"&&<Expenses ws={workspace} reload={load} notify={notify}/>}
        {section==="reports"&&<Reports ws={workspace} reload={load} notify={notify}/>}
        {section==="team"&&<Team ws={workspace} reload={load} notify={notify}/>}
        {section==="billing"&&<Billing ws={workspace} reload={load} notify={notify}/>}
      </div>
      <Toast toast={toast} onClear={()=>setToast(null)}/>
    </main>
  </div>;
}

function Metric({label,value,sub}) { return <article className="metric"><span>{label}</span><strong>{value}</strong><small>{sub}</small></article>; }
function Panel({title,sub,children,className=""}) { return <article className={"panel "+className}><header><div><h3>{title}</h3>{sub&&<p>{sub}</p>}</div></header>{children}</article>; }
function Empty({Icon=ReceiptText,text}) { return <div className="empty"><Icon/><span>{text}</span></div>; }

function SalesTrendChart({rows,metric,type}) {
  if(!rows?.length)return <div className="chart-empty">No sales data for this filter yet.</div>;
  const width=1000,height=300,padX=46,padY=24;
  const values=rows.map(r=>Number(r[metric]||0));
  const max=Math.max(...values,1);
  const step=rows.length>1?(width-padX*2)/(rows.length-1):0;
  const points=rows.map((r,i)=>({x:padX+i*step,y:height-padY-(Number(r[metric]||0)/max)*(height-padY*2),value:Number(r[metric]||0),date:r.date}));
  const line=points.map((p,i)=>(i?"L":"M")+p.x.toFixed(1)+" "+p.y.toFixed(1)).join(" ");
  const area=line+" L "+points[points.length-1].x+" "+(height-padY)+" L "+points[0].x+" "+(height-padY)+" Z";
  const labelEvery=Math.max(1,Math.ceil(rows.length/8));
  return <div className="sales-chart"><svg viewBox={"0 0 "+width+" "+height} role="img" aria-label="Sales trend">
    {[0,.25,.5,.75,1].map((n,i)=>{const y=height-padY-n*(height-padY*2);return <g key={i}><line x1={padX} y1={y} x2={width-padX} y2={y} className="chart-grid"/><text x={6} y={y+4} className="chart-y">{money(max*n)}</text></g>})}
    {type==="bars"?points.map((p,i)=>{const barW=Math.max(5,Math.min(40,(width-padX*2)/Math.max(rows.length,1)*.55));return <rect key={p.date} x={p.x-barW/2} y={p.y} width={barW} height={height-padY-p.y} rx="4" className="chart-bar"/>}):<><path d={area} className="chart-area"/><path d={line} className="chart-line"/>{points.map(p=><circle key={p.date} cx={p.x} cy={p.y} r="4" className="chart-dot"/>)}</>}
    {points.map((p,i)=>i%labelEvery===0||i===points.length-1?<text key={p.date} x={p.x} y={height-5} textAnchor="middle" className="chart-x">{p.date.slice(5)}</text>:null)}
  </svg></div>;
}

function Dashboard({ws,go}) {
  const today=useMemo(()=>new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Manila",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date()),[]);
  const [preset,setPreset]=useState("month");
  const [start,setStart]=useState(today.slice(0,7)+"-01");
  const [end,setEnd]=useState(today);
  const [branchId,setBranchId]=useState("");
  const [employeeId,setEmployeeId]=useState("");
  const [metric,setMetric]=useState("grossSales");
  const [chartType,setChartType]=useState("area");
  const [report,setReport]=useState(null);
  const [loading,setLoading]=useState(true);
  const applyPreset=value=>{
    setPreset(value);
    const now=new Date();
    const fmt=d=>new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Manila",year:"numeric",month:"2-digit",day:"2-digit"}).format(d);
    if(value==="today"){setStart(today);setEnd(today);}
    if(value==="month"){setStart(today.slice(0,7)+"-01");setEnd(today);}
    if(value==="7d"){const d=new Date(now);d.setDate(d.getDate()-6);setStart(fmt(d));setEnd(today);}
    if(value==="30d"){const d=new Date(now);d.setDate(d.getDate()-29);setStart(fmt(d));setEnd(today);}
  };
  useEffect(()=>{
    let live=true;setLoading(true);
    const q=new URLSearchParams({start,end});
    if(branchId)q.set("branchId",branchId);
    if(employeeId)q.set("employeeId",employeeId);
    api("/reports?"+q.toString()).then(r=>{if(live)setReport(r)}).catch(()=>{if(live)setReport(null)}).finally(()=>{if(live)setLoading(false)});
    return()=>{live=false};
  },[start,end,branchId,employeeId,ws.sales.length]);
  const metrics=[
    ["grossSales","Gross sales"],["refunds","Refunds / voids"],["discounts","Discounts"],["netSales","Net sales"],["grossProfit","Gross profit"]
  ];
  const exportCsv=()=>{
    if(!report)return;
    const rows=[["Date","Gross sales","Refunds / voids","Discounts","Net sales","Cost of goods","Gross profit"],...report.breakdown.map(r=>[r.date,r.grossSales,r.refunds,r.discounts,r.netSales,r.cogs,r.grossProfit])];
    const csv=rows.map(r=>r.map(c=>'"'+String(c??"").replaceAll('"','""')+'"').join(",")).join("\n");
    const url=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));const el=document.createElement("a");el.href=url;el.download="BrewPoint-sales-summary-"+start+"-to-"+end+".csv";el.click();URL.revokeObjectURL(url);
  };
  return <div className="sales-summary-page">
    <section className="sales-filter-bar">
      <div className="sales-filter-title"><h2>Sales summary</h2><p>Back-office analytics across your selected period, store, and employee.</p></div>
      <div className="sales-filters">
        <select value={preset} onChange={e=>applyPreset(e.target.value)}><option value="today">Today</option><option value="7d">Last 7 days</option><option value="month">This month</option><option value="30d">Last 30 days</option><option value="custom">Custom</option></select>
        <input type="date" value={start} onChange={e=>{setPreset("custom");setStart(e.target.value)}}/>
        <span className="filter-to">to</span>
        <input type="date" value={end} onChange={e=>{setPreset("custom");setEnd(e.target.value)}}/>
        <select value={branchId} onChange={e=>setBranchId(e.target.value)}><option value="">All stores</option>{ws.branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select>
        <select value={employeeId} onChange={e=>setEmployeeId(e.target.value)}><option value="">All employees</option>{ws.members.filter(m=>m.is_active).map(m=><option key={m.user_id} value={m.user_id}>{m.display_name}</option>)}</select>
        <button className="btn primary" onClick={()=>go("pos")}><ShoppingBag size={15}/>New sale</button>
      </div>
    </section>
    {loading||!report?<div className="dashboard-loading">Building sales summary…</div>:<>
      <section className="sales-kpis">{metrics.map(([key,label])=>{const c=report.comparisons?.[key]||{delta:0,pct:0};return <button key={key} className={"sales-kpi "+(metric===key?"active":"")} onClick={()=>setMetric(key)}><span>{label}</span><strong>{money(report[key])}</strong><small className={c.delta>0?"up":c.delta<0?"down":""}>{c.delta>=0?"+":""}{money(c.delta)} ({c.pct>=0?"+":""}{Number(c.pct).toFixed(1)}%)</small></button>})}</section>
      <section className="sales-chart-card">
        <div className="chart-head"><div><h3>{metrics.find(x=>x[0]===metric)?.[1]}</h3><p>{start} — {end}</p></div><div className="chart-toggle"><button className={chartType==="area"?"active":""} onClick={()=>setChartType("area")}>Area</button><button className={chartType==="bars"?"active":""} onClick={()=>setChartType("bars")}>Bars</button><span>Days</span></div></div>
        <SalesTrendChart rows={report.breakdown} metric={metric} type={chartType}/>
      </section>
      <section className="sales-table-card"><div className="sales-table-head"><div><h3>Sales summary</h3><p>Daily breakdown for the selected filters.</p></div><button className="btn secondary" onClick={exportCsv}>Export CSV</button></div>
        <div className="table-scroll"><table className="report-table"><thead><tr><th>Date</th><th>Gross sales</th><th>Refunds / voids</th><th>Discounts</th><th>Net sales</th><th>Cost of goods</th><th>Gross profit</th></tr></thead><tbody>{[...report.breakdown].reverse().map(r=><tr key={r.date}><td>{r.date}</td><td>{money(r.grossSales)}</td><td>{money(r.refunds)}</td><td>{money(r.discounts)}</td><td>{money(r.netSales)}</td><td>{money(r.cogs)}</td><td><b>{money(r.grossProfit)}</b></td></tr>)}</tbody></table>{!report.breakdown.length&&<Empty Icon={BarChart3} text="No sales in this period."/>}</div>
      </section>
    </>}
  </div>;
}

function POS({ws,reload,notify}) {
  const [category,setCategory]=useState("All");
  const [search,setSearch]=useState("");
  const [cart,setCart]=useState([]);
  const [branchId,setBranchId]=useState(String(ws.branches[0]?.id||""));
  const [paymentMethod,setPaymentMethod]=useState("cash");
  const [reference,setReference]=useState("");
  const [tendered,setTendered]=useState("");
  const [customerId,setCustomerId]=useState("");
  const [promoId,setPromoId]=useState("");
  const [busy,setBusy]=useState(false);
  const products=ws.products.filter(p=>p.is_active&&(category==="All"||p.category_name===category)&&p.name.toLowerCase().includes(search.toLowerCase()));
  const subtotal=cart.reduce((sum,i)=>sum+Number(i.price)*i.qty,0);
  const promo=ws.promos.find(p=>String(p.id)===promoId);
  let discount=0;
  if(promo){const v=Number(promo.value);if(promo.promo_type==="percentage")discount=Math.min(subtotal,subtotal*v/100);else if(promo.promo_type==="set_price")discount=Math.max(0,subtotal-v);else discount=Math.min(subtotal,v);}
  const total=Math.max(0,subtotal-discount);
  const add=p=>setCart(cur=>{const f=cur.find(i=>i.id===p.id);return f?cur.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...cur,{...p,qty:1}]});
  const qty=(id,d)=>setCart(cur=>cur.map(i=>i.id===id?{...i,qty:i.qty+d}:i).filter(i=>i.qty>0));
  const checkout=async()=>{
    setBusy(true);
    try{
      const result=await api("/pos/checkout",{method:"POST",body:{branchId,paymentMethod,paymentReference:reference,tendered:tendered?Number(tendered):total,customerId:customerId||null,promoId:promoId||null,items:cart.map(i=>({productId:String(i.id),qty:i.qty}))}});
      notify(result.referenceNo+" completed · "+money(result.total),result.lowStockNames?.length?"warn":"");
      if(result.lowStockNames?.length) setTimeout(()=>notify("Low stock: "+result.lowStockNames.join(", "),"warn"),600);
      setCart([]);setReference("");setTendered("");setCustomerId("");setPromoId("");await reload();
    }catch(err){notify(err.message,"error");}finally{setBusy(false);}
  };
  return <div className="pos">
    <section className="catalog"><div className="catalog-top"><div className="search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search menu…"/></div><select value={branchId} onChange={e=>setBranchId(e.target.value)}>{ws.branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></div><div className="chips">{["All",...ws.categories.map(c=>c.name)].map(c=><button key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="products">{products.map(p=><button className="product" key={p.id} onClick={()=>add(p)}><span>{p.category_name==="Food"?"🥐":"☕"}</span><b>{p.name}</b><small>{p.category_name}</small><strong>{money(p.price)}</strong><i><Plus size={14}/></i></button>)}</div></section>
    <aside className="cart"><header><div><h3>Current order</h3><small>{cart.reduce((s,i)=>s+i.qty,0)} item(s)</small></div><button className="icon-btn" onClick={()=>setCart([])}><Trash2 size={16}/></button></header><div className="cart-lines">{cart.map(i=><div className="cart-line" key={i.id}><div><b>{i.name}</b><strong>{money(Number(i.price)*i.qty)}</strong></div><small>{money(i.price)} each</small><div className="qty"><button onClick={()=>qty(i.id,-1)}><Minus/></button><span>{i.qty}</span><button onClick={()=>qty(i.id,1)}><Plus/></button></div></div>)}{!cart.length&&<Empty text="Tap a product to start an order."/>}</div><div className="checkout">
      <label>Customer<select value={customerId} onChange={e=>setCustomerId(e.target.value)}><option value="">Walk-in customer</option>{ws.customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label>Promo<select value={promoId} onChange={e=>setPromoId(e.target.value)}><option value="">No promo</option>{ws.promos.filter(p=>p.is_active).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
      {discount>0&&<div className="summary-line"><span>Discount</span><b>-{money(discount)}</b></div>}
      <div className="total"><span>Total</span><strong>{money(total)}</strong></div><div className="pay-tabs"><button className={paymentMethod==="cash"?"active":""} onClick={()=>setPaymentMethod("cash")}>Cash</button><button className={paymentMethod==="gcash"?"active":""} onClick={()=>setPaymentMethod("gcash")}>GCash</button></div>{paymentMethod==="cash"?<input type="number" value={tendered} onChange={e=>setTendered(e.target.value)} placeholder={"Tendered · minimum "+total}/>:<input value={reference} onChange={e=>setReference(e.target.value)} placeholder="GCash reference"/>}<button className="btn primary wide" disabled={!cart.length||busy||(paymentMethod==="gcash"&&!reference.trim())||(paymentMethod==="cash"&&tendered&&Number(tendered)<total)} onClick={checkout}>{busy?"Processing…":"Pay "+money(total)}</button>
    </div></aside>
  </div>;
}

function Inventory({ws,reload,notify}) {
  const [showAdd,setShowAdd]=useState(false);
  const [ingredient,setIngredient]=useState({name:"",uom:"PCS",stockQty:"0",lowStockThreshold:"0",costPerUnit:"0"});
  const [adjust,setAdjust]=useState({ingredientId:String(ws.ingredients[0]?.id||""),branchId:String(ws.branches[0]?.id||""),movementType:"replenish",quantity:"",notes:""});
  const save=async()=>{try{await api("/ingredients/save",{method:"POST",body:{...ingredient,stockQty:Number(ingredient.stockQty),lowStockThreshold:Number(ingredient.lowStockThreshold),costPerUnit:Number(ingredient.costPerUnit)}});notify("Ingredient saved");setIngredient({name:"",uom:"PCS",stockQty:"0",lowStockThreshold:"0",costPerUnit:"0"});setShowAdd(false);await reload();}catch(err){notify(err.message,"error");}};
  const post=async()=>{try{await api("/inventory/adjust",{method:"POST",body:{...adjust,quantity:Number(adjust.quantity)}});notify("Stock movement posted");setAdjust({...adjust,quantity:"",notes:""});await reload();}catch(err){notify(err.message,"error");}};
  return <div className="stack">
    <section className="section-bar"><div><h2>Ingredient inventory</h2><p>Recipe stock deducts automatically after checkout, with a complete movement history below.</p></div><button className="btn primary" onClick={()=>setShowAdd(!showAdd)}><Plus/>Add ingredient</button></section>
    {showAdd&&<Panel title="New ingredient" sub="Opening stock, threshold, and cost per unit"><div className="form-grid">{["name","uom","stockQty","lowStockThreshold","costPerUnit"].map(k=><label key={k}>{({name:"Name",uom:"UOM",stockQty:"Opening stock",lowStockThreshold:"Low-stock level",costPerUnit:"Cost / unit"})[k]}<input type={["stockQty","lowStockThreshold","costPerUnit"].includes(k)?"number":"text"} value={ingredient[k]} onChange={e=>setIngredient({...ingredient,[k]:e.target.value})}/></label>)}<button className="btn primary" onClick={save}>Save ingredient</button></div></Panel>}
    <div className="two-col">
      <Panel title="Stock levels" sub={"Inventory value "+money(ws.summary.inventoryValue)}><div className="data-table four"><div className="head"><span>Ingredient</span><span>Stock</span><span>Low at</span><span>Unit cost</span></div>{ws.ingredients.map(i=><div key={i.id}><span><b>{i.name}</b><small>{i.uom}</small></span><span className={Number(i.stock_qty)<=Number(i.low_stock_threshold)?"warning":""}>{Number(i.stock_qty).toLocaleString()} {i.uom}</span><span>{Number(i.low_stock_threshold).toLocaleString()}</span><span>{money(i.cost_per_unit)}</span></div>)}</div></Panel>
      <Panel title="Adjust stock" sub="Replenish, positive adjustment, or waste"><div className="form-stack"><label>Ingredient<select value={adjust.ingredientId} onChange={e=>setAdjust({...adjust,ingredientId:e.target.value})}>{ws.ingredients.map(i=><option key={i.id} value={i.id}>{i.name}</option>)}</select></label><label>Branch<select value={adjust.branchId} onChange={e=>setAdjust({...adjust,branchId:e.target.value})}>{ws.branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></label><label>Movement<select value={adjust.movementType} onChange={e=>setAdjust({...adjust,movementType:e.target.value})}><option value="replenish">Replenish / add</option><option value="adjustment">Positive adjustment</option><option value="waste">Waste / subtract</option></select></label><label>Quantity<input type="number" value={adjust.quantity} onChange={e=>setAdjust({...adjust,quantity:e.target.value})}/></label><label>Notes<input value={adjust.notes} onChange={e=>setAdjust({...adjust,notes:e.target.value})}/></label><button className="btn primary" onClick={post}>Post stock movement</button></div></Panel>
    </div>
    <Panel title="Inventory history" sub="Sales deductions, replenishments, waste, and manual adjustments"><div className="table-scroll"><table className="report-table"><thead><tr><th>Date</th><th>Ingredient</th><th>Branch</th><th>Movement</th><th>Qty</th><th>Balance after</th><th>Reference / notes</th></tr></thead><tbody>{(ws.inventoryMovements||[]).slice(0,80).map(m=><tr key={m.id}><td>{dateTime(m.created_at)}</td><td><b>{m.ingredient_name}</b></td><td>{m.branch_name||"—"}</td><td>{String(m.movement_type).replaceAll("_"," ")}</td><td className={Number(m.qty)<0?"down":"up"}>{Number(m.qty)>0?"+":""}{Number(m.qty).toLocaleString()} {m.uom}</td><td>{Number(m.balance_after).toLocaleString()} {m.uom}</td><td>{m.reference||m.notes||"—"}</td></tr>)}</tbody></table>{!(ws.inventoryMovements||[]).length&&<Empty Icon={Boxes} text="Inventory movements will appear here."/>}</div></Panel>
  </div>;
}

function Products({ws,reload,notify}) {
  const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({name:"",categoryId:String(ws.categories[0]?.id||""),price:"",sku:"",recipes:[]});
  const [ri,setRi]=useState(String(ws.ingredients[0]?.id||""));
  const [rq,setRq]=useState("");
  const ingredientById=id=>ws.ingredients.find(x=>String(x.id)===String(id));
  const cost=form.recipes.reduce((sum,r)=>sum+Number(ingredientById(r.ingredientId)?.cost_per_unit||0)*Number(r.qtyRequired||0),0);
  const grossMargin=Math.max(0,Number(form.price||0)-cost);
  const marginPct=Number(form.price||0)>0?grossMargin/Number(form.price)*100:0;
  const reset=()=>{setEditing(null);setForm({name:"",categoryId:String(ws.categories[0]?.id||""),price:"",sku:"",recipes:[]});setRq("");};
  const edit=p=>{setEditing(p);setForm({name:p.name,categoryId:String(p.category_id||ws.categories[0]?.id||""),price:String(p.price),sku:p.sku||"",recipes:ws.recipes.filter(r=>String(r.product_id)===String(p.id)).map(r=>({ingredientId:String(r.ingredient_id),qtyRequired:Number(r.qty_required)}))});};
  const addRecipe=()=>{if(!ri||Number(rq)<=0)return;setForm({...form,recipes:[...form.recipes.filter(r=>r.ingredientId!==ri),{ingredientId:ri,qtyRequired:Number(rq)}]});setRq("");};
  const updateQty=(ingredientId,value)=>setForm({...form,recipes:form.recipes.map(r=>r.ingredientId===ingredientId?{...r,qtyRequired:Number(value)}:r)});
  const save=async()=>{try{await api("/products/save",{method:"POST",body:{id:editing?.id,name:form.name,categoryId:form.categoryId,price:Number(form.price),sku:form.sku,recipes:form.recipes}});notify(editing?"Product recipe & costing updated":"Product added");reset();await reload();}catch(err){notify(err.message,"error");}};
  const recipeCost=id=>ws.recipes.filter(r=>String(r.product_id)===String(id)).reduce((sum,r)=>sum+Number(ingredientById(r.ingredient_id)?.cost_per_unit||0)*Number(r.qty_required),0);
  return <div className="stack">
    <section className="section-bar"><div><h2>Products, recipes & costing</h2><p>Edit each recipe ingredient and quantity; BrewPoint recalculates cost and gross margin instantly.</p></div></section>
    <div className="two-col product-costing-layout">
      <Panel title="Menu costing" sub={ws.products.length+" menu items"}><div className="table-scroll"><table className="report-table"><thead><tr><th>Product</th><th>Price</th><th>Recipe cost</th><th>Gross margin</th><th>Margin</th><th></th></tr></thead><tbody>{ws.products.map(p=>{const c=recipeCost(p.id);const gm=Number(p.price)-c;return <tr key={p.id}><td><b>{p.name}</b><small>{p.category_name} · {p.sku||"No SKU"}</small></td><td>{money(p.price)}</td><td>{money(c)}</td><td>{money(gm)}</td><td>{Number(p.price)>0?(gm/Number(p.price)*100).toFixed(1):"0.0"}%</td><td><button className="btn secondary small" onClick={()=>edit(p)}>Edit recipe</button></td></tr>})}</tbody></table></div></Panel>
      <Panel title={editing?"Recipe & costing editor":"Add product & recipe"} sub={editing?"Editing "+editing.name:"Build the recipe before saving"}>
        <div className="form-stack">
          <label>Name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
          <div className="form-grid compact-grid"><label>Category<select value={form.categoryId} onChange={e=>setForm({...form,categoryId:e.target.value})}>{ws.categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>Price<input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></label><label>SKU<input value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})}/></label></div>
          <div className="costing-summary"><div><span>Recipe cost</span><strong>{money(cost)}</strong></div><div><span>Gross margin</span><strong>{money(grossMargin)}</strong></div><div><span>Margin</span><strong>{marginPct.toFixed(1)}%</strong></div></div>
          <div className="recipe-box"><b>Recipe ingredients</b><div className="recipe-add"><select value={ri} onChange={e=>setRi(e.target.value)}>{ws.ingredients.map(i=><option key={i.id} value={i.id}>{i.name} · {i.uom}</option>)}</select><input type="number" step="0.001" value={rq} onChange={e=>setRq(e.target.value)} placeholder="Qty"/><button className="btn secondary small" onClick={addRecipe}>Add</button></div>
            {form.recipes.map(r=>{const i=ingredientById(r.ingredientId);const line=Number(i?.cost_per_unit||0)*Number(r.qtyRequired||0);return <div className="recipe-edit-row" key={r.ingredientId}><div><b>{i?.name||"Ingredient"}</b><small>{money(i?.cost_per_unit||0)} / {i?.uom}</small></div><label>Qty<input type="number" step="0.001" value={r.qtyRequired} onChange={e=>updateQty(r.ingredientId,e.target.value)}/></label><div><span>Line cost</span><strong>{money(line)}</strong></div><button className="icon-btn danger-icon" onClick={()=>setForm({...form,recipes:form.recipes.filter(x=>x.ingredientId!==r.ingredientId)})}><Trash2 size={14}/></button></div>})}
            {!form.recipes.length&&<p className="recipe-hint">No ingredients yet. Add ingredients above; saving a recipe makes stock deduct automatically at checkout.</p>}
          </div>
          <div className="form-actions">{editing&&<button className="btn secondary" onClick={reset}>Cancel</button>}<button className="btn primary" onClick={save}>{editing?"Save recipe & costing":"Add product"}</button></div>
        </div>
      </Panel>
    </div>
  </div>;
}

function CustomersPromos({ws,reload,notify}) {
  const [customer,setCustomer]=useState({name:"",phone:"",email:"",notes:""});
  const [promo,setPromo]=useState({name:"",promoType:"set_price",value:""});
  const saveCustomer=async()=>{try{await api("/customers",{method:"POST",body:customer});notify("Customer saved");setCustomer({name:"",phone:"",email:"",notes:""});await reload();}catch(err){notify(err.message,"error");}};
  const savePromo=async()=>{try{await api("/promos",{method:"POST",body:{...promo,value:Number(promo.value)}});notify("Promo created");setPromo({name:"",promoType:"set_price",value:""});await reload();}catch(err){notify(err.message,"error");}};
  const deletePromo=async p=>{if(!window.confirm("Delete promo '"+p.name+"'? Existing transaction history will remain unchanged."))return;try{await api("/promos/"+p.id,{method:"DELETE"});notify("Promo deleted");await reload();}catch(err){notify(err.message,"error");}};
  return <div className="stack"><section className="section-bar"><div><h2>Customers & promos</h2><p>Save repeat customers and manage checkout pricing rules.</p></div></section><div className="two-col"><Panel title="Customers" sub={ws.customers.length+" saved"}><div className="list">{ws.customers.map(c=><div key={c.id}><span><b>{c.name}</b><small>{[c.phone,c.email].filter(Boolean).join(" · ")||"No contact details"}</small></span></div>)}{!ws.customers.length&&<Empty Icon={Users} text="No customers saved yet."/>}</div><div className="form-stack inset"><label>Name<input value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})}/></label><label>Phone<input value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value})}/></label><label>Email<input type="email" value={customer.email} onChange={e=>setCustomer({...customer,email:e.target.value})}/></label><label>Notes<input value={customer.notes} onChange={e=>setCustomer({...customer,notes:e.target.value})} placeholder="Preferences, usual order, reminders…"/></label><button className="btn primary" onClick={saveCustomer}>Save customer</button></div></Panel><Panel title="Promos" sub="Set price, fixed discount, or percentage"><div className="list promo-list">{ws.promos.map(p=><div key={p.id}><span><b>{p.name}</b><small>{p.promo_type.replaceAll("_"," ")} · {p.is_active?"Active":"Inactive"}</small></span><span className="row-actions"><strong>{p.promo_type==="percentage"?p.value+"%":money(p.value)}</strong><button className="btn danger tiny" onClick={()=>deletePromo(p)}>Delete</button></span></div>)}{!ws.promos.length&&<Empty Icon={Tags} text="No promos yet."/>}</div><div className="form-stack inset"><label>Promo name<input value={promo.name} onChange={e=>setPromo({...promo,name:e.target.value})}/></label><label>Type<select value={promo.promoType} onChange={e=>setPromo({...promo,promoType:e.target.value})}><option value="set_price">Set final order price</option><option value="fixed_discount">Fixed discount</option><option value="percentage">Percentage discount</option></select></label><label>Value<input type="number" value={promo.value} onChange={e=>setPromo({...promo,value:e.target.value})}/></label><button className="btn primary" onClick={savePromo}>Create promo</button></div></Panel></div></div>;
}

function Expenses({ws,reload,notify}) {
  const [form,setForm]=useState({branchId:String(ws.branches[0]?.id||""),category:"Supplies",description:"",amount:""});
  const save=async()=>{try{await api("/expenses",{method:"POST",body:{...form,amount:Number(form.amount)}});notify("Expense recorded");setForm({...form,description:"",amount:""});reload();}catch(err){notify(err.message,"error");}};
  return <div className="stack"><div className="metrics"><Metric label="Month expenses" value={money(ws.summary.monthExpenses)} sub="Included in profit"/><Metric label="Month sales" value={money(ws.summary.monthSales)} sub="Completed sales"/><Metric label="Estimated profit" value={money(ws.summary.estimatedProfit)} sub="After COGS & expenses"/><Metric label="Entries" value={ws.expenses.length} sub="Recent expense records"/></div><div className="two-col"><Panel title="Recent expenses"><div className="list">{ws.expenses.map(e=><div key={e.id}><span><b>{e.description}</b><small>{e.category} · {dateTime(e.spent_at)}</small></span><strong>{money(e.amount)}</strong></div>)}{!ws.expenses.length&&<Empty Icon={WalletCards} text="No expenses recorded yet."/>}</div></Panel><Panel title="Record expense"><div className="form-stack"><label>Branch<select value={form.branchId} onChange={e=>setForm({...form,branchId:e.target.value})}>{ws.branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></label><label>Category<input value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/></label><label>Description<input value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><label>Amount<input type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/></label><button className="btn primary" onClick={save}>Save expense</button></div></Panel></div></div>;
}

function Reports({ws,reload,notify}) {
  const [period,setPeriod]=useState("monthly");
  const [view,setView]=useState("summary");
  const [branchId,setBranchId]=useState("");
  const [employeeId,setEmployeeId]=useState("");
  const [report,setReport]=useState(null);
  const [voiding,setVoiding]=useState(null);
  const [reason,setReason]=useState("");
  const load=async()=>{try{const q=new URLSearchParams({period});if(branchId)q.set("branchId",branchId);if(employeeId)q.set("employeeId",employeeId);setReport(await api("/reports?"+q.toString()));}catch(err){notify(err.message,"error");}};
  useEffect(()=>{load();},[period,branchId,employeeId,ws.sales.length]);
  const voidSale=async()=>{try{await api("/sales/void",{method:"POST",body:{saleId:String(voiding.id),reason}});notify("Transaction voided and ingredient stock restored");setVoiding(null);setReason("");await reload();await load();}catch(err){notify(err.message,"error");}};
  const exportRows=()=>{
    if(!report)return;
    const pick={
      summary:{headers:["Date","Gross sales","Refunds / voids","Discounts","Net sales","COGS","Gross profit"],rows:report.breakdown.map(r=>[r.date,r.grossSales,r.refunds,r.discounts,r.netSales,r.cogs,r.grossProfit])},
      items:{headers:["Item","SKU","Category","Qty","Gross sales","Discounts","Net sales","COGS","Gross profit","Margin %"],rows:report.products.map(r=>[r.name,r.sku,r.category,r.qty,r.grossSales,r.discounts,r.netSales,r.cogs,r.grossProfit,r.margin])},
      categories:{headers:["Category","Qty","Gross sales","Discounts","Net sales","COGS","Gross profit","Margin %"],rows:report.categories.map(r=>[r.name,r.qty,r.grossSales,r.discounts,r.netSales,r.cogs,r.grossProfit,r.margin])},
      employees:{headers:["Employee","Receipts","Net sales"],rows:report.employees.map(r=>[r.name,r.receipts,r.netSales])},
      payments:{headers:["Payment type","Receipts","Net sales"],rows:report.paymentTypes.map(r=>[r.name,r.receipts,r.netSales])},
      receipts:{headers:["Reference","Date","Branch","Employee","Customer","Payment","Status","Discount","Total"],rows:report.transactions.map(r=>[r.reference_no,dateTime(r.created_at),r.branch_name,r.cashier_name,r.customer_name,r.payment_method,r.status,r.discount,r.total])}
    }[view];
    const csv=[pick.headers,...pick.rows].map(r=>r.map(c=>'"'+String(c??"").replaceAll('"','""')+'"').join(",")).join("\n");
    const url=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));const el=document.createElement("a");el.href=url;el.download="BrewPoint-"+view+"-"+period+".csv";el.click();URL.revokeObjectURL(url);
  };
  if(!report)return <Loading text="Building reports…"/>;
  const tabs=[["summary","Sales summary"],["items","Sales by item"],["categories","By category"],["receipts","Receipts"],["employees","By employee"],["payments","Payment types"]];
  return <div className="stack">
    <section className="section-bar"><div><h2>Reports</h2><p>Sales summary, item/category performance, receipts, employees, and payment types.</p></div><div className="bar-actions report-filter-actions"><select value={period} onChange={e=>setPeriod(e.target.value)}><option value="daily">Today</option><option value="weekly">This week</option><option value="monthly">This month</option><option value="yearly">This year</option></select><select value={branchId} onChange={e=>setBranchId(e.target.value)}><option value="">All stores</option>{ws.branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select><select value={employeeId} onChange={e=>setEmployeeId(e.target.value)}><option value="">All employees</option>{ws.members.filter(m=>m.is_active).map(m=><option key={m.user_id} value={m.user_id}>{m.display_name}</option>)}</select><button className="btn secondary" onClick={exportRows}>Export CSV</button></div></section>
    <div className="report-tabs">{tabs.map(([id,label])=><button key={id} className={view===id?"active":""} onClick={()=>setView(id)}>{label}</button>)}</div>
    <div className="metrics report-metrics"><Metric label="Gross sales" value={money(report.grossSales)} sub={report.orders+" completed receipts"}/><Metric label="Discounts" value={money(report.discounts)} sub="Applied discounts"/><Metric label="Net sales" value={money(report.netSales)} sub={"Cash "+money(report.cashSales)+" · GCash "+money(report.gcashSales)}/><Metric label="Gross profit" value={money(report.grossProfit)} sub={"COGS "+money(report.estimatedCogs)}/></div>
    {view==="summary"&&<Panel title="Sales summary" sub="Daily totals"><div className="table-scroll"><table className="report-table"><thead><tr><th>Date</th><th>Gross sales</th><th>Refunds / voids</th><th>Discounts</th><th>Net sales</th><th>COGS</th><th>Gross profit</th></tr></thead><tbody>{[...report.breakdown].reverse().map(r=><tr key={r.date}><td>{r.date}</td><td>{money(r.grossSales)}</td><td>{money(r.refunds)}</td><td>{money(r.discounts)}</td><td>{money(r.netSales)}</td><td>{money(r.cogs)}</td><td><b>{money(r.grossProfit)}</b></td></tr>)}</tbody></table></div></Panel>}
    {view==="items"&&<Panel title="Sales by item" sub="Quantity, revenue, cost, profit, and margin"><div className="table-scroll"><table className="report-table"><thead><tr><th>Item</th><th>SKU</th><th>Category</th><th>Sold</th><th>Gross sales</th><th>Discounts</th><th>Net sales</th><th>COGS</th><th>Gross profit</th><th>Margin</th></tr></thead><tbody>{report.products.map(r=><tr key={String(r.id)+r.name}><td><b>{r.name}</b></td><td>{r.sku||"—"}</td><td>{r.category}</td><td>{Number(r.qty).toLocaleString()}</td><td>{money(r.grossSales)}</td><td>{money(r.discounts)}</td><td>{money(r.netSales)}</td><td>{money(r.cogs)}</td><td><b>{money(r.grossProfit)}</b></td><td>{Number(r.margin).toFixed(1)}%</td></tr>)}</tbody></table></div></Panel>}
    {view==="categories"&&<Panel title="Sales by category"><div className="table-scroll"><table className="report-table"><thead><tr><th>Category</th><th>Items sold</th><th>Gross sales</th><th>Discounts</th><th>Net sales</th><th>COGS</th><th>Gross profit</th><th>Margin</th></tr></thead><tbody>{report.categories.map(r=><tr key={r.name}><td><b>{r.name}</b></td><td>{Number(r.qty).toLocaleString()}</td><td>{money(r.grossSales)}</td><td>{money(r.discounts)}</td><td>{money(r.netSales)}</td><td>{money(r.cogs)}</td><td><b>{money(r.grossProfit)}</b></td><td>{Number(r.margin).toFixed(1)}%</td></tr>)}</tbody></table></div></Panel>}
    {view==="employees"&&<Panel title="Sales by employee"><div className="table-scroll"><table className="report-table"><thead><tr><th>Employee</th><th>Receipts</th><th>Net sales</th><th>Average ticket</th></tr></thead><tbody>{report.employees.map(r=><tr key={r.id||r.name}><td><b>{r.name}</b></td><td>{r.receipts}</td><td>{money(r.netSales)}</td><td>{money(r.receipts?Number(r.netSales)/r.receipts:0)}</td></tr>)}</tbody></table></div></Panel>}
    {view==="payments"&&<Panel title="Sales by payment type"><div className="table-scroll"><table className="report-table"><thead><tr><th>Payment type</th><th>Receipts</th><th>Net sales</th><th>Share</th></tr></thead><tbody>{report.paymentTypes.map(r=><tr key={r.name}><td><b>{String(r.name).toUpperCase()}</b></td><td>{r.receipts}</td><td>{money(r.netSales)}</td><td>{report.netSales?((Number(r.netSales)/report.netSales)*100).toFixed(1):"0.0"}%</td></tr>)}</tbody></table></div></Panel>}
    {view==="receipts"&&<>{voiding&&<Panel title={"Void "+voiding.reference_no} sub="The receipt remains in history and recipe stock is restored."><div className="void-form"><input value={reason} onChange={e=>setReason(e.target.value)} placeholder="Reason for void"/><button className="btn secondary" onClick={()=>setVoiding(null)}>Cancel</button><button className="btn danger" disabled={reason.trim().length<2} onClick={voidSale}>Confirm void</button></div></Panel>}<Panel title="Receipts" sub="Complete transaction history"><div className="table-scroll"><table className="report-table"><thead><tr><th>Reference</th><th>Date</th><th>Branch</th><th>Employee</th><th>Customer</th><th>Payment</th><th>Status</th><th>Total</th><th></th></tr></thead><tbody>{report.transactions.map(s=><tr key={s.id}><td><b>{s.reference_no}</b></td><td>{dateTime(s.created_at)}</td><td>{s.branch_name}</td><td>{s.cashier_name||"—"}</td><td>{s.customer_name||"Walk-in"}</td><td>{String(s.payment_method).toUpperCase()}</td><td><span className={"badge "+s.status}>{s.status}</span></td><td><b>{money(s.total)}</b></td><td>{s.status==="completed"?<button className="btn secondary small" onClick={()=>setVoiding(s)}>Void</button>:"—"}</td></tr>)}</tbody></table></div></Panel></>}
  </div>;
}

function Team({ws,reload,notify}) {
  const [show,setShow]=useState(false);
  const [staff,setStaff]=useState({displayName:"",email:"",password:"",role:"cashier"});
  const [branch,setBranch]=useState({name:"",address:""});
  const active=ws.members.filter(m=>m.is_active).length;
  const createStaff=async()=>{try{await api("/staff",{method:"POST",body:staff});notify("Staff account created");setStaff({displayName:"",email:"",password:"",role:"cashier"});setShow(false);reload();}catch(err){notify(err.message,"error");}};
  const toggle=async m=>{try{await api("/staff/toggle",{method:"POST",body:{memberId:String(m.id),isActive:!m.is_active}});notify("Staff access updated");reload();}catch(err){notify(err.message,"error");}};
  const addBranch=async()=>{try{await api("/branches",{method:"POST",body:branch});notify("Branch created");setBranch({name:"",address:""});reload();}catch(err){notify(err.message,"error");}};
  return <div className="stack"><div className="metrics"><Metric label="Active staff" value={active+"/"+ws.business.staffLimit} sub={plans[ws.business.plan].name+" allowance"}/><Metric label="Owner" value="1" sub="Full access"/><Metric label="Branches" value={ws.branches.length+"/"+ws.business.branchLimit} sub="Current plan limit"/><Metric label="Your role" value={ws.business.memberRole} sub="Current account"/></div><section className="section-bar"><div><h2>People & locations</h2><p>Create role-based staff accounts and branches.</p></div><button className="btn primary" onClick={()=>setShow(!show)}><Plus/>Add staff</button></section>{show&&<Panel title="Create staff account" sub="For testing, set the initial password directly."><div className="form-grid"><label>Name<input value={staff.displayName} onChange={e=>setStaff({...staff,displayName:e.target.value})}/></label><label>Email<input type="email" value={staff.email} onChange={e=>setStaff({...staff,email:e.target.value})}/></label><label>Password<input type="password" value={staff.password} onChange={e=>setStaff({...staff,password:e.target.value})}/></label><label>Role<select value={staff.role} onChange={e=>setStaff({...staff,role:e.target.value})}><option value="cashier">Cashier</option><option value="inventory">Inventory</option><option value="manager">Manager</option><option value="admin">Admin</option></select></label><button className="btn primary" onClick={createStaff}>Create staff</button></div></Panel>}<div className="two-col"><Panel title="Team accounts"><div className="list">{ws.members.map(m=><div key={m.id}><span><b>{m.display_name}</b><small>{m.email} · {m.role}</small></span><span className="row-actions"><span className={"badge "+(m.is_active?"completed":"voided")}>{m.is_active?"Active":"Disabled"}</span>{m.role!=="owner"&&<button className="btn secondary small" onClick={()=>toggle(m)}>{m.is_active?"Disable":"Enable"}</button>}</span></div>)}</div></Panel><Panel title="Branches" sub={ws.business.branchLimit+" allowed on "+plans[ws.business.plan].name}><div className="list">{ws.branches.map(b=><div key={b.id}><span><b>{b.name}</b><small>{b.address||"No address set"}</small></span><span className="badge completed">Active</span></div>)}</div><div className="form-stack inset"><label>Name<input value={branch.name} onChange={e=>setBranch({...branch,name:e.target.value})}/></label><label>Address<input value={branch.address} onChange={e=>setBranch({...branch,address:e.target.value})}/></label><button className="btn primary" onClick={addBranch}>Add branch</button></div></Panel></div></div>;
}

function Billing({ws,reload,notify}) {
  const change=async plan=>{try{await api("/subscription/change",{method:"POST",body:{plan,activateDemo:true}});notify("Sandbox subscription activated");await reload();}catch(err){notify(err.message,"error");}};
  return <div className="stack"><section className="billing-hero"><div><span className={"status "+ws.business.subscriptionStatus}>{ws.business.subscriptionStatus}</span><h2>{plans[ws.business.plan].name} plan</h2><p>{ws.business.subscriptionStatus==="trialing"?"Your trial has "+ws.summary.trialDaysLeft+" days remaining.":"Current period ends "+dateTime(ws.business.currentPeriodEnd)}</p></div><strong>{money(plans[ws.business.plan].price)}<small>/month</small></strong></section>
    <div className="plan-grid compact-plans">{Object.entries(plans).map(([key,p])=><article className={"pricing-card billing-plan-card "+(key===ws.business.plan?"selected":"")} key={key}>{key===ws.business.plan&&<span className="pill">CURRENT</span>}<h3>{p.name}</h3><div className="price">{money(p.price)}<small>/month</small></div><p>{p.branches} branch{p.branches>1?"es":""} · {p.staff} staff accounts</p><ul className="billing-feature-list">{p.features.map(feature=><li key={feature}><Check size={13}/><span>{feature}</span></li>)}</ul><button className="btn primary wide" onClick={()=>change(key)}>{key===ws.business.plan&&ws.business.subscriptionStatus==="active"?"Renew sandbox period":ws.business.subscriptionStatus==="suspended"&&key===ws.business.plan?"Reactivate "+p.name:"Activate "+p.name+" in sandbox"}</button></article>)}</div>
    <div className="info-note"><b>Testing mode:</b> plan activation simulates a successful 30-day payment period. No card, GCash, or bank account is charged.</div>
  </div>;
}

function OwnerConsole() {
  const nav=useNavigate();
  const [data,setData]=useState(null);
  const [error,setError]=useState("");
  const [toast,setToast]=useState(null);
  const [section,setSection]=useState("overview");
  const [search,setSearch]=useState("");
  const [auditSearch,setAuditSearch]=useState("");
  const load=async()=>{try{setError("");setData(await api("/landlord"));}catch(err){setError(err.message);}};
  useEffect(()=>{load();},[]);
  const act=async(businessId,action,extra={})=>{try{await api("/landlord/action",{method:"POST",body:{businessId:String(businessId),action,...extra}});setToast({message:"Tenant updated"});await load();}catch(err){setToast({message:err.message,type:"error"});}};
  const daysLeft=t=>Math.max(0,Math.ceil((new Date(t.trial_ends_at).getTime()-Date.now())/86400000));
  const tenantMatches=t=>[t.name,t.owner_name,t.owner_email,t.plan,t.subscription_status].join(" ").toLowerCase().includes(search.toLowerCase());
  const tenants=(data?.tenants||[]).filter(tenantMatches);
  const trials=tenants.filter(t=>t.subscription_status==="trialing"&&!t.is_suspended);
  const subscriptions=tenants.filter(t=>t.subscription_status!=="trialing"||t.current_period_end);
  const audits=(data?.audits||[]).filter(a=>[a.action,a.business_name,a.display_name,a.email,a.details].join(" ").toLowerCase().includes(auditSearch.toLowerCase()));
  const exportAudits=()=>{const rows=[["Date","Business","User","Action","Entity","Details"],...audits.map(x=>[dateTime(x.created_at),x.business_name||"",x.display_name||x.email||"",x.action,x.entity_type||"",x.details||""])];const csv=rows.map(r=>r.map(c=>'"'+String(c??"").replaceAll('"','""')+'"').join(",")).join("\n");const url=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));const el=document.createElement("a");el.href=url;el.download="BrewPoint-platform-audit.csv";el.click();URL.revokeObjectURL(url);};
  if(error)return <div className="loading"><ShieldCheck/><b>{error}</b><button className="btn secondary" onClick={()=>nav("/")}>Back to website</button></div>;
  if(!data)return <Loading text="Opening BrewPoint administration…"/>;
  const titles={overview:["Platform overview","Monitor the entire BrewPoint SaaS business."],tenants:["Tenants","Manage coffee businesses, access status, and plans."],trials:["Trials","Monitor 30-day trials and conversion actions."],subscriptions:["Subscriptions","Manage active, past-due, suspended, and cancelled subscriptions."],security:["Audit & security","Review platform activity and security controls."]};
  const title=titles[section];
  return <div className="owner-shell">
    <aside className="owner-side"><Brand compact/><span className="owner-tag">PLATFORM ADMIN ONLY</span><nav><button className={section==="overview"?"active":""} onClick={()=>setSection("overview")}><LayoutDashboard/>Overview</button><button className={section==="tenants"?"active":""} onClick={()=>setSection("tenants")}><Store/>Tenants</button><button className={section==="trials"?"active":""} onClick={()=>setSection("trials")}><CalendarClock/>Trials</button><button className={section==="subscriptions"?"active":""} onClick={()=>setSection("subscriptions")}><CreditCard/>Subscriptions</button><button className={section==="security"?"active":""} onClick={()=>setSection("security")}><ShieldCheck/>Audit & security</button></nav><Link className="btn secondary small wide" to="/">Public BrewPoint site</Link></aside>
    <main className="owner-main"><header className="owner-head"><div><span className="pill">BREWPOINT PLATFORM ADMIN</span><h1>{title[0]}</h1><p>{title[1]}</p></div></header>
      {section==="overview"&&<><div className="owner-notice"><CalendarClock/><p><b>Landlord administration is now separate from café tenants.</b> This console is protected by the platform-admin role and is not linked from the tenant POS.</p></div><div className="metrics"><Metric label="Total tenants" value={data.summary.totalTenants} sub={data.summary.activeTenants+" active · "+data.summary.trialTenants+" trial"}/><Metric label="Monthly recurring" value={money(data.summary.monthlyRecurringRevenue)} sub="Active plan value"/><Metric label="Platform month sales" value={money(data.summary.monthPlatformSales)} sub="Across all tenants"/><Metric label="Needs attention" value={data.summary.needsAttention} sub="Past due, suspended, or cancelled"/></div><div className="two-col"><Panel title="Recent tenants" sub="Latest businesses"><div className="list">{data.tenants.slice(0,8).map(t=><div key={t.id}><span><b>{t.name}</b><small>{t.owner_email||"No owner email"} · {plans[t.plan]?.name}</small></span><span className={"badge "+(t.is_suspended?"voided":t.subscription_status==="active"?"completed":"trialing")}>{t.is_suspended?"suspended":t.subscription_status}</span></div>)}</div></Panel><Panel title="Recent platform activity" sub="Audit trail"><div className="list">{data.audits.slice(0,10).map(x=><div key={x.id}><span><b>{x.action.replaceAll("_"," ")}</b><small>{x.business_name||"Platform"} · {dateTime(x.created_at)}</small></span></div>)}</div></Panel></div></>}
      {section==="tenants"&&<><section className="admin-toolbar"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tenant, owner, plan, or status…"/></section><Panel title="Tenant businesses" sub="Real subscription, branch, staff, and sales data"><div className="table-scroll"><table className="report-table admin-table"><thead><tr><th>Business</th><th>Owner</th><th>Plan</th><th>Status</th><th>Branches</th><th>Staff</th><th>Month sales</th><th>Actions</th></tr></thead><tbody>{tenants.map(t=><tr key={t.id}><td><b>{t.name}</b><small>{dateTime(t.created_at)}</small></td><td>{t.owner_name||"—"}<small>{t.owner_email||""}</small></td><td>{plans[t.plan]?.name||t.plan}</td><td><span className={"badge "+(t.is_suspended?"voided":t.subscription_status==="active"?"completed":"trialing")}>{t.is_suspended?"suspended":t.subscription_status}</span></td><td>{t.branches}</td><td>{t.members}</td><td>{money(t.month_sales)}</td><td><span className="row-actions">{t.is_suspended?<button className="btn secondary tiny" onClick={()=>act(t.id,"resume")}>Resume</button>:<button className="btn secondary tiny" onClick={()=>act(t.id,"suspend")}>Suspend</button>}{t.subscription_status!=="active"&&<button className="btn primary tiny" onClick={()=>act(t.id,"mark_active")}>Activate</button>}</span></td></tr>)}</tbody></table></div></Panel></>}
      {section==="trials"&&<><div className="metrics"><Metric label="Active trials" value={trials.length} sub="Currently evaluating BrewPoint"/><Metric label="Expiring ≤7 days" value={trials.filter(t=>daysLeft(t)<=7).length} sub="Follow-up candidates"/><Metric label="Pro trials" value={trials.filter(t=>t.plan==="pro").length} sub="Pro selected"/><Metric label="Business trials" value={trials.filter(t=>t.plan==="business").length} sub="Business selected"/></div><Panel title="Trial management" sub="Extend, reset, or convert a trial"><div className="table-scroll"><table className="report-table"><thead><tr><th>Business</th><th>Owner</th><th>Trial plan</th><th>Ends</th><th>Days left</th><th>Actions</th></tr></thead><tbody>{trials.map(t=><tr key={t.id}><td><b>{t.name}</b></td><td>{t.owner_email||"—"}</td><td>{plans[t.plan]?.name}</td><td>{dateTime(t.trial_ends_at)}</td><td><b>{daysLeft(t)}</b></td><td><span className="row-actions"><button className="btn secondary tiny" onClick={()=>act(t.id,"extend_trial")}>+7 days</button><button className="btn secondary tiny" onClick={()=>act(t.id,"extend_trial_30")}>Reset 30 days</button><button className="btn primary tiny" onClick={()=>act(t.id,"mark_active")}>Activate</button></span></td></tr>)}</tbody></table></div></Panel></>}
      {section==="subscriptions"&&<><div className="metrics"><Metric label="MRR" value={money(data.summary.monthlyRecurringRevenue)} sub="Active plan value"/><Metric label="Starter" value={data.planBreakdown.starter} sub="Active tenants"/><Metric label="Pro" value={data.planBreakdown.pro} sub="Active tenants"/><Metric label="Business" value={data.planBreakdown.business} sub="Active tenants"/></div><Panel title="Subscription management" sub="Change plans and lifecycle status"><div className="table-scroll"><table className="report-table"><thead><tr><th>Business</th><th>Plan</th><th>Status</th><th>Period end</th><th>Month sales</th><th>Actions</th></tr></thead><tbody>{subscriptions.map(t=><tr key={t.id}><td><b>{t.name}</b><small>{t.owner_email||""}</small></td><td><select value={t.plan} onChange={e=>act(t.id,"change_plan",{plan:e.target.value})}><option value="starter">Starter · ₱799</option><option value="pro">Pro · ₱1,199</option><option value="business">Business · ₱1,999</option></select></td><td><span className={"badge "+(t.is_suspended?"voided":t.subscription_status==="active"?"completed":"trialing")}>{t.is_suspended?"suspended":t.subscription_status}</span></td><td>{dateTime(t.current_period_end)}</td><td>{money(t.month_sales)}</td><td><span className="row-actions">{t.subscription_status!=="active"&&<button className="btn primary tiny" onClick={()=>act(t.id,"mark_active")}>Activate</button>}<button className="btn secondary tiny" onClick={()=>act(t.id,"mark_past_due")}>Past due</button>{t.is_suspended?<button className="btn secondary tiny" onClick={()=>act(t.id,"resume")}>Resume</button>:<button className="btn secondary tiny" onClick={()=>act(t.id,"suspend")}>Suspend</button>}<button className="btn danger tiny" onClick={()=>window.confirm("Cancel this subscription?")&&act(t.id,"cancel")}>Cancel</button></span></td></tr>)}</tbody></table></div></Panel></>}
      {section==="security"&&<><div className="metrics"><Metric label="Beta signup gate" value={data.security.betaGateEnabled?"Enabled":"Off"} sub="Private registration code"/><Metric label="Platform admins" value={data.security.platformAdmins} sub={data.security.totalUsers+" total users"}/><Metric label="Database" value={data.security.database} sub="PostgreSQL connectivity"/><Metric label="Session cookie" value="Protected" sub={data.security.sessionCookie}/></div><section className="admin-toolbar"><input value={auditSearch} onChange={e=>setAuditSearch(e.target.value)} placeholder="Search audit action, tenant, user, or detail…"/><button className="btn secondary" onClick={exportAudits}>Export audit CSV</button></section><Panel title="Platform audit trail" sub={audits.length+" matching events"}><div className="table-scroll"><table className="report-table"><thead><tr><th>Date</th><th>Business</th><th>User</th><th>Action</th><th>Entity</th><th>Details</th></tr></thead><tbody>{audits.map(x=><tr key={x.id}><td>{dateTime(x.created_at)}</td><td>{x.business_name||"Platform"}</td><td>{x.display_name||x.email||"System"}</td><td><b>{x.action.replaceAll("_"," ")}</b></td><td>{x.entity_type||"—"}</td><td>{x.details||"—"}</td></tr>)}</tbody></table></div></Panel></>}
    </main><Toast toast={toast} onClear={()=>setToast(null)}/>
  </div>;
}

export default function App() {
  return <Routes>
    <Route path="/" element={<Landing/>}/>
    <Route path="/login" element={<AuthPage mode="login"/>}/>
    <Route path="/signup" element={<AuthPage mode="signup"/>}/>
    <Route path="/app" element={<AppShell/>}/>
    <Route path="/admin" element={<OwnerConsole/>}/><Route path="/owner" element={<Navigate to="/admin"/>}/>
    <Route path="*" element={<Navigate to="/"/>}/>
  </Routes>;
}
