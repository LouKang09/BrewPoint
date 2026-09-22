import { useEffect, useMemo, useState } from "react";
import { Navigate, Link, Route, Routes, useNavigate } from "react-router-dom";
import {
  ArrowRight, BarChart3, Boxes, Building2, CalendarClock, Check, CircleDollarSign,
  Coffee, CreditCard, LayoutDashboard, LogOut, Minus, PackagePlus, Plus, ReceiptText,
  Search, ShieldCheck, ShoppingBag, Store, Tags, Trash2, Users, WalletCards
} from "lucide-react";

const ICON = "/brewpoint-icon.svg";
const LOGO = "/brewpoint-logo.svg";

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
  const [form,setForm]=useState({displayName:"",email:"",password:""});
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
    <aside className="auth-side"><Brand/><h1>{mode==="signup"?"Build a calmer back office for your café.":"Welcome back to BrewPoint."}</h1><p>Sales, recipes, inventory, expenses, customers, staff, branches, and reporting in one workspace.</p><div className="auth-benefits"><span><Check/>30-day trial</span><span><Check/>Private tenant workspace</span><span><Check/>No real payment in testing mode</span></div></aside>
    <main className="auth-main"><form className="auth-card" onSubmit={submit}><span className="pill">{mode==="signup"?"START FREE":"SIGN IN"}</span><h2>{mode==="signup"?"Create your BrewPoint account":"Open your workspace"}</h2>
      {mode==="signup"&&<label>Full name<input value={form.displayName} onChange={e=>setForm({...form,displayName:e.target.value})} placeholder="Your name" required/></label>}
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
      <div className="side-bottom">{me.user.platformRole==="platform_admin"&&<Link className="btn secondary small wide" to="/owner">Landlord console</Link>}<div className="user-mini"><span>{me.user.displayName.slice(0,2).toUpperCase()}</span><div><b>{me.user.displayName}</b><small>{business.memberRole} · {plans[business.plan]?.name}</small></div></div><button className="logout" onClick={logout}><LogOut size={14}/>Sign out</button></div>
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

