import express from "express";
import pg from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const app = express();
const PORT = Number(process.env.PORT || 3000);
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;

if (!DATABASE_URL) throw new Error("DATABASE_URL is required");
if (!JWT_SECRET || JWT_SECRET.length < 32) throw new Error("JWT_SECRET must be at least 32 characters");

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : false,
  max: 15,
  idleTimeoutMillis: 30000
});

app.set("trust proxy", 1);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "data:"]
    }
  }
}));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const PLAN_LIMITS = {
  starter: { branches: 1, staff: 3, price: 799 },
  pro: { branches: 3, staff: 10, price: 1199 },
  business: { branches: 10, staff: 25, price: 1999 }
};

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      platform_role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS businesses (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      plan TEXT NOT NULL DEFAULT 'starter',
      subscription_status TEXT NOT NULL DEFAULT 'trialing',
      trial_started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      trial_ends_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 days'),
      current_period_end TIMESTAMPTZ,
      billing_email TEXT,
      currency TEXT NOT NULL DEFAULT 'PHP',
      timezone TEXT NOT NULL DEFAULT 'Asia/Manila',
      is_suspended BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS business_members (
      id BIGSERIAL PRIMARY KEY,
      business_id BIGINT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role TEXT NOT NULL DEFAULT 'cashier',
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (business_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS branches (
      id BIGSERIAL PRIMARY KEY,
      business_id BIGINT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      address TEXT,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS product_categories (
      id BIGSERIAL PRIMARY KEY,
      business_id BIGINT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT true,
      UNIQUE (business_id, name)
    );

    CREATE TABLE IF NOT EXISTS products (
      id BIGSERIAL PRIMARY KEY,
      business_id BIGINT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      category_id BIGINT REFERENCES product_categories(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      sku TEXT,
      price NUMERIC(12,2) NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS ingredients (
      id BIGSERIAL PRIMARY KEY,
      business_id BIGINT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      uom TEXT NOT NULL DEFAULT 'PCS',
      stock_qty NUMERIC(14,3) NOT NULL DEFAULT 0,
      low_stock_threshold NUMERIC(14,3) NOT NULL DEFAULT 0,
      cost_per_unit NUMERIC(14,4) NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (business_id, name)
    );

    CREATE TABLE IF NOT EXISTS product_ingredients (
      id BIGSERIAL PRIMARY KEY,
      business_id BIGINT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      ingredient_id BIGINT NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
      qty_required NUMERIC(14,3) NOT NULL DEFAULT 0,
      UNIQUE (product_id, ingredient_id)
    );

    CREATE TABLE IF NOT EXISTS customers (
      id BIGSERIAL PRIMARY KEY,
      business_id BIGINT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS promos (
      id BIGSERIAL PRIMARY KEY,
      business_id BIGINT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      promo_type TEXT NOT NULL DEFAULT 'fixed_discount',
      value NUMERIC(12,2) NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT true,
      starts_at TIMESTAMPTZ,
      ends_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS sales (
      id BIGSERIAL PRIMARY KEY,
      business_id BIGINT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      branch_id BIGINT NOT NULL REFERENCES branches(id) ON DELETE RESTRICT,
      cashier_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      customer_id BIGINT REFERENCES customers(id) ON DELETE SET NULL,
      reference_no TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      payment_reference TEXT,
      subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
      discount NUMERIC(12,2) NOT NULL DEFAULT 0,
      total NUMERIC(12,2) NOT NULL DEFAULT 0,
      tendered NUMERIC(12,2),
      change_due NUMERIC(12,2),
      status TEXT NOT NULL DEFAULT 'completed',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (business_id, reference_no)
    );

    CREATE TABLE IF NOT EXISTS sale_items (
      id BIGSERIAL PRIMARY KEY,
      sale_id BIGINT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
      product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
      product_name TEXT NOT NULL,
      qty NUMERIC(12,3) NOT NULL,
      unit_price NUMERIC(12,2) NOT NULL,
      line_total NUMERIC(12,2) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS inventory_movements (
      id BIGSERIAL PRIMARY KEY,
      business_id BIGINT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      branch_id BIGINT REFERENCES branches(id) ON DELETE SET NULL,
      ingredient_id BIGINT NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
      movement_type TEXT NOT NULL,
      qty NUMERIC(14,3) NOT NULL,
      balance_after NUMERIC(14,3) NOT NULL,
      reference TEXT,
      performed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id BIGSERIAL PRIMARY KEY,
      business_id BIGINT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      branch_id BIGINT REFERENCES branches(id) ON DELETE SET NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      amount NUMERIC(12,2) NOT NULL,
      spent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id BIGSERIAL PRIMARY KEY,
      business_id BIGINT REFERENCES businesses(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      action TEXT NOT NULL,
      entity_type TEXT,
      entity_id TEXT,
      details TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS idx_sales_business_created ON sales(business_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_inventory_business_created ON inventory_movements(business_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_audit_business_created ON audit_logs(business_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_expenses_business_spent ON expenses(business_id, spent_at DESC);
  `);
}

function signSession(user) {
  return jwt.sign(
    { id: user.id, email: user.email, platformRole: user.platform_role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function setSession(res, user) {
  res.cookie("bp_session", signSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

async function auth(req, res, next) {
  try {
    const token = req.cookies.bp_session;
    if (!token) return res.status(401).json({ message: "Please sign in." });
    const payload = jwt.verify(token, JWT_SECRET);
    const { rows } = await pool.query(
      "SELECT id,email,display_name,platform_role FROM users WHERE id=$1",
      [payload.id]
    );
    if (!rows[0]) return res.status(401).json({ message: "Account not found." });
    req.user = rows[0];
    next();
  } catch {
    res.status(401).json({ message: "Your session has expired." });
  }
}

async function getContext(userId) {
  const { rows } = await pool.query(
    `SELECT bm.business_id,bm.role,b.name,b.slug,b.plan,b.subscription_status,
            b.trial_started_at,b.trial_ends_at,b.current_period_end,b.currency,
            b.timezone,b.is_suspended
       FROM business_members bm
       JOIN businesses b ON b.id=bm.business_id
      WHERE bm.user_id=$1 AND bm.is_active=true
      ORDER BY bm.created_at ASC LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

async function requireContext(req, res, next) {
  const context = await getContext(req.user.id);
  if (!context) return res.status(404).json({ message: "Create your BrewPoint store first." });
  req.context = context;
  next();
}

function allow(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.context.role)) return res.status(403).json({ message: "You do not have permission for this action." });
    next();
  };
}

async function audit(client, businessId, userId, action, entityType, entityId, details) {
  await client.query(
    "INSERT INTO audit_logs(business_id,user_id,action,entity_type,entity_id,details) VALUES($1,$2,$3,$4,$5,$6)",
    [businessId, userId, action, entityType || null, entityId ? String(entityId) : null, details || null]
  );
}

function slugify(name) {
  return (name || "coffee-shop").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "coffee-shop";
}

function reportStart(period) {
  const now = new Date(Date.now() + 8 * 3600000);
  let y = now.getUTCFullYear();
  let m = now.getUTCMonth();
  let d = now.getUTCDate();
  if (period === "yearly") { m = 0; d = 1; }
  if (period === "monthly") d = 1;
  if (period === "weekly") {
    const dow = now.getUTCDay();
    const back = dow === 0 ? 6 : dow - 1;
    const t = new Date(Date.UTC(y, m, d));
    t.setUTCDate(t.getUTCDate() - back);
    y = t.getUTCFullYear(); m = t.getUTCMonth(); d = t.getUTCDate();
  }
  return new Date(Date.UTC(y, m, d) - 8 * 3600000);
}

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, service: "brewpoint" });
  } catch {
    res.status(503).json({ ok: false });
  }
});

app.post("/api/auth/register", async (req, res) => {
  const requiredAccessCode = String(process.env.BETA_ACCESS_CODE || "");
  if (requiredAccessCode && String(req.body.accessCode || "") !== requiredAccessCode) {
    return res.status(403).json({ message: "Invalid BrewPoint beta access code." });
  }
  const email = String(req.body.email || "").trim().toLowerCase();
  const displayName = String(req.body.displayName || "").trim();
  const password = String(req.body.password || "");
  if (!email.includes("@") || displayName.length < 2 || password.length < 8) {
    return res.status(400).json({ message: "Enter a valid email, name, and password of at least 8 characters." });
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const existing = await client.query("SELECT id FROM users WHERE email=$1", [email]);
    if (existing.rowCount) throw new Error("EMAIL_EXISTS");
    const count = await client.query("SELECT count(*)::int AS count FROM users");
    const platformRole = count.rows[0].count === 0 ? "platform_admin" : "user";
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await client.query(
      "INSERT INTO users(email,display_name,password_hash,platform_role) VALUES($1,$2,$3,$4) RETURNING id,email,display_name,platform_role",
      [email, displayName, hash, platformRole]
    );
    await client.query("COMMIT");
    setSession(res, rows[0]);
    res.json({ user: rows[0], firstUser: platformRole === "platform_admin" });
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.message === "EMAIL_EXISTS") return res.status(409).json({ message: "That email already has an account." });
    console.error(error);
    res.status(500).json({ message: "Unable to create account." });
  } finally {
    client.release();
  }
});

app.post("/api/auth/login", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: "Incorrect email or password." });
  }
  setSession(res, user);
  res.json({ user: { id: user.id, email: user.email, displayName: user.display_name, platformRole: user.platform_role } });
});

app.post("/api/auth/logout", (_req, res) => {
  res.clearCookie("bp_session");
  res.json({ ok: true });
});

app.get("/api/me", auth, async (req, res) => {
  const context = await getContext(req.user.id);
  res.json({
    user: { id: req.user.id, email: req.user.email, displayName: req.user.display_name, platformRole: req.user.platform_role },
    business: context
  });
});

app.post("/api/business/setup", auth, async (req, res) => {
  const existing = await getContext(req.user.id);
  if (existing) return res.status(409).json({ message: "This account already belongs to a BrewPoint business." });
  const name = String(req.body.businessName || "").trim();
  const plan = ["starter", "pro", "business"].includes(req.body.plan) ? req.body.plan : "pro";
  if (name.length < 2) return res.status(400).json({ message: "Enter your business name." });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const slug = slugify(name) + "-" + nanoid(5).toLowerCase();
    const { rows: businessRows } = await client.query(
      `INSERT INTO businesses(name,slug,plan,billing_email)
       VALUES($1,$2,$3,$4) RETURNING *`,
      [name, slug, plan, req.user.email]
    );
    const business = businessRows[0];
    await client.query(
      "INSERT INTO business_members(business_id,user_id,role) VALUES($1,$2,'owner')",
      [business.id, req.user.id]
    );
    const { rows: branchRows } = await client.query(
      "INSERT INTO branches(business_id,name,address) VALUES($1,'Main Branch','') RETURNING id",
      [business.id]
    );
    const categoryNames = ["Coffee", "Non-Coffee", "Food", "Promos"];
    const categoryIds = {};
    for (let i = 0; i < categoryNames.length; i++) {
      const { rows } = await client.query(
        "INSERT INTO product_categories(business_id,name,sort_order) VALUES($1,$2,$3) RETURNING id",
        [business.id, categoryNames[i], i + 1]
      );
      categoryIds[categoryNames[i]] = rows[0].id;
    }
    const seedIngredients = [
      ["Coffee Beans","G",5000,800,0.85],
      ["Fresh Milk","ML",12000,2500,0.085],
      ["Fructose","ML",6000,1200,0.06],
      ["Caramel Syrup","ML",2500,500,0.18],
      ["Matcha Powder","G",1800,300,1.15],
      ["Chocolate Sauce","ML",2400,500,0.22],
      ["16 OZ Cup","PCS",300,60,4.5],
      ["Croissant","PCS",42,10,38]
    ];
    const ingredientIds = {};
    for (const row of seedIngredients) {
      const { rows } = await client.query(
        `INSERT INTO ingredients(business_id,name,uom,stock_qty,low_stock_threshold,cost_per_unit)
         VALUES($1,$2,$3,$4,$5,$6) RETURNING id`,
        [business.id, ...row]
      );
      ingredientIds[row[0]] = rows[0].id;
    }
    const seedProducts = [
      ["Spanish Latte","Coffee",149,"COF-SL"],
      ["Americano","Coffee",99,"COF-AM"],
      ["Caramel Macchiato","Coffee",159,"COF-CM"],
      ["Matcha Latte","Non-Coffee",169,"NC-MAT"],
      ["Iced Mocha","Coffee",159,"COF-MO"],
      ["Croissant","Food",89,"FOOD-CR"],
      ["Cappuccino","Coffee",129,"COF-CP"],
      ["Chocolate","Non-Coffee",139,"NC-CH"]
    ];
    const productIds = {};
    for (const row of seedProducts) {
      const { rows } = await client.query(
        `INSERT INTO products(business_id,category_id,name,price,sku)
         VALUES($1,$2,$3,$4,$5) RETURNING id`,
        [business.id, categoryIds[row[1]], row[0], row[2], row[3]]
      );
      productIds[row[0]] = rows[0].id;
    }
    const recipes = [
      ["Spanish Latte","Coffee Beans",18],["Spanish Latte","Fresh Milk",180],["Spanish Latte","Fructose",20],["Spanish Latte","16 OZ Cup",1],
      ["Americano","Coffee Beans",18],["Americano","16 OZ Cup",1],
      ["Caramel Macchiato","Coffee Beans",18],["Caramel Macchiato","Fresh Milk",170],["Caramel Macchiato","Caramel Syrup",25],["Caramel Macchiato","16 OZ Cup",1],
      ["Matcha Latte","Matcha Powder",12],["Matcha Latte","Fresh Milk",180],["Matcha Latte","Fructose",15],["Matcha Latte","16 OZ Cup",1],
      ["Iced Mocha","Coffee Beans",18],["Iced Mocha","Fresh Milk",160],["Iced Mocha","Chocolate Sauce",25],["Iced Mocha","16 OZ Cup",1],
      ["Croissant","Croissant",1],
      ["Cappuccino","Coffee Beans",18],["Cappuccino","Fresh Milk",150],["Cappuccino","16 OZ Cup",1],
      ["Chocolate","Chocolate Sauce",30],["Chocolate","Fresh Milk",180],["Chocolate","16 OZ Cup",1]
    ];
    for (const row of recipes) {
      await client.query(
        "INSERT INTO product_ingredients(business_id,product_id,ingredient_id,qty_required) VALUES($1,$2,$3,$4)",
        [business.id, productIds[row[0]], ingredientIds[row[1]], row[2]]
      );
    }
    await client.query(
      "INSERT INTO promos(business_id,name,promo_type,value) VALUES($1,'143 Promo','set_price',143)",
      [business.id]
    );
    await audit(client, business.id, req.user.id, "BUSINESS_CREATED", "business", business.id, "30-day " + plan + " trial started");
    await client.query("COMMIT");
    res.json({ businessId: String(business.id), branchId: String(branchRows[0].id) });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ message: "Unable to create your store." });
  } finally {
    client.release();
  }
});

