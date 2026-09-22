import { useEffect, useMemo, useState } from "react";
import { Navigate, Link, Route, Routes, useNavigate } from "react-router-dom";
import {
  ArrowRight, BarChart3, Boxes, Building2, CalendarClock, Check, CircleDollarSign,
  Coffee, CreditCard, LayoutDashboard, LogOut, Minus, PackagePlus, Plus, ReceiptText,
  Search, ShieldCheck, ShoppingBag, Store, Tags, Trash2, Users, WalletCards,
  MessageCircle, Sun, Moon, Monitor, HelpCircle, Printer, X, ChevronRight, QrCode
} from "lucide-react";

const ICON = "data:image/webp;base64,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";
const LOGO = "data:image/webp;base64,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";

const plans = {
  starter: { name:"Starter", price:799, branches:1, staff:3, features:["1 branch","3 staff accounts","POS with Cash & GCash","Product & category management","Recipe editor & automatic ingredient deduction","Ingredient stock, low-stock alerts & adjustments","Customer records","Set-price, fixed & percentage promos","Sales summary and receipt history"] },
  pro: { name:"Pro", price:1199, branches:3, staff:10, features:["Everything in Starter","Up to 3 branches","10 staff accounts","Cashier, inventory, manager & admin roles","Inventory movement history","Recipe costing, COGS & gross-margin analysis","Expense & profit tracking","Sales by item, category, employee & payment type","Receipt voiding with automatic stock restoration","Daily, weekly, monthly & yearly reports","CSV exports"] },
  business: { name:"Business", price:1999, branches:10, staff:25, features:["Everything in Pro","Up to 10 branches","25 staff accounts","All-store sales filters and consolidated analytics","Central ingredient and inventory oversight","Advanced role capacity for larger teams","Complete tenant audit trail","Multi-branch reporting and employee comparisons","Customer purchase history","Priority onboarding","Priority support","Early access to future integrations"] }
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

function useTheme(){
  const [theme,setThemeState]=useState(()=>localStorage.getItem("brewpoint-theme")||"auto");
  useEffect(()=>{
    const apply=()=>{
      const resolved=theme==="auto"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):theme;
      document.documentElement.dataset.theme=resolved;
    };
    apply();
    const media=window.matchMedia("(prefers-color-scheme: dark)");
    const listener=()=>theme==="auto"&&apply();
    media.addEventListener?.("change",listener);
    return()=>media.removeEventListener?.("change",listener);
  },[theme]);
  const setTheme=value=>{localStorage.setItem("brewpoint-theme",value);setThemeState(value);};
  return {theme,setTheme};
}

function ThemeControl({theme,setTheme,compact=false}){
  const options=[["light",Sun,"Light"],["dark",Moon,"Dark"],["auto",Monitor,"Auto"]];
  return <div className={"theme-control "+(compact?"compact":"")}>{options.map(([id,Icon,label])=><button key={id} title={label} className={theme===id?"active":""} onClick={()=>setTheme(id)}><Icon size={14}/>{!compact&&<span>{label}</span>}</button>)}</div>;
}

function GuideTour({role,onSectionChange,onClose,admin=false}){
  const tenantSteps={
    owner:[
      {section:"dashboard",target:'[data-guide="nav-dashboard"]',title:"Dashboard",body:"Use this first. It summarizes gross sales, discounts, net sales, refunds/voids, COGS, and gross profit. Change store, employee, or date filters before comparing performance."},
      {section:"pos",target:'[data-guide="pos-catalog"]',title:"POS menu",body:"Choose the selling branch, then add products by category. If a branch is under maintenance, every sale control is intentionally locked."},
      {section:"pos",target:'[data-guide="pos-categories"]',title:"Promos live here",body:"Promos are a menu category, not a checkout discount. Opening one forces the cashier to choose only the products you authorized in the promo setup."},
      {section:"pos",target:'[data-guide="pos-discount"]',title:"Senior/PWD",body:"Senior and PWD apply 20% and require an ID/reference. They cannot be combined with a promo; BrewPoint enforces that in the screen and server."},
      {section:"products",target:'[data-guide="nav-products"]',title:"Products & recipes",body:"Set selling price, recipe ingredients, required quantities, and cost. Recipe quantities drive stock deductions and gross-margin calculations."},
      {section:"customers",target:'[data-guide="promo-editor"]',title:"Promo permissions",body:"Define the promo price, required categories, quantity per category, and the exact products cashiers are allowed to choose."},
      {section:"reports",target:'[data-guide="nav-reports"]',title:"Reports",body:"Filter by period, branch, or employee. Open receipts, print the current report, or export the selected report as CSV."},
      {section:"team",target:'[data-guide="staff-form"]',title:"Staff assignment",body:"Each staff account needs a role and branch. Assigned staff can only operate the POS for that branch."},
      {section:"team",target:'[data-guide="branch-maintenance"]',title:"Branch maintenance",body:"Use Maintenance before repairs, network work, or temporary closure. Assigned cashiers will see Under Maintenance and cannot process a sale until you reopen it."},
      {section:"team",target:'[data-guide="gcash-settings"]',title:"GCash QR",body:"Upload the branch/company GCash QR and account details. At checkout the customer scans it, then the cashier records the GCash reference."}
    ],
    admin:[
      {section:"dashboard",target:'[data-guide="nav-dashboard"]',title:"Dashboard",body:"Monitor sales, discounts, COGS, and gross profit. Use filters before comparing branches or employees."},
      {section:"pos",target:'[data-guide="pos-root"]',title:"POS",body:"Build orders, select registered promo bundles, apply required Senior/PWD IDs, and complete Cash or GCash payments."},
      {section:"inventory",target:'[data-guide="nav-inventory"]',title:"Inventory",body:"Replenish, adjust, or record waste. Sale deductions come automatically from product recipes."},
      {section:"products",target:'[data-guide="nav-products"]',title:"Recipes & costing",body:"Maintain menu prices and ingredient quantities so stock and COGS stay accurate."},
      {section:"customers",target:'[data-guide="promo-editor"]',title:"Promo control",body:"Tenant Admin can decide the exact products allowed inside each promo combination."},
      {section:"reports",target:'[data-guide="nav-reports"]',title:"Reports",body:"Review receipts and performance, then print or export the active report."},
      {section:"team",target:'[data-guide="branch-maintenance"]',title:"Branches",body:"Assign staff, rename branches, and temporarily lock POS with Under Maintenance when needed."}
    ],
    manager:[
      {section:"dashboard",target:'[data-guide="nav-dashboard"]',title:"Operational dashboard",body:"Use branch and employee results to monitor the day without changing subscription or platform settings."},
      {section:"pos",target:'[data-guide="pos-root"]',title:"Branch POS",body:"Your assigned branch is enforced. Promo rules and Senior/PWD validation cannot be bypassed from the cashier screen."},
      {section:"inventory",target:'[data-guide="nav-inventory"]',title:"Stock operations",body:"Use adjustments only for real replenishment, waste, or corrections because every movement is retained in history."},
      {section:"reports",target:'[data-guide="nav-reports"]',title:"Reports",body:"Use period and employee filters to review sales and print the report you are viewing."}
    ],
    inventory:[
      {section:"dashboard",target:'[data-guide="nav-dashboard"]',title:"Inventory snapshot",body:"Check low-stock counts and inventory value before opening the stock workspace."},
      {section:"inventory",target:'[data-guide="nav-inventory"]',title:"Inventory workspace",body:"Replenish, adjust, or record waste here. Automatic sale deductions appear in movement history for audit."}
    ],
    cashier:[
      {section:"pos",target:'[data-guide="pos-catalog"]',title:"Your branch POS",body:"The branch shown here is your assigned store. You cannot switch to another branch, and maintenance will lock sales completely."},
      {section:"pos",target:'[data-guide="pos-categories"]',title:"Products and promos",body:"Regular products are grouped by category. Promos have their own category and only show product choices approved by Owner/Admin."},
      {section:"pos",target:'[data-guide="pos-discount"]',title:"Customer and Senior/PWD",body:"Select a customer if needed. Senior/PWD requires the ID/reference and cannot be used together with a promo."},
      {section:"customers",target:'[data-guide="customer-form"]',title:"Add a customer",body:"Cashiers may add or edit customer details and review history. Promo setup is hidden because it is an Owner/Admin responsibility."}
    ]
  };
  const adminSteps=[
    {section:"overview",target:'[data-guide="admin-overview"]',title:"Platform overview",body:"This is landlord-only information: tenant count, subscription health, MRR, and sales activity across BrewPoint businesses."},
    {section:"tenants",target:'[data-guide="admin-nav-tenants"]',title:"Tenant control",body:"Suspend or resume tenant access and review plan, owner, branch, staff, and sales data."},
    {section:"trials",target:'[data-guide="admin-nav-trials"]',title:"Trial management",body:"Track 30-day trials, extend evaluation time, or convert a tenant when payment is confirmed."},
    {section:"subscriptions",target:'[data-guide="admin-nav-subscriptions"]',title:"Subscriptions",body:"Change plans and control active, past-due, suspended, or cancelled subscription states."},
    {section:"support",target:'[data-guide="admin-nav-support"]',title:"Support tickets",body:"Questions from the public BrewPoint chatbot arrive here. Open a ticket, reply as BrewPoint Admin, then mark it answered or closed."},
    {section:"security",target:'[data-guide="admin-nav-security"]',title:"Audit & security",body:"Review platform actions and security status. Export the audit trail when you need an external record."}
  ];
  const steps=admin?adminSteps:(tenantSteps[role]||tenantSteps.cashier);
  const [index,setIndex]=useState(0);
  const [rect,setRect]=useState(null);
  const current=steps[index];

  useEffect(()=>{onSectionChange?.(current.section);},[index]);
  useEffect(()=>{
    let cancelled=false;
    const locate=()=>{
      const el=document.querySelector(current.target);
      if(!el){setTimeout(()=>!cancelled&&locate(),120);return;}
      el.scrollIntoView({behavior:"smooth",block:"center",inline:"center"});
      setTimeout(()=>{
        if(cancelled)return;
        const r=el.getBoundingClientRect();
        setRect({left:Math.max(8,r.left-8),top:Math.max(8,r.top-8),width:Math.min(window.innerWidth-16,r.width+16),height:Math.min(window.innerHeight-16,r.height+16)});
      },180);
    };
    locate();
    const update=()=>{const el=document.querySelector(current.target);if(el){const r=el.getBoundingClientRect();setRect({left:Math.max(8,r.left-8),top:Math.max(8,r.top-8),width:Math.min(window.innerWidth-16,r.width+16),height:Math.min(window.innerHeight-16,r.height+16)});}};
    window.addEventListener("resize",update);
    return()=>{cancelled=true;window.removeEventListener("resize",update);};
  },[index,current.target,current.section]);

  const finish=()=>{localStorage.setItem("brewpoint-guide-"+(admin?"platform":role),"done");onClose();};
  const tooltipStyle=rect?{
    left:Math.min(Math.max(16,rect.left),Math.max(16,window.innerWidth-390)),
    top:rect.top+rect.height+16<window.innerHeight-220?rect.top+rect.height+16:Math.max(16,rect.top-205)
  }:{left:24,top:24};

  return <div className="guide-focus-layer" role="dialog" aria-modal="true">
    {rect&&<div className="guide-spotlight" style={{left:rect.left,top:rect.top,width:rect.width,height:rect.height}}/>}
    <div className="guide-tooltip" style={tooltipStyle}>
      <div className="guide-tooltip-head"><span className="guide-step">GUIDE {index+1}/{steps.length}</span><button onClick={finish}><X size={15}/></button></div>
      <h3>{current.title}</h3><p>{current.body}</p>
      <div className="guide-progress">{steps.map((_,i)=><i key={i} className={i<=index?"active":""}/>)}</div>
      <div className="guide-actions"><button className="btn secondary" disabled={index===0} onClick={()=>setIndex(i=>i-1)}>Back</button>{index<steps.length-1?<button className="btn primary" onClick={()=>setIndex(i=>i+1)}>Show next <ChevronRight size={15}/></button>:<button className="btn primary" onClick={finish}>Finish guide</button>}</div>
    </div>
  </div>;
}