function Dashboard({ws,go}) {
  const low=ws.ingredients.filter(i=>Number(i.stock_qty)<=Number(i.low_stock_threshold));
  return <div className="stack">
    <section className="welcome"><div><span className="pill">GOOD DAY, {ws.user.displayName.split(" ")[0].toUpperCase()}</span><h2>Here’s how the café is doing.</h2><p>Sales, stock, expenses, and subscription status are synced from your BrewPoint workspace.</p></div><button className="btn primary" onClick={()=>go("pos")}><ShoppingBag size={16}/>New sale</button></section>
    <div className="metrics"><Metric label="Today's sales" value={money(ws.summary.todaySales)} sub={ws.summary.todayOrders+" orders"}/><Metric label="This month" value={money(ws.summary.monthSales)} sub={ws.summary.monthOrders+" orders"}/><Metric label="Estimated profit" value={money(ws.summary.estimatedProfit)} sub={"After "+money(ws.summary.monthExpenses)+" expenses"}/><Metric label="Low stock" value={ws.summary.lowStock} sub={ws.summary.lowStock?"Needs attention":"Inventory healthy"}/></div>
    <div className="two-col"><Panel title="Recent transactions" sub="Latest sales activity"><div className="list">{ws.sales.slice(0,8).map(s=><div key={s.id}><span><b>{s.reference_no}</b><small>{dateTime(s.created_at)} · {s.payment_method.toUpperCase()}</small></span><strong>{money(s.total)}</strong></div>)}{!ws.sales.length&&<Empty text="Your first sale will appear here."/>}</div></Panel><Panel title="Stock watch" sub={low.length+" item(s) at or below threshold"}><div className="list">{low.slice(0,8).map(i=><div key={i.id}><span><b>{i.name}</b><small>Low at {i.low_stock_threshold} {i.uom}</small></span><strong className="warning">{Number(i.stock_qty).toLocaleString()} {i.uom}</strong></div>)}{!low.length&&<Empty Icon={Boxes} text="Inventory is healthy."/>}</div></Panel></div>
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
  const save=async()=>{try{await api("/ingredients/save",{method:"POST",body:{...ingredient,stockQty:Number(ingredient.stockQty),lowStockThreshold:Number(ingredient.lowStockThreshold),costPerUnit:Number(ingredient.costPerUnit)}});notify("Ingredient saved");setIngredient({name:"",uom:"PCS",stockQty:"0",lowStockThreshold:"0",costPerUnit:"0"});setShowAdd(false);reload();}catch(err){notify(err.message,"error");}};
  const post=async()=>{try{await api("/inventory/adjust",{method:"POST",body:{...adjust,quantity:Number(adjust.quantity)}});notify("Stock movement posted");setAdjust({...adjust,quantity:"",notes:""});reload();}catch(err){notify(err.message,"error");}};
  return <div className="stack"><section className="section-bar"><div><h2>Ingredient inventory</h2><p>Recipe stock automatically deducts after checkout.</p></div><button className="btn primary" onClick={()=>setShowAdd(!showAdd)}><Plus/>Add ingredient</button></section>{showAdd&&<Panel title="New ingredient" sub="Opening stock, threshold, and cost per unit"><div className="form-grid">{["name","uom","stockQty","lowStockThreshold","costPerUnit"].map(k=><label key={k}>{({name:"Name",uom:"UOM",stockQty:"Opening stock",lowStockThreshold:"Low-stock level",costPerUnit:"Cost / unit"})[k]}<input type={["stockQty","lowStockThreshold","costPerUnit"].includes(k)?"number":"text"} value={ingredient[k]} onChange={e=>setIngredient({...ingredient,[k]:e.target.value})}/></label>)}<button className="btn primary" onClick={save}>Save ingredient</button></div></Panel>}<div className="two-col"><Panel title="Stock levels" sub={"Inventory value "+money(ws.summary.inventoryValue)}><div className="data-table four"><div className="head"><span>Ingredient</span><span>Stock</span><span>Low at</span><span>Unit cost</span></div>{ws.ingredients.map(i=><div key={i.id}><span><b>{i.name}</b><small>{i.uom}</small></span><span className={Number(i.stock_qty)<=Number(i.low_stock_threshold)?"warning":""}>{Number(i.stock_qty).toLocaleString()} {i.uom}</span><span>{Number(i.low_stock_threshold).toLocaleString()}</span><span>{money(i.cost_per_unit)}</span></div>)}</div></Panel><Panel title="Adjust stock" sub="Replenish, positive adjustment, or waste"><div className="form-stack"><label>Ingredient<select value={adjust.ingredientId} onChange={e=>setAdjust({...adjust,ingredientId:e.target.value})}>{ws.ingredients.map(i=><option key={i.id} value={i.id}>{i.name}</option>)}</select></label><label>Branch<select value={adjust.branchId} onChange={e=>setAdjust({...adjust,branchId:e.target.value})}>{ws.branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></label><label>Movement<select value={adjust.movementType} onChange={e=>setAdjust({...adjust,movementType:e.target.value})}><option value="replenish">Replenish / add</option><option value="adjustment">Positive adjustment</option><option value="waste">Waste / subtract</option></select></label><label>Quantity<input type="number" value={adjust.quantity} onChange={e=>setAdjust({...adjust,quantity:e.target.value})}/></label><label>Notes<input value={adjust.notes} onChange={e=>setAdjust({...adjust,notes:e.target.value})}/></label><button className="btn primary" onClick={post}>Post stock movement</button></div></Panel></div></div>;
}

function Products({ws,reload,notify}) {
  const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({name:"",categoryId:String(ws.categories[0]?.id||""),price:"",sku:"",recipes:[]});
  const [ri,setRi]=useState(String(ws.ingredients[0]?.id||""));
  const [rq,setRq]=useState("");
  const cost=form.recipes.reduce((sum,r)=>{const i=ws.ingredients.find(x=>String(x.id)===String(r.ingredientId));return sum+Number(i?.cost_per_unit||0)*Number(r.qtyRequired)},0);
  const reset=()=>{setEditing(null);setForm({name:"",categoryId:String(ws.categories[0]?.id||""),price:"",sku:"",recipes:[]});};
  const edit=p=>{setEditing(p);setForm({name:p.name,categoryId:String(p.category_id||ws.categories[0]?.id||""),price:String(p.price),sku:p.sku||"",recipes:ws.recipes.filter(r=>String(r.product_id)===String(p.id)).map(r=>({ingredientId:String(r.ingredient_id),qtyRequired:Number(r.qty_required)}))});};
  const addRecipe=()=>{if(!ri||Number(rq)<=0)return;setForm({...form,recipes:[...form.recipes.filter(r=>r.ingredientId!==ri),{ingredientId:ri,qtyRequired:Number(rq)}]});setRq("");};
  const save=async()=>{try{await api("/products/save",{method:"POST",body:{id:editing?.id,name:form.name,categoryId:form.categoryId,price:Number(form.price),sku:form.sku,recipes:form.recipes}});notify(editing?"Product updated":"Product added");reset();reload();}catch(err){notify(err.message,"error");}};
  const recipeCost=id=>ws.recipes.filter(r=>String(r.product_id)===String(id)).reduce((sum,r)=>{const i=ws.ingredients.find(x=>String(x.id)===String(r.ingredient_id));return sum+Number(i?.cost_per_unit||0)*Number(r.qty_required)},0);
  return <div className="stack"><section className="section-bar"><div><h2>Menu & recipes</h2><p>Recipe quantities drive stock deduction and costing.</p></div></section><div className="two-col"><Panel title="Products" sub={ws.products.length+" menu items"}><div className="list">{ws.products.map(p=><div key={p.id}><span><b>{p.name}</b><small>{p.category_name} · cost {money(recipeCost(p.id))}</small></span><span className="row-actions"><strong>{money(p.price)}</strong><button className="btn secondary small" onClick={()=>edit(p)}>Edit</button></span></div>)}</div></Panel><Panel title={editing?"Edit product & recipe":"Add product & recipe"} sub={"Recipe cost "+money(cost)}><div className="form-stack"><label>Name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Category<select value={form.categoryId} onChange={e=>setForm({...form,categoryId:e.target.value})}>{ws.categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>Price<input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></label><label>SKU<input value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})}/></label><div className="recipe-box"><b>Recipe ingredients</b><div className="recipe-add"><select value={ri} onChange={e=>setRi(e.target.value)}>{ws.ingredients.map(i=><option key={i.id} value={i.id}>{i.name} · {i.uom}</option>)}</select><input type="number" value={rq} onChange={e=>setRq(e.target.value)} placeholder="Qty"/><button className="btn secondary small" onClick={addRecipe}>Add</button></div>{form.recipes.map(r=>{const i=ws.ingredients.find(x=>String(x.id)===r.ingredientId);return <div className="recipe-item" key={r.ingredientId}><span>{i?.name} · {r.qtyRequired} {i?.uom}</span><button onClick={()=>setForm({...form,recipes:form.recipes.filter(x=>x.ingredientId!==r.ingredientId)})}><Trash2 size={13}/></button></div>})}</div><div className="form-actions">{editing&&<button className="btn secondary" onClick={reset}>Cancel</button>}<button className="btn primary" onClick={save}>{editing?"Save changes":"Add product"}</button></div></div></Panel></div></div>;
}