app.get("/api/workspace", auth, requireContext, async (req, res) => {
  const businessId = req.context.business_id;
  const [branches, categories, products, ingredients, recipes, sales, expenses, promos, customers, members, auditLogs, movements] = await Promise.all([
    pool.query("SELECT * FROM branches WHERE business_id=$1 AND is_active=true ORDER BY id", [businessId]),
    pool.query("SELECT * FROM product_categories WHERE business_id=$1 AND is_active=true ORDER BY sort_order,id", [businessId]),
    pool.query(`SELECT p.*,pc.name AS category_name FROM products p LEFT JOIN product_categories pc ON pc.id=p.category_id WHERE p.business_id=$1 ORDER BY p.name`, [businessId]),
    pool.query("SELECT * FROM ingredients WHERE business_id=$1 ORDER BY name", [businessId]),
    pool.query("SELECT * FROM product_ingredients WHERE business_id=$1", [businessId]),
    pool.query(`SELECT s.*,b.name AS branch_name,u.display_name AS cashier_name FROM sales s JOIN branches b ON b.id=s.branch_id LEFT JOIN users u ON u.id=s.cashier_user_id WHERE s.business_id=$1 ORDER BY s.created_at DESC LIMIT 100`, [businessId]),
    pool.query("SELECT * FROM expenses WHERE business_id=$1 ORDER BY spent_at DESC LIMIT 100", [businessId]),
    pool.query("SELECT * FROM promos WHERE business_id=$1 ORDER BY created_at DESC", [businessId]),
    pool.query("SELECT * FROM customers WHERE business_id=$1 ORDER BY created_at DESC LIMIT 100", [businessId]),
    pool.query(`SELECT bm.*,u.display_name,u.email FROM business_members bm JOIN users u ON u.id=bm.user_id WHERE bm.business_id=$1 ORDER BY bm.created_at`, [businessId]),
    pool.query(`SELECT a.*,u.display_name FROM audit_logs a LEFT JOIN users u ON u.id=a.user_id WHERE a.business_id=$1 ORDER BY a.created_at DESC LIMIT 100`, [businessId]),
    pool.query(`SELECT im.*,i.name AS ingredient_name,i.uom,b.name AS branch_name FROM inventory_movements im JOIN ingredients i ON i.id=im.ingredient_id LEFT JOIN branches b ON b.id=im.branch_id WHERE im.business_id=$1 ORDER BY im.created_at DESC LIMIT 100`, [businessId])
  ]);
  const now = new Date();
  const monthStart = reportStart("monthly");
  const completed = sales.rows.filter(s => s.status === "completed");
  const monthSales = completed.filter(s => new Date(s.created_at) >= monthStart);
  const todayStart = reportStart("daily");
  const todaySales = completed.filter(s => new Date(s.created_at) >= todayStart);
  const monthExpenses = expenses.rows.filter(e => new Date(e.spent_at) >= monthStart).reduce((sum,e)=>sum+Number(e.amount),0);
  const ingredientMap = new Map(ingredients.rows.map(i=>[String(i.id), i]));
  const recipeCost = new Map();
  for (const recipe of recipes.rows) {
    const ingredient = ingredientMap.get(String(recipe.ingredient_id));
    recipeCost.set(String(recipe.product_id), (recipeCost.get(String(recipe.product_id)) || 0) + Number(recipe.qty_required) * Number(ingredient?.cost_per_unit || 0));
  }
  const { rows: monthItems } = await pool.query(
    `SELECT si.product_id,si.qty FROM sale_items si JOIN sales s ON s.id=si.sale_id
      WHERE s.business_id=$1 AND s.status='completed' AND s.created_at >= $2`,
    [businessId, monthStart]
  );
  const cogs = monthItems.reduce((sum,i)=>sum+(recipeCost.get(String(i.product_id))||0)*Number(i.qty),0);
  const monthTotal = monthSales.reduce((sum,s)=>sum+Number(s.total),0);
  const inventoryValue = ingredients.rows.reduce((sum,i)=>sum+Number(i.stock_qty)*Number(i.cost_per_unit),0);
  res.json({
    user: { id:req.user.id,email:req.user.email,displayName:req.user.display_name,platformRole:req.user.platform_role },
    business: {
      id:String(businessId),name:req.context.name,slug:req.context.slug,plan:req.context.plan,
      subscriptionStatus:req.context.subscription_status,trialEndsAt:req.context.trial_ends_at,
      currentPeriodEnd:req.context.current_period_end,isSuspended:req.context.is_suspended,
      memberRole:req.context.role,staffLimit:PLAN_LIMITS[req.context.plan]?.staff || 3,
      branchLimit:PLAN_LIMITS[req.context.plan]?.branches || 1
    },
    branches: branches.rows, categories: categories.rows, products: products.rows,
    ingredients: ingredients.rows, recipes: recipes.rows, sales: sales.rows,
    expenses: expenses.rows, promos: promos.rows, customers: customers.rows,
    members: members.rows, auditLogs: auditLogs.rows, inventoryMovements: movements.rows,
    summary: {
      todaySales: todaySales.reduce((sum,s)=>sum+Number(s.total),0),
      todayOrders: todaySales.length,
      monthSales: monthTotal,
      monthOrders: monthSales.length,
      monthExpenses,
      estimatedCogs: cogs,
      estimatedProfit: monthTotal-cogs-monthExpenses,
      lowStock: ingredients.rows.filter(i=>i.is_active && Number(i.stock_qty)<=Number(i.low_stock_threshold)).length,
      inventoryValue,
      trialDaysLeft: Math.max(0, Math.ceil((new Date(req.context.trial_ends_at).getTime()-now.getTime())/86400000))
    }
  });
});