function SupportChat(){
  const [open,setOpen]=useState(false);
  const [faqs,setFaqs]=useState([]);
  const [ticket,setTicket]=useState(null);
  const [form,setForm]=useState({name:"",email:"",message:""});
  const [reply,setReply]=useState("");
  const [answer,setAnswer]=useState(null);
  const [busy,setBusy]=useState(false);
  const tokenKey="brewpoint-support-token";
  const loadTicket=async token=>{if(!token)return;try{setTicket(await api("/support/tickets/"+token));}catch{localStorage.removeItem(tokenKey);setTicket(null);}};
  useEffect(()=>{api("/support/faqs").then(x=>setFaqs(x.faqs||[])).catch(()=>{});const token=localStorage.getItem(tokenKey);if(token)loadTicket(token);},[]);
  useEffect(()=>{if(!open||!ticket)return;const token=localStorage.getItem(tokenKey);const id=setInterval(()=>loadTicket(token),15000);return()=>clearInterval(id);},[open,Boolean(ticket)]);
  const submit=async()=>{setBusy(true);try{const created=await api("/support/tickets",{method:"POST",body:{name:form.name,email:form.email,message:form.message}});localStorage.setItem(tokenKey,created.token);setForm({...form,message:""});await loadTicket(created.token);}catch(err){setAnswer(err.message);}finally{setBusy(false);}};
  const send=async()=>{const token=localStorage.getItem(tokenKey);if(!token||!reply.trim())return;setBusy(true);try{await api("/support/tickets/"+token+"/messages",{method:"POST",body:{message:reply}});setReply("");await loadTicket(token);}catch(err){setAnswer(err.message);}finally{setBusy(false);}};
  const reset=()=>{localStorage.removeItem(tokenKey);setTicket(null);setAnswer(null);setReply("");};
  return <><button className="chat-launcher" onClick={()=>setOpen(v=>!v)} aria-label="BrewPoint support"><MessageCircle/>{ticket?.ticket?.status==="answered"&&<i/>}</button>{open&&<div className="chat-panel"><header><div><b>BrewPoint Help</b><small>FAQs + human support tickets</small></div><button onClick={()=>setOpen(false)}><X/></button></header>{!ticket?<div className="chat-body"><p className="chat-intro">Ask a quick FAQ or send a ticket. A BrewPoint admin can reply here.</p><div className="faq-list">{faqs.map((f,i)=><button key={i} onClick={()=>setAnswer(f.a)}>{f.q}</button>)}</div>{answer&&<div className="chat-answer">{answer}</div>}<div className="chat-ticket-form"><b>Still need help?</b><input placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><textarea placeholder="Type your question…" value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/><button className="btn primary wide" disabled={busy||!form.name||!form.email||!form.message} onClick={submit}>{busy?"Sending…":"Create support ticket"}</button></div></div>:<div className="chat-body ticket-chat"><div className="ticket-status"><span>Ticket #{ticket.ticket.id}</span><b>{ticket.ticket.status}</b></div><div className="ticket-messages">{ticket.messages.map(m=><div key={m.id} className={"ticket-message "+m.sender_type}><small>{m.sender_type==="admin"?(m.display_name||"BrewPoint Admin"):"You"} · {dateTime(m.created_at)}</small><p>{m.message}</p></div>)}</div>{ticket.ticket.status!=="closed"?<div className="chat-reply"><textarea placeholder="Reply…" value={reply} onChange={e=>setReply(e.target.value)}/><button className="btn primary" disabled={busy||!reply.trim()} onClick={send}>Send</button></div>:<div className="chat-answer">This ticket is closed.</div>}<button className="chat-new" onClick={reset}>Start a new question</button></div>}</div>}</>;
}


function Landing() {
  const {theme,setTheme}=useTheme();
  return <div className="marketing">
    <header className="nav"><Brand compact/><nav><a href="#features">Features</a><a href="#pricing">Pricing</a><ThemeControl theme={theme} setTheme={setTheme} compact/><Link to="/login">Sign in</Link><Link className="btn primary small" to="/signup">Start 30 days free</Link></nav></header>
    <section className="hero">
      <div className="hero-copy">
        <span className="pill">30-day free trial · built for coffee businesses</span>
        <h1>Your coffee shop.<br/><em>Your POS.</em><br/>Your growth.</h1>
        <p>BrewPoint combines fast checkout with recipes, ingredient inventory, costing, expenses, staff, branches, reports, customers, promos, GCash QR payments, and subscription management—all in one cloud workspace.</p>
        <div className="hero-actions"><Link className="btn primary" to="/signup">Start free trial <ArrowRight size={17}/></Link><Link className="btn secondary" to="/login">Open BrewPoint</Link></div>
        <div className="checks"><span><Check size={14}/>30 days free</span><span><Check size={14}/>Senior/PWD ready</span><span><Check size={14}/>Cash & GCash QR</span></div>
      </div>
      <div className="hero-art"><img src={LOGO} alt="BrewPoint"/><div className="hero-card"><Coffee/><div><b>Built around café operations</b><span>Recipe costing + automatic ingredient deduction</span></div></div></div>
    </section>
    <section className="stat-strip"><div><strong>30 days</strong><span>Free trial</span></div><div><strong>3 plans</strong><span>Starter · Pro · Business</span></div><div><strong>24/7</strong><span>Cloud back office</span></div><div><strong>Human help</strong><span>FAQ chatbot + support tickets</span></div></section>
    <section id="features" className="section"><div className="section-title"><span className="eyebrow">COFFEE-FIRST OPERATIONS</span><h2>More than a cashier screen.</h2><p>BrewPoint turns the strongest ideas from a spreadsheet-based coffee POS into a proper multi-tenant web platform.</p></div>
      <div className="feature-grid">{[
        [ShoppingBag,"Fast POS","Branch-aware checkout, Cash, GCash QR, and non-stackable Senior/PWD 20% discounts."],
        [Boxes,"Recipe inventory","Ingredients deduct automatically from recipe quantities after every completed sale."],
        [CircleDollarSign,"Costing & profit","Recipe cost, inventory value, expenses, COGS estimates, and profit views."],
        [Tags,"Customers & promos","Customer history plus configurable promo bundles and checkout rules."],
        [Users,"Staff & branches","Role-based accounts with branch assignment and plan-based limits."],
        [BarChart3,"Reports & support","Print-ready reports, CSV export, audit history, FAQs, and support tickets."]
      ].map(([Icon,title,text])=><article key={title}><span className="feature-icon"><Icon/></span><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>
    <section id="pricing" className="section pricing"><div className="section-title"><span className="eyebrow">LAUNCH PRICING</span><h2>Start small. Upgrade when the café grows.</h2><p>Every plan starts with a 30-day free trial.</p></div>
      <div className="plan-grid">{Object.entries(plans).map(([key,plan])=><article className={"pricing-card "+(key==="pro"?"popular":"")} key={key}>{key==="pro"&&<span className="popular-label">MOST POPULAR</span>}<h3>{plan.name}</h3><div className="price">{money(plan.price)}<small>/month</small></div><p>{plan.branches} branch{plan.branches>1?"es":""} · {plan.staff} staff accounts</p><ul>{plan.features.map(f=><li key={f}><Check size={14}/>{f}</li>)}</ul><Link className="btn primary wide" to="/signup">Try {plan.name} free</Link></article>)}</div>
    </section>
    <footer><Brand compact/><span>© 2026 BrewPoint. Brew Ideas. Drive Growth.</span></footer>
    <SupportChat/>
  </div>;
}

function AuthPage({mode,destination="/app"}) {
  const nav=useNavigate();
  const [form,setForm]=useState({displayName:"",email:"",password:"",accessCode:""});
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const submit=async e=>{
    e.preventDefault();setError("");setLoading(true);
    try{
      await api(mode==="signup"?"/auth/register":"/auth/login",{method:"POST",body:form});
      nav(destination);
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
  const {theme,setTheme}=useTheme();
  const [me,setMe]=useState(null);
  const [workspace,setWorkspace]=useState(null);
  const [section,setSection]=useState("dashboard");
  const [toast,setToast]=useState(null);
  const [loading,setLoading]=useState(true);
  const [guideOpen,setGuideOpen]=useState(false);

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
  const role=business.memberRole;
  const allowedByRole={
    owner:["dashboard","pos","inventory","products","customers","expenses","reports","team","billing"],
    admin:["dashboard","pos","inventory","products","customers","expenses","reports","team","billing"],
    manager:["dashboard","pos","inventory","products","customers","expenses","reports"],
    inventory:["dashboard","inventory"],
    cashier:["dashboard","pos","customers"]
  };
  const visibleSections=sections.filter(([id])=>(allowedByRole[role]||["dashboard","pos"]).includes(id));
  const active=visibleSections.find(s=>s[0]===section)||visibleSections[0];
  if(!visibleSections.some(([id])=>id===section))setTimeout(()=>setSection("dashboard"),0);

  return <div className="app-shell">
    <aside className="sidebar">
      <button className="side-brand" onClick={()=>setSection("dashboard")}><img src={ICON}/><span><b>BrewPoint</b><small>COFFEE POS</small></span></button>
      <div className="tenant"><small>WORKSPACE</small><b><Store size={15}/>{business.name}</b><span>{business.assignedBranchId?"Assigned branch":"Workspace"} · {plans[business.plan]?.name}</span></div>
      <nav>{visibleSections.map(([id,label,Icon])=><button data-guide={"nav-"+id} key={id} className={section===id?"active":""} onClick={()=>setSection(id)}><Icon size={17}/>{label}</button>)}</nav>
      <div className="side-bottom">
        <button className="sidebar-guide" onClick={()=>setGuideOpen(true)}><HelpCircle size={15}/>Guided tour</button>
        <ThemeControl theme={theme} setTheme={setTheme}/>
        <div className="user-mini"><span>{me.user.displayName.slice(0,2).toUpperCase()}</span><div><b>{me.user.displayName}</b><small>{business.memberRole} · {plans[business.plan]?.name}</small></div></div>
        <button className="logout" onClick={logout}><LogOut size={14}/>Sign out</button>
      </div>
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
    {guideOpen&&<GuideTour role={role} onSectionChange={setSection} onClose={()=>setGuideOpen(false)}/>}
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
  const assignedBranchId=ws.business.assignedBranchId?String(ws.business.assignedBranchId):"";
  const [category,setCategory]=useState("All");
  const [search,setSearch]=useState("");
  const [cart,setCart]=useState([]);
  const [promoBundles,setPromoBundles]=useState([]);
  const [promoBuilder,setPromoBuilder]=useState(null);
  const [branchId,setBranchId]=useState(assignedBranchId||String(ws.branches[0]?.id||""));
  const [paymentMethod,setPaymentMethod]=useState("cash");
  const [reference,setReference]=useState("");
  const [tendered,setTendered]=useState("");
  const [customerId,setCustomerId]=useState("");
  const [specialDiscountType,setSpecialDiscountType]=useState("");
  const [specialDiscountReference,setSpecialDiscountReference]=useState("");
  const [busy,setBusy]=useState(false);
  const [paymentOpen,setPaymentOpen]=useState(false);
  const [successReceipt,setSuccessReceipt]=useState(null);

  useEffect(()=>{if(assignedBranchId)setBranchId(assignedBranchId);},[assignedBranchId]);

  const selectedBranch=ws.branches.find(b=>String(b.id)===String(branchId));
  const branchMaintenance=Boolean(selectedBranch?.is_maintenance);
  const categoryNames=ws.categories.filter(c=>String(c.name).toLowerCase()!=="promos").map(c=>c.name);
  const products=ws.products.filter(p=>p.is_active&&(category==="All"||p.category_name===category)&&p.name.toLowerCase().includes(search.toLowerCase()));
  const activePromos=ws.promos.filter(p=>p.is_active);

  const promoRules=p=>{
    if(Array.isArray(p?.rules)&&p.rules.length)return p.rules.map(r=>({
      categoryId:String(r.categoryId),
      qty:Number(r.qty||1),
      productIds:Array.isArray(r.productIds)?r.productIds.map(String):[]
    }));
    if(String(p?.name||"").toLowerCase().includes("143")){
      const coffee=ws.categories.find(c=>String(c.name).toLowerCase()==="coffee")||ws.categories.find(c=>String(c.name).toLowerCase().includes("coffee"));
      const food=ws.categories.find(c=>String(c.name).toLowerCase()==="food")||ws.categories.find(c=>String(c.name).toLowerCase().includes("food"));
      if(coffee&&food)return [{categoryId:String(coffee.id),qty:1,productIds:[]},{categoryId:String(food.id),qty:1,productIds:[]}];
    }
    return [];
  };

  const regularSubtotal=cart.reduce((sum,i)=>sum+Number(i.price)*i.qty,0);
  const promoRetail=promoBundles.reduce((sum,b)=>sum+b.retail,0);
  const subtotal=regularSubtotal+promoRetail;
  const promoDiscount=promoBundles.reduce((sum,b)=>sum+b.discount,0);
  const specialDiscount=specialDiscountType&&!promoBundles.length?subtotal*.20:0;
  const discount=promoBundles.length?promoDiscount:specialDiscount;
  const total=Math.max(0,subtotal-discount);

  const add=p=>{if(branchMaintenance)return;setCart(cur=>{const f=cur.find(i=>i.id===p.id);return f?cur.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...cur,{...p,qty:1}]})};
  const qty=(id,d)=>setCart(cur=>cur.map(i=>i.id===id?{...i,qty:i.qty+d}:i).filter(i=>i.qty>0));
  const openPromo=p=>{
    if(branchMaintenance)return;
    const rules=promoRules(p);
    if(!rules.length){notify("This promo has no category rules yet. Edit it under Customers & Promos.","warn");return;}
    const slots=[];
    rules.forEach(rule=>{
      const cat=ws.categories.find(c=>String(c.id)===String(rule.categoryId));
      for(let i=0;i<Number(rule.qty);i++)slots.push({categoryId:String(rule.categoryId),label:cat?.name||"Category",productId:"",productIds:rule.productIds||[]});
    });
    setPromoBuilder({promo:p,slots});
  };
  const setPromoSlot=(idx,productId)=>setPromoBuilder(cur=>({...cur,slots:cur.slots.map((s,i)=>i===idx?{...s,productId}:s)}));
  const addPromoBundle=()=>{
    if(!promoBuilder||promoBuilder.slots.some(s=>!s.productId))return;
    const counts=new Map();
    for(const slot of promoBuilder.slots)counts.set(slot.productId,(counts.get(slot.productId)||0)+1);
    const selections=[...counts.entries()].map(([productId,qty])=>({productId,qty}));
    const retail=selections.reduce((sum,x)=>sum+Number(ws.products.find(p=>String(p.id)===String(x.productId))?.price||0)*x.qty,0);
    const promo=promoBuilder.promo;
    const value=Number(promo.value);
    let promoDisc=0;
    if(promo.promo_type==="percentage")promoDisc=Math.min(retail,retail*value/100);
    else if(promo.promo_type==="set_price")promoDisc=Math.max(0,retail-value);
    else promoDisc=Math.min(retail,value);
    setPromoBundles(cur=>[...cur,{id:Date.now()+"-"+Math.random(),promoId:String(promo.id),name:promo.name,selections,retail,discount:promoDisc,total:retail-promoDisc,items:selections.map(x=>({name:ws.products.find(p=>String(p.id)===String(x.productId))?.name||"Item",qty:x.qty}))}]);
    setPromoBuilder(null);
    setSpecialDiscountType("");
    setSpecialDiscountReference("");
  };

  const clearOrder=()=>{setCart([]);setPromoBundles([]);setSpecialDiscountType("");setSpecialDiscountReference("");setReference("");setTendered("");setCustomerId("");};
  const orderLines=()=>[
    ...cart.map(i=>({name:i.name,qty:i.qty,unit:Number(i.price),total:Number(i.price)*i.qty})),
    ...promoBundles.flatMap(b=>b.items.map(x=>({name:b.name+" · "+x.name,qty:x.qty,unit:null,total:null})))
  ];

  const openPayment=()=>{
    if(branchMaintenance)return notify((selectedBranch?.name||"This branch")+" is under maintenance. POS is temporarily disabled.","error");
    if(!cart.length&&!promoBundles.length)return notify("Add at least one product or promo.","error");
    if(specialDiscountType&&!specialDiscountReference.trim())return notify("Senior/PWD ID or reference is required before payment.","error");
    setPaymentMethod("cash");setReference("");setTendered("");setSuccessReceipt(null);setPaymentOpen(true);
  };

  const checkout=async()=>{
    if(paymentMethod==="cash"&&(!tendered||Number(tendered)<total))return notify("Enter tendered cash equal to or greater than the amount due.","error");
    if(paymentMethod==="gcash"&&!reference.trim())return notify("GCash payment reference is required.","error");
    setBusy(true);
    const snapshot={
      branch:selectedBranch?.name||"Branch",
      customer:ws.customers.find(c=>String(c.id)===String(customerId))?.name||"Walk-in customer",
      subtotal,discount,total,paymentMethod,
      tendered:paymentMethod==="cash"?Number(tendered):null,
      changeDue:paymentMethod==="cash"?Math.max(0,Number(tendered)-total):0,
      specialDiscountType,specialDiscountReference,
      promoNames:promoBundles.map(b=>b.name),
      lines:orderLines()
    };
    try{
      const result=await api("/pos/checkout",{method:"POST",body:{
        branchId,paymentMethod,paymentReference:reference,tendered:paymentMethod==="cash"?Number(tendered):null,
        customerId:customerId||null,specialDiscountType:specialDiscountType||null,specialDiscountReference,
        items:cart.map(i=>({productId:String(i.id),qty:i.qty})),
        promoBundles:promoBundles.map(b=>({promoId:b.promoId,selections:b.selections}))
      }});
      setSuccessReceipt({...snapshot,...result,referenceNo:result.referenceNo,paymentReference:reference,createdAt:new Date().toISOString()});
      notify(result.referenceNo+" completed · "+money(result.total),result.lowStockNames?.length?"warn":"");
      if(result.lowStockNames?.length)setTimeout(()=>notify("Low stock: "+result.lowStockNames.join(", "),"warn"),600);
      clearOrder();await reload();
    }catch(err){notify(err.message,"error");}finally{setBusy(false);}
  };

  const printInvoice=receipt=>{
    const w=window.open("","_blank","width=520,height=760");
    if(!w)return notify("Allow pop-ups to print the invoice.","warn");
    const esc=v=>String(v??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
    w.document.write(`<!doctype html><html><head><title>${esc(receipt.referenceNo)}</title><style>body{font-family:Arial,sans-serif;width:320px;margin:0 auto;padding:24px;color:#111}h1{font-size:20px;text-align:center;margin:0}.sub{text-align:center;font-size:11px;margin:4px 0 16px}.row{display:flex;justify-content:space-between;gap:12px;padding:5px 0;font-size:11px}.line{border-bottom:1px dashed #aaa;padding:7px 0}.line b,.line small{display:block}.line small{font-size:9px}.total{font-size:16px;font-weight:bold;border-top:1px dashed #333;margin-top:8px;padding-top:10px}.foot{text-align:center;margin-top:18px;font-size:9px}@media print{body{padding:0}}</style></head><body><h1>BrewPoint</h1><div class="sub">${esc(ws.business.name)} · ${esc(receipt.branch)}<br>${esc(dateTime(receipt.createdAt))}</div><div class="row"><span>Invoice</span><b>${esc(receipt.referenceNo)}</b></div><div class="row"><span>Customer</span><b>${esc(receipt.customer)}</b></div>${receipt.lines.map(x=>`<div class="line"><b>${esc(x.name)}</b><small>${esc(x.qty)} × ${x.unit==null?"Promo selection":esc(money(x.unit))}</small>${x.total==null?"":`<div class="row"><span></span><b>${esc(money(x.total))}</b></div>`}</div>`).join("")}<div class="row"><span>Subtotal</span><b>${esc(money(receipt.subtotal))}</b></div><div class="row"><span>Discount</span><b>-${esc(money(receipt.discount))}</b></div><div class="row total"><span>Total</span><b>${esc(money(receipt.total))}</b></div><div class="row"><span>Payment</span><b>${esc(String(receipt.paymentMethod).toUpperCase())}</b></div>${receipt.paymentMethod==="cash"?`<div class="row"><span>Tendered</span><b>${esc(money(receipt.tendered))}</b></div><div class="row"><span>Change</span><b>${esc(money(receipt.changeDue))}</b></div>`:`<div class="row"><span>GCash ref.</span><b>${esc(receipt.paymentReference)}</b></div>`}<div class="foot">Thank you for choosing ${esc(ws.business.name)}.</div><script>window.onload=()=>window.print()<\/script></body></html>`);
    w.document.close();
  };

  return <div className="pos" data-guide="pos-root">
    <section className="catalog" data-guide="pos-catalog">
      <div className="catalog-top"><div className="search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={category==="Promos"?"Search promos…":"Search menu…"}/></div><select value={branchId} disabled={Boolean(assignedBranchId)} onChange={e=>setBranchId(e.target.value)}>{ws.branches.filter(b=>!assignedBranchId||String(b.id)===assignedBranchId).map(b=><option key={b.id} value={b.id}>{b.name}{b.is_maintenance?" · maintenance":assignedBranchId?" · assigned":""}</option>)}</select></div>
      {branchMaintenance&&<div className="maintenance-banner"><ShieldCheck/><div><b>{selectedBranch?.name} is Under Maintenance</b><span>This branch cannot create POS transactions until the Owner/Admin reopens it from Team & Branches.</span></div></div>}
      <div className="chips" data-guide="pos-categories">{["All",...categoryNames,"Promos"].map(c=><button key={c} className={category===c?"active":""} onClick={()=>setCategory(c)} disabled={branchMaintenance}>{c}</button>)}</div>
      {category!=="Promos"?<div className="products">{products.map(p=><button className="product" disabled={branchMaintenance} key={p.id} onClick={()=>add(p)}><span>{p.category_name==="Food"?"🥐":"☕"}</span><b>{p.name}</b><small>{p.category_name}</small><strong>{money(p.price)}</strong><i><Plus size={14}/></i></button>)}</div>:<div className="promo-catalog">{activePromos.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())).map(p=>{const rules=promoRules(p);return <button className="promo-product" disabled={branchMaintenance} key={p.id} onClick={()=>openPromo(p)}><span className="promo-icon"><Tags/></span><b>{p.name}</b><small>{rules.length?rules.map(r=>{const c=ws.categories.find(x=>String(x.id)===String(r.categoryId));return r.qty+"× "+(c?.name||"Category")+(r.productIds?.length?" · restricted":"")}).join(" + "):"Needs promo rules"}</small><strong>{p.promo_type==="set_price"?money(p.value)+" set price":p.promo_type==="percentage"?p.value+"% off":money(p.value)+" off"}</strong><i><Plus size={14}/></i></button>})}{!activePromos.length&&<Empty Icon={Tags} text="No active promos configured."/>}</div>}
    </section>

    <aside className="cart" data-guide="pos-order">
      <header><div><h3>Current order</h3><small>{cart.reduce((s,i)=>s+i.qty,0)+promoBundles.reduce((s,b)=>s+b.selections.reduce((n,x)=>n+x.qty,0),0)} item(s)</small></div><button className="icon-btn" onClick={clearOrder}><Trash2 size={16}/></button></header>
      <div className="cart-lines">
        {cart.map(i=><div className="cart-line" key={i.id}><div><b>{i.name}</b><strong>{money(Number(i.price)*i.qty)}</strong></div><small>{money(i.price)} each</small><div className="qty"><button onClick={()=>qty(i.id,-1)}><Minus/></button><span>{i.qty}</span><button onClick={()=>qty(i.id,1)}><Plus/></button></div></div>)}
        {promoBundles.map(b=><div className="cart-line promo-cart-line" key={b.id}><div><b>{b.name}</b><strong>{money(b.total)}</strong></div><small>{b.items.map(x=>x.qty+"× "+x.name).join(" · ")} · save {money(b.discount)}</small><button className="remove-promo" onClick={()=>setPromoBundles(cur=>cur.filter(x=>x.id!==b.id))}>Remove promo</button></div>)}
        {!cart.length&&!promoBundles.length&&<Empty text="Tap a product or open the Promos category."/>}
      </div>
      <div className="checkout" data-guide="pos-discount">
        <label>Customer<select value={customerId} onChange={e=>setCustomerId(e.target.value)}><option value="">Walk-in customer</option>{ws.customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        <label>Senior / PWD discount<select value={specialDiscountType} disabled={promoBundles.length>0||branchMaintenance} onChange={e=>{setSpecialDiscountType(e.target.value);setSpecialDiscountReference("")}}><option value="">No special discount</option><option value="senior">Senior Citizen · 20%</option><option value="pwd">PWD · 20%</option></select></label>
        {promoBundles.length>0&&<div className="discount-lock"><Tags size={13}/>Senior/PWD cannot be combined with an existing promo.</div>}
        {specialDiscountType&&<label>{specialDiscountType==="senior"?"Senior ID / reference *":"PWD ID / reference *"}<input required value={specialDiscountReference} onChange={e=>setSpecialDiscountReference(e.target.value)} placeholder="Required before payment"/></label>}
        {discount>0&&<div className="summary-line"><span>{promoBundles.length?"Promo savings":specialDiscountType==="senior"?"Senior Citizen 20%":"PWD 20%"}</span><b>-{money(discount)}</b></div>}
        <div className="total"><span>Total</span><strong>{money(total)}</strong></div>
        <button className="btn primary wide pay-open" disabled={branchMaintenance||(!cart.length&&!promoBundles.length)||(specialDiscountType&&!specialDiscountReference.trim())} onClick={openPayment}>Proceed to payment</button>
      </div>
    </aside>

    {promoBuilder&&<div className="modal-overlay"><div className="promo-builder"><header><div><span className="pill">PROMO BUILDER</span><h2>{promoBuilder.promo.name}</h2><p>Select only from the exact products authorized by the Owner/Admin for each promo requirement.</p></div><button className="icon-btn" onClick={()=>setPromoBuilder(null)}><X/></button></header><div className="promo-slots">{promoBuilder.slots.map((slot,idx)=>{let eligible=ws.products.filter(p=>p.is_active&&String(p.category_id)===String(slot.categoryId));if(slot.productIds?.length)eligible=eligible.filter(p=>slot.productIds.includes(String(p.id)));return <label key={idx}>{slot.label} #{idx+1}<select required value={slot.productId} onChange={e=>setPromoSlot(idx,e.target.value)}><option value="">Select {slot.label}</option>{eligible.map(p=><option key={p.id} value={p.id}>{p.name} · {money(p.price)}</option>)}</select>{!eligible.length&&<small className="field-error">No allowed products are available for this slot.</small>}</label>})}</div><div className="promo-builder-total"><span>Promo price</span><strong>{promoBuilder.promo.promo_type==="set_price"?money(promoBuilder.promo.value):promoBuilder.promo.promo_type==="percentage"?promoBuilder.promo.value+"% off":money(promoBuilder.promo.value)+" off"}</strong></div><div className="form-actions"><button className="btn secondary" onClick={()=>setPromoBuilder(null)}>Cancel</button><button className="btn primary" disabled={promoBuilder.slots.some(s=>!s.productId)} onClick={addPromoBundle}>Add promo to order</button></div></div></div>}

    {paymentOpen&&<div className="modal-overlay payment-modal-overlay"><div className="payment-modal" data-guide="payment-modal">
      {!successReceipt?<>
        <header className="payment-head"><button className="back-pay" onClick={()=>setPaymentOpen(false)}>← Back to sale</button><div><span>Amount to pay</span><strong>{money(total)}</strong></div><button className="icon-btn" onClick={()=>setPaymentOpen(false)}><X/></button></header>
        <div className="payment-layout">
          <section className="payment-entry">
            <h3>Select mode of payment</h3>
            <div className="payment-method-cards"><button className={paymentMethod==="cash"?"active":""} onClick={()=>setPaymentMethod("cash")}>Cash</button><button className={paymentMethod==="gcash"?"active":""} onClick={()=>setPaymentMethod("gcash")}>GCash QR</button></div>
            {paymentMethod==="cash"?<div className="cash-entry"><label>Tendered amount *<input autoFocus type="number" min={total} value={tendered} onChange={e=>setTendered(e.target.value)} placeholder={money(total)}/></label><div className="quick-cash"><button onClick={()=>setTendered(String(total))}>Exact {money(total)}</button>{[100,200,500,1000].filter(v=>v>=total).slice(0,3).map(v=><button key={v} onClick={()=>setTendered(String(v))}>{money(v)}</button>)}</div>{tendered&&Number(tendered)>=total&&<div className="change-preview"><span>Change</span><strong>{money(Number(tendered)-total)}</strong></div>}</div>:<div className="gcash-modal-pay">{ws.business.gcashQrData?<img src={ws.business.gcashQrData} alt="GCash QR"/>:<QrCode className="missing-qr"/>}<div><b>Scan the café's GCash QR</b><small>{[ws.business.gcashAccountName,ws.business.gcashAccountNumber].filter(Boolean).join(" · ")||"QR not configured by Owner/Admin"}</small></div><label>GCash reference *<input required value={reference} onChange={e=>setReference(e.target.value)} placeholder="Enter payment reference after successful scan"/></label></div>}
            <button className="btn primary wide confirm-payment" disabled={busy||(paymentMethod==="cash"&&(!tendered||Number(tendered)<total))||(paymentMethod==="gcash"&&(!ws.business.gcashQrData||!reference.trim()))} onClick={checkout}>{busy?"Processing…":"Confirm payment & generate invoice"}</button>
          </section>
          <aside className="payment-summary"><h3>Sale summary</h3><div className="payment-summary-lines">{cart.map(i=><div key={i.id}><span><b>{i.name}</b><small>{i.qty} × {money(i.price)}</small></span><strong>{money(Number(i.price)*i.qty)}</strong></div>)}{promoBundles.map(b=><div key={b.id}><span><b>{b.name}</b><small>{b.items.map(x=>x.qty+"× "+x.name).join(" · ")}</small></span><strong>{money(b.total)}</strong></div>)}</div><div className="payment-summary-totals"><div><span>Subtotal</span><b>{money(subtotal)}</b></div><div><span>Discount</span><b>-{money(discount)}</b></div><div className="grand"><span>Grand total</span><strong>{money(total)}</strong></div></div></aside>
        </div>
      </>:<div className="payment-success"><div className="success-icon"><Check/></div><h2>Payment successful</h2><p>Order <b>{successReceipt.referenceNo}</b> has been successfully placed.</p><div className="success-total"><span>Paid</span><strong>{money(successReceipt.total)}</strong></div>{successReceipt.paymentMethod==="cash"&&<div className="success-change"><span>Change</span><b>{money(successReceipt.changeDue)}</b></div>}<div className="success-actions"><button className="btn primary" onClick={()=>printInvoice(successReceipt)}><Printer/>Print invoice</button><button className="btn secondary" onClick={()=>{setPaymentOpen(false);setSuccessReceipt(null)}}>New sale</button></div></div>}
    </div></div>}
  </div>;
}

function Inventory({ws,reload,notify}) {
  const [showAdd,setShowAdd]=useState(false);
  const [editingId,setEditingId]=useState(null);
  const [ingredient,setIngredient]=useState({name:"",uom:"PCS",stockQty:"0",lowStockThreshold:"0",costPerUnit:"0"});
  const [adjust,setAdjust]=useState({ingredientId:String(ws.ingredients[0]?.id||""),branchId:String(ws.branches[0]?.id||""),movementType:"replenish",quantity:"",notes:""});
  const resetIngredient=()=>{setEditingId(null);setIngredient({name:"",uom:"PCS",stockQty:"0",lowStockThreshold:"0",costPerUnit:"0"});setShowAdd(false);};
  const editIngredient=i=>{setEditingId(String(i.id));setIngredient({name:i.name,uom:i.uom,stockQty:String(i.stock_qty),lowStockThreshold:String(i.low_stock_threshold),costPerUnit:String(i.cost_per_unit)});setShowAdd(true);};
  const save=async()=>{try{await api("/ingredients/save",{method:"POST",body:{id:editingId||undefined,...ingredient,stockQty:Number(ingredient.stockQty),lowStockThreshold:Number(ingredient.lowStockThreshold),costPerUnit:Number(ingredient.costPerUnit)}});notify(editingId?"Ingredient updated":"Ingredient saved");resetIngredient();await reload();}catch(err){notify(err.message,"error");}};
  const remove=async i=>{if(!window.confirm("Delete ingredient '"+i.name+"'? It can only be deleted when no recipe uses it."))return;try{await api("/ingredients/"+i.id,{method:"DELETE"});notify("Ingredient deleted");await reload();}catch(err){notify(err.message,"error");}};
  const post=async()=>{try{await api("/inventory/adjust",{method:"POST",body:{...adjust,quantity:Number(adjust.quantity)}});notify("Stock movement posted");setAdjust({...adjust,quantity:"",notes:""});await reload();}catch(err){notify(err.message,"error");}};
  return <div className="stack">
    <section className="section-bar"><div><h2>Ingredient inventory</h2><p>Recipe stock deducts automatically after checkout, with full editing and movement history.</p></div><button className="btn primary" onClick={()=>{if(showAdd)resetIngredient();else setShowAdd(true)}}><Plus/>{showAdd?"Close editor":"Add ingredient"}</button></section>
    {showAdd&&<Panel title={editingId?"Edit ingredient":"New ingredient"} sub="Stock, threshold, unit of measure, and cost per unit"><div className="form-grid">{["name","uom","stockQty","lowStockThreshold","costPerUnit"].map(k=><label key={k}>{({name:"Name",uom:"UOM",stockQty:"Current stock",lowStockThreshold:"Low-stock level",costPerUnit:"Cost / unit"})[k]}<input type={["stockQty","lowStockThreshold","costPerUnit"].includes(k)?"number":"text"} value={ingredient[k]} onChange={e=>setIngredient({...ingredient,[k]:e.target.value})}/></label>)}<div className="form-actions">{editingId&&<button className="btn secondary" onClick={resetIngredient}>Cancel</button>}<button className="btn primary" onClick={save}>{editingId?"Save changes":"Save ingredient"}</button></div></div></Panel>}
    <div className="two-col">
      <Panel title="Stock levels" sub={"Inventory value "+money(ws.summary.inventoryValue)}><div className="table-scroll"><table className="report-table"><thead><tr><th>Ingredient</th><th>Stock</th><th>Low at</th><th>Unit cost</th><th>Actions</th></tr></thead><tbody>{ws.ingredients.map(i=><tr key={i.id}><td><b>{i.name}</b><small>{i.uom}</small></td><td className={Number(i.stock_qty)<=Number(i.low_stock_threshold)?"warning":""}>{Number(i.stock_qty).toLocaleString()} {i.uom}</td><td>{Number(i.low_stock_threshold).toLocaleString()} {i.uom}</td><td>{money(i.cost_per_unit)}</td><td><span className="row-actions"><button className="btn secondary tiny" onClick={()=>editIngredient(i)}>Edit</button><button className="btn danger tiny" onClick={()=>remove(i)}>Delete</button></span></td></tr>)}</tbody></table></div></Panel>
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
  const [categoryName,setCategoryName]=useState("");
  const ingredientById=id=>ws.ingredients.find(x=>String(x.id)===String(id));
  const cost=form.recipes.reduce((sum,r)=>sum+Number(ingredientById(r.ingredientId)?.cost_per_unit||0)*Number(r.qtyRequired||0),0);
  const grossMargin=Math.max(0,Number(form.price||0)-cost);
  const marginPct=Number(form.price||0)>0?grossMargin/Number(form.price)*100:0;
  const reset=()=>{setEditing(null);setForm({name:"",categoryId:String(ws.categories[0]?.id||""),price:"",sku:"",recipes:[]});setRq("");};
  const edit=p=>{setEditing(p);setForm({name:p.name,categoryId:String(p.category_id||ws.categories[0]?.id||""),price:String(p.price),sku:p.sku||"",recipes:ws.recipes.filter(r=>String(r.product_id)===String(p.id)).map(r=>({ingredientId:String(r.ingredient_id),qtyRequired:Number(r.qty_required)}))});};
  const addRecipe=()=>{if(!ri||Number(rq)<=0)return;setForm({...form,recipes:[...form.recipes.filter(r=>r.ingredientId!==ri),{ingredientId:ri,qtyRequired:Number(rq)}]});setRq("");};
  const updateQty=(ingredientId,value)=>setForm({...form,recipes:form.recipes.map(r=>r.ingredientId===ingredientId?{...r,qtyRequired:Number(value)}:r)});
  const save=async()=>{try{await api("/products/save",{method:"POST",body:{id:editing?.id,name:form.name,categoryId:form.categoryId,price:Number(form.price),sku:form.sku,recipes:form.recipes}});notify(editing?"Product recipe & costing updated":"Product added");reset();await reload();}catch(err){notify(err.message,"error");}};
  const removeProduct=async p=>{if(!window.confirm("Delete product '"+p.name+"'? Historical receipt lines will remain in reports."))return;try{await api("/products/"+p.id,{method:"DELETE"});notify("Product deleted");if(editing?.id===p.id)reset();await reload();}catch(err){notify(err.message,"error");}};
  const addCategory=async()=>{if(!categoryName.trim())return;try{const r=await api("/categories",{method:"POST",body:{name:categoryName}});notify("Category created");setCategoryName("");await reload();setForm(cur=>({...cur,categoryId:String(r.id)}));}catch(err){notify(err.message,"error");}};
  const removeCategory=async c=>{if(!window.confirm("Delete category '"+c.name+"'? It must be empty first."))return;try{await api("/categories/"+c.id,{method:"DELETE"});notify("Category deleted");await reload();}catch(err){notify(err.message,"error");}};
  const recipeCost=id=>ws.recipes.filter(r=>String(r.product_id)===String(id)).reduce((sum,r)=>sum+Number(ingredientById(r.ingredient_id)?.cost_per_unit||0)*Number(r.qty_required),0);
  return <div className="stack">
    <section className="section-bar"><div><h2>Products, recipes & costing</h2><p>Edit recipes, ingredient quantities, categories, prices, and product profitability.</p></div></section>
    <Panel title="Categories" sub="Manage the categories used on the POS"><div className="category-manager"><div className="category-chips">{ws.categories.map(c=><span key={c.id}>{c.name}<button onClick={()=>removeCategory(c)} title="Delete empty category">×</button></span>)}</div><div className="category-add"><input value={categoryName} onChange={e=>setCategoryName(e.target.value)} placeholder="New category name"/><button className="btn secondary" onClick={addCategory}>Add category</button></div></div></Panel>
    <div className="two-col product-costing-layout">
      <Panel title="Menu costing" sub={ws.products.length+" menu items"}><div className="table-scroll"><table className="report-table"><thead><tr><th>Product</th><th>Price</th><th>Recipe cost</th><th>Gross margin</th><th>Margin</th><th>Actions</th></tr></thead><tbody>{ws.products.map(p=>{const c=recipeCost(p.id);const gm=Number(p.price)-c;return <tr key={p.id}><td><b>{p.name}</b><small>{p.category_name} · {p.sku||"No SKU"}</small></td><td>{money(p.price)}</td><td>{money(c)}</td><td>{money(gm)}</td><td>{Number(p.price)>0?(gm/Number(p.price)*100).toFixed(1):"0.0"}%</td><td><span className="row-actions"><button className="btn secondary tiny" onClick={()=>edit(p)}>Edit recipe</button><button className="btn danger tiny" onClick={()=>removeProduct(p)}>Delete</button></span></td></tr>})}</tbody></table></div></Panel>
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
  const canManagePromos=["owner","admin"].includes(ws.business.memberRole);
  const blankCustomer={name:"",phone:"",email:"",notes:""};
  const [editingCustomer,setEditingCustomer]=useState(null);
  const [customer,setCustomer]=useState(blankCustomer);
  const [customerHistory,setCustomerHistory]=useState(null);
  const [historyLoading,setHistoryLoading]=useState(false);

  const emptyPromo={name:"",promoType:"set_price",value:"",isActive:true,rules:[]};
  const [editingPromo,setEditingPromo]=useState(null);
  const [promo,setPromo]=useState(emptyPromo);

  const normalizedRules=p=>{
    if(Array.isArray(p?.rules)&&p.rules.length)return p.rules.map(r=>({
      categoryId:String(r.categoryId),
      qty:Number(r.qty||1),
      productIds:Array.isArray(r.productIds)?r.productIds.map(String):[]
    }));
    if(String(p?.name||"").toLowerCase().includes("143")){
      const coffee=ws.categories.find(c=>String(c.name).toLowerCase()==="coffee")||ws.categories.find(c=>String(c.name).toLowerCase().includes("coffee"));
      const food=ws.categories.find(c=>String(c.name).toLowerCase()==="food")||ws.categories.find(c=>String(c.name).toLowerCase().includes("food"));
      if(coffee&&food)return [{categoryId:String(coffee.id),qty:1,productIds:[]},{categoryId:String(food.id),qty:1,productIds:[]}];
    }
    return [];
  };

  const resetCustomer=()=>{setEditingCustomer(null);setCustomer(blankCustomer);};
  const editCustomer=c=>{setEditingCustomer(c);setCustomer({name:c.name,phone:c.phone||"",email:c.email||"",notes:c.notes||""});};
  const openHistory=async c=>{setHistoryLoading(true);try{setCustomerHistory(await api("/customers/"+c.id+"/history"));}catch(err){notify(err.message,"error");}finally{setHistoryLoading(false);}};
  const saveCustomer=async()=>{
    if(customer.name.trim().length<2){notify("Customer name is required.","error");return;}
    if(customer.email && !customer.email.includes("@")){notify("Enter a valid customer email or leave it blank.","error");return;}
    try{await api("/customers",{method:"POST",body:{id:editingCustomer?.id,...customer}});notify(editingCustomer?"Customer updated":"Customer saved");resetCustomer();await reload();if(customerHistory?.customer?.id===editingCustomer?.id)setCustomerHistory(null);}catch(err){notify(err.message,"error");}
  };
  const deleteCustomer=async c=>{if(!window.confirm("Delete customer '"+c.name+"'? Historical receipts will remain, but the customer link will be removed."))return;try{await api("/customers/"+c.id,{method:"DELETE"});notify("Customer deleted");if(editingCustomer?.id===c.id)resetCustomer();if(customerHistory?.customer?.id===c.id)setCustomerHistory(null);await reload();}catch(err){notify(err.message,"error");}};

  const resetPromo=()=>{setEditingPromo(null);setPromo(emptyPromo);};
  const editPromo=p=>{setEditingPromo(p);setPromo({name:p.name,promoType:p.promo_type,value:String(p.value),isActive:Boolean(p.is_active),rules:normalizedRules(p)});};
  const firstUsable=()=>String(ws.categories.find(c=>String(c.name).toLowerCase()!=="promos")?.id||"");
  const addPromoRule=()=>setPromo(cur=>({...cur,rules:[...cur.rules,{categoryId:firstUsable(),qty:1,productIds:[]}]}));
  const updatePromoRule=(index,patch)=>setPromo(cur=>({...cur,rules:cur.rules.map((r,i)=>i===index?{...r,...patch}:r)}));
  const changeRuleCategory=(index,categoryId)=>updatePromoRule(index,{categoryId,productIds:[]});
  const toggleAllowedProduct=(index,productId)=>setPromo(cur=>({...cur,rules:cur.rules.map((r,i)=>{
    if(i!==index)return r;
    const set=new Set((r.productIds||[]).map(String));
    if(set.has(String(productId)))set.delete(String(productId));else set.add(String(productId));
    return {...r,productIds:[...set]};
  })}));
  const selectAllRuleProducts=(index,categoryId)=>setPromo(cur=>({...cur,rules:cur.rules.map((r,i)=>i===index?{...r,productIds:ws.products.filter(p=>p.is_active&&String(p.category_id)===String(categoryId)).map(p=>String(p.id))}:r)}));
  const clearRuleProducts=index=>updatePromoRule(index,{productIds:[]});
  const removePromoRule=index=>setPromo(cur=>({...cur,rules:cur.rules.filter((_,i)=>i!==index)}));
  const savePromo=async()=>{
    if(!canManagePromos)return notify("Only the Owner or Tenant Admin can manage promos.","error");
    if(promo.name.trim().length<2)return notify("Promo name is required.","error");
    if(!Number(promo.value)||Number(promo.value)<=0)return notify("Enter a valid promo price or discount value.","error");
    if(promo.promoType==="percentage"&&Number(promo.value)>100)return notify("Percentage discount cannot exceed 100%.","error");
    if(!promo.rules.length)return notify("Add at least one promo requirement, such as 1× Coffee + 1× Food.","error");
    if(promo.rules.some(r=>!r.categoryId||Number(r.qty)<1))return notify("Every promo requirement needs a category and quantity.","error");
    try{
      await api("/promos",{method:"POST",body:{id:editingPromo?.id,...promo,value:Number(promo.value),rules:promo.rules.map(r=>({categoryId:r.categoryId,qty:Number(r.qty),productIds:r.productIds||[]}))}});
      notify(editingPromo?"Promo updated":"Promo created");resetPromo();await reload();
    }catch(err){notify(err.message,"error");}
  };
  const deletePromo=async p=>{if(!window.confirm("Delete promo '"+p.name+"'? Existing transaction history will remain unchanged."))return;try{await api("/promos/"+p.id,{method:"DELETE"});notify("Promo deleted");if(editingPromo?.id===p.id)resetPromo();await reload();}catch(err){notify(err.message,"error");}};

  const usableCategories=ws.categories.filter(c=>String(c.name).toLowerCase()!=="promos");

  return <div className="stack" data-guide="customers-root">
    <section className="section-bar"><div><h2>{canManagePromos?"Customers & promos":"Customers"}</h2><p>{canManagePromos?"Manage repeat customers, purchase history, and the promo combinations cashiers are allowed to sell.":"Cashiers can add and look up customers here. Promo setup is restricted to the Owner and Tenant Admin."}</p></div></section>

    {customerHistory&&<Panel title={customerHistory.customer.name+" · purchase history"} sub="Completed receipts and lifetime value">
      <div className="customer-history-head">
        <Metric label="Completed visits" value={customerHistory.summary.visits} sub="Receipts linked to this customer"/>
        <Metric label="Lifetime spend" value={money(customerHistory.summary.lifetimeSpend)} sub="Completed transactions"/>
        <Metric label="Average ticket" value={money(customerHistory.summary.averageTicket)} sub="Per completed receipt"/>
        <Metric label="Last visit" value={customerHistory.summary.lastVisit?dateTime(customerHistory.summary.lastVisit):"—"} sub="Most recent purchase"/>
      </div>
      <div className="table-scroll"><table className="report-table"><thead><tr><th>Reference</th><th>Date</th><th>Branch</th><th>Cashier</th><th>Payment</th><th>Status</th><th>Total</th></tr></thead><tbody>{customerHistory.sales.map(s=><tr key={s.id}><td><b>{s.reference_no}</b></td><td>{dateTime(s.created_at)}</td><td>{s.branch_name}</td><td>{s.cashier_name||"—"}</td><td>{String(s.payment_method).toUpperCase()}</td><td><span className={"badge "+s.status}>{s.status}</span></td><td><b>{money(s.total)}</b></td></tr>)}</tbody></table>{!customerHistory.sales.length&&<Empty Icon={ReceiptText} text="No purchases linked to this customer yet."/>}</div>
      <div className="panel-footer"><button className="btn secondary" onClick={()=>setCustomerHistory(null)}>Close history</button></div>
    </Panel>}

    <div className={canManagePromos?"two-col":"single-col"}>
      <Panel title="Customers" sub={ws.customers.length+" saved"}>
        <div className="list customer-list">{ws.customers.map(c=><div key={c.id}><span><b>{c.name}</b><small>{[c.phone,c.email].filter(Boolean).join(" · ")||"No contact details"}{c.notes?" · "+c.notes:""}</small></span><span className="row-actions"><button className="btn secondary tiny" disabled={historyLoading} onClick={()=>openHistory(c)}>History</button><button className="btn secondary tiny" onClick={()=>editCustomer(c)}>Edit</button>{canManagePromos&&<button className="btn danger tiny" onClick={()=>deleteCustomer(c)}>Delete</button>}</span></div>)}{!ws.customers.length&&<Empty Icon={Users} text="No customers saved yet."/>}</div>
        <div className="form-stack inset" data-guide="customer-form"><h4 className="inline-form-title">{editingCustomer?"Edit "+editingCustomer.name:"New customer"}</h4><label>Name *<input required value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})}/></label><label>Phone<input value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value})}/></label><label>Email<input type="email" value={customer.email} onChange={e=>setCustomer({...customer,email:e.target.value})}/></label><label>Notes<input value={customer.notes} onChange={e=>setCustomer({...customer,notes:e.target.value})} placeholder="Preferences, usual order, reminders…"/></label><div className="form-actions">{editingCustomer&&<button className="btn secondary" onClick={resetCustomer}>Cancel</button>}<button className="btn primary" disabled={customer.name.trim().length<2} onClick={saveCustomer}>{editingCustomer?"Save customer":"Add customer"}</button></div></div>
      </Panel>

      {canManagePromos&&<Panel title="Promos" sub="Owner/Admin only · define both the category and exact products cashiers may choose">
        <div className="list promo-list">{ws.promos.map(p=>{const rules=normalizedRules(p);return <div key={p.id}><span><b>{p.name}</b><small>{p.promo_type.replaceAll("_"," ")} · {p.is_active?"Active":"Inactive"} · {rules.length?rules.map(r=>{const c=ws.categories.find(x=>String(x.id)===String(r.categoryId));const allowed=(r.productIds||[]).length;return r.qty+"× "+(c?.name||"Category")+(allowed?" · "+allowed+" allowed":" · all allowed")}).join(" + "):"No requirements"}</small></span><span className="row-actions"><strong>{p.promo_type==="percentage"?p.value+"%":money(p.value)}</strong><button className="btn secondary tiny" onClick={()=>editPromo(p)}>Edit</button><button className="btn danger tiny" onClick={()=>deletePromo(p)}>Delete</button></span></div>})}{!ws.promos.length&&<Empty Icon={Tags} text="No promos yet."/>}</div>

        <div className="form-stack inset" data-guide="promo-editor">
          <h4 className="inline-form-title">{editingPromo?"Edit "+editingPromo.name:"New promo"}</h4>
          <label>Promo name *<input required value={promo.name} onChange={e=>setPromo({...promo,name:e.target.value})}/></label>
          <div className="form-grid promo-basic-grid"><label>Type<select value={promo.promoType} onChange={e=>setPromo({...promo,promoType:e.target.value})}><option value="set_price">Set promo bundle price</option><option value="fixed_discount">Fixed discount from selected bundle</option><option value="percentage">Percentage discount on selected bundle</option></select></label><label>{promo.promoType==="set_price"?"Promo bundle price *":"Value *"}<input required min="0.01" type="number" value={promo.value} onChange={e=>setPromo({...promo,value:e.target.value})}/></label></div>

          <div className="promo-rule-editor">
            <div className="promo-rule-head"><div><b>Promo requirements</b><small>Choose a category, required quantity, then optionally limit exactly which products may be picked.</small></div><button className="btn secondary small" onClick={addPromoRule}><Plus/>Add requirement</button></div>
            {promo.rules.map((r,index)=>{
              const eligible=ws.products.filter(p=>p.is_active&&String(p.category_id)===String(r.categoryId));
              return <div className="promo-rule-card" key={index}>
                <div className="promo-rule-row"><select value={r.categoryId} onChange={e=>changeRuleCategory(index,e.target.value)}>{usableCategories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><input type="number" min="1" step="1" value={r.qty} onChange={e=>updatePromoRule(index,{qty:Math.max(1,Number(e.target.value||1))})}/><span>item(s)</span><button className="icon-btn danger-icon" onClick={()=>removePromoRule(index)}><Trash2 size={14}/></button></div>
                <div className="allowed-products-head"><div><b>Allowed products</b><small>{(r.productIds||[]).length?"Only checked products can be selected in POS.":"No products checked = all products in this category are allowed."}</small></div><span className="row-actions"><button className="btn secondary tiny" onClick={()=>selectAllRuleProducts(index,r.categoryId)}>Select all</button><button className="btn secondary tiny" onClick={()=>clearRuleProducts(index)}>Allow all</button></span></div>
                <div className="allowed-products">{eligible.map(p=><label key={p.id} className={(r.productIds||[]).includes(String(p.id))?"selected":""}><input type="checkbox" checked={(r.productIds||[]).includes(String(p.id))} onChange={()=>toggleAllowedProduct(index,p.id)}/><span>{p.name}</span></label>)}{!eligible.length&&<span className="no-products">No active products in this category.</span>}</div>
              </div>;
            })}
            {!promo.rules.length&&<div className="promo-rule-empty">Add the product categories required by this promo before saving it.</div>}
          </div>

          <label className="checkbox-row"><input type="checkbox" checked={promo.isActive} onChange={e=>setPromo({...promo,isActive:e.target.checked})}/><span>Active and available in the POS Promos category</span></label>
          <div className="form-actions">{editingPromo&&<button className="btn secondary" onClick={resetPromo}>Cancel</button>}<button className="btn primary" disabled={promo.name.trim().length<2||!Number(promo.value)||!promo.rules.length} onClick={savePromo}>{editingPromo?"Save promo":"Create promo"}</button></div>
        </div>
      </Panel>}
    </div>
  </div>;
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
  const [receiptDetail,setReceiptDetail]=useState(null);
  const [receiptLoading,setReceiptLoading]=useState(false);
  const [voiding,setVoiding]=useState(null);
  const [reason,setReason]=useState("");
  const load=async()=>{try{const q=new URLSearchParams({period});if(branchId)q.set("branchId",branchId);if(employeeId)q.set("employeeId",employeeId);setReport(await api("/reports?"+q.toString()));}catch(err){notify(err.message,"error");}};
  useEffect(()=>{load();},[period,branchId,employeeId,ws.sales.length]);
  const openReceipt=async sale=>{setReceiptLoading(true);try{setReceiptDetail(await api("/sales/"+sale.id));}catch(err){notify(err.message,"error");}finally{setReceiptLoading(false);}};
  const voidSale=async()=>{try{await api("/sales/void",{method:"POST",body:{saleId:String(voiding.id),reason}});notify("Transaction voided and ingredient stock restored");setVoiding(null);setReceiptDetail(null);setReason("");await reload();await load();}catch(err){notify(err.message,"error");}};
  const reportMatrix=()=>({
    summary:{title:"Sales summary",headers:["Date","Gross sales","Refunds / voids","Discounts","Net sales","COGS","Gross profit"],rows:report.breakdown.map(r=>[r.date,money(r.grossSales),money(r.refunds),money(r.discounts),money(r.netSales),money(r.cogs),money(r.grossProfit)])},
    items:{title:"Sales by item",headers:["Item","SKU","Category","Qty","Gross sales","Discounts","Net sales","COGS","Gross profit","Margin %"],rows:report.products.map(r=>[r.name,r.sku||"",r.category,r.qty,money(r.grossSales),money(r.discounts),money(r.netSales),money(r.cogs),money(r.grossProfit),Number(r.margin).toFixed(1)+"%"])},
    categories:{title:"Sales by category",headers:["Category","Qty","Gross sales","Discounts","Net sales","COGS","Gross profit","Margin %"],rows:report.categories.map(r=>[r.name,r.qty,money(r.grossSales),money(r.discounts),money(r.netSales),money(r.cogs),money(r.grossProfit),Number(r.margin).toFixed(1)+"%"])},
    employees:{title:"Sales by employee",headers:["Employee","Receipts","Net sales"],rows:report.employees.map(r=>[r.name,r.receipts,money(r.netSales)])},
    payments:{title:"Payment types",headers:["Payment type","Receipts","Net sales"],rows:report.paymentTypes.map(r=>[r.name,r.receipts,money(r.netSales)])},
    receipts:{title:"Receipts",headers:["Reference","Date","Branch","Employee","Customer","Payment","Status","Discount","Total"],rows:report.transactions.map(r=>[r.reference_no,dateTime(r.created_at),r.branch_name,r.cashier_name||"",r.customer_name||"Walk-in",r.payment_method,r.status,money(r.discount),money(r.total)])}
  })[view];
  const exportRows=()=>{if(!report)return;const pick=reportMatrix();const csv=[pick.headers,...pick.rows].map(r=>r.map(c=>'"'+String(c??"").replaceAll('"','""')+'"').join(",")).join("\n");const url=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));const el=document.createElement("a");el.href=url;el.download="BrewPoint-"+view+"-"+period+".csv";el.click();URL.revokeObjectURL(url);};
  const printReport=()=>{const pick=reportMatrix();const w=window.open("","_blank","width=1100,height=760");if(!w)return notify("Allow pop-ups to print the report.","warn");const esc=v=>String(v??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));w.document.write(`<!doctype html><html><head><title>BrewPoint - ${esc(pick.title)}</title><style>body{font-family:Arial,sans-serif;color:#10253d;padding:28px}h1{margin:0}p{color:#667;margin:6px 0 22px}.summary{display:flex;gap:20px;margin:18px 0}.summary div{border:1px solid #ddd;padding:10px 14px;border-radius:8px}.summary b{display:block;font-size:18px;margin-top:4px}table{width:100%;border-collapse:collapse;font-size:11px}th,td{border-bottom:1px solid #ddd;padding:8px;text-align:left}th{background:#f6f3ee}@media print{button{display:none}}</style></head><body><h1>BrewPoint · ${esc(pick.title)}</h1><p>${esc(ws.business.name)} · ${esc(period)} · Printed ${esc(new Date().toLocaleString())}</p><div class="summary"><div>Gross sales<b>${esc(money(report.grossSales))}</b></div><div>Net sales<b>${esc(money(report.netSales))}</b></div><div>Gross profit<b>${esc(money(report.grossProfit))}</b></div></div><table><thead><tr>${pick.headers.map(h=>"<th>"+esc(h)+"</th>").join("")}</tr></thead><tbody>${pick.rows.map(r=>"<tr>"+r.map(c=>"<td>"+esc(c)+"</td>").join("")+"</tr>").join("")}</tbody></table><script>window.onload=()=>window.print()<\/script></body></html>`);w.document.close();};
  if(!report)return <Loading text="Building reports…"/>;
  const tabs=[["summary","Sales summary"],["items","Sales by item"],["categories","By category"],["receipts","Receipts"],["employees","By employee"],["payments","Payment types"]];
  return <div className="stack">
    <section className="section-bar"><div><h2>Reports</h2><p>Sales summary, item/category performance, receipts, employees, and payment types.</p></div><div className="bar-actions report-filter-actions"><select value={period} onChange={e=>setPeriod(e.target.value)}><option value="daily">Today</option><option value="weekly">This week</option><option value="monthly">This month</option><option value="yearly">This year</option></select><select value={branchId} onChange={e=>setBranchId(e.target.value)}><option value="">All stores</option>{ws.branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select><select value={employeeId} onChange={e=>setEmployeeId(e.target.value)}><option value="">All employees</option>{ws.members.filter(m=>m.is_active).map(m=><option key={m.user_id} value={m.user_id}>{m.display_name}</option>)}</select><button className="btn secondary" onClick={printReport}><Printer/>Print report</button><button className="btn secondary" onClick={exportRows}>Export CSV</button></div></section>
    <div className="report-tabs">{tabs.map(([id,label])=><button key={id} className={view===id?"active":""} onClick={()=>setView(id)}>{label}</button>)}</div>
    <div className="metrics report-metrics"><Metric label="Gross sales" value={money(report.grossSales)} sub={report.orders+" completed receipts"}/><Metric label="Discounts" value={money(report.discounts)} sub="Applied discounts"/><Metric label="Net sales" value={money(report.netSales)} sub={"Cash "+money(report.cashSales)+" · GCash "+money(report.gcashSales)}/><Metric label="Gross profit" value={money(report.grossProfit)} sub={"COGS "+money(report.estimatedCogs)}/></div>

    {view==="summary"&&<Panel title="Sales summary" sub="Daily totals"><div className="table-scroll"><table className="report-table"><thead><tr><th>Date</th><th>Gross sales</th><th>Refunds / voids</th><th>Discounts</th><th>Net sales</th><th>COGS</th><th>Gross profit</th></tr></thead><tbody>{[...report.breakdown].reverse().map(r=><tr key={r.date}><td>{r.date}</td><td>{money(r.grossSales)}</td><td>{money(r.refunds)}</td><td>{money(r.discounts)}</td><td>{money(r.netSales)}</td><td>{money(r.cogs)}</td><td><b>{money(r.grossProfit)}</b></td></tr>)}</tbody></table></div></Panel>}
    {view==="items"&&<Panel title="Sales by item" sub="Quantity, revenue, cost, profit, and margin"><div className="table-scroll"><table className="report-table"><thead><tr><th>Item</th><th>SKU</th><th>Category</th><th>Sold</th><th>Gross sales</th><th>Discounts</th><th>Net sales</th><th>COGS</th><th>Gross profit</th><th>Margin</th></tr></thead><tbody>{report.products.map(r=><tr key={String(r.id)+r.name}><td><b>{r.name}</b></td><td>{r.sku||"—"}</td><td>{r.category}</td><td>{Number(r.qty).toLocaleString()}</td><td>{money(r.grossSales)}</td><td>{money(r.discounts)}</td><td>{money(r.netSales)}</td><td>{money(r.cogs)}</td><td><b>{money(r.grossProfit)}</b></td><td>{Number(r.margin).toFixed(1)}%</td></tr>)}</tbody></table></div></Panel>}
    {view==="categories"&&<Panel title="Sales by category"><div className="table-scroll"><table className="report-table"><thead><tr><th>Category</th><th>Items sold</th><th>Gross sales</th><th>Discounts</th><th>Net sales</th><th>COGS</th><th>Gross profit</th><th>Margin</th></tr></thead><tbody>{report.categories.map(r=><tr key={r.name}><td><b>{r.name}</b></td><td>{Number(r.qty).toLocaleString()}</td><td>{money(r.grossSales)}</td><td>{money(r.discounts)}</td><td>{money(r.netSales)}</td><td>{money(r.cogs)}</td><td><b>{money(r.grossProfit)}</b></td><td>{Number(r.margin).toFixed(1)}%</td></tr>)}</tbody></table></div></Panel>}
    {view==="employees"&&<Panel title="Sales by employee"><div className="table-scroll"><table className="report-table"><thead><tr><th>Employee</th><th>Receipts</th><th>Net sales</th><th>Average ticket</th></tr></thead><tbody>{report.employees.map(r=><tr key={r.id||r.name}><td><b>{r.name}</b></td><td>{r.receipts}</td><td>{money(r.netSales)}</td><td>{money(r.receipts?Number(r.netSales)/r.receipts:0)}</td></tr>)}</tbody></table></div></Panel>}
    {view==="payments"&&<Panel title="Sales by payment type"><div className="table-scroll"><table className="report-table"><thead><tr><th>Payment type</th><th>Receipts</th><th>Net sales</th><th>Share</th></tr></thead><tbody>{report.paymentTypes.map(r=><tr key={r.name}><td><b>{String(r.name).toUpperCase()}</b></td><td>{r.receipts}</td><td>{money(r.netSales)}</td><td>{report.netSales?((Number(r.netSales)/report.netSales)*100).toFixed(1):"0.0"}%</td></tr>)}</tbody></table></div></Panel>}

    {view==="receipts"&&<>
      {receiptDetail&&<Panel title={"Receipt "+receiptDetail.sale.reference_no} sub={dateTime(receiptDetail.sale.created_at)+" · "+receiptDetail.sale.branch_name}>
        <div className="receipt-detail-meta"><div><span>Cashier</span><b>{receiptDetail.sale.cashier_name||"—"}</b></div><div><span>Customer</span><b>{receiptDetail.sale.customer_name||"Walk-in"}</b></div><div><span>Payment</span><b>{String(receiptDetail.sale.payment_method).toUpperCase()}</b></div><div><span>Payment ref.</span><b>{receiptDetail.sale.payment_reference||"—"}</b></div><div><span>Status</span><b>{receiptDetail.sale.status}</b></div></div>
        <div className="receipt-items">{receiptDetail.items.map(item=><div key={item.id}><span><b>{item.product_name}</b><small>{Number(item.qty).toLocaleString()} × {money(item.unit_price)}</small></span><strong>{money(item.line_total)}</strong></div>)}</div>
        <div className="receipt-totals"><div><span>Subtotal</span><b>{money(receiptDetail.sale.subtotal)}</b></div><div><span>Discount</span><b>-{money(receiptDetail.sale.discount)}</b></div><div className="grand"><span>Total</span><strong>{money(receiptDetail.sale.total)}</strong></div>{receiptDetail.sale.payment_method==="cash"&&<><div><span>Tendered</span><b>{money(receiptDetail.sale.tendered)}</b></div><div><span>Change</span><b>{money(receiptDetail.sale.change_due)}</b></div></>}</div>
        <div className="panel-footer"><button className="btn secondary" onClick={()=>setReceiptDetail(null)}>Close receipt</button>{receiptDetail.sale.status==="completed"&&<button className="btn danger" onClick={()=>setVoiding(receiptDetail.sale)}>Void receipt</button>}</div>
      </Panel>}
      {voiding&&<Panel title={"Void "+voiding.reference_no} sub="The receipt remains in history and recipe stock is restored."><div className="void-form"><input value={reason} onChange={e=>setReason(e.target.value)} placeholder="Reason for void"/><button className="btn secondary" onClick={()=>setVoiding(null)}>Cancel</button><button className="btn danger" disabled={reason.trim().length<2} onClick={voidSale}>Confirm void</button></div></Panel>}
      <Panel title="Receipts" sub="Open a receipt to see its items, customer, payment reference, and totals"><div className="table-scroll"><table className="report-table"><thead><tr><th>Reference</th><th>Date</th><th>Branch</th><th>Employee</th><th>Customer</th><th>Payment</th><th>Status</th><th>Total</th><th>Actions</th></tr></thead><tbody>{report.transactions.map(s=><tr key={s.id}><td><b>{s.reference_no}</b></td><td>{dateTime(s.created_at)}</td><td>{s.branch_name}</td><td>{s.cashier_name||"—"}</td><td>{s.customer_name||"Walk-in"}</td><td>{String(s.payment_method).toUpperCase()}</td><td><span className={"badge "+s.status}>{s.status}</span></td><td><b>{money(s.total)}</b></td><td><span className="row-actions"><button className="btn secondary tiny" disabled={receiptLoading} onClick={()=>openReceipt(s)}>View</button>{s.status==="completed"&&<button className="btn secondary tiny" onClick={()=>setVoiding(s)}>Void</button>}</span></td></tr>)}</tbody></table></div></Panel>
    </>}
  </div>;
}

function Team({ws,reload,notify}) {
  const [show,setShow]=useState(false);
  const [staff,setStaff]=useState({displayName:"",email:"",password:"",role:"cashier",branchId:String(ws.branches[0]?.id||"")});
  const [branch,setBranch]=useState({name:"",address:""});
  const [editingBranch,setEditingBranch]=useState(null);
  const [branchEdit,setBranchEdit]=useState({name:"",address:""});
  const [gcash,setGcash]=useState({accountName:ws.business.gcashAccountName||"",accountNumber:ws.business.gcashAccountNumber||"",qrData:ws.business.gcashQrData||""});
  const active=ws.members.filter(m=>m.is_active).length;
  useEffect(()=>{setGcash({accountName:ws.business.gcashAccountName||"",accountNumber:ws.business.gcashAccountNumber||"",qrData:ws.business.gcashQrData||""});},[ws.business.gcashQrData,ws.business.gcashAccountName,ws.business.gcashAccountNumber]);

  const createStaff=async()=>{
    if(staff.displayName.trim().length<2)return notify("Staff name is required.","error");
    if(!staff.email.includes("@"))return notify("Enter a valid staff email.","error");
    if(staff.password.length<8)return notify("Staff password must be at least 8 characters.","error");
    if(!staff.branchId)return notify("Select an assigned branch.","error");
    try{await api("/staff",{method:"POST",body:staff});notify("Staff account created and assigned to branch");setStaff({displayName:"",email:"",password:"",role:"cashier",branchId:String(ws.branches[0]?.id||"")});setShow(false);await reload();}catch(err){notify(err.message,"error");}
  };
  const toggle=async m=>{try{await api("/staff/toggle",{method:"POST",body:{memberId:String(m.id),isActive:!m.is_active}});notify("Staff access updated");await reload();}catch(err){notify(err.message,"error");}};
  const assignBranch=async(m,branchId)=>{try{await api("/staff/branch",{method:"POST",body:{memberId:String(m.id),branchId:String(branchId)}});notify("Branch assignment updated");await reload();}catch(err){notify(err.message,"error");}};
  const addBranch=async()=>{
    if(branch.name.trim().length<2)return notify("Branch name is required.","error");
    try{await api("/branches",{method:"POST",body:branch});notify("Branch created");setBranch({name:"",address:""});await reload();}catch(err){notify(err.message,"error");}
  };
  const startBranchEdit=b=>{setEditingBranch(String(b.id));setBranchEdit({name:b.name,address:b.address||""});};
  const saveBranchEdit=async b=>{
    if(branchEdit.name.trim().length<2)return notify("Branch name is required.","error");
    try{await api("/branches/"+b.id+"/update",{method:"POST",body:branchEdit});notify("Branch updated");setEditingBranch(null);await reload();}catch(err){notify(err.message,"error");}
  };
  const toggleMaintenance=async b=>{
    const turningOn=!b.is_maintenance;
    if(turningOn&&!window.confirm("Put "+b.name+" under maintenance? Staff assigned to this branch will not be able to process POS sales until you reopen it."))return;
    try{await api("/branches/"+b.id+"/maintenance",{method:"POST",body:{isMaintenance:turningOn}});notify(turningOn?b.name+" is now under maintenance":b.name+" POS reopened");await reload();}catch(err){notify(err.message,"error");}
  };
  const chooseQr=file=>{
    if(!file)return;
    if(file.size>650*1024){notify("Use a GCash QR image below 650 KB.","error");return;}
    const reader=new FileReader();
    reader.onload=()=>setGcash(cur=>({...cur,qrData:String(reader.result||"")}));
    reader.readAsDataURL(file);
  };
  const saveGcash=async()=>{
    if(gcash.qrData&&gcash.accountName.trim().length<2)return notify("Enter the GCash account or merchant name.","error");
    if(gcash.qrData&&!gcash.accountNumber.trim())return notify("Enter the GCash mobile number or merchant ID.","error");
    try{await api("/business/gcash",{method:"POST",body:gcash});notify("GCash scan-to-pay QR updated");await reload();}catch(err){notify(err.message,"error");}
  };

  return <div className="stack" data-guide="team-root">
    <div className="metrics"><Metric label="Active staff" value={active+"/"+ws.business.staffLimit} sub={plans[ws.business.plan].name+" allowance"}/><Metric label="Owner" value="1" sub="Full workspace access"/><Metric label="Branches" value={ws.branches.length+"/"+ws.business.branchLimit} sub="Current plan limit"/><Metric label="Your role" value={ws.business.memberRole} sub="Current account"/></div>
    <section className="section-bar"><div><h2>People & locations</h2><p>Create staff accounts, assign each person to a branch, edit branch details, control maintenance, and configure GCash scan-to-pay.</p></div><button className="btn primary" onClick={()=>setShow(!show)}><Plus/>Add staff</button></section>

    {show&&<Panel title="Create staff account" sub="Every staff account must be assigned to one POS branch."><div className="form-grid" data-guide="staff-form"><label>Name *<input required value={staff.displayName} onChange={e=>setStaff({...staff,displayName:e.target.value})}/></label><label>Email *<input required type="email" value={staff.email} onChange={e=>setStaff({...staff,email:e.target.value})}/></label><label>Password *<input required minLength="8" type="password" value={staff.password} onChange={e=>setStaff({...staff,password:e.target.value})}/></label><label>Role<select value={staff.role} onChange={e=>setStaff({...staff,role:e.target.value})}><option value="cashier">Cashier</option><option value="inventory">Inventory</option><option value="manager">Manager</option><option value="admin">Tenant Admin</option></select></label><label>Assigned branch *<select required value={staff.branchId} onChange={e=>setStaff({...staff,branchId:e.target.value})}>{ws.branches.map(b=><option key={b.id} value={b.id}>{b.name}{b.is_maintenance?" · maintenance":""}</option>)}</select></label><button className="btn primary" disabled={staff.displayName.trim().length<2||!staff.email.includes("@")||staff.password.length<8||!staff.branchId} onClick={createStaff}>Create staff</button></div></Panel>}

    <div className="two-col">
      <Panel title="Team accounts" sub="Branch assignment controls which store a staff member can use in POS"><div className="list team-list">{ws.members.map(m=><div key={m.id}><span><b>{m.display_name}</b><small>{m.email} · {m.role}{m.assigned_branch_name?" · "+m.assigned_branch_name:""}</small></span><span className="row-actions">{m.role!=="owner"&&<select className="staff-branch-select" value={m.branch_id||""} onChange={e=>assignBranch(m,e.target.value)}><option value="" disabled>Select branch</option>{ws.branches.map(b=><option key={b.id} value={b.id}>{b.name}{b.is_maintenance?" · maintenance":""}</option>)}</select>}<span className={"badge "+(m.is_active?"completed":"voided")}>{m.is_active?"Active":"Disabled"}</span>{m.role!=="owner"&&<button className="btn secondary small" onClick={()=>toggle(m)}>{m.is_active?"Disable":"Enable"}</button>}</span></div>)}</div></Panel>

      <Panel title="Branches" sub="Owner/Admin can rename branches and temporarily stop POS during maintenance">
        <div className="branch-admin-list" data-guide="branch-maintenance">{ws.branches.map(b=><div className={"branch-admin-card "+(b.is_maintenance?"maintenance":"")} key={b.id}>
          {editingBranch===String(b.id)?<div className="branch-edit-fields"><label>Branch name *<input required value={branchEdit.name} onChange={e=>setBranchEdit({...branchEdit,name:e.target.value})}/></label><label>Address<input value={branchEdit.address} onChange={e=>setBranchEdit({...branchEdit,address:e.target.value})}/></label></div>:<div className="branch-admin-info"><b>{b.name}</b><small>{b.address||"No address set"}</small><span className={"badge "+(b.is_maintenance?"voided":"completed")}>{b.is_maintenance?"Under Maintenance":"POS Active"}</span></div>}
          <div className="branch-admin-actions">{editingBranch===String(b.id)?<><button className="btn secondary tiny" onClick={()=>setEditingBranch(null)}>Cancel</button><button className="btn primary tiny" disabled={branchEdit.name.trim().length<2} onClick={()=>saveBranchEdit(b)}>Save branch</button></>:<button className="btn secondary tiny" onClick={()=>startBranchEdit(b)}>Edit branch</button>}<button className={"btn tiny "+(b.is_maintenance?"primary":"danger")} onClick={()=>toggleMaintenance(b)}>{b.is_maintenance?"Reopen POS":"Maintenance"}</button></div>
        </div>)}</div>
        <div className="form-stack inset"><h4 className="inline-form-title">Add another branch</h4><label>Name *<input required value={branch.name} onChange={e=>setBranch({...branch,name:e.target.value})}/></label><label>Address<input value={branch.address} onChange={e=>setBranch({...branch,address:e.target.value})}/></label><button className="btn primary" disabled={branch.name.trim().length<2} onClick={addBranch}>Add branch</button></div>
      </Panel>
    </div>

    <Panel title="GCash scan-to-pay" sub="Upload the store's official GCash QR. Customers scan this QR from the POS, then the cashier records the transaction reference."><div className="gcash-settings" data-guide="gcash-settings"><div className="gcash-preview">{gcash.qrData?<img src={gcash.qrData} alt="GCash QR preview"/>:<div><QrCode/><span>No QR uploaded</span></div>}</div><div className="form-stack gcash-form"><label>GCash account name {gcash.qrData?"*":""}<input value={gcash.accountName} onChange={e=>setGcash({...gcash,accountName:e.target.value})} placeholder="Business / account name"/></label><label>GCash mobile / merchant number {gcash.qrData?"*":""}<input value={gcash.accountNumber} onChange={e=>setGcash({...gcash,accountNumber:e.target.value})} placeholder="09xx xxx xxxx or merchant ID"/></label><label>QR image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>chooseQr(e.target.files?.[0])}/></label><div className="form-actions">{gcash.qrData&&<button className="btn secondary" onClick={()=>setGcash({...gcash,qrData:""})}>Remove QR</button>}<button className="btn primary" disabled={Boolean(gcash.qrData)&&(!gcash.accountName.trim()||!gcash.accountNumber.trim())} onClick={saveGcash}>Save GCash QR</button></div><div className="info-note"><b>Scan-to-pay:</b> BrewPoint displays this QR at checkout. Automatic payment confirmation still requires an official GCash/merchant payment-gateway integration and merchant credentials, so the cashier records the payment reference in this build.</div></div></div></Panel>
  </div>;
}

function Billing({ws,reload,notify}) {
  const change=async plan=>{try{await api("/subscription/change",{method:"POST",body:{plan,activateDemo:true}});notify("Sandbox subscription activated");await reload();}catch(err){notify(err.message,"error");}};
  return <div className="stack"><section className="billing-hero"><div><span className={"status "+ws.business.subscriptionStatus}>{ws.business.subscriptionStatus}</span><h2>{plans[ws.business.plan].name} plan</h2><p>{ws.business.subscriptionStatus==="trialing"?"Your trial has "+ws.summary.trialDaysLeft+" days remaining.":"Current period ends "+dateTime(ws.business.currentPeriodEnd)}</p></div><strong>{money(plans[ws.business.plan].price)}<small>/month</small></strong></section>
    <div className="plan-grid compact-plans">{Object.entries(plans).map(([key,p])=><article className={"pricing-card billing-plan-card "+(key===ws.business.plan?"selected":"")} key={key}>{key===ws.business.plan&&<span className="pill">CURRENT</span>}<h3>{p.name}</h3><div className="price">{money(p.price)}<small>/month</small></div><p>{p.branches} branch{p.branches>1?"es":""} · {p.staff} staff accounts</p><ul className="billing-feature-list">{p.features.map(feature=><li key={feature}><Check size={13}/><span>{feature}</span></li>)}</ul><button className="btn primary wide" onClick={()=>change(key)}>{key===ws.business.plan&&ws.business.subscriptionStatus==="active"?"Renew sandbox period":ws.business.subscriptionStatus==="suspended"&&key===ws.business.plan?"Reactivate "+p.name:"Activate "+p.name+" in sandbox"}</button></article>)}</div>
    <div className="info-note"><b>Testing mode:</b> plan activation simulates a successful 30-day payment period. No card, GCash, or bank account is charged.</div>
  </div>;
}

function SupportAdmin({notify}){
  const [tickets,setTickets]=useState([]);
  const [selected,setSelected]=useState(null);
  const [detail,setDetail]=useState(null);
  const [reply,setReply]=useState("");
  const [filter,setFilter]=useState("open");
  const load=async()=>{try{const r=await api("/admin/support");setTickets(r.tickets||[]);}catch(err){notify(err.message,"error");}};
  const openTicket=async t=>{setSelected(t);try{setDetail(await api("/admin/support/"+t.id));}catch(err){notify(err.message,"error");}};
  useEffect(()=>{load();},[]);
  const send=async()=>{if(!selected||!reply.trim())return;try{await api("/admin/support/"+selected.id+"/reply",{method:"POST",body:{message:reply}});setReply("");await openTicket(selected);await load();notify("Reply sent to support ticket");}catch(err){notify(err.message,"error");}};
  const changeStatus=async status=>{if(!selected)return;try{await api("/admin/support/"+selected.id+"/status",{method:"POST",body:{status}});await openTicket({...selected,status});await load();notify("Ticket status updated");}catch(err){notify(err.message,"error");}};
  const visible=tickets.filter(t=>filter==="all"||t.status===filter);
  return <div className="support-admin-grid"><Panel title="Support tickets" sub="Questions submitted from the BrewPoint public chatbot"><div className="support-filter"><button className={filter==="open"?"active":""} onClick={()=>setFilter("open")}>Open</button><button className={filter==="answered"?"active":""} onClick={()=>setFilter("answered")}>Answered</button><button className={filter==="closed"?"active":""} onClick={()=>setFilter("closed")}>Closed</button><button className={filter==="all"?"active":""} onClick={()=>setFilter("all")}>All</button></div><div className="ticket-list">{visible.map(t=><button key={t.id} className={String(selected?.id)===String(t.id)?"active":""} onClick={()=>openTicket(t)}><span><b>{t.subject}</b><small>{t.name} · {t.email}</small></span><span><i className={"ticket-dot "+t.status}/>{dateTime(t.updated_at)}</span></button>)}{!visible.length&&<Empty Icon={MessageCircle} text="No tickets in this status."/>}</div></Panel>
    <Panel title={detail?"Ticket #"+detail.ticket.id:"Conversation"} sub={detail?detail.ticket.name+" · "+detail.ticket.email:"Select a ticket to reply"}>{detail?<div className="support-thread"><div className="support-thread-head"><span className={"badge "+(detail.ticket.status==="open"?"trialing":detail.ticket.status==="closed"?"voided":"completed")}>{detail.ticket.status}</span><div className="row-actions"><button className="btn secondary tiny" onClick={()=>changeStatus("open")}>Open</button><button className="btn secondary tiny" onClick={()=>changeStatus("answered")}>Answered</button><button className="btn secondary tiny" onClick={()=>changeStatus("closed")}>Close</button></div></div><div className="support-messages">{detail.messages.map(m=><div key={m.id} className={"support-message "+m.sender_type}><small>{m.sender_type==="admin"?(m.display_name||"BrewPoint Admin"):detail.ticket.name} · {dateTime(m.created_at)}</small><p>{m.message}</p></div>)}</div>{detail.ticket.status!=="closed"&&<div className="support-reply"><textarea value={reply} onChange={e=>setReply(e.target.value)} placeholder="Reply as BrewPoint Admin…"/><button className="btn primary" disabled={!reply.trim()} onClick={send}>Send reply</button></div>}</div>:<Empty Icon={MessageCircle} text="Choose a ticket from the inbox."/>}</Panel>
  </div>;
}

function OwnerConsole() {
  const nav=useNavigate();
  const {theme,setTheme}=useTheme();
  const [data,setData]=useState(null);
  const [error,setError]=useState("");
  const [toast,setToast]=useState(null);
  const [section,setSection]=useState("overview");
  const [search,setSearch]=useState("");
  const [auditSearch,setAuditSearch]=useState("");
  const [guideOpen,setGuideOpen]=useState(false);
  const load=async()=>{try{setError("");setData(await api("/landlord"));}catch(err){if(err.message.toLowerCase().includes("sign in")||err.message.toLowerCase().includes("session"))nav("/admin/login");else setError(err.message);}};
  useEffect(()=>{load();},[]);
  const act=async(businessId,action,extra={})=>{try{await api("/landlord/action",{method:"POST",body:{businessId:String(businessId),action,...extra}});setToast({message:"Tenant updated"});await load();}catch(err){setToast({message:err.message,type:"error"});}};
  const logout=async()=>{await api("/auth/logout",{method:"POST"});nav("/admin/login");};
  const daysLeft=t=>Math.max(0,Math.ceil((new Date(t.trial_ends_at).getTime()-Date.now())/86400000));
  const tenantMatches=t=>[t.name,t.owner_name,t.owner_email,t.plan,t.subscription_status].join(" ").toLowerCase().includes(search.toLowerCase());
  const tenants=(data?.tenants||[]).filter(tenantMatches);
  const trials=tenants.filter(t=>t.subscription_status==="trialing"&&!t.is_suspended);
  const subscriptions=tenants.filter(t=>t.subscription_status!=="trialing"||t.current_period_end);
  const audits=(data?.audits||[]).filter(a=>[a.action,a.business_name,a.display_name,a.email,a.details].join(" ").toLowerCase().includes(auditSearch.toLowerCase()));
  const exportAudits=()=>{const rows=[["Date","Business","User","Action","Entity","Details"],...audits.map(x=>[dateTime(x.created_at),x.business_name||"",x.display_name||x.email||"",x.action,x.entity_type||"",x.details||""])];const csv=rows.map(r=>r.map(c=>'"'+String(c??"").replaceAll('"','""')+'"').join(",")).join("\n");const url=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));const el=document.createElement("a");el.href=url;el.download="BrewPoint-platform-audit.csv";el.click();URL.revokeObjectURL(url);};
  if(error)return <div className="loading"><ShieldCheck/><b>{error}</b><button className="btn secondary" onClick={()=>nav("/")}>Back to website</button></div>;
  if(!data)return <Loading text="Opening BrewPoint administration…"/>;
  const titles={overview:["Platform overview","Monitor the entire BrewPoint SaaS business."],tenants:["Tenants","Manage coffee businesses, access status, and plans."],trials:["Trials","Monitor 30-day trials and conversion actions."],subscriptions:["Subscriptions","Manage active, past-due, suspended, and cancelled subscriptions."],support:["Support tickets","Reply to FAQ/chatbot tickets from prospective and existing users."],security:["Audit & security","Review platform activity and security controls."]};
  const title=titles[section];
  return <div className="owner-shell">
    <aside className="owner-side"><Brand compact/><span className="owner-tag">PLATFORM ADMIN ONLY</span><nav><button className={section==="overview"?"active":""} onClick={()=>setSection("overview")}><LayoutDashboard/>Overview</button><button className={section==="tenants"?"active":""} data-guide="admin-nav-tenants" onClick={()=>setSection("tenants")}><Store/>Tenants</button><button className={section==="trials"?"active":""} data-guide="admin-nav-trials" onClick={()=>setSection("trials")}><CalendarClock/>Trials</button><button className={section==="subscriptions"?"active":""} data-guide="admin-nav-subscriptions" onClick={()=>setSection("subscriptions")}><CreditCard/>Subscriptions</button><button className={section==="support"?"active":""} data-guide="admin-nav-support" onClick={()=>setSection("support")}><MessageCircle/>Support tickets</button><button className={section==="security"?"active":""} data-guide="admin-nav-security" onClick={()=>setSection("security")}><ShieldCheck/>Audit & security</button></nav><div className="admin-side-actions"><button className="sidebar-guide" onClick={()=>setGuideOpen(true)}><HelpCircle size={15}/>Guided tour</button><ThemeControl theme={theme} setTheme={setTheme}/><Link className="btn secondary small wide" to="/">Public BrewPoint site</Link><button className="logout admin-logout" onClick={logout}><LogOut size={14}/>Sign out admin</button></div></aside>
    <main className="owner-main"><header className="owner-head" data-guide="admin-overview"><div><span className="pill">BREWPOINT PLATFORM ADMIN</span><h1>{title[0]}</h1><p>{title[1]}</p></div></header>
      {section==="overview"&&<><div className="owner-notice"><CalendarClock/><p><b>Landlord administration is now separate from café tenants.</b> This console is protected by the platform-admin role and is not linked from the tenant POS.</p></div><div className="metrics"><Metric label="Total tenants" value={data.summary.totalTenants} sub={data.summary.activeTenants+" active · "+data.summary.trialTenants+" trial"}/><Metric label="Monthly recurring" value={money(data.summary.monthlyRecurringRevenue)} sub="Active plan value"/><Metric label="Platform month sales" value={money(data.summary.monthPlatformSales)} sub="Across all tenants"/><Metric label="Needs attention" value={data.summary.needsAttention} sub="Past due, suspended, or cancelled"/></div><div className="two-col"><Panel title="Recent tenants" sub="Latest businesses"><div className="list">{data.tenants.slice(0,8).map(t=><div key={t.id}><span><b>{t.name}</b><small>{t.owner_email||"No owner email"} · {plans[t.plan]?.name}</small></span><span className={"badge "+(t.is_suspended?"voided":t.subscription_status==="active"?"completed":"trialing")}>{t.is_suspended?"suspended":t.subscription_status}</span></div>)}</div></Panel><Panel title="Recent platform activity" sub="Audit trail"><div className="list">{data.audits.slice(0,10).map(x=><div key={x.id}><span><b>{x.action.replaceAll("_"," ")}</b><small>{x.business_name||"Platform"} · {dateTime(x.created_at)}</small></span></div>)}</div></Panel></div></>}
      {section==="tenants"&&<><section className="admin-toolbar"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tenant, owner, plan, or status…"/></section><Panel title="Tenant businesses" sub="Real subscription, branch, staff, and sales data"><div className="table-scroll"><table className="report-table admin-table"><thead><tr><th>Business</th><th>Owner</th><th>Plan</th><th>Status</th><th>Branches</th><th>Staff</th><th>Month sales</th><th>Actions</th></tr></thead><tbody>{tenants.map(t=><tr key={t.id}><td><b>{t.name}</b><small>{dateTime(t.created_at)}</small></td><td>{t.owner_name||"—"}<small>{t.owner_email||""}</small></td><td>{plans[t.plan]?.name||t.plan}</td><td><span className={"badge "+(t.is_suspended?"voided":t.subscription_status==="active"?"completed":"trialing")}>{t.is_suspended?"suspended":t.subscription_status}</span></td><td>{t.branches}</td><td>{t.members}</td><td>{money(t.month_sales)}</td><td><span className="row-actions">{t.is_suspended?<button className="btn secondary tiny" onClick={()=>act(t.id,"resume")}>Resume</button>:<button className="btn secondary tiny" onClick={()=>act(t.id,"suspend")}>Suspend</button>}{t.subscription_status!=="active"&&<button className="btn primary tiny" onClick={()=>act(t.id,"mark_active")}>Activate</button>}</span></td></tr>)}</tbody></table></div></Panel></>}
      {section==="trials"&&<><div className="metrics"><Metric label="Active trials" value={trials.length} sub="Currently evaluating BrewPoint"/><Metric label="Expiring ≤7 days" value={trials.filter(t=>daysLeft(t)<=7).length} sub="Follow-up candidates"/><Metric label="Pro trials" value={trials.filter(t=>t.plan==="pro").length} sub="Pro selected"/><Metric label="Business trials" value={trials.filter(t=>t.plan==="business").length} sub="Business selected"/></div><Panel title="Trial management" sub="Extend, reset, or convert a trial"><div className="table-scroll"><table className="report-table"><thead><tr><th>Business</th><th>Owner</th><th>Trial plan</th><th>Ends</th><th>Days left</th><th>Actions</th></tr></thead><tbody>{trials.map(t=><tr key={t.id}><td><b>{t.name}</b></td><td>{t.owner_email||"—"}</td><td>{plans[t.plan]?.name}</td><td>{dateTime(t.trial_ends_at)}</td><td><b>{daysLeft(t)}</b></td><td><span className="row-actions"><button className="btn secondary tiny" onClick={()=>act(t.id,"extend_trial")}>+7 days</button><button className="btn secondary tiny" onClick={()=>act(t.id,"extend_trial_30")}>Reset 30 days</button><button className="btn primary tiny" onClick={()=>act(t.id,"mark_active")}>Activate</button></span></td></tr>)}</tbody></table></div></Panel></>}
      {section==="subscriptions"&&<><div className="metrics"><Metric label="MRR" value={money(data.summary.monthlyRecurringRevenue)} sub="Active plan value"/><Metric label="Starter" value={data.planBreakdown.starter} sub="Active tenants"/><Metric label="Pro" value={data.planBreakdown.pro} sub="Active tenants"/><Metric label="Business" value={data.planBreakdown.business} sub="Active tenants"/></div><Panel title="Subscription management" sub="Change plans and lifecycle status"><div className="table-scroll"><table className="report-table"><thead><tr><th>Business</th><th>Plan</th><th>Status</th><th>Period end</th><th>Month sales</th><th>Actions</th></tr></thead><tbody>{subscriptions.map(t=><tr key={t.id}><td><b>{t.name}</b><small>{t.owner_email||""}</small></td><td><select value={t.plan} onChange={e=>act(t.id,"change_plan",{plan:e.target.value})}><option value="starter">Starter · ₱799</option><option value="pro">Pro · ₱1,199</option><option value="business">Business · ₱1,999</option></select></td><td><span className={"badge "+(t.is_suspended?"voided":t.subscription_status==="active"?"completed":"trialing")}>{t.is_suspended?"suspended":t.subscription_status}</span></td><td>{dateTime(t.current_period_end)}</td><td>{money(t.month_sales)}</td><td><span className="row-actions">{t.subscription_status!=="active"&&<button className="btn primary tiny" onClick={()=>act(t.id,"mark_active")}>Activate</button>}<button className="btn secondary tiny" onClick={()=>act(t.id,"mark_past_due")}>Past due</button>{t.is_suspended?<button className="btn secondary tiny" onClick={()=>act(t.id,"resume")}>Resume</button>:<button className="btn secondary tiny" onClick={()=>act(t.id,"suspend")}>Suspend</button>}<button className="btn danger tiny" onClick={()=>window.confirm("Cancel this subscription?")&&act(t.id,"cancel")}>Cancel</button></span></td></tr>)}</tbody></table></div></Panel></>}
      {section==="support"&&<SupportAdmin notify={(message,type="")=>setToast({message,type})}/>}\n      {section==="security"&&<><div className="metrics"><Metric label="Beta signup gate" value={data.security.betaGateEnabled?"Enabled":"Off"} sub="Private registration code"/><Metric label="Platform admins" value={data.security.platformAdmins} sub={data.security.totalUsers+" total users"}/><Metric label="Database" value={data.security.database} sub="PostgreSQL connectivity"/><Metric label="Session cookie" value="Protected" sub={data.security.sessionCookie}/></div><section className="admin-toolbar"><input value={auditSearch} onChange={e=>setAuditSearch(e.target.value)} placeholder="Search audit action, tenant, user, or detail…"/><button className="btn secondary" onClick={exportAudits}>Export audit CSV</button></section><Panel title="Platform audit trail" sub={audits.length+" matching events"}><div className="table-scroll"><table className="report-table"><thead><tr><th>Date</th><th>Business</th><th>User</th><th>Action</th><th>Entity</th><th>Details</th></tr></thead><tbody>{audits.map(x=><tr key={x.id}><td>{dateTime(x.created_at)}</td><td>{x.business_name||"Platform"}</td><td>{x.display_name||x.email||"System"}</td><td><b>{x.action.replaceAll("_"," ")}</b></td><td>{x.entity_type||"—"}</td><td>{x.details||"—"}</td></tr>)}</tbody></table></div></Panel></>}
    </main><Toast toast={toast} onClear={()=>setToast(null)}/>{guideOpen&&<GuideTour admin onSectionChange={setSection} onClose={()=>setGuideOpen(false)}/>}\n  </div>;
}

export default function App() {
  return <Routes>
    <Route path="/" element={<Landing/>}/>
    <Route path="/login" element={<AuthPage mode="login"/>}/>
    <Route path="/signup" element={<AuthPage mode="signup"/>}/>
    <Route path="/app" element={<AppShell/>}/>
    <Route path="/admin/login" element={<AuthPage mode="login" destination="/admin"/>}/><Route path="/admin" element={<OwnerConsole/>}/><Route path="/owner" element={<Navigate to="/admin"/>}/>
    <Route path="*" element={<Navigate to="/"/>}/>
  </Routes>;
}