function CustomersPromos({ws,reload,notify}) {
  const [customer,setCustomer]=useState({name:"",phone:"",email:"",notes:""});
  const [promo,setPromo]=useState({name:"",promoType:"set_price",value:""});
  const saveCustomer=async()=>{try{await api("/customers",{method:"POST",body:customer});notify("Customer saved");setCustomer({name:"",phone:"",email:"",notes:""});reload();}catch(err){notify(err.message,"error");}};
  const savePromo=async()=>{try{await api("/promos",{method:"POST",body:{...promo,value:Number(promo.value)}});notify("Promo created");setPromo({name:"",promoType:"set_price",value:""});reload();}catch(err){notify(err.message,"error");}};
  return <div className="stack"><section className="section-bar"><div><h2>Customers & promos</h2><p>Save repeat customers and create checkout pricing rules.</p></div></section><div className="two-col"><Panel title="Customers" sub={ws.customers.length+" saved"}><div className="list">{ws.customers.map(c=><div key={c.id}><span><b>{c.name}</b><small>{[c.phone,c.email].filter(Boolean).join(" · ")||"No contact details"}</small></span></div>)}{!ws.customers.length&&<Empty Icon={Users} text="No customers saved yet."/>}</div><div className="form-stack inset"><label>Name<input value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})}/></label><label>Phone<input value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value})}/></label><label>Email<input type="email" value={customer.email} onChange={e=>setCustomer({...customer,email:e.target.value})}/></label><button className="btn primary" onClick={saveCustomer}>Save customer</button></div></Panel><Panel title="Promos" sub="Set price, fixed discount, or percentage"><div className="list">{ws.promos.map(p=><div key={p.id}><span><b>{p.name}</b><small>{p.promo_type.replaceAll("_"," ")} · {p.is_active?"Active":"Inactive"}</small></span><strong>{p.promo_type==="percentage"?p.value+"%":money(p.value)}</strong></div>)}{!ws.promos.length&&<Empty Icon={Tags} text="No promos yet."/>}</div><div className="form-stack inset"><label>Promo name<input value={promo.name} onChange={e=>setPromo({...promo,name:e.target.value})}/></label><label>Type<select value={promo.promoType} onChange={e=>setPromo({...promo,promoType:e.target.value})}><option value="set_price">Set final order price</option><option value="fixed_discount">Fixed discount</option><option value="percentage">Percentage discount</option></select></label><label>Value<input type="number" value={promo.value} onChange={e=>setPromo({...promo,value:e.target.value})}/></label><button className="btn primary" onClick={savePromo}>Create promo</button></div></Panel></div></div>;
}