app.post("/api/pos/checkout", auth, requireContext, async (req, res) => {
  const ctx = req.context;
  if (ctx.is_suspended || ["suspended","cancelled","past_due"].includes(ctx.subscription_status)) {
    return res.status(403).json({ message: "This store is not active. Renew or contact the BrewPoint owner." });
  }
  if (ctx.subscription_status === "trialing" && new Date(ctx.trial_ends_at).getTime() <= Date.now()) {
    return res.status(403).json({ message: "Your 30-day trial has ended. Choose a plan to continue taking sales." });
  }
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const branchId = String(req.body.branchId || "");
  const paymentMethod = req.body.paymentMethod === "gcash" ? "gcash" : "cash";
  const paymentReference = String(req.body.paymentReference || "").trim();
  const customerId = req.body.customerId ? String(req.body.customerId) : null;
  const promoId = req.body.promoId ? String(req.body.promoId) : null;
  const tendered = req.body.tendered == null ? null : Number(req.body.tendered);
  if (!items.length) return res.status(400).json({ message: "Add at least one product." });
  if (paymentMethod === "gcash" && !paymentReference) return res.status(400).json({ message: "GCash reference is required." });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const branch = await client.query("SELECT id FROM branches WHERE id=$1 AND business_id=$2 AND is_active=true", [branchId, ctx.business_id]);
    if (!branch.rowCount) throw new Error("Invalid branch.");
    const productIds = [...new Set(items.map(i=>String(i.productId)))];
    const { rows: productRows } = await client.query(
      "SELECT id,name,price,is_active FROM products WHERE business_id=$1 AND id = ANY($2::bigint[])",
      [ctx.business_id, productIds]
    );
    if (productRows.length !== productIds.length || productRows.some(p=>!p.is_active)) throw new Error("One or more products are unavailable.");
    const productMap = new Map(productRows.map(p=>[String(p.id),p]));
    const { rows: recipeRows } = await client.query(
      `SELECT pi.product_id,pi.ingredient_id,pi.qty_required,i.name,i.stock_qty,i.low_stock_threshold
       FROM product_ingredients pi JOIN ingredients i ON i.id=pi.ingredient_id
       WHERE pi.business_id=$1 AND pi.product_id = ANY($2::bigint[])
       FOR UPDATE OF i`,
      [ctx.business_id, productIds]
    );
    const required = new Map();
    for (const recipe of recipeRows) {
      const cart = items.find(i=>String(i.productId)===String(recipe.product_id));
      const key = String(recipe.ingredient_id);
      const current = required.get(key) || { ingredientId:key,name:recipe.name,qty:0,stock:Number(recipe.stock_qty),low:Number(recipe.low_stock_threshold) };
      current.qty += Number(recipe.qty_required) * Number(cart.qty);
      required.set(key,current);
    }
    const insufficient = [...required.values()].filter(x=>x.qty>x.stock);
    if (insufficient.length) throw new Error("Not enough stock: " + insufficient.map(x=>x.name).join(", "));
    let subtotal = 0;
    for (const item of items) {
      const p = productMap.get(String(item.productId));
      const qty = Number(item.qty);
      if (!qty || qty <= 0) throw new Error("Invalid quantity.");
      subtotal += Number(p.price) * qty;
    }
    let discount = Math.max(0, Number(req.body.discount || 0));
    let promoLabel = "";
    if (promoId) {
      const { rows } = await client.query("SELECT * FROM promos WHERE id=$1 AND business_id=$2 AND is_active=true", [promoId, ctx.business_id]);
      const promo = rows[0];
      if (!promo) throw new Error("Selected promo is not active.");
      if (promo.starts_at && new Date(promo.starts_at) > new Date()) throw new Error("Promo has not started.");
      if (promo.ends_at && new Date(promo.ends_at) < new Date()) throw new Error("Promo has ended.");
      const value = Number(promo.value);
      if (promo.promo_type === "percentage") discount = Math.min(subtotal, subtotal * value / 100);
      else if (promo.promo_type === "set_price") discount = Math.max(0, subtotal - value);
      else discount = Math.min(subtotal, value);
      promoLabel = promo.name;
    }
    const total = Math.max(0, subtotal - discount);
    if (paymentMethod === "cash" && tendered != null && tendered < total) throw new Error("Tendered cash is below the total.");
    if (customerId) {
      const check = await client.query("SELECT id FROM customers WHERE id=$1 AND business_id=$2", [customerId, ctx.business_id]);
      if (!check.rowCount) throw new Error("Invalid customer.");
    }
    const referenceNo = "BP-" + new Date().toISOString().slice(0,10).replace(/-/g,"") + "-" + nanoid(5).toUpperCase();
    const changeDue = paymentMethod === "cash" && tendered != null ? tendered-total : 0;
    const { rows: saleRows } = await client.query(
      `INSERT INTO sales(business_id,branch_id,cashier_user_id,customer_id,reference_no,payment_method,payment_reference,subtotal,discount,total,tendered,change_due)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id`,
      [ctx.business_id,branchId,req.user.id,customerId,referenceNo,paymentMethod,paymentReference||null,subtotal,discount,total,tendered,changeDue]
    );
    const saleId = saleRows[0].id;
    for (const item of items) {
      const p = productMap.get(String(item.productId));
      const qty = Number(item.qty);
      await client.query(
        "INSERT INTO sale_items(sale_id,product_id,product_name,qty,unit_price,line_total) VALUES($1,$2,$3,$4,$5,$6)",
        [saleId,p.id,p.name,qty,p.price,Number(p.price)*qty]
      );
    }
    const lowStockNames = [];
    for (const entry of required.values()) {
      const balance = entry.stock-entry.qty;
      await client.query("UPDATE ingredients SET stock_qty=$1,updated_at=now() WHERE id=$2", [balance,entry.ingredientId]);
      await client.query(
        `INSERT INTO inventory_movements(business_id,branch_id,ingredient_id,movement_type,qty,balance_after,reference,performed_by,notes)
         VALUES($1,$2,$3,'sale',$4,$5,$6,$7,'Automatic recipe deduction')`,
        [ctx.business_id,branchId,entry.ingredientId,-entry.qty,balance,referenceNo,req.user.id]
      );
      if (balance <= entry.low) lowStockNames.push(entry.name);
    }
    await audit(client,ctx.business_id,req.user.id,"SALE_COMPLETED","sale",saleId,referenceNo+" · "+paymentMethod.toUpperCase()+" · ₱"+total.toFixed(2)+(promoLabel?" · "+promoLabel:""));
    await client.query("COMMIT");
    res.json({ saleId:String(saleId),referenceNo,total,changeDue,lowStockNames });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(400).json({ message:error.message || "Checkout failed." });
  } finally {
    client.release();
  }
});