function Expenses({ws,reload,notify}) {
  const [form,setForm]=useState({branchId:String(ws.branches[0]?.id||""),category:"Supplies",description:"",amount:""});
  const save=async()=>{try{await api("/expenses",{method:"POST",body:{...form,amount:Number(form.amount)}});notify("Expense recorded");setForm({...form,description:"",amount:""});reload();}catch(err){notify(err.message,"error");}};
  return <div className="stack"><div className="metrics"><Metric label="Month expenses" value={money(ws.summary.monthExpenses)} sub="Included in profit"/><Metric label="Month sales" value={money(ws.summary.monthSales)} sub="Completed sales"/><Metric label="Estimated profit" value={money(ws.summary.estimatedProfit)} sub="After COGS & expenses"/><Metric label="Entries" value={ws.expenses.length} sub="Recent expense records"/></div><div className="two-col"><Panel title="Recent expenses"><div className="list">{ws.expenses.map(e=><div key={e.id}><span><b>{e.description}</b><small>{e.category} · {dateTime(e.spent_at)}</small></span><strong>{money(e.amount)}</strong></div>)}{!ws.expenses.length&&<Empty Icon={WalletCards} text="No expenses recorded yet."/>}</div></Panel><Panel title="Record expense"><div className="form-stack"><label>Branch<select value={form.branchId} onChange={e=>setForm({...form,branchId:e.target.value})}>{ws.branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></label><label>Category<input value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/></label><label>Description<input value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><label>Amount<input type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/></label><button className="btn primary" onClick={save}>Save expense</button></div></Panel></div></div>;
}

function Reports({ws,reload,notify}) {
  const [period,setPeriod]=useState("monthly");
  const [report,setReport]=useState(null);
  const [voiding,setVoiding]=useState(null);
  const [reason,setReason]=useState("");
  const load=async()=>{try{setReport(await api("/reports?period="+period));}catch(err){notify(err.message,"error");}};
  useEffect(()=>{load();},[period,ws.sales.length]);
  const voidSale=async()=>{try{await api("/sales/void",{method:"POST",body:{saleId:String(voiding.id),reason}});notify("Transaction voided and ingredient stock restored");setVoiding(null);setReason("");await reload();await load();}catch(err){notify(err.message,"error");}};
  const exportCsv=()=>{if(!report)return;const rows=[["Reference","Date","Branch","Cashier","Payment","Status","Total"],...report.transactions.map(s=>[s.reference_no,dateTime(s.created_at),s.branch_name||"",s.cashier_name||"",s.payment_method,s.status,s.total])];const csv=rows.map(r=>r.map(c=>'"'+String(c??"").replaceAll('"','""')+'"').join(",")).join("\n");const url=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));const a=document.createElement("a");a.href=url;a.download="BrewPoint-"+period+"-sales.csv";a.click();URL.revokeObjectURL(url);};
  if(!report)return <Loading text="Building report…"/>;
  return <div className="stack"><section className="section-bar"><div><h2>Sales & profitability</h2><p>Switch periods, inspect audit records, export, or void sales safely.</p></div><div className="bar-actions"><select value={period} onChange={e=>setPeriod(e.target.value)}><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select><button className="btn secondary" onClick={exportCsv}>Export CSV</button></div></section><div className="metrics"><Metric label="Gross sales" value={money(report.sales)} sub={report.orders+" orders"}/><Metric label="Cash" value={money(report.cashSales)} sub="Completed cash sales"/><Metric label="GCash" value={money(report.gcashSales)} sub="Completed GCash sales"/><Metric label="Estimated profit" value={money(report.estimatedProfit)} sub={"COGS "+money(report.estimatedCogs)+" · Expenses "+money(report.expenses)}/></div><div className="two-col"><Panel title="Top products"><div className="list">{report.products.slice(0,12).map(p=><div key={p.name}><span><b>{p.name}</b><small>{p.qty} sold</small></span><strong>{money(p.revenue)}</strong></div>)}{!report.products.length&&<Empty Icon={BarChart3} text="No product sales for this period."/>}</div></Panel><Panel title="System activity" sub="Latest audit trail"><div className="list">{ws.auditLogs.slice(0,12).map(a=><div key={a.id}><span><b>{a.action.replaceAll("_"," ")}</b><small>{a.display_name||"System"} · {dateTime(a.created_at)}</small></span></div>)}</div></Panel></div>{voiding&&<Panel title={"Void "+voiding.reference_no} sub="The transaction stays in audit history and its recipe stock deduction is restored."><div className="void-form"><input value={reason} onChange={e=>setReason(e.target.value)} placeholder="Reason for void"/><button className="btn secondary" onClick={()=>setVoiding(null)}>Cancel</button><button className="btn danger" disabled={reason.trim().length<2} onClick={voidSale}>Confirm void</button></div></Panel>}<Panel title="Transaction log"><div className="data-table seven"><div className="head"><span>Reference</span><span>Date</span><span>Branch</span><span>Payment</span><span>Status</span><span>Total</span><span>Action</span></div>{report.transactions.map(s=><div key={s.id}><span><b>{s.reference_no}</b><small>{s.cashier_name||"—"}</small></span><span>{dateTime(s.created_at)}</span><span>{s.branch_name}</span><span>{s.payment_method.toUpperCase()}</span><span className={"badge "+s.status}>{s.status}</span><span><b>{money(s.total)}</b></span><span>{s.status==="completed"?<button className="btn secondary small" onClick={()=>setVoiding(s)}>Void</button>:"—"}</span></div>)}</div></Panel></div>;
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
  const change=async plan=>{try{await api("/subscription/change",{method:"POST",body:{plan,activateDemo:true}});notify("Sandbox subscription activated");reload();}catch(err){notify(err.message,"error");}};
  return <div className="stack"><section className="billing-hero"><div><span className={"status "+ws.business.subscriptionStatus}>{ws.business.subscriptionStatus}</span><h2>{plans[ws.business.plan].name} plan</h2><p>{ws.business.subscriptionStatus==="trialing"?"Your trial has "+ws.summary.trialDaysLeft+" days remaining.":"Current period ends "+dateTime(ws.business.currentPeriodEnd)}</p></div><strong>{money(plans[ws.business.plan].price)}<small>/month</small></strong></section><div className="plan-grid compact-plans">{Object.entries(plans).map(([key,p])=><article className={"pricing-card "+(key===ws.business.plan?"selected":"")} key={key}>{key===ws.business.plan&&<span className="pill">CURRENT</span>}<h3>{p.name}</h3><div className="price">{money(p.price)}<small>/month</small></div><p>{p.branches} branch{p.branches>1?"es":""} · {p.staff} staff</p><button className="btn primary wide" onClick={()=>change(key)}>{key===ws.business.plan&&ws.business.subscriptionStatus==="active"?"Reactivate sandbox":"Activate in sandbox"}</button></article>)}</div><div className="info-note"><b>Testing mode:</b> plan activation simulates a successful 30-day payment period. No card, GCash, or bank account is charged.</div></div>;
}

function OwnerConsole() {
  const nav=useNavigate();
  const [data,setData]=useState(null);
  const [error,setError]=useState("");
  const [toast,setToast]=useState(null);
  const load=async()=>{try{setData(await api("/landlord"));}catch(err){setError(err.message);}};
  useEffect(()=>{load();},[]);
  const act=async(businessId,action)=>{try{await api("/landlord/action",{method:"POST",body:{businessId:String(businessId),action}});setToast({message:"Tenant updated"});load();}catch(err){setToast({message:err.message,type:"error"});}};
  if(error)return <div className="loading"><ShieldCheck/><b>{error}</b><button className="btn secondary" onClick={()=>nav("/app")}>Back to app</button></div>;
  if(!data)return <Loading text="Opening landlord console…"/>;
  return <div className="owner-shell"><aside className="owner-side"><Brand compact/><span className="owner-tag">PLATFORM OWNER</span><nav><button className="active"><LayoutDashboard/>Overview</button><button><Store/>Tenants</button><button><CalendarClock/>Trials</button><button><CreditCard/>Subscriptions</button><button><ShieldCheck/>Audit & security</button></nav><Link className="btn secondary small wide" to="/app">Open tenant POS</Link></aside><main className="owner-main"><header className="owner-head"><div><span className="pill">LIVE LANDLORD CONSOLE</span><h1>Platform overview</h1><p>Manage coffee businesses renting BrewPoint.</p></div><Link className="btn primary" to="/app">Open your café <ArrowRight/></Link></header><div className="owner-notice"><CalendarClock/><p><b>30-day trial lifecycle is connected.</b> Extend trials, suspend or resume tenants, and simulate subscription activation.</p></div><div className="metrics"><Metric label="Total tenants" value={data.summary.totalTenants} sub={data.summary.activeTenants+" active · "+data.summary.trialTenants+" trial"}/><Metric label="Monthly recurring" value={money(data.summary.monthlyRecurringRevenue)} sub="Active sandbox plans"/><Metric label="Active trials" value={data.summary.trialTenants} sub="Conversion pipeline"/><Metric label="Needs attention" value={data.summary.needsAttention} sub="Suspended or past due"/></div><Panel title="Tenant businesses" sub="Real subscription, branch, member, and sales data"><div className="tenant-table"><div className="head"><span>Business</span><span>Plan</span><span>Status</span><span>Branches</span><span>This month</span><span>Actions</span></div>{data.tenants.map(t=><div key={t.id}><span><b>{t.name}</b><small>{t.members} member(s)</small></span><span>{plans[t.plan]?.name||t.plan}</span><span className={"badge "+(t.is_suspended?"voided":t.subscription_status==="active"?"completed":"trialing")}>{t.is_suspended?"suspended":t.subscription_status}</span><span>{t.branches}</span><span><b>{money(t.month_sales)}</b></span><span className="row-actions">{t.subscription_status==="trialing"&&<button className="btn secondary tiny" onClick={()=>act(t.id,"extend_trial")}>+7 days</button>}{t.is_suspended?<button className="btn secondary tiny" onClick={()=>act(t.id,"resume")}>Resume</button>:<button className="btn secondary tiny" onClick={()=>act(t.id,"suspend")}>Suspend</button>}{t.subscription_status!=="active"&&<button className="btn primary tiny" onClick={()=>act(t.id,"mark_active")}>Activate</button>}</span></div>)}</div></Panel></main><Toast toast={toast} onClear={()=>setToast(null)}/></div>;
}

export default function App() {
  return <Routes>
    <Route path="/" element={<Landing/>}/>
    <Route path="/login" element={<AuthPage mode="login"/>}/>
    <Route path="/signup" element={<AuthPage mode="signup"/>}/>
    <Route path="/app" element={<AppShell/>}/>
    <Route path="/owner" element={<OwnerConsole/>}/>
    <Route path="*" element={<Navigate to="/"/>}/>
  </Routes>;
}