app.post("/api/inventory/adjust", auth, requireContext, allow("owner","admin","manager","inventory"), async (req,res)=>{
  const ingredientId=String(req.body.ingredientId||"");
  const branchId=String(req.body.branchId||"");
  const type=["replenish","adjustment","waste"].includes(req.body.movementType)?req.body.movementType:"adjustment";
  const quantity=Number(req.body.quantity);
  if (!quantity || quantity<=0) return res.status(400).json({message:"Enter a positive quantity."});
  const client=await pool.connect();
  try{
    await client.query("BEGIN");
    const {rows}=await client.query("SELECT * FROM ingredients WHERE id=$1 AND business_id=$2 FOR UPDATE",[ingredientId,req.context.business_id]);
    if(!rows[0]) throw new Error("Ingredient not found.");
    const delta=type==="waste"?-quantity:quantity;
    const balance=Number(rows[0].stock_qty)+delta;
    if(balance<0) throw new Error("Stock cannot go below zero.");
    await client.query("UPDATE ingredients SET stock_qty=$1,updated_at=now() WHERE id=$2",[balance,ingredientId]);
    await client.query(`INSERT INTO inventory_movements(business_id,branch_id,ingredient_id,movement_type,qty,balance_after,performed_by,notes) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,[req.context.business_id,branchId||null,ingredientId,type,delta,balance,req.user.id,String(req.body.notes||"")||null]);
    await audit(client,req.context.business_id,req.user.id,"INVENTORY_UPDATED","ingredient",ingredientId,rows[0].name+": "+delta+" → "+balance);
    await client.query("COMMIT");
    res.json({balanceAfter:balance});
  }catch(error){await client.query("ROLLBACK");res.status(400).json({message:error.message});}finally{client.release();}
});

app.post("/api/ingredients/save", auth, requireContext, allow("owner","admin","manager","inventory"), async (req,res)=>{
  const name=String(req.body.name||"").trim();
  if(name.length<2)return res.status(400).json({message:"Ingredient name is required."});
  const values=[name,String(req.body.uom||"PCS").toUpperCase(),Math.max(0,Number(req.body.stockQty||0)),Math.max(0,Number(req.body.lowStockThreshold||0)),Math.max(0,Number(req.body.costPerUnit||0))];
  try{
    let result;
    if(req.body.id){
      result=await pool.query(`UPDATE ingredients SET name=$1,uom=$2,stock_qty=$3,low_stock_threshold=$4,cost_per_unit=$5,updated_at=now() WHERE id=$6 AND business_id=$7 RETURNING id`,[...values,req.body.id,req.context.business_id]);
    }else{
      result=await pool.query(`INSERT INTO ingredients(business_id,name,uom,stock_qty,low_stock_threshold,cost_per_unit) VALUES($1,$2,$3,$4,$5,$6) RETURNING id`,[req.context.business_id,...values]);
    }
    if(!result.rowCount)return res.status(404).json({message:"Ingredient not found."});
    await audit(pool,req.context.business_id,req.user.id,req.body.id?"INGREDIENT_UPDATED":"INGREDIENT_CREATED","ingredient",result.rows[0].id,name);
    res.json({id:String(result.rows[0].id)});
  }catch(error){res.status(400).json({message:error.code==="23505"?"Ingredient name already exists.":"Unable to save ingredient."});}
});

app.delete("/api/ingredients/:id", auth, requireContext, allow("owner","admin","manager","inventory"), async(req,res)=>{
  const ingredientId=String(req.params.id||"");
  const used=await pool.query("SELECT count(*)::int AS count FROM product_ingredients WHERE ingredient_id=$1 AND business_id=$2",[ingredientId,req.context.business_id]);
  if(Number(used.rows[0]?.count||0)>0)return res.status(400).json({message:"This ingredient is used in product recipes. Remove it from those recipes first."});
  const {rows}=await pool.query("DELETE FROM ingredients WHERE id=$1 AND business_id=$2 RETURNING id,name",[ingredientId,req.context.business_id]);
  if(!rows[0])return res.status(404).json({message:"Ingredient not found."});
  await audit(pool,req.context.business_id,req.user.id,"INGREDIENT_DELETED","ingredient",ingredientId,rows[0].name);
  res.json({ok:true});
});

app.post("/api/products/save", auth, requireContext, allow("owner","admin","manager"), async (req,res)=>{
  const name=String(req.body.name||"").trim();
  const categoryId=String(req.body.categoryId||"");
  const price=Math.max(0,Number(req.body.price||0));
  const recipes=Array.isArray(req.body.recipes)?req.body.recipes:[];
  if(name.length<2)return res.status(400).json({message:"Product name is required."});
  const client=await pool.connect();
  try{
    await client.query("BEGIN");
    const category=await client.query("SELECT id FROM product_categories WHERE id=$1 AND business_id=$2",[categoryId,req.context.business_id]);
    if(!category.rowCount)throw new Error("Invalid category.");
    let productId=req.body.id?String(req.body.id):null;
    if(productId){
      const updated=await client.query(`UPDATE products SET name=$1,category_id=$2,price=$3,sku=$4,updated_at=now() WHERE id=$5 AND business_id=$6 RETURNING id`,[name,categoryId,price,String(req.body.sku||"").trim()||null,productId,req.context.business_id]);
      if(!updated.rowCount)throw new Error("Product not found.");
      await client.query("DELETE FROM product_ingredients WHERE product_id=$1 AND business_id=$2",[productId,req.context.business_id]);
    }else{
      const {rows}=await client.query(`INSERT INTO products(business_id,category_id,name,price,sku) VALUES($1,$2,$3,$4,$5) RETURNING id`,[req.context.business_id,categoryId,name,price,String(req.body.sku||"").trim()||null]);
      productId=String(rows[0].id);
    }
    for(const recipe of recipes){
      const ingredientId=String(recipe.ingredientId||"");
      const qty=Number(recipe.qtyRequired);
      if(!ingredientId||!qty||qty<=0)continue;
      const found=await client.query("SELECT id FROM ingredients WHERE id=$1 AND business_id=$2",[ingredientId,req.context.business_id]);
      if(!found.rowCount)throw new Error("Invalid recipe ingredient.");
      await client.query(`INSERT INTO product_ingredients(business_id,product_id,ingredient_id,qty_required) VALUES($1,$2,$3,$4)`,[req.context.business_id,productId,ingredientId,qty]);
    }
    await audit(client,req.context.business_id,req.user.id,req.body.id?"PRODUCT_UPDATED":"PRODUCT_CREATED","product",productId,name+" · ₱"+price.toFixed(2));
    await client.query("COMMIT");
    res.json({id:productId});
  }catch(error){await client.query("ROLLBACK");res.status(400).json({message:error.message});}finally{client.release();}
});

app.delete("/api/products/:id", auth, requireContext, allow("owner","admin","manager"), async(req,res)=>{
  const productId=String(req.params.id||"");
  const {rows}=await pool.query("DELETE FROM products WHERE id=$1 AND business_id=$2 RETURNING id,name",[productId,req.context.business_id]);
  if(!rows[0])return res.status(404).json({message:"Product not found."});
  await audit(pool,req.context.business_id,req.user.id,"PRODUCT_DELETED","product",productId,rows[0].name);
  res.json({ok:true});
});

app.post("/api/categories", auth, requireContext, allow("owner","admin","manager"), async(req,res)=>{
  const name=String(req.body.name||"").trim();
  if(name.length<2)return res.status(400).json({message:"Category name is required."});
  try{
    const {rows}=await pool.query("INSERT INTO product_categories(business_id,name,sort_order) VALUES($1,$2,(SELECT COALESCE(max(sort_order),0)+1 FROM product_categories WHERE business_id=$1)) RETURNING id,name",[req.context.business_id,name]);
    await audit(pool,req.context.business_id,req.user.id,"CATEGORY_CREATED","category",rows[0].id,name);
    res.json({id:String(rows[0].id),name:rows[0].name});
  }catch(error){res.status(400).json({message:error.code==="23505"?"Category already exists.":"Unable to create category."});}
});

app.delete("/api/categories/:id", auth, requireContext, allow("owner","admin","manager"), async(req,res)=>{
  const categoryId=String(req.params.id||"");
  const used=await pool.query("SELECT count(*)::int AS count FROM products WHERE category_id=$1 AND business_id=$2",[categoryId,req.context.business_id]);
  if(Number(used.rows[0]?.count||0)>0)return res.status(400).json({message:"Move or delete products in this category first."});
  const {rows}=await pool.query("DELETE FROM product_categories WHERE id=$1 AND business_id=$2 RETURNING id,name",[categoryId,req.context.business_id]);
  if(!rows[0])return res.status(404).json({message:"Category not found."});
  await audit(pool,req.context.business_id,req.user.id,"CATEGORY_DELETED","category",categoryId,rows[0].name);
  res.json({ok:true});
});

app.post("/api/expenses", auth, requireContext, allow("owner","admin","manager"), async(req,res)=>{
  const amount=Number(req.body.amount);
  if(!amount||amount<=0)return res.status(400).json({message:"Expense amount must be greater than zero."});
  const {rows}=await pool.query(`INSERT INTO expenses(business_id,branch_id,category,description,amount,created_by) VALUES($1,$2,$3,$4,$5,$6) RETURNING id`,[req.context.business_id,req.body.branchId||null,String(req.body.category||"Other"),String(req.body.description||"Expense"),amount,req.user.id]);
  await audit(pool,req.context.business_id,req.user.id,"EXPENSE_ADDED","expense",rows[0].id,String(req.body.description||"Expense")+" · ₱"+amount.toFixed(2));
  res.json({id:String(rows[0].id)});
});

app.post("/api/customers", auth, requireContext, async(req,res)=>{
  const name=String(req.body.name||"").trim();
  if(name.length<2)return res.status(400).json({message:"Customer name is required."});
  const {rows}=await pool.query(`INSERT INTO customers(business_id,name,phone,email,notes) VALUES($1,$2,$3,$4,$5) RETURNING id`,[req.context.business_id,name,String(req.body.phone||"").trim()||null,String(req.body.email||"").trim().toLowerCase()||null,String(req.body.notes||"").trim()||null]);
  await audit(pool,req.context.business_id,req.user.id,"CUSTOMER_CREATED","customer",rows[0].id,name);
  res.json({id:String(rows[0].id)});
});

app.post("/api/promos", auth, requireContext, allow("owner","admin","manager"), async(req,res)=>{
  const name=String(req.body.name||"").trim();
  const type=["set_price","fixed_discount","percentage"].includes(req.body.promoType)?req.body.promoType:"fixed_discount";
  const value=Number(req.body.value);
  if(name.length<2||!value||value<=0)return res.status(400).json({message:"Enter a valid promo name and value."});
  if(type==="percentage"&&value>100)return res.status(400).json({message:"Percentage cannot exceed 100."});
  if(req.body.id){
    const {rows}=await pool.query("UPDATE promos SET name=$1,promo_type=$2,value=$3,is_active=$4 WHERE id=$5 AND business_id=$6 RETURNING id",[name,type,value,req.body.isActive!==false,String(req.body.id),req.context.business_id]);
    if(!rows[0])return res.status(404).json({message:"Promo not found."});
    await audit(pool,req.context.business_id,req.user.id,"PROMO_UPDATED","promo",rows[0].id,name);
    return res.json({id:String(rows[0].id)});
  }
  const {rows}=await pool.query(`INSERT INTO promos(business_id,name,promo_type,value,is_active) VALUES($1,$2,$3,$4,true) RETURNING id`,[req.context.business_id,name,type,value]);
  await audit(pool,req.context.business_id,req.user.id,"PROMO_CREATED","promo",rows[0].id,name);
  res.json({id:String(rows[0].id)});
});

app.delete("/api/promos/:id", auth, requireContext, allow("owner","admin","manager"), async(req,res)=>{
  const promoId=String(req.params.id||"");
  const {rows}=await pool.query("DELETE FROM promos WHERE id=$1 AND business_id=$2 RETURNING id,name",[promoId,req.context.business_id]);
  if(!rows[0])return res.status(404).json({message:"Promo not found."});
  await audit(pool,req.context.business_id,req.user.id,"PROMO_DELETED","promo",promoId,rows[0].name);
  res.json({ok:true});
});

app.post("/api/staff", auth, requireContext, allow("owner","admin"), async(req,res)=>{
  const email=String(req.body.email||"").trim().toLowerCase();
  const displayName=String(req.body.displayName||"").trim();
  const password=String(req.body.password||"");
  const role=["admin","manager","cashier","inventory"].includes(req.body.role)?req.body.role:"cashier";
  if(!email.includes("@")||displayName.length<2||password.length<8)return res.status(400).json({message:"Enter valid staff details and a password of at least 8 characters."});
  const {rows:[count]}=await pool.query("SELECT count(*)::int AS count FROM business_members WHERE business_id=$1 AND is_active=true",[req.context.business_id]);
  if(count.count>=PLAN_LIMITS[req.context.plan].staff)return res.status(400).json({message:"Your plan's active staff limit has been reached."});
  const client=await pool.connect();
  try{
    await client.query("BEGIN");
    const existing=await client.query("SELECT id FROM users WHERE email=$1",[email]);
    if(existing.rowCount)throw new Error("That email already has a BrewPoint account.");
    const hash=await bcrypt.hash(password,12);
    const {rows}=await client.query("INSERT INTO users(email,display_name,password_hash) VALUES($1,$2,$3) RETURNING id",[email,displayName,hash]);
    await client.query("INSERT INTO business_members(business_id,user_id,role) VALUES($1,$2,$3)",[req.context.business_id,rows[0].id,role]);
    await audit(client,req.context.business_id,req.user.id,"STAFF_CREATED","user",rows[0].id,displayName+" · "+role);
    await client.query("COMMIT");
    res.json({userId:rows[0].id});
  }catch(error){await client.query("ROLLBACK");res.status(400).json({message:error.message});}finally{client.release();}
});

app.post("/api/staff/toggle", auth, requireContext, allow("owner","admin"), async(req,res)=>{
  const memberId=String(req.body.memberId||"");
  const member=await pool.query("SELECT * FROM business_members WHERE id=$1 AND business_id=$2",[memberId,req.context.business_id]);
  if(!member.rowCount)return res.status(404).json({message:"Staff member not found."});
  if(member.rows[0].role==="owner")return res.status(400).json({message:"The owner cannot be disabled."});
  const isActive=Boolean(req.body.isActive);
  if(isActive){
    const {rows:[count]}=await pool.query("SELECT count(*)::int AS count FROM business_members WHERE business_id=$1 AND is_active=true",[req.context.business_id]);
    if(count.count>=PLAN_LIMITS[req.context.plan].staff)return res.status(400).json({message:"Your plan's active staff limit has been reached."});
  }
  await pool.query("UPDATE business_members SET is_active=$1 WHERE id=$2",[isActive,memberId]);
  await audit(pool,req.context.business_id,req.user.id,isActive?"STAFF_ENABLED":"STAFF_DISABLED","user",member.rows[0].user_id,"Staff access changed");
  res.json({ok:true});
});

app.post("/api/branches", auth, requireContext, allow("owner","admin"), async(req,res)=>{
  const name=String(req.body.name||"").trim();
  if(name.length<2)return res.status(400).json({message:"Branch name is required."});
  const {rows:[count]}=await pool.query("SELECT count(*)::int AS count FROM branches WHERE business_id=$1 AND is_active=true",[req.context.business_id]);
  if(count.count>=PLAN_LIMITS[req.context.plan].branches)return res.status(400).json({message:"Your plan's branch limit has been reached."});
  const {rows}=await pool.query("INSERT INTO branches(business_id,name,address) VALUES($1,$2,$3) RETURNING id",[req.context.business_id,name,String(req.body.address||"").trim()||null]);
  await audit(pool,req.context.business_id,req.user.id,"BRANCH_CREATED","branch",rows[0].id,name);
  res.json({id:String(rows[0].id)});
});

app.get("/api/reports", auth, requireContext, async(req,res)=>{
  try{
    const period=["daily","weekly","monthly","yearly"].includes(req.query.period)?req.query.period:"monthly";
    const startAt=req.query.start?new Date(String(req.query.start)+"T00:00:00+08:00"):reportStart(period);
    const endAt=req.query.end?new Date(String(req.query.end)+"T23:59:59.999+08:00"):new Date();
    if(Number.isNaN(startAt.getTime())||Number.isNaN(endAt.getTime())||endAt<startAt)return res.status(400).json({message:"Invalid report date range."});
    const branchId=req.query.branchId?String(req.query.branchId):null;
    const employeeId=req.query.employeeId?Number(req.query.employeeId):null;
    const businessId=req.context.business_id;
    const params=[businessId,startAt,endAt,branchId,employeeId];
    const saleFilter="s.business_id=$1 AND s.created_at >= $2 AND s.created_at <= $3 AND ($4::bigint IS NULL OR s.branch_id=$4::bigint) AND ($5::integer IS NULL OR s.cashier_user_id=$5::integer)";
    const itemSql=`SELECT si.*,s.status,s.subtotal AS sale_subtotal,s.discount AS sale_discount,s.total AS sale_total,s.created_at,
        p.sku,pc.name AS category_name,b.name AS branch_name,u.display_name AS cashier_name
      FROM sale_items si
      JOIN sales s ON s.id=si.sale_id
      LEFT JOIN products p ON p.id=si.product_id
      LEFT JOIN product_categories pc ON pc.id=p.category_id
      LEFT JOIN branches b ON b.id=s.branch_id
      LEFT JOIN users u ON u.id=s.cashier_user_id
      WHERE ${saleFilter}`;

    const [sales,items,expenses,ingredients,recipes]=await Promise.all([
      pool.query(`SELECT s.*,b.name AS branch_name,u.display_name AS cashier_name,c.name AS customer_name
        FROM sales s JOIN branches b ON b.id=s.branch_id
        LEFT JOIN users u ON u.id=s.cashier_user_id
        LEFT JOIN customers c ON c.id=s.customer_id
        WHERE ${saleFilter} ORDER BY s.created_at DESC`,params),
      pool.query(itemSql,params),
      pool.query(`SELECT amount FROM expenses WHERE business_id=$1 AND spent_at >= $2 AND spent_at <= $3 AND ($4::bigint IS NULL OR branch_id=$4::bigint)`,[businessId,startAt,endAt,branchId]),
      pool.query("SELECT id,cost_per_unit FROM ingredients WHERE business_id=$1",[businessId]),
      pool.query("SELECT product_id,ingredient_id,qty_required FROM product_ingredients WHERE business_id=$1",[businessId])
    ]);

    const costMap=new Map(ingredients.rows.map(i=>[String(i.id),Number(i.cost_per_unit)]));
    const recipeCost=new Map();
    for(const recipe of recipes.rows){
      const key=String(recipe.product_id);
      recipeCost.set(key,(recipeCost.get(key)||0)+Number(recipe.qty_required)*(costMap.get(String(recipe.ingredient_id))||0));
    }

    const summarize=(saleRows,itemRows)=>{
      const completed=saleRows.filter(x=>x.status==="completed");
      const refunded=saleRows.filter(x=>x.status==="voided"||x.status==="refunded");
      const cogs=itemRows.filter(x=>x.status==="completed").reduce((sum,item)=>sum+(recipeCost.get(String(item.product_id))||0)*Number(item.qty),0);
      const grossSales=completed.reduce((sum,x)=>sum+Number(x.subtotal),0);
      const discounts=completed.reduce((sum,x)=>sum+Number(x.discount),0);
      const netSales=completed.reduce((sum,x)=>sum+Number(x.total),0);
      const refunds=refunded.reduce((sum,x)=>sum+Number(x.total),0);
      return {grossSales,refunds,discounts,netSales,grossProfit:netSales-cogs,cogs,orders:completed.length};
    };

    const current=summarize(sales.rows,items.rows);
    const duration=Math.max(1,endAt.getTime()-startAt.getTime());
    const prevStart=new Date(startAt.getTime()-duration-1);
    const prevEnd=new Date(startAt.getTime()-1);
    const prevParams=[businessId,prevStart,prevEnd,branchId,employeeId];
    const [prevSales,prevItems]=await Promise.all([
      pool.query(`SELECT s.* FROM sales s WHERE ${saleFilter}`,prevParams),
      pool.query(itemSql,prevParams)
    ]);
    const previous=summarize(prevSales.rows,prevItems.rows);
    const compare=(cur,prev)=>({delta:cur-prev,pct:prev===0?(cur===0?0:100):((cur-prev)/Math.abs(prev))*100});
    const comparisons={
      grossSales:compare(current.grossSales,previous.grossSales),
      refunds:compare(current.refunds,previous.refunds),
      discounts:compare(current.discounts,previous.discounts),
      netSales:compare(current.netSales,previous.netSales),
      grossProfit:compare(current.grossProfit,previous.grossProfit)
    };

    const productMap=new Map();
    const categoryMap=new Map();
    const dayMap=new Map();
    const paymentMap=new Map();
    const employeeMap=new Map();
    const dayKey=value=>new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Manila",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(value));

    for(const sale of sales.rows){
      const key=dayKey(sale.created_at);
      const day=dayMap.get(key)||{date:key,grossSales:0,refunds:0,discounts:0,netSales:0,cogs:0,grossProfit:0,orders:0};
      if(sale.status==="completed"){
        day.grossSales+=Number(sale.subtotal);day.discounts+=Number(sale.discount);day.netSales+=Number(sale.total);day.orders++;
        const pay=paymentMap.get(sale.payment_method)||{name:sale.payment_method,receipts:0,netSales:0};
        pay.receipts++;pay.netSales+=Number(sale.total);paymentMap.set(sale.payment_method,pay);
        const empKey=String(sale.cashier_user_id||"unknown");
        const emp=employeeMap.get(empKey)||{id:sale.cashier_user_id,name:sale.cashier_name||"Unknown",receipts:0,netSales:0};
        emp.receipts++;emp.netSales+=Number(sale.total);employeeMap.set(empKey,emp);
      }else if(sale.status==="voided"||sale.status==="refunded") day.refunds+=Number(sale.total);
      dayMap.set(key,day);
    }

    for(const item of items.rows){
      if(item.status!=="completed")continue;
      const gross=Number(item.line_total);
      const saleSubtotal=Number(item.sale_subtotal)||0;
      const discountShare=saleSubtotal>0?Number(item.sale_discount||0)*(gross/saleSubtotal):0;
      const net=gross-discountShare;
      const cogs=(recipeCost.get(String(item.product_id))||0)*Number(item.qty);
      const profit=net-cogs;
      const productKey=String(item.product_id||item.product_name);
      const p=productMap.get(productKey)||{id:item.product_id,name:item.product_name,sku:item.sku||"",category:item.category_name||"Uncategorized",qty:0,grossSales:0,discounts:0,netSales:0,cogs:0,grossProfit:0,margin:0};
      p.qty+=Number(item.qty);p.grossSales+=gross;p.discounts+=discountShare;p.netSales+=net;p.cogs+=cogs;p.grossProfit+=profit;p.margin=p.netSales?100*p.grossProfit/p.netSales:0;productMap.set(productKey,p);
      const catKey=item.category_name||"Uncategorized";
      const c=categoryMap.get(catKey)||{name:catKey,qty:0,grossSales:0,discounts:0,netSales:0,cogs:0,grossProfit:0,margin:0};
      c.qty+=Number(item.qty);c.grossSales+=gross;c.discounts+=discountShare;c.netSales+=net;c.cogs+=cogs;c.grossProfit+=profit;c.margin=c.netSales?100*c.grossProfit/c.netSales:0;categoryMap.set(catKey,c);
      const key=dayKey(item.created_at);
      const day=dayMap.get(key)||{date:key,grossSales:0,refunds:0,discounts:0,netSales:0,cogs:0,grossProfit:0,orders:0};
      day.cogs+=cogs;dayMap.set(key,day);
    }
    for(const day of dayMap.values())day.grossProfit=day.netSales-day.cogs;

    const expenseTotal=expenses.rows.reduce((sum,e)=>sum+Number(e.amount),0);
    res.json({
      period,startAt,endAt,
      sales:current.netSales,orders:current.orders,expenses:expenseTotal,estimatedCogs:current.cogs,
      estimatedProfit:current.grossProfit-expenseTotal,
      grossSales:current.grossSales,refunds:current.refunds,discounts:current.discounts,netSales:current.netSales,grossProfit:current.grossProfit,
      cashSales:sales.rows.filter(x=>x.status==="completed"&&x.payment_method==="cash").reduce((sum,x)=>sum+Number(x.total),0),
      gcashSales:sales.rows.filter(x=>x.status==="completed"&&x.payment_method==="gcash").reduce((sum,x)=>sum+Number(x.total),0),
      comparisons,
      breakdown:[...dayMap.values()].sort((a,b)=>a.date.localeCompare(b.date)),
      products:[...productMap.values()].sort((a,b)=>b.netSales-a.netSales),
      categories:[...categoryMap.values()].sort((a,b)=>b.netSales-a.netSales),
      employees:[...employeeMap.values()].sort((a,b)=>b.netSales-a.netSales),
      paymentTypes:[...paymentMap.values()].sort((a,b)=>b.netSales-a.netSales),
      transactions:sales.rows
    });
  }catch(error){
    console.error(error);
    res.status(500).json({message:"Unable to build report."});
  }
});

app.post("/api/sales/void", auth, requireContext, allow("owner","admin","manager"), async(req,res)=>{
  const saleId=String(req.body.saleId||"");
  const reason=String(req.body.reason||"").trim();
  if(reason.length<2)return res.status(400).json({message:"Enter a reason for the void."});
  const client=await pool.connect();
  try{
    await client.query("BEGIN");
    const {rows}=await client.query("SELECT * FROM sales WHERE id=$1 AND business_id=$2 FOR UPDATE",[saleId,req.context.business_id]);
    const sale=rows[0];if(!sale)throw new Error("Sale not found.");if(sale.status==="voided")throw new Error("Sale is already voided.");
    const movements=await client.query("SELECT * FROM inventory_movements WHERE business_id=$1 AND reference=$2 AND movement_type='sale'",[req.context.business_id,sale.reference_no]);
    await client.query("UPDATE sales SET status='voided' WHERE id=$1",[saleId]);
    for(const movement of movements.rows){
      const {rows:[ingredient]}=await client.query("SELECT stock_qty FROM ingredients WHERE id=$1 FOR UPDATE",[movement.ingredient_id]);
      if(!ingredient)continue;
      const restore=Math.abs(Number(movement.qty));
      const balance=Number(ingredient.stock_qty)+restore;
      await client.query("UPDATE ingredients SET stock_qty=$1,updated_at=now() WHERE id=$2",[balance,movement.ingredient_id]);
      await client.query(`INSERT INTO inventory_movements(business_id,branch_id,ingredient_id,movement_type,qty,balance_after,reference,performed_by,notes) VALUES($1,$2,$3,'adjustment',$4,$5,$6,$7,'Stock restored after void')`,[req.context.business_id,sale.branch_id,movement.ingredient_id,restore,balance,"VOID-"+sale.reference_no,req.user.id]);
    }
    await audit(client,req.context.business_id,req.user.id,"SALE_VOIDED","sale",saleId,sale.reference_no+" · "+reason);
    await client.query("COMMIT");
    res.json({ok:true});
  }catch(error){await client.query("ROLLBACK");res.status(400).json({message:error.message});}finally{client.release();}
});

app.post("/api/subscription/change", auth, requireContext, allow("owner","admin"), async(req,res)=>{
  const plan=["starter","pro","business"].includes(req.body.plan)?req.body.plan:null;
  if(!plan)return res.status(400).json({message:"Invalid plan."});
  const currentMembers=await pool.query("SELECT count(*)::int AS count FROM business_members WHERE business_id=$1 AND is_active=true",[req.context.business_id]);
  const currentBranches=await pool.query("SELECT count(*)::int AS count FROM branches WHERE business_id=$1 AND is_active=true",[req.context.business_id]);
  if(currentMembers.rows[0].count>PLAN_LIMITS[plan].staff)return res.status(400).json({message:"Disable staff accounts before downgrading to this plan."});
  if(currentBranches.rows[0].count>PLAN_LIMITS[plan].branches)return res.status(400).json({message:"This business has too many active branches for that plan."});
  const activate=Boolean(req.body.activateDemo);
  await pool.query(`UPDATE businesses SET plan=$1,subscription_status=$2,current_period_end=$3,is_suspended=false,updated_at=now() WHERE id=$4`,[plan,activate?"active":req.context.subscription_status,activate?new Date(Date.now()+30*86400000):req.context.current_period_end,req.context.business_id]);
  await audit(pool,req.context.business_id,req.user.id,activate?"DEMO_SUBSCRIPTION_ACTIVATED":"PLAN_CHANGED","subscription",req.context.business_id,plan);
  res.json({plan,subscriptionStatus:activate?"active":req.context.subscription_status});
});

app.get("/api/landlord", auth, async(req,res)=>{
  try{
    if(req.user.platform_role!=="platform_admin")return res.status(403).json({message:"Platform owner access required."});
    const [tenantRows,auditRows,userStats]=await Promise.all([
      pool.query(`
        SELECT b.*,
          (SELECT count(*)::int FROM branches br WHERE br.business_id=b.id AND br.is_active=true) AS branches,
          (SELECT count(*)::int FROM business_members bm WHERE bm.business_id=b.id AND bm.is_active=true) AS members,
          (SELECT u.email FROM business_members bm JOIN users u ON u.id=bm.user_id WHERE bm.business_id=b.id AND bm.role='owner' ORDER BY bm.id LIMIT 1) AS owner_email,
          (SELECT u.display_name FROM business_members bm JOIN users u ON u.id=bm.user_id WHERE bm.business_id=b.id AND bm.role='owner' ORDER BY bm.id LIMIT 1) AS owner_name,
          COALESCE((SELECT sum(s.total) FROM sales s WHERE s.business_id=b.id AND s.status='completed' AND s.created_at>=date_trunc('month',now())),0) AS month_sales,
          COALESCE((SELECT sum(s.total) FROM sales s WHERE s.business_id=b.id AND s.status='completed' AND s.created_at>=date_trunc('day',now())),0) AS today_sales,
          COALESCE((SELECT count(*)::int FROM sales s WHERE s.business_id=b.id AND s.status='completed' AND s.created_at>=date_trunc('month',now())),0) AS month_orders
        FROM businesses b ORDER BY b.created_at DESC
      `),
      pool.query(`SELECT a.*,b.name AS business_name,u.display_name,u.email
        FROM audit_logs a LEFT JOIN businesses b ON b.id=a.business_id LEFT JOIN users u ON u.id=a.user_id
        ORDER BY a.created_at DESC LIMIT 250`),
      pool.query(`SELECT count(*)::int AS total_users,
        count(*) FILTER (WHERE platform_role='platform_admin')::int AS platform_admins
        FROM users`)
    ]);
    const rows=tenantRows.rows;
    const active=rows.filter(b=>b.subscription_status==="active"&&!b.is_suspended);
    const trial=rows.filter(b=>b.subscription_status==="trialing"&&!b.is_suspended);
    const planBreakdown={starter:0,pro:0,business:0};
    for(const tenant of active)if(planBreakdown[tenant.plan]!==undefined)planBreakdown[tenant.plan]++;
    res.json({
      summary:{
        totalTenants:rows.length,
        activeTenants:active.length,
        trialTenants:trial.length,
        needsAttention:rows.filter(b=>["past_due","suspended","cancelled"].includes(b.subscription_status)||b.is_suspended).length,
        monthlyRecurringRevenue:active.reduce((sum,b)=>sum+(PLAN_LIMITS[b.plan]?.price||0),0),
        monthPlatformSales:rows.reduce((sum,b)=>sum+Number(b.month_sales||0),0)
      },
      planBreakdown,
      security:{
        betaGateEnabled:Boolean(process.env.BETA_ACCESS_CODE),
        platformAdmins:Number(userStats.rows[0]?.platform_admins||0),
        totalUsers:Number(userStats.rows[0]?.total_users||0),
        database:"healthy",
        sessionCookie:"httpOnly · sameSite=lax · secure in production"
      },
      tenants:rows,
      audits:auditRows.rows
    });
  }catch(error){
    console.error(error);
    res.status(500).json({message:"Unable to load platform console."});
  }
});

app.post("/api/landlord/action", auth, async(req,res)=>{
  try{
    if(req.user.platform_role!=="platform_admin")return res.status(403).json({message:"Platform owner access required."});
    const businessId=String(req.body.businessId||"");
    const action=String(req.body.action||"");
    const found=await pool.query("SELECT * FROM businesses WHERE id=$1",[businessId]);
    if(!found.rowCount)return res.status(404).json({message:"Tenant not found."});
    const tenant=found.rows[0];
    if(action==="extend_trial"){
      await pool.query(`UPDATE businesses SET trial_ends_at=GREATEST(trial_ends_at,now())+interval '7 days',subscription_status='trialing',is_suspended=false,updated_at=now() WHERE id=$1`,[businessId]);
    }else if(action==="extend_trial_30"||action==="reset_trial"){
      await pool.query(`UPDATE businesses SET trial_ends_at=now()+interval '30 days',subscription_status='trialing',is_suspended=false,current_period_end=NULL,updated_at=now() WHERE id=$1`,[businessId]);
    }else if(action==="suspend"){
      await pool.query("UPDATE businesses SET is_suspended=true,subscription_status='suspended',updated_at=now() WHERE id=$1",[businessId]);
    }else if(action==="resume"){
      const resumeStatus=tenant.current_period_end&&new Date(tenant.current_period_end).getTime()>Date.now()?"active":"trialing";
      await pool.query(`UPDATE businesses SET is_suspended=false,subscription_status=$2,trial_ends_at=CASE WHEN $2='trialing' THEN GREATEST(trial_ends_at,now())+interval '7 days' ELSE trial_ends_at END,updated_at=now() WHERE id=$1`,[businessId,resumeStatus]);
    }else if(action==="mark_active"){
      await pool.query(`UPDATE businesses SET is_suspended=false,subscription_status='active',current_period_end=now()+interval '30 days',updated_at=now() WHERE id=$1`,[businessId]);
    }else if(action==="mark_past_due"){
      await pool.query("UPDATE businesses SET is_suspended=false,subscription_status='past_due',updated_at=now() WHERE id=$1",[businessId]);
    }else if(action==="cancel"){
      await pool.query("UPDATE businesses SET is_suspended=true,subscription_status='cancelled',updated_at=now() WHERE id=$1",[businessId]);
    }else if(action==="change_plan"){
      const plan=["starter","pro","business"].includes(req.body.plan)?req.body.plan:null;
      if(!plan)return res.status(400).json({message:"Invalid plan."});
      const [members,branches]=await Promise.all([
        pool.query("SELECT count(*)::int AS count FROM business_members WHERE business_id=$1 AND is_active=true",[businessId]),
        pool.query("SELECT count(*)::int AS count FROM branches WHERE business_id=$1 AND is_active=true",[businessId])
      ]);
      if(members.rows[0].count>PLAN_LIMITS[plan].staff)return res.status(400).json({message:"Tenant has more active staff than the selected plan allows."});
      if(branches.rows[0].count>PLAN_LIMITS[plan].branches)return res.status(400).json({message:"Tenant has more active branches than the selected plan allows."});
      await pool.query("UPDATE businesses SET plan=$2,updated_at=now() WHERE id=$1",[businessId,plan]);
    }else return res.status(400).json({message:"Invalid action."});
    await audit(pool,businessId,req.user.id,"LANDLORD_"+action.toUpperCase(),"business",businessId,req.body.plan?String(req.body.plan):"Platform owner action");
    const updated=await pool.query("SELECT id,name,plan,subscription_status,trial_ends_at,current_period_end,is_suspended FROM businesses WHERE id=$1",[businessId]);
    res.json({ok:true,tenant:updated.rows[0]});
  }catch(error){
    console.error(error);
    res.status(400).json({message:error.message||"Unable to update tenant."});
  }
});

app.use(express.static(path.join(rootDir, "dist")));
app.use((req,res,next)=>{
  if(req.method!=="GET"||req.path.startsWith("/api/"))return next();
  res.sendFile(path.join(rootDir,"dist","index.html"));
});

await migrate();
app.listen(PORT, "0.0.0.0", () => console.log("BrewPoint listening on port", PORT));
