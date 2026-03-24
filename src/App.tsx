import { useState, useEffect, useCallback, useRef } from "react";

// ═══════════════════════════════════════════════════════════
//  SAVUKA v4 — savuka.online
//  Complete platform: Worker · Employer · Sole Trader
//  Payments: MTN MoMo + DeltaPay
//  AI: Claude API profile builder, portfolio captions, skill grading
// ═══════════════════════════════════════════════════════════
const BRAND = "Savuka";
const DOMAIN = "savuka.online";
const MOMO_API_KEY    = "YOUR_MTN_MOMO_API_KEY";
const DELTAPAY_KEY    = "YOUR_DELTAPAY_KEY";
const DELTAPAY_MERCHANT = "SAVUKA_MERCHANT_001";

// ─── DEMO ACCOUNTS ────────────────────────────────────────
const DEMO_ACCOUNTS = {
  "worker@savuka.online":   { id:"11111111-1111-1111-1111-111111111111", full_name:"Sibusiso Dlamini", initials:"SD", role:"worker",     sub:"premium", status:"active", phone:"+26876001111", verified:true,  trade:"Construction" },
  "nomvula@savuka.online":  { id:"22222222-2222-2222-2222-222222222222", full_name:"Nomvula Khumalo",  initials:"NK", role:"worker",     sub:"premium", status:"active", phone:"+26876002222", verified:true,  trade:"Domestic" },
  "thabo@savuka.online":    { id:"33333333-3333-3333-3333-333333333333", full_name:"Thabo Mkhwanazi",  initials:"TM", role:"worker",     sub:"free",    status:"active", phone:"+26876003333", verified:true,  trade:"Electrical" },
  "employer@savuka.online": { id:"66666666-6666-6666-6666-666666666666", full_name:"Tibiyo HR",        initials:"TH", role:"employer",   sub:"premium", status:"active", phone:"+26876006666", verified:true,  cipa:"SW2019/001234", deposit_paid:true },
  "nandi@savuka.online":    { id:"88888888-8888-8888-8888-888888888888", full_name:"Nandi Mthembu",    initials:"NM", role:"sole_trader", sub:"premium", status:"active", phone:"+26876008888", verified:true,  trade:"Beauty" },
  "newbiz@savuka.online":   { id:"99999999-9999-9999-9999-999999999999", full_name:"New Business",     initials:"NB", role:"employer",   sub:"free",    status:"pending_verify", phone:"+26876009999", verified:false, cipa:"" },
  "admin@savuka.online":    { id:"00000000-0000-0000-0000-000000000000", full_name:"Savuka Admin",     initials:"SA", role:"admin",      sub:"premium", status:"active", phone:"+26876000000", verified:true },
};

// ─── DESIGN TOKENS ────────────────────────────────────────
const C = {
  blue:"#0A66C2", blueDark:"#004182", blueLight:"#EBF3FB",
  white:"#FFFFFF", bg:"#F3F2EF", card:"#FAFAF8",
  text:"#191919", mid:"#434649", light:"#888", xlight:"#BBB",
  border:"#E0DFDC", borderDark:"#C8C7C4",
  green:"#057642", greenLight:"#DCFCE7",
  red:"#CC1016", redLight:"#FEE2E2",
  orange:"#E67E22", orangeLight:"#FEF3CD",
  gold:"#C9A84C", goldLight:"#FDF6DC", goldBright:"#F0C040",
  teal:"#0F766E", tealLight:"#CCFBF1",
  purple:"#7C3AED", purpleLight:"#EDE9FE",
  momo:"#FFCB00", momoDark:"#E6A800",
  delta:"#014D6F", deltaLight:"#E6F2F7",
  workerAccent:"#0A66C2", employerAccent:"#7C3AED", traderAccent:"#0F766E",
  chart1:"#0A66C2",chart2:"#10B981",chart3:"#F59E0B",chart4:"#EF4444",chart5:"#8B5CF6",
};

// ─── IMAGES ───────────────────────────────────────────────
const IMG = {
  sibusiso:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face",
  nomvula: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=160&h=160&fit=crop&crop=face",
  thabo:   "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=face",
  lindiwe: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face",
  bongani: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop&crop=face",
  nandi:   "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop&crop=face",
  cover1:  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=200&fit=crop",
  cover2:  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=200&fit=crop",
  nails:   "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
  hair:    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop",
  sewing:  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=300&fit=crop",
  port1:   "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=280&fit=crop",
  port2:   "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=280&fit=crop",
  port3:   "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=280&fit=crop",
  build1:  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=280&fit=crop",
};

// ─── DEMO DATA ─────────────────────────────────────────────
const DEMO_WORKERS = [
  { id:"11111111-1111-1111-1111-111111111111", full_name:"Sibusiso Dlamini", initials:"SD", photo:IMG.sibusiso, title:"Master Bricklayer & Construction Specialist", trade:"Construction", location:"Mbabane", experience_years:"14", rating:4.9, jobs_completed:127, available:true, verified:true, sub:"premium", skills:["Bricklaying","Plastering","Tiling","Waterproofing","Scaffolding","Site Management"], skills_score:91, bio:"Built over 200 homes across Eswatini and South Africa. Every structure I build is a legacy.", hourly:"E180", phone:"+26876001111", portfolio:[{img:IMG.port1,caption:"4-bedroom house handover, Ezulwini"},{img:IMG.port2,caption:"Commercial tile installation, Matsapha"},{img:IMG.port3,caption:"Foundation work, Mbabane CBD"}], certifications:["Occupational Safety Certificate","TVET Bricklaying Level 4"], experience:[{role:"Lead Bricklayer",company:"Swazi Construction Ltd",period:"2018–Present"},{role:"Bricklayer",company:"Tibiyo Infrastructure",period:"2014–2018"}] },
  { id:"22222222-2222-2222-2222-222222222222", full_name:"Nomvula Khumalo",  initials:"NK", photo:IMG.nomvula,  title:"Domestic Worker & Childcare Specialist", trade:"Domestic", location:"Manzini", experience_years:"9", rating:5.0, jobs_completed:83, available:true, verified:true, sub:"premium", skills:["Childcare","Cooking","Housekeeping","First Aid","Elderly Care","Meal Planning"], skills_score:88, bio:"Trusted with families for nearly a decade. Safe Food Handling & First Aid certified.", hourly:"E120", phone:"+26876002222", portfolio:[], certifications:["Safe Food Handling Certificate","Childcare First Aid — TVET Mbabane"], experience:[{role:"Senior Domestic Worker",company:"Private Household, Ezulwini",period:"2020–Present"}] },
  { id:"33333333-3333-3333-3333-333333333333", full_name:"Thabo Mkhwanazi",  initials:"TM", photo:IMG.thabo,   title:"Certified Electrician & Solar Installer", trade:"Electrical", location:"Nhlangano", experience_years:"11", rating:4.8, jobs_completed:94, available:false, verified:true, sub:"free", skills:["Electrical Wiring","Solar PV","Fault Finding","Compliance Testing","Inverter Installation"], skills_score:94, bio:"Licensed by EEC. Solar retrofits for homes and businesses across Eswatini.", hourly:"E200", phone:"+26876003333", portfolio:[{img:IMG.build1,caption:"5kW solar installation, Kwaluseni"}], certifications:["EEC Licensed Electrician","Solar PV Installer — SANESA"], experience:[{role:"Electrical Contractor",company:"Self-Employed",period:"2019–Present"}] },
  { id:"44444444-4444-4444-4444-444444444444", full_name:"Lindiwe Shabalala", initials:"LS", photo:IMG.lindiwe, title:"Head Chef & Catering Professional", trade:"Hospitality", location:"Mbabane", experience_years:"7", rating:4.9, jobs_completed:56, available:true, verified:true, sub:"premium", skills:["Event Catering","Traditional Cuisine","Baking","Menu Planning","Food Safety"], skills_score:87, bio:"Catered events from 20 to 500 guests. Siswati and international cuisine.", hourly:"E160", phone:"+26876004444", portfolio:[], certifications:["Food Hygiene Level 3","City & Guilds Culinary Arts"], experience:[{role:"Head Chef",company:"Royal Swazi Events",period:"2021–Present"}] },
  { id:"55555555-5555-5555-5555-555555555555", full_name:"Bongani Ndlovu",    initials:"BN", photo:IMG.bongani,  title:"Professional Plumber & Pipe Fitter", trade:"Plumbing", location:"Manzini", experience_years:"8", rating:4.7, jobs_completed:71, available:true, verified:true, sub:"free", skills:["Plumbing","Pipe Fitting","Geyser Installation","Drain Clearing","Leak Detection"], skills_score:82, bio:"Water is life. Commercial and residential plumbing across Eswatini.", hourly:"E140", phone:"+26876005555", portfolio:[], certifications:["Plumbing Trade Certificate","Water Safety Compliance"], experience:[{role:"Senior Plumber",company:"AquaFix Eswatini",period:"2020–Present"}] },
];

const DEMO_JOBS = [
  { id:"j1", title:"Bricklayer — 3-bedroom house", company:"Swazi Homes Ltd", company_verified:true, location:"Ezulwini", salary:"E8,500/month", type:"Full-time", urgent:true, posted:"2h ago", applicants:12, match:96, description:"Foundation to roof, 4-month project. TVET cert preferred. PPE supplied.", trade:"Construction", deposit_held:true },
  { id:"j2", title:"Live-in domestic worker", company:"Private Family", company_verified:true, location:"Mbabane", salary:"E4,200/month + board", type:"Live-in", urgent:false, posted:"5h ago", applicants:7, match:88, description:"2 children ages 4 and 7. First Aid cert required. Accommodation provided.", trade:"Domestic", deposit_held:true },
  { id:"j3", title:"Solar installation — 10kW commercial", company:"EcoEnergy Eswatini", company_verified:true, location:"Matsapha", salary:"E14,000 project", type:"Contract", urgent:true, posted:"1d ago", applicants:4, match:99, description:"Commercial installation. EEC licence required. Materials provided.", trade:"Electrical", deposit_held:true },
  { id:"j4", title:"Head Chef — boutique lodge", company:"Hawane Resort", company_verified:true, location:"Hawane", salary:"E9,500/month", type:"Full-time", urgent:false, posted:"2d ago", applicants:9, match:81, description:"Breakfast, lunch, dinner for 25 covers. Accommodation available.", trade:"Hospitality", deposit_held:true },
  { id:"j5", title:"Plumber — block of flats renovation", company:"Tibiyo Construction", company_verified:true, location:"Manzini", salary:"E7,200/month", type:"Contract 3mo", urgent:false, posted:"3d ago", applicants:6, match:77, description:"Full bathroom and kitchen refit on 12 units. Tools provided.", trade:"Plumbing", deposit_held:false },
];

const DEMO_SERVICES = [
  { id:"s1", name:"Acrylic nail set", price:"E150", priceNum:150, duration:"90 min", img:IMG.nails },
  { id:"s2", name:"Full hair relaxer + blowout", price:"E280", priceNum:280, duration:"3 hrs", img:IMG.hair },
  { id:"s3", name:"Dress alteration", price:"E80", priceNum:80, duration:"1–2 days", img:IMG.sewing },
  { id:"s4", name:"Gel polish + nail art", price:"E120", priceNum:120, duration:"60 min", img:IMG.nails },
];

const DEMO_NOTIFS = [
  { id:"n1", type:"match",   icon:"🎯", title:"New job match — 99% fit", body:"Solar installation in Matsapha matches your Electrical skills.", time:"2m ago",  read:false },
  { id:"n2", type:"message", icon:"💬", title:"Tibiyo HR wants to hire you", body:"They viewed your profile and sent a message.", time:"1h ago",  read:false },
  { id:"n3", type:"verify",  icon:"✦", title:"ID verification approved", body:"Your Verified badge is now active on your profile.", time:"3h ago",  read:false },
  { id:"n4", type:"payment", icon:"💰", title:"Premium payment confirmed", body:"MoMo payment of E10 received. Premium active for 30 days.", time:"1d ago",  read:true },
  { id:"n5", type:"skill",   icon:"🏆", title:"Skills test result: 91/100", body:"Your Bricklaying test badge is now public on your profile.", time:"2d ago",  read:true },
  { id:"n6", type:"endorse", icon:"⭐", title:"Nomvula endorsed your skills", body:"Nomvula Khumalo endorsed you for Childcare.", time:"3d ago",  read:true },
];

// ─── CONNECTIONS & CHAT DATA ──────────────────────────────
const DEMO_CONNECTIONS_INITIAL = {
  "11111111-1111-1111-1111-111111111111": { status:"connected", since:"Jan 2025" }, // Sibusiso (me as logged worker)
  "22222222-2222-2222-2222-222222222222": { status:"none" },
  "33333333-3333-3333-3333-333333333333": { status:"pending_sent" },
  "44444444-4444-4444-4444-444444444444": { status:"none" },
  "55555555-5555-5555-5555-555555555555": { status:"connected", since:"Nov 2024" },
  "66666666-6666-6666-6666-666666666666": { status:"none" }, // Tibiyo HR
};

// Messages shared across all roles — keyed by conversation id
const INITIAL_CHAT_THREADS = [
  { id:"c1", participants:["11111111-1111-1111-1111-111111111111","66666666-6666-6666-6666-666666666666"], other:{ id:"66666666-6666-6666-6666-666666666666", full_name:"Tibiyo HR", initials:"TH", photo:null, role:"employer", verified:true }, messages:[
    { id:"msg1", from:"66666666-6666-6666-6666-666666666666", text:"Hello Sibusiso, we reviewed your profile and would like to discuss the Site Manager role.", time:"10:15", date:"Today" },
    { id:"msg2", from:"66666666-6666-6666-6666-666666666666", text:"The role starts 1 February. Salary is E12,000/month + benefits.", time:"10:16", date:"Today" },
    { id:"msg3", from:"11111111-1111-1111-1111-111111111111", text:"Thank you! I am very interested. What are the working hours?", time:"10:30", date:"Today" },
  ], unread:2 },
  { id:"c2", participants:["11111111-1111-1111-1111-111111111111","33333333-3333-3333-3333-333333333333"], other:{ id:"33333333-3333-3333-3333-333333333333", full_name:"Thabo Mkhwanazi", initials:"TM", photo:IMG.thabo, role:"worker", verified:true }, messages:[
    { id:"msg4", from:"33333333-3333-3333-3333-333333333333", text:"Sibusiso, do you know anyone who needs solar panels installed on a new build?", time:"Yesterday", date:"Yesterday" },
    { id:"msg5", from:"11111111-1111-1111-1111-111111111111", text:"Yes! I have a client in Ezulwini finishing a 4-bed house. I'll connect you.", time:"Yesterday", date:"Yesterday" },
  ], unread:0 },
  { id:"c3", participants:["11111111-1111-1111-1111-111111111111","55555555-5555-5555-5555-555555555555"], other:{ id:"55555555-5555-5555-5555-555555555555", full_name:"Bongani Ndlovu", initials:"BN", photo:IMG.bongani, role:"worker", verified:true }, messages:[
    { id:"msg6", from:"55555555-5555-5555-5555-555555555555", text:"How long does the tiling usually take after plastering?", time:"Mon", date:"Mon" },
    { id:"msg7", from:"11111111-1111-1111-1111-111111111111", text:"Depends on the area — small bathroom 1 day, full house 4–5 days.", time:"Mon", date:"Mon" },
  ], unread:0 },
];

// ─── WORKER-POSTED JOBS ───────────────────────────────────
const DEMO_WORKER_POSTS = [
  { id:"wp1", type:"availability", author:{ id:"11111111-1111-1111-1111-111111111111", name:"Sibusiso Dlamini", initials:"SD", photo:IMG.sibusiso, title:"Master Bricklayer", verified:true, sub:"premium" }, headline:"Available for bricklaying projects from 1 Feb", detail:"Finishing current project end of January. Taking on 1–2 new builds in Mbabane/Manzini area. E180/hr or project rate. References available.", trade:"Construction", location:"Mbabane", rate:"E180/hr", posted:"1h ago", responses:4 },
  { id:"wp2", type:"hiring", author:{ id:"33333333-3333-3333-3333-333333333333", name:"Thabo Mkhwanazi", initials:"TM", photo:IMG.thabo, title:"Certified Electrician", verified:true, sub:"free" }, headline:"Looking for 2 general workers — solar project in Matsapha", detail:"Need 2 strong workers for 3-day solar panel installation. Must be fit and not afraid of heights. E300/day. Start date: next Monday.", trade:"Electrical", location:"Matsapha", rate:"E300/day", posted:"3h ago", responses:7 },
  { id:"wp3", type:"availability", author:{ id:"22222222-2222-2222-2222-222222222222", name:"Nomvula Khumalo", initials:"NK", photo:IMG.nomvula, title:"Domestic & Childcare", verified:true, sub:"premium" }, headline:"Available for afternoon childcare shifts — Manzini area", detail:"Experienced childminder available Mon–Fri 2pm–7pm. Also available weekends for events. First Aid certified. E120/half-day.", trade:"Domestic", location:"Manzini", rate:"E120/half-day", posted:"5h ago", responses:2 },
  { id:"wp4", type:"hiring", author:{ id:"55555555-5555-5555-5555-555555555555", name:"Bongani Ndlovu", initials:"BN", photo:IMG.bongani, title:"Professional Plumber", verified:true, sub:"free" }, headline:"Need a labourer for flats renovation — 3 months", detail:"Working on a large plumbing job in Manzini. Need a helper to carry materials and assist. No experience needed — will train. E250/day.", trade:"Plumbing", location:"Manzini", rate:"E250/day", posted:"1d ago", responses:11 },
];

const PRICING = {
  worker_free:    { name:"Worker Basic",   price:"Free", period:"forever", color:C.mid,    features:["AI profile builder","Browse all jobs","3 applications/month","Skills test (1 attempt)"] },
  worker_premium: { name:"Worker Premium", price:"E10",  period:"/month",  color:C.blue,   features:["Everything in Basic","Verified gold badge","Unlimited applications","Analytics dashboard","Skills test badge shared with recruiters","Priority in search","AI portfolio PDF export"] },
  sole_trader:    { name:"Sole Trader",    price:"E30",  period:"/month",  color:C.teal,   features:["Professional storefront","Service menu with prices","In-app booking system","20-photo portfolio","AI captions on work photos","Verified business badge","Bookings calendar","MoMo payments"] },
  enterprise:     { name:"Enterprise",     price:"E200", period:"/month",  color:C.purple, features:["Unlimited job posts","Full candidate skills scores","Team shortlist access","AI candidate matching","Employer verified badge","Priority support","Hire data reports","E100 deposit waived"] },
};

// ─── FEED DATA ─────────────────────────────────────────────
const timeAgo = ts => {
  const s = Math.floor((Date.now()-ts)/1000);
  if(s<60) return "Just now";
  if(s<3600) return `${Math.floor(s/60)}m ago`;
  if(s<86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
};

const FEED_IMGS = {
  fi1:"https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=640&h=380&fit=crop",
  fi2:"https://images.unsplash.com/photo-1509391366360-2e959784a276?w=640&h=380&fit=crop",
  fi3:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=640&h=380&fit=crop",
};

const ROLE_CHIP_COLORS = { worker:C.blue, employer:C.purple, sole_trader:C.teal };
const ROLE_CHIP_LABELS = { worker:"Worker", employer:"Employer", sole_trader:"Business" };

const DEMO_FEED_INIT = [
  { id:"fp1", authorId:"11111111-1111-1111-1111-111111111111",
    author:{ full_name:"Sibusiso Dlamini", initials:"SD", photo:IMG.sibusiso, title:"Master Bricklayer & Construction Specialist", role:"worker", verified:true, sub:"premium" },
    content:"Just handed over a 4-bedroom house in Ezulwini — 14 weeks from foundation to roof. Every brick laid with hands taught by my father.\n\nThis is not just construction. This is legacy. 🧱",
    image:FEED_IMGS.fi1, likes:347, comments:48, reposts:14, liked:false, ts:Date.now()-7200000,
    commentsList:[
      { id:"fc1", author:{ full_name:"Nomvula Khumalo", initials:"NK", photo:IMG.nomvula }, text:"Congratulations Sibusiso! Your work is always exceptional 🙌", time:"2h ago" },
      { id:"fc2", author:{ full_name:"Tibiyo HR", initials:"TH", photo:null }, text:"We have 3 upcoming builds that need your skills. Check your messages.", time:"1h ago" },
    ]},
  { id:"fp2", authorId:"22222222-2222-2222-2222-222222222222",
    author:{ full_name:"Nomvula Khumalo", initials:"NK", photo:IMG.nomvula, title:"Domestic Worker & Childcare Specialist", role:"worker", verified:true, sub:"premium" },
    content:"Received my Safe Food Handling & First Aid certificate from TVET Mbabane today.\n\n9 years of experience. Now formally certified. To every domestic worker — your skills deserve recognition. Keep growing. 🙏",
    image:null, likes:893, comments:121, reposts:44, liked:false, ts:Date.now()-86400000,
    commentsList:[{ id:"fc3", author:{ full_name:"Sibusiso Dlamini", initials:"SD", photo:IMG.sibusiso }, text:"Well deserved! Congratulations 👏", time:"1d ago" }]},
  { id:"fp3", authorId:"33333333-3333-3333-3333-333333333333",
    author:{ full_name:"Thabo Mkhwanazi", initials:"TM", photo:IMG.thabo, title:"Certified Electrician & Solar Installer", role:"worker", verified:true, sub:"free" },
    content:"Installed a 5kW solar system for a family in Kwaluseni today. Their electricity bill drops 80% from next month.\n\nEvery home that goes solar is energy independence for a Swazi family. ⚡",
    image:FEED_IMGS.fi2, likes:1180, comments:204, reposts:61, liked:false, ts:Date.now()-10800000,
    commentsList:[]},
  { id:"fp4", authorId:"88888888-8888-8888-8888-888888888888",
    author:{ full_name:"Nandi Mthembu", initials:"NM", photo:IMG.nandi, title:"Beauty & Nails Specialist", role:"sole_trader", verified:true, sub:"premium" },
    content:"New acrylic set just done! 💅 2.5 hours of work — the result speaks for itself.\n\nBookings open this week. Message me on Savuka to reserve your slot.",
    image:FEED_IMGS.fi3, likes:428, comments:63, reposts:11, liked:false, ts:Date.now()-3600000,
    commentsList:[{ id:"fc4", author:{ full_name:"Nomvula Khumalo", initials:"NK", photo:IMG.nomvula }, text:"These are gorgeous Nandi! 😍", time:"1h ago" }]},
  { id:"fp5", authorId:"55555555-5555-5555-5555-555555555555",
    author:{ full_name:"Bongani Ndlovu", initials:"BN", photo:IMG.bongani, title:"Professional Plumber & Pipe Fitter", role:"worker", verified:true, sub:"free" },
    content:"8 years of pipes, drains, and leaks. Not glamorous — but without water, there is no life.\n\nPro tip for homeowners: always check the trap before assuming a blocked drain. Saves you E400 every time. 🔧",
    image:null, likes:214, comments:31, reposts:8, liked:false, ts:Date.now()-18000000,
    commentsList:[]},
];

// ─── PAYMENT INTEGRATIONS ──────────────────────────────────
// MTN MoMo — Eswatini Collection API
const MoMo = {
  // Production: POST https://proxy.momoapi.mtn.com/collection/v1_0/requesttopay
  async requestPayment({ amount, currency="SZL", phone, description, ref }) {
    // Demo mode simulation
    await new Promise(r => setTimeout(r, 1800));
    if (MOMO_API_KEY === "YOUR_MTN_MOMO_API_KEY") {
      return { success:true, transactionId:`MOMO-${Date.now()}`, status:"SUCCESSFUL", message:`E${amount} collected from ${phone}` };
    }
    try {
      const r = await fetch("https://proxy.momoapi.mtn.com/collection/v1_0/requesttopay", {
        method:"POST",
        headers: {
          "Authorization":`Bearer ${MOMO_API_KEY}`,
          "X-Reference-Id": ref || crypto.randomUUID(),
          "X-Target-Environment":"production",
          "Content-Type":"application/json",
          "Ocp-Apim-Subscription-Key": MOMO_API_KEY,
        },
        body: JSON.stringify({ amount:String(amount), currency, externalId:ref, payer:{ partyIdType:"MSISDN", partyId:phone.replace("+","") }, payerMessage:description, payeeNote:description }),
      });
      return r.ok ? { success:true, transactionId:ref } : { success:false, error:"Payment failed" };
    } catch(e) { return { success:false, error:e.message }; }
  },

  // Verify payment status
  async getStatus(transactionId) {
    await new Promise(r => setTimeout(r, 500));
    return { status:"SUCCESSFUL", transactionId };
  }
};

// DeltaPay — Eswatini's local digital payments
const DeltaPay = {
  // Production: https://api.deltapay.co.sz
  async charge({ amount, phone, description, merchantRef }) {
    await new Promise(r => setTimeout(r, 1500));
    if (DELTAPAY_KEY === "YOUR_DELTAPAY_KEY") {
      return { success:true, reference:`DP-${Date.now()}`, status:"approved", amount, currency:"SZL" };
    }
    try {
      const r = await fetch("https://api.deltapay.co.sz/v2/payments/charge", {
        method:"POST",
        headers: { "Authorization":`Bearer ${DELTAPAY_KEY}`, "Content-Type":"application/json", "X-Merchant-ID":DELTAPAY_MERCHANT },
        body: JSON.stringify({ amount, currency:"SZL", phone, description, merchant_ref:merchantRef }),
      });
      const d = await r.json();
      return r.ok ? { success:true, reference:d.reference, status:d.status } : { success:false, error:d.message };
    } catch(e) { return { success:false, error:e.message }; }
  },

  // Generate payment link (shareable)
  generateLink({ amount, description, ref }) {
    return `https://pay.deltapay.co.sz/${DELTAPAY_MERCHANT}?amount=${amount}&ref=${ref}&desc=${encodeURIComponent(description)}`;
  }
};

// ─── AI HELPERS ────────────────────────────────────────────
async function aiCall(prompt, maxTokens=300) {
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:maxTokens, messages:[{role:"user",content:prompt}] })
    });
    const d = await r.json();
    return d.content?.[0]?.text?.trim() || null;
  } catch { return null; }
}

async function aiPolishBio(raw, trade, skills, years, location) {
  const fallback = `Experienced ${trade} based in ${location}, Eswatini, with ${years} of hands-on professional experience. Skilled in ${skills.slice(0,3).join(", ")} and committed to quality workmanship.`;
  if (!raw || raw.length < 10) return fallback;
  const result = await aiCall(`Write a professional 2-3 sentence profile bio for a ${trade} in Eswatini with ${years} experience. Skills: ${skills.join(", ")}. They said: "${raw}". Return only the polished bio, no preamble.`);
  return result || fallback;
}

async function aiGenerateTitle(trade, skills, years) {
  const result = await aiCall(`Create a professional job title (6–9 words) for an Eswatini ${trade} with ${years} experience specialising in ${skills.slice(0,3).join(", ")}. Example: "Senior Electrician & Solar Installation Specialist". Return only the title.`, 60);
  return result || `Professional ${trade}`;
}

async function aiCaptionPhoto(trade, description) {
  const result = await aiCall(`Write a professional 1-sentence caption for a work portfolio photo. Trade: ${trade}. Worker's description: "${description}". Make it specific, professional, and impressive. Return only the caption.`, 80);
  return result || description;
}

async function aiGradeAnswer(question, answer, trade) {
  const result = await aiCall(`You are grading a trade skills test for a ${trade} in Eswatini. Question: "${question}". Answer given: "${answer}". Rate this answer from 0-100 and give a 1-sentence explanation. Return JSON: {"score":number,"feedback":"string"}`, 100);
  try { return JSON.parse(result); } catch { return { score:70, feedback:"Reasonable answer given." }; }
}

// ─── UTILITIES ─────────────────────────────────────────────
function useBreakpoint() {
  const [w, setW] = useState(() => { try { return window.innerWidth; } catch { return 1200; } });
  useEffect(() => {
    const fn = () => { try { setW(window.innerWidth); } catch {} };
    try { window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn); }
    catch { return () => {}; }
  }, []);
  return { isMobile: w < 768 };
}

function Avatar({ src, initials, size=48, border }) {
  const [err, setErr] = useState(false);
  if (src && !err) return <img src={src} onError={()=>setErr(true)} style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",flexShrink:0,border:border?`3px solid ${border}`:`2px solid ${C.white}`}} />;
  return <div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${C.blue},${C.blueDark})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:size*0.35,flexShrink:0}}>{initials}</div>;
}

function VerifiedBadge({ size=14 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={C.gold} stroke={C.gold} strokeWidth="1"/></svg>;
}

function PremiumBadge() {
  return <span style={{fontSize:9,background:`linear-gradient(90deg,${C.goldBright},${C.gold})`,color:"#fff",borderRadius:8,padding:"2px 6px",fontWeight:800,letterSpacing:0.5}}>PREMIUM</span>;
}

function SkillScore({ score }) {
  const col = score>=90?C.green:score>=75?C.blue:C.orange;
  return (
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <div style={{width:38,height:38,borderRadius:"50%",border:`3px solid ${col}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:col,background:`${col}10`}}>{score}</div>
      <div style={{fontSize:11,color:C.light,lineHeight:1.3}}>Skills<br/>score</div>
    </div>
  );
}

function Toast({ msg, type="success", onClose }) {
  useEffect(() => { const t=setTimeout(onClose,3800); return ()=>clearTimeout(t); }, []);
  const bg = type==="error"?C.red:type==="warning"?C.orange:C.green;
  return <div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:bg,color:"#fff",padding:"10px 20px",borderRadius:24,fontSize:13,fontWeight:600,zIndex:9999,boxShadow:"0 4px 20px rgba(0,0,0,0.25)",whiteSpace:"nowrap"}}>{msg}</div>;
}

function BottomNav({ items, active, onSelect }) {
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:C.white,borderTop:`1px solid ${C.border}`,display:"flex",zIndex:200,paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
      {items?.map(([id,ic,lb,badge]) => (
        <button key={id} onClick={()=>onSelect(id)} style={{flex:1,background:"none",border:"none",padding:"8px 4px 6px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",position:"relative"}}>
          <div style={{position:"relative"}}>
            <span style={{fontSize:20}}>{ic}</span>
            {badge>0 && <span style={{position:"absolute",top:-4,right:-6,background:C.red,color:"#fff",borderRadius:20,fontSize:9,fontWeight:800,padding:"1px 4px",minWidth:14,textAlign:"center"}}>{badge>9?"9+":badge}</span>}
          </div>
          <span style={{fontSize:10,fontWeight:active===id?700:400,color:active===id?items.find(i=>i[0]===id)?.[4]||C.blue:C.light}}>{lb}</span>
          {active===id && <div style={{position:"absolute",top:0,left:"15%",right:"15%",height:2,background:items.find(i=>i[0]===id)?.[4]||C.blue,borderRadius:"0 0 2px 2px"}}/>}
        </button>
      ))}
    </div>
  );
}

function TopBar({ brand, role, accent, user, actions, onSignOut }) {
  return (
    <div style={{background:C.white,borderBottom:`1px solid ${C.border}`,padding:"0 16px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:28,height:28,background:`linear-gradient(135deg,${accent},${C.blueDark})`,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2L3 7v10l9 5 9-5V7L12 2z"/></svg>
        </div>
        <span style={{fontFamily:"'Source Serif 4',serif",fontSize:18,fontWeight:800,color:accent}}>{BRAND}</span>
        <span style={{fontSize:11,background:`${accent}18`,color:accent,borderRadius:10,padding:"2px 8px",fontWeight:600}}>{role}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        {actions}
        <Avatar src={user.photo||null} initials={user.initials} size={30} />
      </div>
    </div>
  );
}

// ─── PAYMENT MODAL ─────────────────────────────────────────
function PaymentModal({ onClose, amount, description, phone, onSuccess, accent="#0A66C2" }) {
  const [method, setMethod] = useState("momo");
  const [momoPhone, setMomoPhone] = useState(phone||"");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("choose"); // choose | processing | done | error
  const [txnId, setTxnId] = useState("");
  const [err, setErr] = useState("");

  const handlePay = async () => {
    setLoading(true); setStep("processing"); setErr("");
    let result;
    if (method === "momo") {
      result = await MoMo.requestPayment({ amount, phone:momoPhone, description, ref:`SAV-${Date.now()}` });
    } else {
      result = await DeltaPay.charge({ amount, phone:momoPhone, description, merchantRef:`SAV-${Date.now()}` });
    }
    setLoading(false);
    if (result.success) { setTxnId(result.transactionId||result.reference); setStep("done"); setTimeout(()=>{ onSuccess(result); }, 1500); }
    else { setErr(result.error||"Payment failed. Please try again."); setStep("error"); }
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:800,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:C.white,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:440,padding:24}}>
        {step==="choose" && <>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div><div style={{fontWeight:700,fontSize:17,color:C.text}}>Complete payment</div><div style={{fontSize:13,color:C.light,marginTop:2}}>{description}</div></div>
            <button onClick={onClose} style={{background:C.bg,border:"none",borderRadius:"50%",width:32,height:32,fontSize:18,cursor:"pointer"}}>×</button>
          </div>
          <div style={{background:C.bg,borderRadius:12,padding:"12px 16px",marginBottom:20,textAlign:"center"}}>
            <div style={{fontSize:28,fontWeight:800,color:C.text}}>E{amount}</div>
            <div style={{fontSize:12,color:C.light,marginTop:2}}>Emalangeni</div>
          </div>
          {/* Payment method selector */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
            <button onClick={()=>setMethod("momo")} style={{background:method==="momo"?"#FFFBEB":"none",border:`2px solid ${method==="momo"?C.momo:C.border}`,borderRadius:12,padding:"12px 8px",cursor:"pointer",fontFamily:"inherit"}}>
              <div style={{fontSize:22,marginBottom:4}}>📱</div>
              <div style={{fontSize:12,fontWeight:700,color:C.text}}>MTN MoMo</div>
              <div style={{fontSize:10,color:C.light,marginTop:2}}>Mobile money</div>
              {method==="momo" && <div style={{fontSize:10,background:C.momo,color:"#000",borderRadius:8,padding:"2px 6px",marginTop:4,fontWeight:700}}>Selected</div>}
            </button>
            <button onClick={()=>setMethod("delta")} style={{background:method==="delta"?C.deltaLight:"none",border:`2px solid ${method==="delta"?C.delta:C.border}`,borderRadius:12,padding:"12px 8px",cursor:"pointer",fontFamily:"inherit"}}>
              <div style={{fontSize:22,marginBottom:4}}>💳</div>
              <div style={{fontSize:12,fontWeight:700,color:C.text}}>DeltaPay</div>
              <div style={{fontSize:10,color:C.light,marginTop:2}}>Card / wallet</div>
              {method==="delta" && <div style={{fontSize:10,background:C.delta,color:"#fff",borderRadius:8,padding:"2px 6px",marginTop:4,fontWeight:700}}>Selected</div>}
            </button>
          </div>
          {/* MoMo phone input */}
          {method==="momo" && (
            <div style={{marginBottom:16}}>
              <label style={{fontSize:12,fontWeight:700,color:C.mid,display:"block",marginBottom:6}}>MTN MOMO NUMBER</label>
              <input value={momoPhone} onChange={e=>setMomoPhone(e.target.value)} placeholder="+268 7600 0000" style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"11px 12px",fontSize:15,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}} />
              <div style={{fontSize:11,color:C.light,marginTop:4}}>You will receive an MoMo prompt on your phone to confirm.</div>
            </div>
          )}
          {method==="delta" && (
            <div style={{marginBottom:16,background:C.deltaLight,borderRadius:10,padding:"12px 14px"}}>
              <div style={{fontSize:13,color:C.delta,fontWeight:600,marginBottom:4}}>DeltaPay secure checkout</div>
              <div style={{fontSize:12,color:C.mid}}>You'll be redirected to DeltaPay to complete the payment securely. Supports Visa, Mastercard, and DeltaWallet.</div>
              <div style={{fontSize:11,color:C.delta,marginTop:6,fontWeight:600}}>Powered by DeltaPay Eswatini · {DELTAPAY_MERCHANT}</div>
            </div>
          )}
          <button onClick={handlePay} style={{width:"100%",background:method==="momo"?`linear-gradient(90deg,${C.momo},${C.momoDark})`:`linear-gradient(90deg,${C.delta},#01344A)`,color:method==="momo"?"#000":"#fff",border:"none",borderRadius:12,padding:"13px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            {method==="momo"?`Pay E${amount} with MoMo`:`Pay E${amount} via DeltaPay`}
          </button>
        </>}

        {step==="processing" && (
          <div style={{textAlign:"center",padding:"32px 0"}}>
            <div style={{fontSize:48,marginBottom:16,animation:"spin 1s linear infinite",display:"inline-block"}}>{method==="momo"?"📱":"💳"}</div>
            <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:8}}>{method==="momo"?"Check your phone for MoMo prompt…":"Processing DeltaPay…"}</div>
            <div style={{fontSize:13,color:C.light}}>Do not close this window. E{amount} pending.</div>
          </div>
        )}

        {step==="done" && (
          <div style={{textAlign:"center",padding:"24px 0"}}>
            <div style={{fontSize:52,marginBottom:12}}>✅</div>
            <div style={{fontWeight:700,fontSize:18,color:C.green,marginBottom:6}}>Payment successful!</div>
            <div style={{fontSize:13,color:C.mid,marginBottom:4}}>E{amount} paid via {method==="momo"?"MTN MoMo":"DeltaPay"}</div>
            <div style={{fontSize:11,color:C.light,fontFamily:"monospace"}}>TXN: {txnId}</div>
          </div>
        )}

        {step==="error" && (
          <div style={{textAlign:"center",padding:"24px 0"}}>
            <div style={{fontSize:48,marginBottom:12}}>❌</div>
            <div style={{fontWeight:700,fontSize:16,color:C.red,marginBottom:8}}>Payment failed</div>
            <div style={{fontSize:13,color:C.mid,marginBottom:20}}>{err}</div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setStep("choose")} style={{flex:1,background:C.bg,border:"none",borderRadius:12,padding:"11px",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Try again</button>
              <button onClick={onClose} style={{flex:1,background:"none",border:`1px solid ${C.border}`,borderRadius:12,padding:"11px",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── RECRUITER VERIFICATION MODAL ─────────────────────────
function RecruiterVerifyModal({ onClose, onComplete, user }) {
  const [step, setStep] = useState(user?.verified?"done":"step1");
  const [form, setForm] = useState({ cipa:user?.cipa||"", bizName:"", phone:user?.phone||"", otp:"", depositMethod:"" });
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const inp = {width:"100%",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"11px 12px",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box"};

  const verifyOTP = async () => {
    setLoading(true);
    await new Promise(r=>setTimeout(r,1200));
    setLoading(false);
    setStep("cipa");
  };

  const verifyCIPA = async () => {
    setLoading(true);
    await new Promise(r=>setTimeout(r,2000));
    setLoading(false);
    setStep("deposit");
  };

  const steps = [
    { id:"step1", label:"Phone OTP", done:["cipa","deposit","done"].includes(step) },
    { id:"cipa",  label:"CIPA Check", done:["deposit","done"].includes(step) },
    { id:"deposit",label:"Ad Deposit", done:step==="done" },
    { id:"done",  label:"Verified ✓", done:step==="done" },
  ];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:600,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:C.white,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:500,maxHeight:"90vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"16px 20px 12px",borderBottom:`1px solid ${C.bg}`,flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontWeight:700,fontSize:16,color:C.text}}>🏢 Recruiter Verification</div>
            <button onClick={onClose} style={{background:C.bg,border:"none",borderRadius:"50%",width:32,height:32,fontSize:18,cursor:"pointer"}}>×</button>
          </div>
          {/* Step ladder */}
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            {steps?.map((s,i)=>(
              <div key={s.id} style={{display:"flex",alignItems:"center",flex:1}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",flex:1}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:s.done?C.green:step===s.id?C.blue:C.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:700}}>{s.done?"✓":i+1}</div>
                  <div style={{fontSize:9,color:s.done?C.green:step===s.id?C.blue:C.light,marginTop:3,textAlign:"center",fontWeight:s.done||step===s.id?700:400}}>{s.label}</div>
                </div>
                {i<steps.length-1 && <div style={{width:8,height:1,background:s.done?C.green:C.border,flexShrink:0,marginBottom:12}}/>}
              </div>
            ))}
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"20px"}}>
          {step==="step1" && (
            <div>
              <h3 style={{fontSize:17,fontWeight:700,margin:"0 0 6px"}}>Step 1 — Verify your phone</h3>
              <p style={{fontSize:13,color:C.light,margin:"0 0 16px"}}>We send a one-time code to confirm your number. This prevents fake accounts.</p>
              <input value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="+268 7600 0000" style={inp} />
              <div style={{height:10}}/>
              <input value={form.otp} onChange={e=>set("otp",e.target.value)} placeholder="Enter 6-digit OTP (use: 123456)" style={inp} />
              <div style={{fontSize:11,color:C.light,marginTop:4,marginBottom:16}}>Demo: type 123456 to proceed</div>
              <button onClick={()=>form.otp==="123456"&&verifyOTP()} disabled={loading||form.otp.length!==6} style={{width:"100%",background:form.otp.length===6?`linear-gradient(90deg,${C.blue},${C.blueDark})`:C.border,color:form.otp.length===6?"#fff":C.light,border:"none",borderRadius:12,padding:"12px",fontSize:14,fontWeight:700,cursor:form.otp.length===6?"pointer":"not-allowed",fontFamily:"inherit"}}>
                {loading?"Verifying…":"Verify Phone →"}
              </button>
            </div>
          )}

          {step==="cipa" && (
            <div>
              <h3 style={{fontSize:17,fontWeight:700,margin:"0 0 6px"}}>Step 2 — Business registration</h3>
              <p style={{fontSize:13,color:C.light,margin:"0 0 16px"}}>We cross-check your CIPA registration number against the Eswatini Companies Registry. Unregistered employers can use their National ID instead and get a "Private Employer" badge.</p>
              <label style={{fontSize:12,fontWeight:700,color:C.mid,display:"block",marginBottom:4}}>CIPA REGISTRATION NUMBER</label>
              <input value={form.cipa} onChange={e=>set("cipa",e.target.value)} placeholder="e.g. SW2019/001234 (or leave blank for Private Employer)" style={inp} />
              <div style={{height:10}}/>
              <label style={{fontSize:12,fontWeight:700,color:C.mid,display:"block",marginBottom:4}}>REGISTERED BUSINESS NAME</label>
              <input value={form.bizName} onChange={e=>set("bizName",e.target.value)} placeholder="As it appears on your CIPA certificate" style={inp} />
              <div style={{background:C.blueLight,borderRadius:10,padding:"10px 12px",marginTop:14,fontSize:12,color:C.blue}}>
                <strong>What you get:</strong> CIPA-verified employers get the 🟡 Business Verified badge, appear higher in candidate search, and workers trust them more. Private employers get the 🔵 Phone Verified badge.
              </div>
              <button onClick={verifyCIPA} disabled={loading} style={{width:"100%",marginTop:16,background:`linear-gradient(90deg,${C.blue},${C.blueDark})`,color:"#fff",border:"none",borderRadius:12,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                {loading?"Checking registry…":"Check CIPA →"}
              </button>
            </div>
          )}

          {step==="deposit" && (
            <div>
              <h3 style={{fontSize:17,fontWeight:700,margin:"0 0 6px"}}>Step 3 — Job posting deposit</h3>
              <p style={{fontSize:13,color:C.mid,margin:"0 0 8px",lineHeight:1.6}}>A <strong>refundable E100 deposit</strong> is required to post your first job. This deposit is held until the position is filled and returned in full.</p>
              <div style={{background:C.orangeLight,borderRadius:10,padding:"10px 12px",marginBottom:16,fontSize:12,color:C.orange,lineHeight:1.6}}>
                ⚠️ <strong>Anti-fraud protection:</strong> The deposit is forfeited if your job post is removed for fraudulent activity — fake salaries, upfront payment demands, or non-existent positions. This protects workers from exploitation.
              </div>
              <div style={{display:"flex",gap:10,marginBottom:16}}>
                {[["momo","📱 MTN MoMo","Yellow"],["delta","💳 DeltaPay","Blue"]]?.map(([id,lb,col])=>(
                  <button key={id} onClick={()=>set("depositMethod",id)} style={{flex:1,background:form.depositMethod===id?C.blueLight:C.bg,border:`2px solid ${form.depositMethod===id?C.blue:C.border}`,borderRadius:12,padding:"12px 8px",cursor:"pointer",fontFamily:"inherit"}}>
                    <div style={{fontSize:16,marginBottom:4}}>{lb.split(" ")[0]}</div>
                    <div style={{fontSize:12,fontWeight:600,color:C.text}}>{lb.slice(2)}</div>
                  </button>
                ))}
              </div>
              <button onClick={()=>setShowPayment(true)} disabled={!form.depositMethod} style={{width:"100%",background:form.depositMethod?`linear-gradient(90deg,${C.green},#047857)`:C.border,color:form.depositMethod?"#fff":C.light,border:"none",borderRadius:12,padding:"12px",fontSize:14,fontWeight:700,cursor:form.depositMethod?"pointer":"not-allowed",fontFamily:"inherit"}}>
                Pay E100 deposit →
              </button>
            </div>
          )}

          {step==="done" && (
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:52,marginBottom:14}}>🟡</div>
              <div style={{fontWeight:800,fontSize:20,color:C.green,marginBottom:6}}>Business Verified! ✓</div>
              <div style={{fontSize:13,color:C.mid,lineHeight:1.7,marginBottom:20}}>Your account now shows the <strong>Business Verified</strong> badge. Workers trust verified employers. You can now post unlimited jobs and access candidate skills scores.</div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",marginBottom:20}}>
                {["Business Verified badge","Unlimited job posts","Candidate skills scores","Priority listing"]?.map(f=>(
                  <span key={f} style={{fontSize:11,background:C.greenLight,color:C.green,borderRadius:20,padding:"4px 12px",fontWeight:600}}>✓ {f}</span>
                ))}
              </div>
              <button onClick={onComplete} style={{width:"100%",background:`linear-gradient(90deg,${C.green},#047857)`,color:"#fff",border:"none",borderRadius:12,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Start Hiring →</button>
            </div>
          )}
        </div>
      </div>
      {showPayment && <PaymentModal amount={100} description="Savuka recruiter deposit — fully refundable" phone={form.phone} onClose={()=>setShowPayment(false)} onSuccess={()=>{ setShowPayment(false); setStep("done"); }} />}
    </div>
  );
}

// ─── AI PORTFOLIO BUILDER ─────────────────────────────────
function PortfolioBuilder({ onClose, trade, existingPhotos=[], onSave }) {
  const [photos, setPhotos] = useState(existingPhotos?.map((p,i)=>({...p,id:i,captioning:false})));
  const [captioning, setCaptioning] = useState(false);

  const addDemoPhoto = async (url) => {
    const desc = prompt("Describe this photo briefly (in your own words):") || "My work";
    const id = Date.now();
    setPhotos(p=>[...p,{id,img:url,rawDesc:desc,caption:"Generating…",captioning:true}]);
    const caption = await aiCaptionPhoto(trade, desc);
    setPhotos(p=>p?.map(ph=>ph.id===id?{...ph,caption,captioning:false}:ph));
  };

  const demoImgs = [IMG.port1,IMG.port2,IMG.port3,IMG.build1];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:600,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:C.white,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,maxHeight:"90vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"16px 20px 12px",borderBottom:`1px solid ${C.bg}`,flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:700,fontSize:16,color:C.text}}>📸 AI Portfolio Builder</div>
            <div style={{fontSize:12,color:C.light,marginTop:1}}>Photos + AI professional captions</div>
          </div>
          <button onClick={onClose} style={{background:C.bg,border:"none",borderRadius:"50%",width:32,height:32,fontSize:18,cursor:"pointer"}}>×</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
          <div style={{background:`${C.blue}10`,borderRadius:10,padding:"10px 12px",marginBottom:14,fontSize:12,color:C.blue,lineHeight:1.6}}>
            <strong>How it works:</strong> Add photos of your work. Write a simple description — our AI turns it into a professional caption. Your portfolio becomes a shareable link and PDF that replaces a CV.
          </div>

          {photos.length === 0 && (
            <div style={{textAlign:"center",padding:"32px 0",color:C.light}}>
              <div style={{fontSize:40,marginBottom:10}}>📷</div>
              <div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:4}}>No photos yet</div>
              <div style={{fontSize:12}}>Add photos of your work below</div>
            </div>
          )}

          {photos?.map((ph,i)=>(
            <div key={ph.id} style={{display:"flex",gap:12,marginBottom:12,background:C.bg,borderRadius:12,padding:12,alignItems:"flex-start"}}>
              <img src={ph.img} style={{width:80,height:60,objectFit:"cover",borderRadius:8,flexShrink:0}} />
              <div style={{flex:1,minWidth:0}}>
                {ph.captioning ? (
                  <div style={{fontSize:13,color:C.blue,fontStyle:"italic"}}>✨ AI writing caption…</div>
                ) : (
                  <div style={{fontSize:13,color:C.text,lineHeight:1.5,fontWeight:500}}>{ph.caption}</div>
                )}
                <div style={{fontSize:11,color:C.light,marginTop:4}}>Photo {i+1}</div>
              </div>
              <button onClick={()=>setPhotos(p=>p?.filter(x=>x.id!==ph.id))} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:16,flexShrink:0}}>×</button>
            </div>
          ))}

          <div style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:700,color:C.mid,marginBottom:8}}>ADD PHOTOS — tap any to add with caption</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {demoImgs?.map((src,i)=>(
                <button key={i} onClick={()=>addDemoPhoto(src)} style={{background:"none",border:`2px dashed ${C.border}`,borderRadius:10,overflow:"hidden",cursor:"pointer",padding:0,position:"relative",aspectRatio:"4/3"}}>
                  <img src={src} style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.7}} />
                  <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.3)"}}>
                    <span style={{fontSize:24,color:"#fff"}}>+</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{padding:"12px 20px",borderTop:`1px solid ${C.bg}`,display:"flex",gap:10,flexShrink:0}}>
          <button onClick={onClose} style={{flex:1,background:C.bg,border:"none",borderRadius:12,padding:"11px",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
          <button onClick={()=>onSave(photos)} style={{flex:2,background:`linear-gradient(90deg,${C.blue},${C.green})`,color:"#fff",border:"none",borderRadius:12,padding:"11px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✨ Save Portfolio ({photos.length} photos)</button>
        </div>
      </div>
    </div>
  );
}

// ─── STOKVEL MODULE ────────────────────────────────────────
// ─── NOTIFICATIONS TAB ─────────────────────────────────────
function NotificationsTab({ notifs, setNotifs }) {
  const markAll = () => setNotifs(n=>n?.map(x=>({...x,read:true})));
  const unread = notifs?.filter(n=>!n.read).length;

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div><div style={{fontWeight:700,fontSize:15,color:C.text}}>Notifications</div><div style={{fontSize:11,color:C.light}}>{unread} unread</div></div>
        {unread>0 && <button onClick={markAll} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:20,padding:"5px 12px",fontSize:12,color:C.mid,cursor:"pointer",fontFamily:"inherit"}}>Mark all read</button>}
      </div>
      {notifs?.map(n=>(
        <div key={n.id} onClick={()=>setNotifs(p=>p?.map(x=>x.id===n.id?{...x,read:true}:x))} style={{display:"flex",gap:12,padding:"12px 14px",background:n.read?C.white:`${C.blue}05`,borderRadius:12,border:`1px solid ${n.read?C.border:`${C.blue}20`}`,marginBottom:8,cursor:"pointer"}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:n.read?C.bg:`${C.blue}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{n.icon}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:n.read?500:700,fontSize:13,color:C.text,marginBottom:2}}>{n.title}</div>
            <div style={{fontSize:12,color:C.light,lineHeight:1.4}}>{n.body}</div>
            <div style={{fontSize:11,color:C.xlight,marginTop:4}}>{n.time}</div>
          </div>
          {!n.read && <div style={{width:8,height:8,borderRadius:"50%",background:C.blue,flexShrink:0,marginTop:4}}/>}
        </div>
      ))}
    </div>
  );
}

// ─── NATIVE SAVUKA CHAT ───────────────────────────────────
// Shared across all 3 app types — worker, employer, sole trader
function SavukaChat({ userId, threads, onUpdateThreads, setToast, accent="#0A66C2", onStartChat }) {
  const [active, setActive] = useState(null);
  const [reply, setReply] = useState("");
  const [search, setSearch] = useState("");
  const msgEndRef = useRef(null);

  const activeThread = threads.find(t => t.id === active);
  const totalUnread = threads?.reduce((a, t) => a + t.unread, 0);

  useEffect(() => {
    if (active) msgEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [active, threads]);

  const sendMessage = () => {
    if (!reply.trim()) return;
    const newMsg = { id:`msg-${Date.now()}`, from:userId, text:reply.trim(), time:new Date().toLocaleTimeString("en-GB", {hour:"2-digit",minute:"2-digit"}), date:"Today" };
    onUpdateThreads(threads?.map(t => t.id===active ? { ...t, messages:[...t.messages, newMsg], unread:0 } : t));
    setReply("");
  };

  const openThread = (id) => {
    setActive(id);
    onUpdateThreads(threads?.map(t => t.id===id ? { ...t, unread:0 } : t));
  };

  const filteredThreads = threads?.filter(t =>
    t.other.full_name.toLowerCase().includes(search.toLowerCase())
  );

  // ── THREAD VIEW ──
  if (active && activeThread) {
    const other = activeThread.other;
    return (
      <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 130px)", minHeight:400 }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0 12px", borderBottom:`1px solid ${C.border}`, marginBottom:8, flexShrink:0 }}>
          <button onClick={()=>setActive(null)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.mid, padding:"0 4px" }}>←</button>
          <div style={{ position:"relative" }}>
            <Avatar src={other.photo} initials={other.initials} size={38} />
            <div style={{ position:"absolute", bottom:0, right:0, width:10, height:10, background:C.green, borderRadius:"50%", border:"2px solid #fff" }} />
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ fontWeight:700, fontSize:14, color:C.text }}>{other.full_name}</span>
              {other.verified && <VerifiedBadge size={13} />}
            </div>
            <div style={{ fontSize:11, color:C.green, fontWeight:600 }}>● Online</div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button style={{ background:C.bg, border:"none", borderRadius:8, padding:"6px 10px", fontSize:11, fontWeight:600, color:C.mid, cursor:"pointer" }}>Profile</button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:10, paddingBottom:8 }}>
          {activeThread.messages?.map((msg, i) => {
            const isMe = msg.from === userId;
            const showDate = i === 0 || activeThread.messages[i-1].date !== msg.date;
            return (
              <div key={msg.id}>
                {showDate && <div style={{ textAlign:"center", margin:"8px 0 4px" }}><span style={{ fontSize:11, color:C.light, background:C.bg, borderRadius:20, padding:"3px 12px" }}>{msg.date}</span></div>}
                <div style={{ display:"flex", justifyContent:isMe?"flex-end":"flex-start", gap:8, alignItems:"flex-end" }}>
                  {!isMe && <Avatar src={other.photo} initials={other.initials} size={28} />}
                  <div style={{ maxWidth:"72%", background:isMe?accent:C.white, color:isMe?"#fff":C.text, borderRadius:isMe?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"10px 14px", fontSize:13, lineHeight:1.5, boxShadow:"0 1px 3px rgba(0,0,0,0.08)", border:isMe?"none":`1px solid ${C.border}` }}>
                    <div>{msg.text}</div>
                    <div style={{ fontSize:10, opacity:0.65, marginTop:4, textAlign:isMe?"right":"left" }}>{msg.time} {isMe && "✓✓"}</div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={msgEndRef} />
        </div>

        {/* Composer */}
        <div style={{ display:"flex", gap:8, paddingTop:10, borderTop:`1px solid ${C.border}`, flexShrink:0 }}>
          <input
            value={reply} onChange={e=>setReply(e.target.value)}
            placeholder="Write a message…"
            onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),sendMessage())}
            style={{ flex:1, border:`1.5px solid ${C.border}`, borderRadius:24, padding:"10px 16px", fontSize:14, outline:"none", fontFamily:"inherit", background:C.white }}
          />
          <button onClick={sendMessage} disabled={!reply.trim()} style={{ background:reply.trim()?accent:C.border, color:"#fff", border:"none", borderRadius:"50%", width:42, height:42, cursor:reply.trim()?"pointer":"not-allowed", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:16 }}>→</button>
        </div>
      </div>
    );
  }

  // ── THREAD LIST ──
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <div>
          <div style={{ fontWeight:700, fontSize:15, color:C.text }}>Messages</div>
          {totalUnread > 0 && <div style={{ fontSize:11, color:accent, fontWeight:600 }}>{totalUnread} unread</div>}
        </div>
        {onStartChat && (
          <button onClick={onStartChat} style={{ background:accent, color:"#fff", border:"none", borderRadius:20, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>+ New message</button>
        )}
      </div>

      {/* Search */}
      <div style={{ position:"relative", marginBottom:12 }}>
        <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, color:C.light }}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search conversations…" style={{ width:"100%", border:`1px solid ${C.border}`, borderRadius:24, padding:"8px 14px 8px 34px", fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} />
      </div>

      {filteredThreads.length === 0 && (
        <div style={{ textAlign:"center", padding:"40px 0", color:C.light }}>
          <div style={{ fontSize:36, marginBottom:10 }}>💬</div>
          <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:4 }}>No messages yet</div>
          <div style={{ fontSize:12 }}>Connect with workers or employers to start a conversation.</div>
        </div>
      )}

      {filteredThreads?.map(t => {
        const lastMsg = t.messages[t.messages.length-1];
        const isLastFromMe = lastMsg?.from === userId;
        return (
          <div key={t.id} onClick={()=>openThread(t.id)}
            style={{ display:"flex", gap:12, alignItems:"center", padding:"12px 14px", background:t.unread>0?`${accent}06`:C.white, borderRadius:12, border:`1px solid ${t.unread>0?`${accent}25`:C.border}`, marginBottom:8, cursor:"pointer", transition:"all 0.15s" }}
            onMouseEnter={e=>e.currentTarget.style.background=`${accent}08`}
            onMouseLeave={e=>e.currentTarget.style.background=t.unread>0?`${accent}06`:C.white}>
            <div style={{ position:"relative", flexShrink:0 }}>
              <Avatar src={t.other.photo} initials={t.other.initials} size={46} />
              <div style={{ position:"absolute", bottom:0, right:0, width:11, height:11, background:C.green, borderRadius:"50%", border:"2px solid #fff" }} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:2 }}>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <span style={{ fontWeight:t.unread>0?700:500, fontSize:14, color:C.text }}>{t.other.full_name}</span>
                  {t.other.verified && <VerifiedBadge size={12} />}
                  <span style={{ fontSize:10, background:t.other.role==="employer"?C.purpleLight:t.other.role==="sole_trader"?C.tealLight:C.blueLight, color:t.other.role==="employer"?C.purple:t.other.role==="sole_trader"?C.teal:C.blue, borderRadius:8, padding:"1px 6px", fontWeight:600 }}>{t.other.role==="sole_trader"?"Business":t.other.role==="employer"?"Employer":"Worker"}</span>
                </div>
                <span style={{ fontSize:11, color:C.light }}>{lastMsg?.time}</span>
              </div>
              <div style={{ fontSize:12, color:t.unread>0?C.text:C.light, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontWeight:t.unread>0?500:400 }}>
                {isLastFromMe && <span style={{ color:C.light }}>You: </span>}
                {lastMsg?.text}
              </div>
            </div>
            {t.unread > 0 && <div style={{ width:22, height:22, borderRadius:"50%", background:accent, color:"#fff", fontSize:11, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{t.unread}</div>}
          </div>
        );
      })}
    </div>
  );
}
function AIProfileBuilderModal({ onClose, onComplete, isMobile, defaultTrade="" }) {
  const [step, setStep] = useState(0);
  const [polishing, setPolishing] = useState(false);
  const [form, setForm] = useState({ name:"", phone:"", location:"Mbabane", trade:defaultTrade, skills:[], years:"", rawBio:"", cert:"", hasId:null, idNumber:"" });
  const [result, setResult] = useState({ bio:"", title:"" });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const TRADES = [["🧱","Bricklayer"],["⚡","Electrician"],["🔧","Plumber"],["🏠","Domestic Worker"],["👨‍🍳","Chef / Cook"],["🚗","Driver"],["🌱","Gardener"],["🛡️","Security Guard"],["🎨","Painter"],["🪚","Carpenter"],["🧵","Tailor"],["🧹","Cleaner"],["💅","Beauty & Nails"],["🏥","Healthcare Worker"],["⭐","Other"]];
  const SKILLS = {"Bricklayer":["Bricklaying","Plastering","Tiling","Waterproofing","Scaffolding","Site Management"],"Electrician":["Wiring","Solar Panels","Fault Finding","Compliance Testing","Inverter Installation","Generator"],"Plumber":["Pipe Fitting","Drain Clearing","Geyser Installation","Leak Detection","Bathroom Fitting"],"Domestic Worker":["Childcare","Cooking","Housekeeping","First Aid","Elderly Care","Laundry"],"Chef / Cook":["Cooking","Baking","Event Catering","Menu Planning","Food Safety","Traditional Cuisine"],"Beauty & Nails":["Acrylic Nails","Gel Polish","Hair Relaxer","Braiding","Makeup","Waxing"]};
  const skillOpts = SKILLS[form.trade] || ["Communication","Teamwork","Problem Solving","Leadership","Time Management","Customer Service"];

  const handlePolish = async () => {
    setPolishing(true);
    const [bio, title] = await Promise.all([
      aiPolishBio(form.rawBio, form.trade, form.skills, form.years, form.location),
      aiGenerateTitle(form.trade, form.skills, form.years)
    ]);
    setResult({ bio, title });
    setPolishing(false);
    setStep(5);
  };

  const STEPS = ["Name & location","Your trade","Skills","Work history","ID (optional)","Your profile ✨"];
  const canNext = [form.name.length>=2,form.trade!=="",form.skills.length>=2,form.years!=="",true,true];
  const inp = {width:"100%",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"12px",fontSize:15,outline:"none",fontFamily:"inherit",boxSizing:"border-box",background:C.white};

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:700,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:C.white,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,maxHeight:"92vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"16px 20px 12px",borderBottom:`1px solid ${C.bg}`,flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div><div style={{fontWeight:800,fontSize:15}}>✨ AI Profile Builder</div><div style={{fontSize:11,color:C.light}}>Step {step+1} of {STEPS.length} — {STEPS[step]}</div></div>
            <button onClick={onClose} style={{background:C.bg,border:"none",borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:16}}>×</button>
          </div>
          <div style={{height:4,background:C.bg,borderRadius:99}}>
            <div style={{width:`${(step/(STEPS.length-1))*100}%`,height:"100%",background:`linear-gradient(90deg,${C.blue},${C.green})`,borderRadius:99,transition:"width 0.4s"}}/>
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"20px"}}>
          {step===0 && <div>
            <h2 style={{fontSize:20,fontWeight:700,margin:"0 0 4px"}}>What's your name?</h2>
            <p style={{fontSize:12,color:C.light,margin:"0 0 16px"}}>Your real name — just like it is on your ID.</p>
            <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Sipho Dlamini" style={inp} />
            <div style={{height:10}}/>
            <label style={{fontSize:12,fontWeight:700,color:C.mid,display:"block",marginBottom:4}}>PHONE NUMBER (for Savuka messages)</label>
            <input value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="+268 7600 0000" style={inp} />
            <div style={{height:10}}/>
            <label style={{fontSize:12,fontWeight:700,color:C.mid,display:"block",marginBottom:6}}>WHERE ARE YOU BASED?</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {["Mbabane","Manzini","Ezulwini","Nhlangano","Matsapha","Siteki","Big Bend","Piggs Peak"]?.map(l=><button key={l} onClick={()=>set("location",l)} style={{background:form.location===l?C.blue:C.bg,color:form.location===l?"#fff":C.mid,border:`1.5px solid ${form.location===l?C.blue:C.border}`,borderRadius:20,padding:"7px 14px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>)}
            </div>
          </div>}

          {step===1 && <div>
            <h2 style={{fontSize:20,fontWeight:700,margin:"0 0 4px"}}>What is your trade?</h2>
            <p style={{fontSize:12,color:C.light,margin:"0 0 16px"}}>Pick the work you do best.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {TRADES?.map(([ic,lb])=><button key={lb} onClick={()=>set("trade",lb)} style={{background:form.trade===lb?C.blueLight:C.bg,border:`2px solid ${form.trade===lb?C.blue:"transparent"}`,borderRadius:12,padding:"14px 10px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8,textAlign:"left"}}>
                <span style={{fontSize:22}}>{ic}</span><span style={{fontSize:13,fontWeight:form.trade===lb?700:500,color:form.trade===lb?C.blue:C.text}}>{lb}</span>
              </button>)}
            </div>
          </div>}

          {step===2 && <div>
            <h2 style={{fontSize:20,fontWeight:700,margin:"0 0 4px"}}>What can you do?</h2>
            <p style={{fontSize:12,color:C.light,margin:"0 0 4px"}}>Tap everything you know. <strong style={{color:C.blue}}>{form.skills.length} selected</strong></p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
              {skillOpts?.map(s=>{const on=form.skills.includes(s);return<button key={s} onClick={()=>set("skills",on?form.skills?.filter(x=>x!==s):[...form.skills,s])} style={{background:on?C.blue:C.bg,color:on?"#fff":C.text,border:`1.5px solid ${on?C.blue:C.border}`,borderRadius:20,padding:"9px 16px",fontSize:13,fontWeight:on?700:500,cursor:"pointer",fontFamily:"inherit"}}>{on&&"✓ "}{s}</button>;})}
            </div>
          </div>}

          {step===3 && <div>
            <h2 style={{fontSize:20,fontWeight:700,margin:"0 0 4px"}}>Your work history</h2>
            <p style={{fontSize:12,color:C.light,margin:"0 0 14px"}}>Don't worry about grammar — just tell us what you do and we'll make it professional. ✨</p>
            <label style={{fontSize:12,fontWeight:700,color:C.mid,display:"block",marginBottom:6}}>HOW MANY YEARS?</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
              {["1–2 years","3–5 years","6–9 years","10–14 years","15+ years"]?.map(y=><button key={y} onClick={()=>set("years",y)} style={{background:form.years===y?C.blue:C.bg,color:form.years===y?"#fff":C.text,border:`1.5px solid ${form.years===y?C.blue:C.border}`,borderRadius:20,padding:"8px 14px",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>{y}</button>)}
            </div>
            <label style={{fontSize:12,fontWeight:700,color:C.mid,display:"block",marginBottom:4}}>DESCRIBE YOUR WORK <span style={{color:C.blue,fontWeight:400}}>(AI will polish this)</span></label>
            <textarea value={form.rawBio} onChange={e=>set("rawBio",e.target.value)} placeholder="Tell us what kind of work you do, where you worked, and anything you are proud of. Don't worry about spelling." rows={4} style={{...inp,resize:"vertical"}} />
            <div style={{height:10}}/>
            <label style={{fontSize:12,fontWeight:700,color:C.mid,display:"block",marginBottom:4}}>CERTIFICATES (optional)</label>
            <input value={form.cert} onChange={e=>set("cert",e.target.value)} placeholder="e.g. TVET Level 4, Food Safety, First Aid" style={inp} />
          </div>}

          {step===4 && <div>
            <h2 style={{fontSize:20,fontWeight:700,margin:"0 0 6px"}}>ID Verification</h2>
            <div style={{background:C.goldLight,border:`1px solid ${C.gold}44`,borderRadius:12,padding:"14px 16px",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><VerifiedBadge size={18}/><span style={{fontWeight:700,fontSize:14,color:C.gold}}>Get the ✦ Verified badge</span></div>
              <p style={{fontSize:12,color:C.mid,lineHeight:1.7,margin:0}}>Verified workers get <strong>3× more profile views</strong> and appear at the top of search. Required to unlock unlimited job applications.</p>
            </div>
            <div style={{background:C.blueLight,borderRadius:10,padding:"10px 12px",marginBottom:14,fontSize:12,color:C.blue}}><strong>Privacy:</strong> Your ID number is never shown publicly. It is deleted after verification. We comply with the Eswatini Data Protection Act.</div>
            <p style={{fontSize:13,fontWeight:700,color:C.text,margin:"0 0 10px"}}>Do you want to verify your ID now?</p>
            <div style={{display:"flex",gap:10,marginBottom:12}}>
              {[["yes","✓ Yes, verify me",C.green],["later","Skip for now",C.mid],["no","No thanks",C.red]]?.map(([v,l,col])=><button key={v} onClick={()=>set("hasId",v)} style={{flex:1,background:form.hasId===v?`${col}12`:C.bg,color:col,border:`2px solid ${form.hasId===v?col:C.border}`,borderRadius:10,padding:"10px 6px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>)}
            </div>
            {form.hasId==="yes" && <div>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                {[["National ID","id"],["Passport","passport"]]?.map(([l,v])=><button key={v} onClick={()=>set("idType",v)} style={{flex:1,background:form.idType===v?C.blueLight:C.bg,color:form.idType===v?C.blue:C.mid,border:`1.5px solid ${form.idType===v?C.blue:C.border}`,borderRadius:8,padding:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>)}
              </div>
              <input value={form.idNumber} onChange={e=>set("idNumber",e.target.value)} placeholder="ID or passport number" style={inp} />
              <div style={{fontSize:11,color:C.green,marginTop:6}}>📸 You'll upload a photo of your ID after sign-up. Processed within 24 hours.</div>
            </div>}
          </div>}

          {step===5 && (polishing ? (
            <div style={{textAlign:"center",padding:"40px 0"}}>
              <div style={{fontSize:48,marginBottom:14,animation:"spin 1s linear infinite",display:"inline-block"}}>✨</div>
              <div style={{fontWeight:700,fontSize:16}}>AI is polishing your profile…</div>
              <div style={{fontSize:13,color:C.light,marginTop:6}}>Making your experience shine 🌟</div>
            </div>
          ) : (
            <div>
              <div style={{background:`linear-gradient(135deg,${C.blue},${C.blueDark})`,borderRadius:14,padding:20,color:"#fff",marginBottom:14}}>
                <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:14}}>
                  <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,border:"3px solid rgba(255,255,255,0.4)"}}>👷</div>
                  <div><div style={{fontWeight:800,fontSize:18}}>{form.name}</div><div style={{fontSize:13,opacity:0.85,marginTop:2}}>{result.title}</div><div style={{fontSize:12,opacity:0.65,marginTop:1}}>📍 {form.location}, Eswatini</div></div>
                </div>
                <div style={{background:"rgba(255,255,255,0.12)",borderRadius:10,padding:"12px 14px"}}>
                  <div style={{fontSize:10,opacity:0.7,marginBottom:4,fontWeight:700,letterSpacing:1}}>✨ AI-WRITTEN BIO</div>
                  <p style={{fontSize:13,lineHeight:1.7,margin:0,opacity:0.95}}>{result.bio}</p>
                </div>
              </div>
              <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",marginBottom:10}}>
                <div style={{fontSize:12,fontWeight:700,color:C.mid,marginBottom:8}}>YOUR SKILLS ({form.skills.length})</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{form.skills?.map(s=><span key={s} style={{fontSize:12,background:C.blueLight,color:C.blue,borderRadius:20,padding:"4px 12px",fontWeight:600}}>{s}</span>)}</div>
              </div>
              {form.hasId==="yes" && <div style={{background:C.goldLight,border:`1px solid ${C.gold}44`,borderRadius:10,padding:"10px 14px",display:"flex",gap:8,alignItems:"center"}}><VerifiedBadge size={16}/><div style={{fontSize:12,color:C.mid}}><strong style={{color:C.gold}}>Verification submitted</strong> — badge within 24 hours</div></div>}
              <div style={{background:C.greenLight,borderRadius:10,padding:"10px 14px",marginTop:10,fontSize:13,color:C.green,fontWeight:600,textAlign:"center"}}>🎉 Your profile is ready! Welcome to Savuka.</div>
            </div>
          ))}
        </div>

        <div style={{padding:"14px 20px",borderTop:`1px solid ${C.bg}`,display:"flex",gap:10,flexShrink:0}}>
          {step>0&&step<5&&!polishing&&<button onClick={()=>setStep(s=>s-1)} style={{background:C.bg,border:"none",borderRadius:24,padding:"12px 20px",fontSize:14,fontWeight:600,color:C.mid,cursor:"pointer",fontFamily:"inherit"}}>← Back</button>}
          {step<4&&<button onClick={()=>setStep(s=>s+1)} disabled={!canNext[step]} style={{flex:1,background:canNext[step]?`linear-gradient(90deg,${C.blue},${C.blueDark})`:C.border,color:canNext[step]?"#fff":C.light,border:"none",borderRadius:24,padding:"12px",fontSize:15,fontWeight:700,cursor:canNext[step]?"pointer":"not-allowed",fontFamily:"inherit"}}>Continue →</button>}
          {step===4&&<button onClick={handlePolish} style={{flex:1,background:`linear-gradient(90deg,${C.blue},${C.green})`,color:"#fff",border:"none",borderRadius:24,padding:"12px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✨ Build My Profile with AI →</button>}
          {step===5&&!polishing&&<button onClick={()=>onComplete(form,result)} style={{flex:1,background:`linear-gradient(90deg,${C.green},#047857)`,color:"#fff",border:"none",borderRadius:24,padding:"12px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🚀 Launch My Profile</button>}
        </div>
      </div>
    </div>
  );
}

// ─── SKILL TEST MODAL ──────────────────────────────────────
function SkillTestModal({ onClose, onComplete, trade="Bricklayer" }) {
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);

  const QUESTIONS = {
    Bricklayer: [
      { q:"Mortar is too wet — what do you do?", opts:["Continue — it'll dry","Add more water","Add more sand and cement","Stop work"], correct:2 },
      { q:"Standard brick bond for external Eswatini walls?", opts:["Flemish bond","Stretcher bond","English bond","Stack bond"], correct:2 },
      { q:"Before starting a foundation, you must first check:", opts:["Weather forecast","Site drawings and ground conditions","Your tools","Mortar mix"], correct:1 },
      { q:"PPE required on a construction site at all times:", opts:["Hard hat only","Hard hat and boots","Hard hat, boots and high-vis","Nothing on small sites"], correct:2 },
      { q:"How do you test concrete before loading?", opts:["Pour water on it","Scratch test after 7 days","Strike with hammer","Ask the foreman"], correct:1 },
    ],
    Electrician: [
      { q:"What must you do before working on a live circuit?", opts:["Nothing — just be careful","Isolate and lock out the supply","Wear rubber gloves only","Call your supervisor"], correct:1 },
      { q:"EEC compliance test must be done:", opts:["Only on new installations","After any modification or new install","Once every 5 years","Never for residential"], correct:1 },
      { q:"Solar PV inverter should be installed:", opts:["In direct sunlight","In a cool, ventilated area","Underground","Near the battery bank only"], correct:1 },
      { q:"What does ELCB stand for?", opts:["Electric Load Control Breaker","Earth Leakage Circuit Breaker","Electrical Limit Current Box","Emergency Load Cable Barrier"], correct:1 },
      { q:"Maximum voltage for single-phase residential in Eswatini:", opts:["110V","220V","240V","380V"], correct:2 },
    ],
    Domestic: [
      { q:"A child under 5 is choking — first action?", opts:["Call emergency immediately","Back blows and abdominal thrusts","Give water","Lay them flat"], correct:1 },
      { q:"Safe Food Handling — raw meat must be stored:", opts:["Above cooked food","On the top shelf","On the bottom shelf below cooked food","Anywhere in the fridge"], correct:2 },
      { q:"You find cleaning products unlabelled — you:", opts:["Test on a surface","Dispose of it safely","Mix to see what happens","Use as normal"], correct:1 },
      { q:"An elderly person falls — first you:", opts:["Help them up immediately","Check for injury before moving","Call the family","Give them water"], correct:1 },
      { q:"Correct handwashing time is at least:", opts:["5 seconds","10 seconds","20 seconds","60 seconds"], correct:2 },
    ],
  };

  const questions = QUESTIONS[trade] || QUESTIONS.Bricklayer;

  const handleAnswer = (optIdx) => {
    const newA = {...answers, [qIdx]:optIdx};
    setAnswers(newA);
    if (qIdx < questions.length-1) { setTimeout(()=>setQIdx(i=>i+1), 350); }
    else {
      const correct = Object.values(newA)?.filter((a,i)=>a===questions[i]?.correct).length;
      setScore(Math.round((correct/questions.length)*100));
      setDone(true);
    }
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:700,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:C.white,borderRadius:20,width:"100%",maxWidth:460,padding:24,maxHeight:"85vh",overflowY:"auto"}}>
        {!done ? <>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div><div style={{fontWeight:700,fontSize:15,color:C.text}}>{trade} Skills Test</div><div style={{fontSize:12,color:C.light}}>Question {qIdx+1} of {questions.length}</div></div>
            <button onClick={onClose} style={{background:C.bg,border:"none",borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:16}}>×</button>
          </div>
          <div style={{height:4,background:C.bg,borderRadius:99,marginBottom:18}}>
            <div style={{width:`${((qIdx+1)/questions.length)*100}%`,height:"100%",background:C.blue,borderRadius:99,transition:"width 0.3s"}}/>
          </div>
          <div style={{fontSize:15,fontWeight:600,color:C.text,lineHeight:1.5,marginBottom:18}}>{questions[qIdx].q}</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {questions[qIdx].opts?.map((opt,i)=>(
              <button key={i} onClick={()=>handleAnswer(i)} style={{background:answers[qIdx]===i?C.blueLight:C.bg,border:`2px solid ${answers[qIdx]===i?C.blue:"transparent"}`,borderRadius:10,padding:"11px 14px",fontSize:13,fontWeight:answers[qIdx]===i?700:400,color:answers[qIdx]===i?C.blue:C.text,cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"all 0.15s"}}>{opt}</button>
            ))}
          </div>
        </> : (
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:14}}>{score>=80?"🏆":score>=60?"🎯":"📚"}</div>
            <div style={{fontSize:28,fontWeight:800,color:score>=80?C.green:score>=60?C.blue:C.orange,marginBottom:4}}>{score}/100</div>
            <div style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:8}}>{score>=80?"Excellent — badge awarded!":score>=60?"Good effort — almost there!":"Keep practising"}</div>
            <div style={{background:score>=80?C.greenLight:score>=60?C.blueLight:C.orangeLight,borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:13,color:score>=80?C.green:score>=60?C.blue:C.orange,lineHeight:1.6}}>
              {score>=80?"Your verified score is now visible on your profile and shared with Premium recruiters. Employers trust verified scores.":"You can retake this test in 7 days. Review the topics you found difficult."}
            </div>
            <div style={{fontSize:11,color:C.light,marginBottom:20}}>Score shareable with Premium recruiters only · Retake available in 7 days</div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={onClose} style={{flex:1,background:"none",border:`1px solid ${C.border}`,borderRadius:12,padding:"11px",fontSize:13,color:C.mid,cursor:"pointer",fontFamily:"inherit"}}>Close</button>
              <button onClick={()=>onComplete(score,trade)} style={{flex:2,background:`linear-gradient(90deg,${C.blue},${C.blueDark})`,color:"#fff",border:"none",borderRadius:12,padding:"11px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{score>=80?"Add badge to profile →":"Try again in 7 days"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PRICING / UPGRADE MODAL ───────────────────────────────
function PricingModal({ onClose, onPay, user }) {
  const [selected, setSelected] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const tiers = Object.values(PRICING);

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:700,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:C.white,borderRadius:20,width:"100%",maxWidth:640,maxHeight:"90vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"18px 24px 14px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{fontWeight:700,fontSize:18,color:C.text}}>Choose your plan</div>
          <button onClick={onClose} style={{background:C.bg,border:"none",borderRadius:"50%",width:32,height:32,fontSize:18,cursor:"pointer"}}>×</button>
        </div>
        <div style={{overflowY:"auto",padding:"16px 24px 24px",display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
          {tiers?.map((tier,i)=>(
            <div key={tier.name} onClick={()=>setSelected(tier)} style={{border:`${selected?.name===tier.name?"2px":"1px"} solid ${selected?.name===tier.name?tier.color:i===1?C.blue:C.border}`,borderRadius:14,padding:"16px 14px",cursor:"pointer",position:"relative",transition:"all 0.15s"}}>
              {i===1 && <div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:C.blue,color:"#fff",borderRadius:10,padding:"2px 12px",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>Most popular</div>}
              <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:4}}>{tier.name}</div>
              <div style={{marginBottom:12}}><span style={{fontSize:24,fontWeight:800,color:tier.color}}>{tier.price}</span><span style={{fontSize:13,color:C.light}}>{tier.period}</span></div>
              {tier.features?.map(f=>(
                <div key={f} style={{display:"flex",gap:6,alignItems:"flex-start",marginBottom:5}}>
                  <span style={{color:tier.color,fontSize:12,flexShrink:0,marginTop:1}}>✓</span>
                  <span style={{fontSize:12,color:C.mid,lineHeight:1.4}}>{f}</span>
                </div>
              ))}
              <button onClick={()=>{ setSelected(tier); if(tier.price!=="Free") setShowPayment(true); else onClose(); }} style={{width:"100%",marginTop:12,background:i===1?`linear-gradient(90deg,${C.blue},${C.blueDark})`:`${tier.color}12`,color:i===1?"#fff":tier.color,border:i===1?"none":`1px solid ${tier.color}30`,borderRadius:10,padding:"9px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                {tier.price==="Free"?"Get started free":`Upgrade — ${tier.price}${tier.period}`}
              </button>
            </div>
          ))}
        </div>
        <div style={{padding:"10px 24px 16px",borderTop:`1px solid ${C.border}`,flexShrink:0,fontSize:12,color:C.light,textAlign:"center"}}>
          All paid plans include MTN MoMo and DeltaPay payment options · Cancel anytime
        </div>
      </div>
      {showPayment && selected && <PaymentModal amount={parseInt(selected.price.replace("E",""))} description={`Savuka ${selected.name} subscription`} phone={user?.phone||""} onClose={()=>setShowPayment(false)} onSuccess={(r)=>{ setShowPayment(false); onPay?.(selected,r); onClose(); }} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  FEED COMPONENTS
// ═══════════════════════════════════════════════════════════
function PostCard({ post, userId, connections, onConnect, onLike, onRepost, onComment, accent }) {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const TRUNC = 220;
  const long = post.content.length > TRUNC;
  const isOwn = post.authorId === userId;
  const roleCol = ROLE_CHIP_COLORS[post.author.role] || C.blue;

  const submitComment = () => {
    if (!commentText.trim() || !userId) return;
    const me = { full_name:"You", initials:"ME", photo:null };
    onComment(post.id, { id:`fc-${Date.now()}`, author:me, text:commentText.trim(), time:"Just now" });
    setCommentText("");
  };

  return (
    <div style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,marginBottom:10,overflow:"hidden"}}>
      <div style={{padding:"14px 16px 0"}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
          <div style={{position:"relative",flexShrink:0}}>
            <Avatar src={post.author.photo} initials={post.author.initials} size={46}/>
            {post.author.verified && <div style={{position:"absolute",bottom:-2,right:-2,background:C.white,borderRadius:"50%",padding:1}}><VerifiedBadge size={13}/></div>}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
              <span style={{fontWeight:700,fontSize:14,color:C.text}}>{post.author.full_name}</span>
              {post.author.sub==="premium" && <PremiumBadge/>}
              <span style={{fontSize:10,background:`${roleCol}15`,color:roleCol,borderRadius:8,padding:"1px 7px",fontWeight:600}}>{ROLE_CHIP_LABELS[post.author.role]}</span>
            </div>
            <div style={{fontSize:12,color:C.light,marginTop:1}}>{post.author.title} · {timeAgo(post.ts)}</div>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
            {!isOwn && userId && <ConnectButton targetId={post.authorId} connections={connections||{}} onConnect={onConnect||(()=>{})} size="small" accentColor={accent}/>}
            <button style={{background:"none",border:"none",fontSize:18,color:C.light,cursor:"pointer",padding:4}}>⋯</button>
          </div>
        </div>
        <div style={{fontSize:14,color:C.text,lineHeight:1.75,marginBottom:10,whiteSpace:"pre-wrap"}}>
          {long&&!expanded ? post.content.slice(0,TRUNC)+"… " : post.content+" "}
          {long && <button onClick={()=>setExpanded(v=>!v)} style={{background:"none",border:"none",color:C.blue,fontWeight:700,fontSize:14,cursor:"pointer",padding:0,fontFamily:"inherit"}}>{expanded?"see less":"see more"}</button>}
        </div>
      </div>
      {post.image && <img src={post.image} alt="" style={{width:"100%",maxHeight:340,objectFit:"cover",display:"block",borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}/>}
      {(post.likes>0||post.comments>0) && (
        <div style={{padding:"5px 16px",display:"flex",justifyContent:"space-between",fontSize:12,color:C.light,borderBottom:`1px solid ${C.border}`}}>
          <span>{post.likes>0?`👍 ${post.likes.toLocaleString()}`:""}</span>
          <div style={{display:"flex",gap:12}}>
            {post.comments>0 && <button onClick={()=>setShowComments(v=>!v)} style={{background:"none",border:"none",fontSize:12,color:C.light,cursor:"pointer",padding:0,fontFamily:"inherit"}}>{post.comments} comments</button>}
            {post.reposts>0 && <span>{post.reposts} reposts</span>}
          </div>
        </div>
      )}
      <div style={{display:"flex"}}>
        {[
          {ic:"👍",lb:post.liked?"Liked":"Like",fn:()=>userId&&onLike&&onLike(),active:post.liked},
          {ic:"💬",lb:"Comment",fn:()=>setShowComments(v=>!v),active:false},
          {ic:"🔁",lb:"Repost",fn:()=>userId&&onRepost&&onRepost(),active:false},
          {ic:"↗",lb:"Share",fn:()=>{},active:false},
        ]?.map(a=>(
          <button key={a.lb} onClick={a.fn} style={{flex:1,background:"none",border:"none",padding:"9px 4px",display:"flex",alignItems:"center",justifyContent:"center",gap:4,fontSize:12,fontWeight:600,color:a.active?accent:C.mid,cursor:"pointer",fontFamily:"inherit"}}>
            <span style={{fontSize:16}}>{a.ic}</span>{a.lb}
          </button>
        ))}
      </div>
      {showComments && (
        <div style={{borderTop:`1px solid ${C.border}`,padding:"10px 16px"}}>
          {post.commentsList?.map(c=>(
            <div key={c.id} style={{display:"flex",gap:8,marginBottom:12}}>
              <Avatar src={c.author.photo} initials={c.author.initials} size={32}/>
              <div style={{flex:1}}>
                <div style={{background:C.bg,borderRadius:"4px 14px 14px 14px",padding:"8px 12px"}}>
                  <div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:2}}>{c.author.full_name}</div>
                  <div style={{fontSize:13,color:C.text,lineHeight:1.5}}>{c.text}</div>
                </div>
                <div style={{fontSize:11,color:C.xlight,marginTop:3,paddingLeft:4}}>{c.time}</div>
              </div>
            </div>
          ))}
          {userId && (
            <div style={{display:"flex",gap:8,alignItems:"center",marginTop:4}}>
              <div style={{flex:1,display:"flex",background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:22,padding:"6px 14px",alignItems:"center",gap:8}}>
                <input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Add a comment…" onKeyDown={e=>e.key==="Enter"&&submitComment()} style={{flex:1,border:"none",background:"none",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                <button onClick={submitComment} disabled={!commentText.trim()} style={{background:commentText.trim()?accent:"none",color:commentText.trim()?"#fff":C.xlight,border:"none",borderRadius:"50%",width:26,height:26,cursor:commentText.trim()?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>→</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FeedTab({ user, accent, connections, onConnect }) {
  const [posts, setPosts] = useState(DEMO_FEED_INIT);
  const [sort, setSort] = useState("top");
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [posting, setPosting] = useState(false);

  const sorted = sort==="top"
    ? [...posts].sort((a,b)=>(b.likes+b.comments*2)-(a.likes+a.comments*2))
    : [...posts].sort((a,b)=>b.ts-a.ts);

  const handleLike = id => setPosts(f=>f?.map(p=>p.id===id?{...p,liked:!p.liked,likes:p.liked?p.likes-1:p.likes+1}:p));
  const handleRepost = id => setPosts(f=>f?.map(p=>p.id===id?{...p,reposts:p.reposts+1}:p));
  const handleComment = (id,c) => setPosts(f=>f?.map(p=>p.id===id?{...p,comments:p.comments+1,commentsList:[...p.commentsList,c]}:p));

  const submit = async () => {
    if (!text.trim() || !user) return;
    setPosting(true);
    await new Promise(r=>setTimeout(r,500));
    setPosts(f=>[{
      id:`fp-${Date.now()}`, authorId:user.id, ts:Date.now(),
      author:{ full_name:user.full_name, initials:user.initials, photo:user.photo||null, title:user.trade||user.role, role:user.role, verified:user.verified, sub:user.sub },
      content:text.trim(), image:null, likes:0, comments:0, reposts:0, liked:false, commentsList:[],
    },...f]);
    setText(""); setOpen(false); setPosting(false);
  };

  return (
    <div style={{animation:"slideUp 0.3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontWeight:700,fontSize:16,color:C.text}}>Savuka Feed</span>
        <div style={{display:"flex",background:C.bg,borderRadius:20,padding:2}}>
          {[["top","⭐ Top"],["recent","🕐 Recent"]]?.map(([v,l])=>(
            <button key={v} onClick={()=>setSort(v)} style={{background:sort===v?C.white:"none",border:"none",borderRadius:18,padding:"4px 12px",fontSize:12,fontWeight:sort===v?700:400,color:sort===v?C.text:C.light,cursor:"pointer",fontFamily:"inherit",boxShadow:sort===v?"0 1px 4px rgba(0,0,0,0.08)":"none"}}>{l}</button>
          ))}
        </div>
      </div>

      {user ? (
        <div style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,padding:"14px 16px",marginBottom:10}}>
          <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <Avatar src={user.photo||null} initials={user.initials} size={42}/>
            {!open
              ? <button onClick={()=>setOpen(true)} style={{flex:1,textAlign:"left",border:`1.5px solid ${C.border}`,borderRadius:28,padding:"10px 18px",fontSize:14,color:C.light,background:C.bg,cursor:"text",fontFamily:"inherit"}}>
                  Share a milestone, tip or update…
                </button>
              : <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Share your work, a lesson, or something that inspires you…" rows={3} autoFocus style={{flex:1,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 14px",fontSize:14,outline:"none",fontFamily:"inherit",resize:"none",lineHeight:1.6}}/>
            }
          </div>
          {open && (
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
              <div style={{display:"flex",gap:4}}>
                {[["📷","Photo"],["🏆","Milestone"],["📍","Location"]]?.map(([ic,lb])=>(
                  <button key={lb} style={{background:"none",border:"none",fontSize:12,color:C.mid,cursor:"pointer",padding:"4px 8px",borderRadius:6,fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>{ic} {lb}</button>
                ))}
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>{setOpen(false);setText("");}} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:20,padding:"6px 14px",fontSize:13,color:C.mid,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
                <button onClick={submit} disabled={!text.trim()||posting} style={{background:text.trim()?`linear-gradient(90deg,${accent},${C.blueDark})`:C.border,color:text.trim()?"#fff":C.light,border:"none",borderRadius:20,padding:"6px 18px",fontSize:13,fontWeight:700,cursor:text.trim()?"pointer":"not-allowed",fontFamily:"inherit"}}>
                  {posting?"Posting…":"Post"}
                </button>
              </div>
            </div>
          )}
          {!open && (
            <div style={{display:"flex",borderTop:`1px solid ${C.border}`,marginTop:10,paddingTop:8}}>
              {[["📷","Photo"],["🎬","Video"],["🏆","Milestone"]]?.map(([ic,lb])=>(
                <button key={lb} onClick={()=>setOpen(true)} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:"none",border:"none",padding:"5px",fontSize:13,fontWeight:600,color:C.mid,cursor:"pointer",borderRadius:6,fontFamily:"inherit"}}>{ic} {lb}</button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,padding:"14px 16px",marginBottom:10,textAlign:"center",color:C.mid,fontSize:13}}>
          Join Savuka to post, like, and comment on your community's work.
        </div>
      )}

      {sorted?.map(post=>(
        <PostCard key={post.id} post={post} userId={user?.id} accent={accent}
          connections={connections||{}} onConnect={onConnect}
          onLike={()=>handleLike(post.id)} onRepost={()=>handleRepost(post.id)} onComment={handleComment}/>
      ))}
    </div>
  );
}

// ─── WORKER-POSTED JOBS TAB ───────────────────────────────
function WorkerPostsTab({ user, workerPosts, setWorkerPosts, setToast, onMessage }) {
  const [showPost, setShowPost] = useState(false);
  const [form, setForm] = useState({ type:"availability", headline:"", detail:"", trade:"Construction", location:"Mbabane", rate:"" });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const inp = { width:"100%", border:`1.5px solid ${C.border}`, borderRadius:10, padding:"10px 12px", fontSize:14, outline:"none", fontFamily:"inherit", boxSizing:"border-box" };

  const submitPost = () => {
    if (!form.headline.trim()) return;
    const newPost = {
      id:`wp-${Date.now()}`, type:form.type,
      author:{ id:user.id, name:user.full_name, initials:user.initials, photo:null, title:"Worker", verified:user.verified, sub:user.sub },
      headline:form.headline, detail:form.detail, trade:form.trade, location:form.location, rate:form.rate,
      posted:"Just now", responses:0
    };
    setWorkerPosts(p=>[newPost,...p]);
    setForm({ type:"availability", headline:"", detail:"", trade:"Construction", location:"Mbabane", rate:"" });
    setShowPost(false);
    setToast({ msg:"Post published! Other workers and employers can now see it.", type:"success" });
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div>
          <div style={{ fontWeight:700, fontSize:15, color:C.text }}>Worker board</div>
          <div style={{ fontSize:11, color:C.light }}>Workers hiring, advertising availability, and subcontracting</div>
        </div>
        <button onClick={()=>setShowPost(true)} style={{ background:C.workerAccent, color:"#fff", border:"none", borderRadius:20, padding:"7px 14px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>+ Post</button>
      </div>

      {/* Filter chips */}
      <div style={{ display:"flex", gap:6, marginBottom:12, overflowX:"auto", paddingBottom:4 }}>
        {["All","Availability","Hiring","Construction","Domestic","Electrical","Hospitality","Plumbing"]?.map((f,i)=>(
          <button key={f} style={{ background:i===0?C.workerAccent:C.white, color:i===0?"#fff":C.mid, border:`1px solid ${i===0?C.workerAccent:C.border}`, borderRadius:20, padding:"5px 12px", fontSize:12, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", flexShrink:0 }}>{f}</button>
        ))}
      </div>

      {workerPosts?.map((post, idx) => (
        <div key={post.id} style={{ background:C.white, borderRadius:14, border:`1px solid ${C.border}`, padding:"14px 16px", marginBottom:10, animation:`slideUp 0.3s ease ${idx*0.04}s both` }}>
          {/* Type badge */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
            <span style={{ fontSize:11, fontWeight:700, background:post.type==="hiring"?C.purpleLight:C.blueLight, color:post.type==="hiring"?C.purple:C.blue, borderRadius:20, padding:"3px 10px" }}>
              {post.type==="hiring"?"🤝 Hiring help":"📢 Available for work"}
            </span>
            <span style={{ fontSize:11, color:C.light }}>{post.posted}</span>
          </div>

          {/* Author */}
          <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
            <Avatar src={post.author.photo} initials={post.author.initials} size={40} />
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ fontWeight:700, fontSize:14, color:C.text }}>{post.author.name}</span>
                {post.author.verified && <VerifiedBadge />}
                {post.author.sub==="premium" && <PremiumBadge />}
              </div>
              <div style={{ fontSize:12, color:C.light }}>{post.author.title}</div>
            </div>
          </div>

          {/* Content */}
          <div style={{ fontWeight:700, fontSize:14, color:C.text, marginBottom:4 }}>{post.headline}</div>
          <div style={{ fontSize:13, color:C.mid, lineHeight:1.6, marginBottom:10 }}>{post.detail}</div>

          {/* Meta */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:10 }}>
            <span style={{ fontSize:11, background:C.bg, color:C.mid, borderRadius:12, padding:"3px 10px" }}>📍 {post.location}</span>
            <span style={{ fontSize:11, background:C.bg, color:C.mid, borderRadius:12, padding:"3px 10px" }}>🔧 {post.trade}</span>
            <span style={{ fontSize:11, background:C.greenLight, color:C.green, borderRadius:12, padding:"3px 10px", fontWeight:700 }}>💰 {post.rate}</span>
          </div>

          {/* Actions */}
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button onClick={()=>onMessage(post.author)} style={{ flex:1, background:`linear-gradient(90deg,${C.workerAccent},${C.blueDark})`, color:"#fff", border:"none", borderRadius:8, padding:"9px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
              💬 Message {post.author.name.split(" ")[0]}
            </button>
            <button style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px", fontSize:12, color:C.mid, cursor:"pointer" }}>Save</button>
            <span style={{ fontSize:12, color:C.light }}>{post.responses} responses</span>
          </div>
        </div>
      ))}

      {/* Post modal */}
      {showPost && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:600, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div style={{ background:C.white, borderRadius:"20px 20px 0 0", width:"100%", maxWidth:520, maxHeight:"88vh", display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"16px 20px 12px", borderBottom:`1px solid ${C.bg}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
              <div style={{ fontWeight:700, fontSize:16, color:C.text }}>Post on the Worker Board</div>
              <button onClick={()=>setShowPost(false)} style={{ background:C.bg, border:"none", borderRadius:"50%", width:32, height:32, fontSize:18, cursor:"pointer" }}>×</button>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:"16px 20px", display:"flex", flexDirection:"column", gap:12 }}>
              {/* Post type */}
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:C.mid, display:"block", marginBottom:6 }}>WHAT ARE YOU POSTING?</label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[["availability","📢 I'm available for work","Tell employers and other workers you're free"],["hiring","🤝 I'm looking for help","Find subcontractors, labourers, or assistants"]]?.map(([v,l,d])=>(
                    <button key={v} onClick={()=>set("type",v)} style={{ background:form.type===v?C.blueLight:C.bg, border:`2px solid ${form.type===v?C.blue:"transparent"}`, borderRadius:12, padding:"12px 10px", cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
                      <div style={{ fontSize:13, fontWeight:700, color:form.type===v?C.blue:C.text, marginBottom:3 }}>{l}</div>
                      <div style={{ fontSize:11, color:C.light }}>{d}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div><label style={{ fontSize:12, fontWeight:700, color:C.mid, display:"block", marginBottom:4 }}>HEADLINE</label><input value={form.headline} onChange={e=>set("headline",e.target.value)} placeholder={form.type==="availability"?"e.g. Available for tiling from 1 Feb — Mbabane":"e.g. Need 2 labourers for 3-day project"} style={inp} /></div>
              <div><label style={{ fontSize:12, fontWeight:700, color:C.mid, display:"block", marginBottom:4 }}>DETAILS</label><textarea value={form.detail} onChange={e=>set("detail",e.target.value)} rows={3} placeholder="More information about what you're offering or looking for…" style={{...inp,resize:"vertical"}} /></div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div><label style={{ fontSize:12, fontWeight:700, color:C.mid, display:"block", marginBottom:4 }}>TRADE</label>
                  <select value={form.trade} onChange={e=>set("trade",e.target.value)} style={inp}>{["Construction","Domestic","Electrical","Hospitality","Plumbing","Gardening","Security","Beauty","Other"]?.map(t=><option key={t}>{t}</option>)}</select>
                </div>
                <div><label style={{ fontSize:12, fontWeight:700, color:C.mid, display:"block", marginBottom:4 }}>LOCATION</label>
                  <select value={form.location} onChange={e=>set("location",e.target.value)} style={inp}>{["Mbabane","Manzini","Ezulwini","Nhlangano","Matsapha","Siteki"]?.map(l=><option key={l}>{l}</option>)}</select>
                </div>
              </div>
              <div><label style={{ fontSize:12, fontWeight:700, color:C.mid, display:"block", marginBottom:4 }}>RATE / PAY</label><input value={form.rate} onChange={e=>set("rate",e.target.value)} placeholder="e.g. E180/hr or E300/day or negotiable" style={inp} /></div>
            </div>
            <div style={{ padding:"12px 20px", borderTop:`1px solid ${C.bg}`, display:"flex", gap:10, flexShrink:0 }}>
              <button onClick={()=>setShowPost(false)} style={{ flex:1, background:"none", border:`1px solid ${C.border}`, borderRadius:12, padding:"12px", fontSize:14, color:C.mid, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
              <button onClick={submitPost} disabled={!form.headline.trim()} style={{ flex:2, background:form.headline.trim()?`linear-gradient(90deg,${C.workerAccent},${C.blueDark})`:C.border, color:form.headline.trim()?"#fff":C.light, border:"none", borderRadius:12, padding:"12px", fontSize:14, fontWeight:700, cursor:form.headline.trim()?"pointer":"not-allowed", fontFamily:"inherit" }}>Publish Post →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CONNECT BUTTON ───────────────────────────────────────
function ConnectButton({ targetId, connections, onConnect, size="normal", accentColor }) {
  const acc = accentColor || C.blue;
  const conn = connections[targetId];
  const status = conn?.status || "none";

  if (status === "connected") return (
    <button style={{ background:C.greenLight, border:`1px solid ${C.green}30`, borderRadius:size==="small"?6:8, padding:size==="small"?"4px 10px":"7px 14px", fontSize:size==="small"?11:12, fontWeight:600, color:C.green, cursor:"default", fontFamily:"inherit", display:"flex", alignItems:"center", gap:4 }}>
      ✓ Connected
    </button>
  );

  if (status === "pending_sent") return (
    <button onClick={()=>onConnect(targetId,"cancel")} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:size==="small"?6:8, padding:size==="small"?"4px 10px":"7px 14px", fontSize:size==="small"?11:12, fontWeight:600, color:C.light, cursor:"pointer", fontFamily:"inherit" }}>
      Pending…
    </button>
  );

  return (
    <button onClick={()=>onConnect(targetId,"send")} style={{ background:`${acc}12`, border:`1.5px solid ${acc}40`, borderRadius:size==="small"?6:8, padding:size==="small"?"4px 10px":"7px 14px", fontSize:size==="small"?11:12, fontWeight:700, color:acc, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:4 }}>
      + Connect
    </button>
  );
}

// ═══════════════════════════════════════════════════════════
//  WORKER APP
// ═══════════════════════════════════════════════════════════
function WorkerApp({ user, onLogout, isMobile, setToast }) {
  // --- FIXED STATE INITIALIZATION ---
  const [notifs, setNotifs] = useState((typeof DEMO_NOTIFS !== 'undefined' ? DEMO_NOTIFS.slice(0,3) : []));
  const [chatThreads, setChatThreads] = useState([]);
  const [connections, setConnections] = useState({});

  const [tab, setTab] = useState("feed");
  const [workerPosts, setWorkerPosts] = useState(DEMO_WORKER_POSTS);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showSkillTest, setShowSkillTest] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [portfolio, setPortfolio] = useState(DEMO_WORKERS[0].portfolio);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [viewingWorker, setViewingWorker] = useState(null);
  const accent = C.workerAccent;
  const unreadNotifs = notifs?.filter(n=>!n.read).length;
  const unreadMsgs = chatThreads?.reduce((a,t)=>a+t.unread,0);

  const handleConnect = (targetId, action) => {
    setConnections(c => ({
      ...c,
      [targetId]: action==="send" ? { status:"pending_sent" } : action==="cancel" ? { status:"none" } : { status:"connected", since:"Now" }
    }));
    if (action==="send") {
      const w = DEMO_WORKERS.find(x=>x.id===targetId);
      setToast({ msg:`Connection request sent to ${w?.full_name?.split(" ")[0] || "them"} ✓`, type:"success" });
    }
  };

  const handleMessagePerson = (person) => {
    // Open chat, creating a thread if one doesn't exist
    const existing = chatThreads.find(t => t.participants.includes(person.id));
    if (!existing) {
      const newThread = {
        id:`c-new-${Date.now()}`,
        participants:[user.id, person.id],
        other:{ id:person.id, full_name:person.name||person.full_name, initials:person.initials, photo:person.photo||null, role:person.role||"worker", verified:!!person.verified },
        messages:[], unread:0
      };
      setChatThreads(t => [newThread, ...t]);
    }
    setTab("messages");
  };

  const navItems = [
    ["feed","🏠","Feed",0,accent],
    ["discover","💼","Jobs",0,accent],
    ["posts","📌","Board",0,accent],
    ["messages","💬","Chat",unreadMsgs,accent],
    ["more","⋯","More",unreadNotifs,accent],
  ];

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Source Sans 3',sans-serif",paddingBottom:70}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@700;800&family=Source+Sans+3:wght@400;500;600;700;800&display=swap'); *{box-sizing:border-box;-webkit-tap-highlight-color:transparent} @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <TopBar brand={BRAND} role="Worker" accent={accent} user={user} onSignOut={onLogout}
        actions={<>
          <button onClick={()=>setShowSkillTest(true)} style={{background:`${accent}12`,border:`1px solid ${accent}30`,borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:700,color:accent,cursor:"pointer",fontFamily:"inherit"}}>Take Test</button>
          <button onClick={()=>setShowPricing(true)} style={{background:`linear-gradient(90deg,${C.goldBright},${C.gold})`,color:"#fff",border:"none",borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✦ Premium</button>
        </>}
      />

      <div style={{maxWidth:640,margin:"0 auto",padding:"12px 12px 0"}}>
        {tab==="feed" && (
          <FeedTab user={user} accent={accent} connections={connections} onConnect={handleConnect}/>
        )}

        {tab==="discover" && (
          <div style={{animation:"slideUp 0.3s ease"}}>
            {user.sub==="free" && (
              <div style={{background:`linear-gradient(135deg,${accent},${C.blueDark})`,borderRadius:14,padding:"14px 16px",marginBottom:12,display:"flex",gap:12,alignItems:"center"}}>
                <span style={{fontSize:24,flexShrink:0}}>✨</span>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:"#fff"}}>Complete your profile with AI</div><div style={{fontSize:12,color:"rgba(255,255,255,0.75)",marginTop:2}}>3-minute setup. AI writes your bio and portfolio captions.</div></div>
                <button onClick={()=>setShowBuilder(true)} style={{background:`linear-gradient(90deg,${C.goldBright},${C.gold})`,color:"#fff",border:"none",borderRadius:20,padding:"7px 14px",fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0}}>Build →</button>
              </div>
            )}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div><div style={{fontSize:16,fontWeight:700,color:C.text}}>Jobs for you</div><div style={{fontSize:12,color:C.light}}>Ranked by match score · {DEMO_JOBS.length} open roles</div></div>
              <div style={{display:"flex",gap:6}}>{["All","Urgent","Near me"]?.map((f,i)=><button key={f} style={{background:i===0?accent:C.white,color:i===0?"#fff":C.mid,border:`1px solid ${i===0?accent:C.border}`,borderRadius:20,padding:"5px 12px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{f}</button>)}</div>
            </div>
            {DEMO_JOBS?.map((job,idx)=>(
              <WorkerJobCard key={job.id} job={job} saved={savedJobs.has(job.id)} applied={appliedJobs.has(job.id)}
                onSave={()=>setSavedJobs(s=>{const n=new Set(s);n.has(job.id)?n.delete(job.id):n.add(job.id);return n;})}
                onApply={()=>{ if(user.sub==="free"&&appliedJobs.size>=3){setShowPricing(true);return;} setAppliedJobs(s=>new Set(s).add(job.id)); setToast({msg:"Application sent! 🎉",type:"success"}); }}
                accent={accent} idx={idx} />
            ))}
          </div>
        )}

        {tab==="applied" && (
          <div style={{animation:"slideUp 0.3s ease"}}>
            <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:12}}>Your applications ({appliedJobs.size})</div>
            {appliedJobs.size===0 ? (
              <div style={{textAlign:"center",padding:"48px 24px",background:C.white,borderRadius:14,border:`1px solid ${C.border}`}}>
                <div style={{fontSize:40,marginBottom:12}}>📋</div>
                <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:6}}>No applications yet</div>
                <div style={{fontSize:13,color:C.light}}>Apply to jobs in Discover to track them here.</div>
              </div>
            ) : DEMO_JOBS?.filter(j=>appliedJobs.has(j.id))?.map(job=>(
              <div key={job.id} style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,padding:"14px 16px",marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div><div style={{fontWeight:700,fontSize:14,color:C.text}}>{job.title}</div><div style={{fontSize:12,color:C.mid,marginTop:2}}>{job.company} · {job.location}</div></div>
                  <span style={{background:C.greenLight,color:C.green,borderRadius:12,padding:"3px 10px",fontSize:11,fontWeight:700}}>Applied</span>
                </div>
                <div style={{fontSize:12,color:C.light,marginTop:8}}>Waiting for employer · {job.posted}</div>
              </div>
            ))}
          </div>
        )}

        {tab==="posts" && (
          <WorkerPostsTab
            user={user}
            workerPosts={workerPosts}
            setWorkerPosts={setWorkerPosts}
            setToast={setToast}
            onMessage={handleMessagePerson}
          />
        )}

        {tab==="messages" && (
          <SavukaChat
            userId={user.id}
            threads={chatThreads}
            onUpdateThreads={setChatThreads}
            setToast={setToast}
            accent={accent}
            onStartChat={() => setToast({msg:"Search for a worker or employer to start a new chat",type:"success"})}
          />
        )}

        {tab==="more" && (
          <div style={{animation:"slideUp 0.3s ease"}}>
            {/* Profile card */}
            <div style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,marginBottom:10}}>
              <div style={{height:90,background:`linear-gradient(135deg,${accent},${C.blueDark})`,position:"relative",borderRadius:"14px 14px 0 0",overflow:"hidden"}}><img src={IMG.cover1} style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.35}}/></div>
              <div style={{padding:"0 16px 16px",marginTop:-32,position:"relative"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:10}}>
                  <div style={{border:`3px solid ${C.white}`,borderRadius:"50%",display:"inline-block",background:C.white}}>
                    <Avatar src={user.photo||IMG.sibusiso} initials={user.initials} size={60} />
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>setShowBuilder(true)} style={{background:`${accent}12`,border:`1px solid ${accent}30`,borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:700,color:accent,cursor:"pointer",fontFamily:"inherit"}}>✨ AI Edit</button>
                    <button onClick={()=>setShowPortfolio(true)} style={{background:`${C.teal}12`,border:`1px solid ${C.teal}30`,borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:700,color:C.teal,cursor:"pointer",fontFamily:"inherit"}}>📸 Portfolio</button>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}><span style={{fontWeight:700,fontSize:16,color:C.text}}>{user.full_name}</span>{user.verified&&<VerifiedBadge/>}{user.sub==="premium"&&<PremiumBadge/>}</div>
                <div style={{fontSize:13,color:C.mid}}>Master Bricklayer · Mbabane</div>
                <div style={{display:"flex",gap:16,marginTop:10}}>
                  <div style={{textAlign:"center"}}><div style={{fontWeight:700,fontSize:15,color:accent}}>127</div><div style={{fontSize:10,color:C.light}}>Jobs</div></div>
                  <div style={{textAlign:"center"}}><div style={{fontWeight:700,fontSize:15,color:C.gold}}>4.9★</div><div style={{fontSize:10,color:C.light}}>Rating</div></div>
                  <div style={{textAlign:"center"}}><div style={{fontWeight:700,fontSize:15,color:C.green}}>98%</div><div style={{fontSize:10,color:C.light}}>Response</div></div>
                  <div style={{textAlign:"center"}}><SkillScore score={91}/></div>
                </div>
              </div>
            </div>

            {/* Network / connections */}
            <div style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,padding:"14px 16px",marginBottom:10}}>
              <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:12}}>Workers you may know</div>
              {DEMO_WORKERS?.filter(w=>w.id!==user.id).slice(0,4)?.map(w=>(
                <div key={w.id} style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
                  <button onClick={()=>setViewingWorker(w)} style={{background:"none",border:"none",padding:0,cursor:"pointer",flexShrink:0}}>
                    <Avatar src={w.photo} initials={w.initials} size={44}/>
                  </button>
                  <div style={{flex:1,minWidth:0}}>
                    <button onClick={()=>setViewingWorker(w)} style={{background:"none",border:"none",padding:0,cursor:"pointer",textAlign:"left",width:"100%"}}>
                      <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontWeight:600,fontSize:13,color:C.text}}>{w.full_name}</span>{w.verified&&<VerifiedBadge size={12}/>}</div>
                      <div style={{fontSize:11,color:C.light}}>{w.title} · {w.location}</div>
                    </button>
                  </div>
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    <button onClick={()=>setViewingWorker(w)} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:600,color:C.mid,cursor:"pointer",fontFamily:"inherit"}}>View</button>
                    <ConnectButton targetId={w.id} connections={connections} onConnect={handleConnect} size="small" accentColor={accent}/>
                  </div>
                </div>
              ))}
            </div>

            <NotificationsTab notifs={notifs} setNotifs={setNotifs} />
            <div style={{height:10}}/>
            <button onClick={onLogout} style={{width:"100%",background:"none",border:`1px solid ${C.border}`,borderRadius:12,padding:"12px",fontSize:14,color:C.mid,cursor:"pointer",fontFamily:"inherit"}}>Sign out</button>
          </div>
        )}
      </div>

      <BottomNav items={navItems} active={tab} onSelect={setTab} />
      {showBuilder && <AIProfileBuilderModal onClose={()=>setShowBuilder(false)} onComplete={(d,r)=>{ setShowBuilder(false); setToast({msg:`Profile built! Welcome, ${d.name?.split(" ")[0]||"there"} ✨`,type:"success"}); }} isMobile={isMobile} defaultTrade={user.trade||""} />}
      {showSkillTest && <SkillTestModal onClose={()=>setShowSkillTest(false)} onComplete={(score,trade)=>{ setShowSkillTest(false); setToast({msg:`${trade} test: ${score}/100 ${score>=80?"🏆 Badge added!":"📚 Keep practising"}`,type:score>=80?"success":"warning"}); }} trade={user.trade||"Bricklayer"} />}
      {showPricing && <PricingModal onClose={()=>setShowPricing(false)} user={user} onPay={(tier,r)=>setToast({msg:`${tier.name} activated! Welcome to Premium 🎉`,type:"success"})} />}
      {showPortfolio && <PortfolioBuilder onClose={()=>setShowPortfolio(false)} trade={user.trade||"Bricklayer"} existingPhotos={portfolio} onSave={(p)=>{ setPortfolio(p); setShowPortfolio(false); setToast({msg:`Portfolio updated — ${p.length} photos ✨`,type:"success"}); }} />}
      {viewingWorker && <WorkerProfileModal worker={viewingWorker} onClose={()=>setViewingWorker(null)} connections={connections} onConnect={handleConnect} onMessage={()=>{ handleMessagePerson(viewingWorker); setViewingWorker(null); }} accent={accent} />}
    </div>
  );
}

function WorkerProfileModal({ worker, onClose, connections, onConnect, onMessage, accent }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:700,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:C.white,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:540,maxHeight:"92vh",display:"flex",flexDirection:"column"}}>
        {/* Cover + avatar */}
        <div style={{position:"relative",flexShrink:0}}>
          <div style={{height:110,background:`linear-gradient(135deg,${accent},${C.blueDark})`,borderRadius:"24px 24px 0 0",overflow:"hidden"}}>
            <img src={worker.portfolio?.[0]?.img||IMG.cover1} style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.35}}/>
          </div>
          <button onClick={onClose} style={{position:"absolute",top:12,right:14,background:"rgba(0,0,0,0.45)",border:"none",borderRadius:"50%",width:32,height:32,color:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          <div style={{padding:"0 16px",marginTop:-36,position:"relative"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:8}}>
              <div style={{border:`3px solid ${C.white}`,borderRadius:"50%",background:C.white,display:"inline-block"}}>
                <Avatar src={worker.photo} initials={worker.initials} size={72}/>
              </div>
              <div style={{display:"flex",gap:8,paddingBottom:4}}>
                <button onClick={onMessage} style={{background:`linear-gradient(90deg,${accent},${C.blueDark})`,color:"#fff",border:"none",borderRadius:10,padding:"8px 16px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>💬 Message</button>
                <ConnectButton targetId={worker.id} connections={connections} onConnect={onConnect} accentColor={accent}/>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:2}}>
              <span style={{fontWeight:800,fontSize:18,color:C.text}}>{worker.full_name}</span>
              {worker.verified&&<VerifiedBadge size={16}/>}
              {worker.sub==="premium"&&<PremiumBadge/>}
            </div>
            <div style={{fontSize:13,color:C.mid,marginBottom:2}}>{worker.title}</div>
            <div style={{fontSize:12,color:C.light,marginBottom:10}}>📍 {worker.location} · {worker.experience_years} yrs · {worker.hourly}/hr</div>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{flex:1,overflowY:"auto",padding:"0 16px 24px"}}>
          {/* Stats row */}
          <div style={{display:"flex",gap:0,background:C.bg,borderRadius:12,padding:"12px 0",marginBottom:14,border:`1px solid ${C.border}`}}>
            {[
              [worker.rating+"★","Rating",C.gold],
              [worker.jobs_completed,"Jobs done",accent],
              [worker.available?"Open":"Busy",worker.available?"to work":"right now",worker.available?C.green:C.orange],
              [worker.skills_score+"/100","Skills score",C.teal],
            ]?.map(([v,l,col],i,arr)=>(
              <div key={l} style={{flex:1,textAlign:"center",borderRight:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
                <div style={{fontWeight:800,fontSize:15,color:col}}>{v}</div>
                <div style={{fontSize:10,color:C.light,marginTop:1}}>{l}</div>
              </div>
            ))}
          </div>

          {/* Bio */}
          {worker.bio && (
            <div style={{marginBottom:14}}>
              <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:6}}>About</div>
              <div style={{fontSize:13,color:C.mid,lineHeight:1.75}}>{worker.bio}</div>
            </div>
          )}

          {/* Skills */}
          <div style={{marginBottom:14}}>
            <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:8}}>Skills</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {worker.skills?.map(s=><span key={s} style={{fontSize:12,background:C.blueLight,color:C.blue,borderRadius:20,padding:"4px 12px",fontWeight:600}}>{s}</span>)}
            </div>
          </div>

          {/* Experience */}
          {worker.experience?.length>0 && (
            <div style={{marginBottom:14}}>
              <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:8}}>Experience</div>
              {worker.experience?.map((e,i)=>(
                <div key={i} style={{display:"flex",gap:10,marginBottom:10,borderLeft:`2px solid ${accent}`,paddingLeft:10}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:13,color:C.text}}>{e.role}</div>
                    <div style={{fontSize:12,color:C.mid}}>{e.company}</div>
                    <div style={{fontSize:11,color:C.light}}>{e.period}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {worker.certifications?.length>0 && (
            <div style={{marginBottom:14}}>
              <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:8}}>Certifications</div>
              {worker.certifications?.map((c,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <span style={{fontSize:14}}>🏅</span>
                  <span style={{fontSize:13,color:C.mid}}>{c}</span>
                </div>
              ))}
            </div>
          )}

          {/* Portfolio */}
          {worker.portfolio?.length>0 && (
            <div style={{marginBottom:14}}>
              <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:8}}>Portfolio ({worker.portfolio.length} photos)</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {worker.portfolio?.map((p,i)=>(
                  <div key={i} style={{borderRadius:10,overflow:"hidden",border:`1px solid ${C.border}`}}>
                    <img src={p.img} alt={p.caption} style={{width:"100%",height:110,objectFit:"cover",display:"block"}}/>
                    <div style={{padding:"6px 8px",fontSize:11,color:C.mid,lineHeight:1.4}}>{p.caption}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WorkerJobCard({ job, saved, applied, onSave, onApply, accent, idx }) {
  const [exp, setExp] = useState(false);
  const mc = job.match>=90?C.green:job.match>=75?accent:C.orange;
  return (
    <div style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,marginBottom:10,overflow:"hidden",animation:`slideUp 0.3s ease ${idx*0.05}s both`}}>
      <div style={{background:`${mc}12`,borderBottom:`1px solid ${mc}20`,padding:"6px 16px",display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:mc,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800}}>{job.match}%</div>
        <span style={{fontSize:12,fontWeight:700,color:mc}}>Match score</span>
        {job.urgent&&<span style={{marginLeft:"auto",background:C.redLight,color:C.red,borderRadius:10,padding:"2px 8px",fontSize:10,fontWeight:700}}>URGENT</span>}
        {job.deposit_held&&<span style={{background:C.greenLight,color:C.green,borderRadius:10,padding:"2px 8px",fontSize:10,fontWeight:600}}>✓ Verified employer</span>}
      </div>
      <div style={{padding:"14px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,fontSize:15,color:C.text,marginBottom:2}}>{job.title}</div><div style={{fontSize:13,color:C.mid}}>{job.company} · 📍 {job.location}</div></div>
          <div style={{fontSize:14,fontWeight:800,color:C.green,flexShrink:0,marginLeft:8}}>{job.salary}</div>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
          <span style={{fontSize:11,background:C.bg,color:C.mid,borderRadius:12,padding:"3px 10px",fontWeight:600}}>{job.type}</span>
          <span style={{fontSize:11,background:C.bg,color:C.mid,borderRadius:12,padding:"3px 10px"}}>{job.trade}</span>
          <span style={{fontSize:11,color:C.light}}>· {job.applicants} applicants · {job.posted}</span>
        </div>
        {exp&&<div style={{fontSize:13,color:C.mid,lineHeight:1.7,marginBottom:12,padding:"10px 12px",background:C.bg,borderRadius:8}}>{job.description}</div>}
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={onSave} style={{background:saved?C.goldLight:"none",border:`1px solid ${saved?C.gold:C.border}`,borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:600,color:saved?C.gold:C.mid,cursor:"pointer",fontFamily:"inherit"}}>{saved?"★ Saved":"☆ Save"}</button>
          <button onClick={()=>setExp(v=>!v)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 12px",fontSize:12,color:C.mid,cursor:"pointer",fontFamily:"inherit"}}>{exp?"Less ▲":"Details ▼"}</button>
          <div style={{flex:1}}/>
          {applied?<span style={{fontSize:12,fontWeight:700,color:C.green}}>✓ Applied</span>:<button onClick={onApply} style={{background:`linear-gradient(90deg,${accent},${C.blueDark})`,color:"#fff",border:"none",borderRadius:8,padding:"8px 18px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Apply Now</button>}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  EMPLOYER APP
// ═══════════════════════════════════════════════════════════
function EmployerApp({ user, onLogout, isMobile, setToast }) {
  const [tab, setTab] = useState("feed");
  const [shortlisted, setShortlisted] = useState(new Set());
  const [postedJobs, setPostedJobs] = useState([DEMO_JOBS[0]]);
  const [notifs, setNotifs] = useState(DEMO_NOTIFS.slice(0,3));
  const [chatThreads, setChatThreads] = useState(INITIAL_CHAT_THREADS.slice(0,2));
  const [connections, setConnections] = useState({});
  const [showPost, setShowPost] = useState(false);
  const [showVerify, setShowVerify] = useState(!user.verified);
  const [showPricing, setShowPricing] = useState(false);
  const accent = C.employerAccent;
  const unreadMsgs = chatThreads?.reduce((a,t)=>a+t.unread,0);

  const handleConnect = (targetId, action) => {
    setConnections(c => ({...c, [targetId]: action==="send" ? {status:"pending_sent"} : {status:"none"}}));
    if (action==="send") setToast({msg:"Connection request sent ✓",type:"success"});
  };

  const navItems = [
    ["feed","🏠","Feed",0,accent],
    ["discover","🔍","Talent",0,accent],
    ["shortlist","⭐","Shortlist",shortlisted.size,accent],
    ["jobs","📋","My Jobs",0,accent],
    ["messages","💬","Messages",unreadMsgs,accent],
  ];

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Source Sans 3',sans-serif",paddingBottom:70}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@700;800&family=Source+Sans+3:wght@400;500;600;700;800&display=swap'); *{box-sizing:border-box;-webkit-tap-highlight-color:transparent} @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <TopBar brand={BRAND} role="Employer" accent={accent} user={user} onSignOut={onLogout}
        actions={<>
          <button onClick={()=>setShowVerify(true)} style={{background:user.verified?`${C.green}12`:`${C.orange}12`,border:`1px solid ${user.verified?C.green:C.orange}30`,borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:700,color:user.verified?C.green:C.orange,cursor:"pointer",fontFamily:"inherit"}}>{user.verified?"✓ Verified":"Verify →"}</button>
          <button onClick={()=>setShowPost(true)} style={{background:`linear-gradient(90deg,${accent},#5B21B6)`,color:"#fff",border:"none",borderRadius:20,padding:"5px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ Post Job</button>
        </>}
      />

      <div style={{maxWidth:640,margin:"0 auto",padding:"12px 12px 0"}}>
        {tab==="feed" && (
          <FeedTab user={user} accent={accent} connections={connections} onConnect={handleConnect}/>
        )}

        {tab==="discover" && (
          <div style={{animation:"slideUp 0.3s ease"}}>
            {!user.verified && (
              <div style={{background:`${C.orange}12`,border:`1px solid ${C.orange}30`,borderRadius:12,padding:"12px 14px",marginBottom:12,display:"flex",gap:10,alignItems:"center"}}>
                <span style={{fontSize:20}}>⚠️</span>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:C.orange}}>Verify your business to unlock all features</div><div style={{fontSize:12,color:C.mid,marginTop:1}}>Unverified accounts can browse but cannot post jobs or message workers.</div></div>
                <button onClick={()=>setShowVerify(true)} style={{background:C.orange,color:"#fff",border:"none",borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Verify →</button>
              </div>
            )}
            <div style={{display:"flex",gap:6,marginBottom:12,overflowX:"auto",paddingBottom:4}}>
              {["All trades","Construction","Domestic","Electrical","Hospitality","Plumbing"]?.map((f,i)=>(
                <button key={f} style={{background:i===0?accent:C.white,color:i===0?"#fff":C.mid,border:`1px solid ${i===0?accent:C.border}`,borderRadius:20,padding:"5px 14px",fontSize:12,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",flexShrink:0}}>{f}</button>
              ))}
            </div>
            {DEMO_WORKERS?.map((w,idx)=>(
              <EmployerWorkerCard key={w.id} worker={w} shortlisted={shortlisted.has(w.id)}
                onShortlist={()=>{ setShortlisted(s=>{const n=new Set(s);n.has(w.id)?n.delete(w.id):n.add(w.id); setToast({msg:n.has(w.id)?`${w.full_name.split(" ")[0]} shortlisted ⭐`:"Removed",type:"success"}); return n;}); }}
                onMessage={()=>{ if(!user.verified){setShowVerify(true);return;} setTab("messages"); setToast({msg:`Opening chat with ${w.full_name.split(" ")[0]}`,type:"success"}); }}
                connections={connections} onConnect={handleConnect}
                accent={accent} idx={idx} isPremium={user.sub==="premium"} onUpgrade={()=>setShowPricing(true)} />
            ))}
          </div>
        )}

        {tab==="shortlist" && (
          <div style={{animation:"slideUp 0.3s ease"}}>
            <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:12}}>Shortlisted candidates ({shortlisted.size})</div>
            {shortlisted.size===0 ? (
              <div style={{textAlign:"center",padding:"48px 24px",background:C.white,borderRadius:14,border:`1px solid ${C.border}`}}>
                <div style={{fontSize:40,marginBottom:12}}>⭐</div>
                <div style={{fontWeight:700,fontSize:15,color:C.text,marginBottom:6}}>No shortlisted candidates yet</div>
                <div style={{fontSize:13,color:C.light}}>Star workers in Discover to build your shortlist.</div>
              </div>
            ) : DEMO_WORKERS?.filter(w=>shortlisted.has(w.id))?.map((w,idx)=>(
              <EmployerWorkerCard key={w.id} worker={w} shortlisted={true}
                onShortlist={()=>setShortlisted(s=>{const n=new Set(s);n.delete(w.id);return n;})}
                onMessage={()=>{ setTab("messages"); setToast({msg:`Opening chat with ${w.full_name.split(" ")[0]}`,type:"success"}); }}
                connections={connections} onConnect={handleConnect}
                accent={accent} idx={idx} isPremium={user.sub==="premium"} onUpgrade={()=>setShowPricing(true)} />
            ))}
          </div>
        )}

        {tab==="jobs" && (
          <div style={{animation:"slideUp 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontWeight:700,fontSize:16,color:C.text}}>Posted jobs ({postedJobs.length})</div>
              <button onClick={()=>user.verified?setShowPost(true):setShowVerify(true)} style={{background:accent,color:"#fff",border:"none",borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ New job</button>
            </div>
            {postedJobs?.map(job=>(
              <div key={job.id} style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,padding:"14px 16px",marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div><div style={{fontWeight:700,fontSize:14,color:C.text}}>{job.title}</div><div style={{fontSize:12,color:C.light,marginTop:2}}>{job.location} · {job.type} · {job.salary}</div></div>
                  <span style={{background:C.greenLight,color:C.green,borderRadius:12,padding:"3px 10px",fontSize:11,fontWeight:700}}>Live</span>
                </div>
                <div style={{display:"flex",gap:14,fontSize:12,color:C.mid,marginBottom:10}}>
                  <span>👥 {job.applicants} applicants</span>
                  <span>📊 {job.match}% avg match</span>
                  <span>🕐 {job.posted}</span>
                  {job.deposit_held&&<span style={{color:C.green,fontWeight:600}}>✓ Deposit held</span>}
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button style={{flex:1,background:accent,color:"#fff",border:"none",borderRadius:8,padding:"8px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>View applicants</button>
                  <button style={{background:"none",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",fontSize:12,color:C.mid,cursor:"pointer"}}>Edit</button>
                  <button style={{background:"none",border:`1px solid ${C.redLight}`,borderRadius:8,padding:"8px 12px",fontSize:12,color:C.red,cursor:"pointer"}}>Close</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==="messages" && (
          <SavukaChat
            userId={user.id}
            threads={chatThreads}
            onUpdateThreads={setChatThreads}
            setToast={setToast}
            accent={accent}
          />
        )}

        {tab==="account" && (
          <div style={{animation:"slideUp 0.3s ease"}}>
            <div style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,padding:16,marginBottom:10}}>
              <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16}}>
                <Avatar initials={user.initials} size={52}/>
                <div><div style={{fontWeight:700,fontSize:16,color:C.text}}>{user.full_name}</div><div style={{fontSize:12,color:C.light}}>{user.sub==="premium"?"Enterprise plan":"Basic plan"} · Employer</div></div>
              </div>
              <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:10}}>Verification status</div>
              {[{done:true,label:"Phone OTP verified"},{done:!!user.cipa,label:"CIPA registration checked"},{done:user.deposit_paid,label:"Job posting deposit paid (E100)"},{done:user.sub==="premium",label:"Premium subscription active"}]?.map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <div style={{width:20,height:20,borderRadius:"50%",background:s.done?C.green:C.bg,border:`2px solid ${s.done?C.green:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{s.done&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}</div>
                  <span style={{fontSize:13,color:s.done?C.text:C.light,fontWeight:s.done?500:400}}>{s.label}</span>
                  {!s.done&&<button onClick={()=>setShowVerify(true)} style={{marginLeft:"auto",fontSize:11,color:accent,background:"none",border:`1px solid ${accent}40`,borderRadius:12,padding:"2px 10px",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Complete</button>}
                </div>
              ))}
            </div>
            <button onClick={()=>setShowPricing(true)} style={{width:"100%",background:`linear-gradient(90deg,${accent},#5B21B6)`,color:"#fff",border:"none",borderRadius:12,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:10}}>Upgrade to Enterprise — E200/month</button>
            <button onClick={onLogout} style={{width:"100%",background:"none",border:`1px solid ${C.border}`,borderRadius:12,padding:"12px",fontSize:14,color:C.mid,cursor:"pointer",fontFamily:"inherit"}}>Sign out</button>
          </div>
        )}
      </div>

      <BottomNav items={navItems} active={tab} onSelect={setTab} />
      {showPost&&<PostJobModal onClose={()=>setShowPost(false)} onPost={(job)=>{ setPostedJobs(p=>[...p,{...job,id:`j${Date.now()}`,applicants:0,match:85,posted:"Just now",deposit_held:true}]); setShowPost(false); setToast({msg:"Job live! Workers are being matched. ✅",type:"success"}); }} accent={accent} user={user} />}
      {showVerify&&<RecruiterVerifyModal onClose={()=>setShowVerify(false)} onComplete={()=>{setShowVerify(false);setToast({msg:"Business verified! ✓ You can now post jobs and message workers.",type:"success"});}} user={user} />}
      {showPricing&&<PricingModal onClose={()=>setShowPricing(false)} user={user} onPay={(tier,r)=>setToast({msg:`${tier.name} activated! 🎉`,type:"success"})} />}
    </div>
  );
}

function EmployerWorkerCard({ worker, shortlisted, onShortlist, onMessage, connections={}, onConnect=()=>{}, accent, idx, isPremium, onUpgrade }) {
  return (
    <div style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,marginBottom:10,overflow:"hidden",animation:`slideUp 0.3s ease ${idx*0.06}s both`}}>
      <div style={{padding:"14px 16px"}}>
        <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
          <div style={{position:"relative",flexShrink:0}}>
            <Avatar src={worker.photo} initials={worker.initials} size={52}/>
            {worker.available&&<div style={{position:"absolute",bottom:0,right:0,width:13,height:13,background:C.green,borderRadius:"50%",border:"2px solid #fff"}}/>}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
              <span style={{fontWeight:700,fontSize:15,color:C.text}}>{worker.full_name}</span>
              {worker.verified&&<VerifiedBadge/>}
              {worker.sub==="premium"&&<PremiumBadge/>}
            </div>
            <div style={{fontSize:13,color:C.mid,marginTop:2}}>{worker.title}</div>
            <div style={{fontSize:12,color:C.light,marginTop:1}}>📍 {worker.location} · {worker.experience_years}yrs · {worker.hourly}/hr</div>
          </div>
          <div style={{textAlign:"center",flexShrink:0}}>
            <div style={{fontSize:15,fontWeight:800,color:worker.rating>=4.9?C.green:C.orange}}>⭐{worker.rating}</div>
            <div style={{fontSize:9,color:C.light}}>{worker.jobs_completed} jobs</div>
          </div>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
          {worker.skills.slice(0,4)?.map(s=><span key={s} style={{fontSize:11,background:C.bg,color:C.mid,borderRadius:12,padding:"3px 10px"}}>{s}</span>)}
          {worker.skills.length>4&&<span style={{fontSize:11,color:C.light}}>+{worker.skills.length-4}</span>}
        </div>
        {isPremium ? (
          <div style={{background:`${accent}08`,border:`1px solid ${accent}20`,borderRadius:8,padding:"8px 12px",marginBottom:10,display:"flex",alignItems:"center",gap:10}}>
            <SkillScore score={worker.skills_score}/>
            <div style={{flex:1,fontSize:12,color:C.mid}}>Trade competency test · verified score</div>
          </div>
        ) : (
          <div onClick={onUpgrade} style={{background:C.bg,borderRadius:8,padding:"8px 12px",marginBottom:10,display:"flex",alignItems:"center",gap:8,cursor:"pointer",position:"relative"}}>
            <div style={{filter:"blur(3px)",fontSize:12,color:C.mid,flex:1}}>Skills score: {worker.skills_score}/100 · verified</div>
            <span style={{fontSize:11,color:C.gold,fontWeight:700,flexShrink:0}}>🔒 Upgrade</span>
          </div>
        )}
        <div style={{display:"flex",gap:8}}>
          <ConnectButton targetId={worker.id} connections={connections} onConnect={onConnect} size="small" accentColor={accent}/>
          <button onClick={onShortlist} style={{flex:1,background:shortlisted?C.goldLight:"none",border:`1px solid ${shortlisted?C.gold:C.border}`,borderRadius:8,padding:"8px",fontSize:12,fontWeight:700,color:shortlisted?C.gold:C.mid,cursor:"pointer",fontFamily:"inherit"}}>{shortlisted?"★ Shortlisted":"☆ Shortlist"}</button>
          <button onClick={onMessage} style={{flex:1,background:`linear-gradient(90deg,${accent},#5B21B6)`,color:"#fff",border:"none",borderRadius:8,padding:"8px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>💬 Message</button>
        </div>
      </div>
    </div>
  );
}

function PostJobModal({ onClose, onPost, accent, user }) {
  const [form, setForm] = useState({title:"",location:"Mbabane",salary:"",type:"Full-time",trade:"Construction",description:""});
  const [showPay, setShowPay] = useState(false);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const inp = {width:"100%",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"10px 12px",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box",background:C.white};
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:600,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:C.white,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:520,maxHeight:"88vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"16px 20px 12px",borderBottom:`1px solid ${C.bg}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{fontWeight:700,fontSize:16,color:C.text}}>Post a job</div>
          <button onClick={onClose} style={{background:C.bg,border:"none",borderRadius:"50%",width:32,height:32,fontSize:18,cursor:"pointer"}}>×</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"16px 20px",display:"flex",flexDirection:"column",gap:12}}>
          <div><label style={{fontSize:12,fontWeight:700,color:C.mid,display:"block",marginBottom:4}}>JOB TITLE</label><input value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. Bricklayer needed for 3-bedroom house" style={inp}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><label style={{fontSize:12,fontWeight:700,color:C.mid,display:"block",marginBottom:4}}>LOCATION</label>
              <select value={form.location} onChange={e=>set("location",e.target.value)} style={inp}>{["Mbabane","Manzini","Ezulwini","Nhlangano","Matsapha","Siteki"]?.map(l=><option key={l}>{l}</option>)}</select>
            </div>
            <div><label style={{fontSize:12,fontWeight:700,color:C.mid,display:"block",marginBottom:4}}>TRADE</label>
              <select value={form.trade} onChange={e=>set("trade",e.target.value)} style={inp}>{["Construction","Domestic","Electrical","Hospitality","Plumbing","Gardening","Security","Other"]?.map(t=><option key={t}>{t}</option>)}</select>
            </div>
          </div>
          <div><label style={{fontSize:12,fontWeight:700,color:C.mid,display:"block",marginBottom:4}}>SALARY / RATE</label><input value={form.salary} onChange={e=>set("salary",e.target.value)} placeholder="e.g. E7,500/month or E180/hour" style={inp}/></div>
          <div><label style={{fontSize:12,fontWeight:700,color:C.mid,display:"block",marginBottom:4}}>DESCRIPTION</label><textarea value={form.description} onChange={e=>set("description",e.target.value)} placeholder="What does the job involve? Requirements, duration, etc." rows={3} style={{...inp,resize:"vertical"}}/></div>
          {!user.deposit_paid && (
            <div style={{background:C.orangeLight,borderRadius:10,padding:"10px 12px",fontSize:12,color:C.orange,lineHeight:1.6}}>
              ⚠️ A refundable <strong>E100 deposit</strong> is required to post your first job. This protects workers from fraudulent listings.
            </div>
          )}
        </div>
        <div style={{padding:"12px 20px",borderTop:`1px solid ${C.bg}`,flexShrink:0,display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,background:"none",border:`1px solid ${C.border}`,borderRadius:12,padding:"12px",fontSize:14,color:C.mid,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
          <button onClick={()=>form.title&&(user.deposit_paid?onPost(form):setShowPay(true))} disabled={!form.title} style={{flex:2,background:form.title?`linear-gradient(90deg,${accent},#5B21B6)`:C.border,color:form.title?"#fff":C.light,border:"none",borderRadius:12,padding:"12px",fontSize:14,fontWeight:700,cursor:form.title?"pointer":"not-allowed",fontFamily:"inherit"}}>
            {user.deposit_paid?"Post Job →":"Pay E100 deposit + Post →"}
          </button>
        </div>
      </div>
      {showPay&&<PaymentModal amount={100} description="Savuka recruiter deposit — refundable" phone={user.phone||""} onClose={()=>setShowPay(false)} onSuccess={()=>{ setShowPay(false); onPost(form); }} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  SOLE TRADER APP
// ═══════════════════════════════════════════════════════════
function TraderApp({ user, onLogout, isMobile, setToast }) {
  const [tab, setTab] = useState("feed");
  const [services, setServices] = useState(DEMO_SERVICES);
  const [showPay, setShowPay] = useState(null);
  const [showPricing, setShowPricing] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [chatThreads, setChatThreads] = useState([
    { id:"tc1", participants:[user.id,"22222222-2222-2222-2222-222222222222"], other:{ id:"22222222-2222-2222-2222-222222222222", full_name:"Nomvula Khumalo", initials:"NK", photo:IMG.nomvula, role:"worker", verified:true }, messages:[
      { id:"tm1", from:"22222222-2222-2222-2222-222222222222", text:"Hi Nandi! I'd like to book a full hair relaxer for Saturday. Are you available?", time:"11:00", date:"Today" },
      { id:"tm2", from:user.id, text:"Hi Nomvula! Yes, I have a slot at 10am on Saturday. Shall I confirm your booking?", time:"11:15", date:"Today" },
    ], unread:1 },
    { id:"tc2", participants:[user.id,"33333333-3333-3333-3333-333333333333"], other:{ id:"33333333-3333-3333-3333-333333333333", full_name:"Thabo Mkhwanazi", initials:"TM", photo:IMG.thabo, role:"worker", verified:true }, messages:[
      { id:"tm3", from:"33333333-3333-3333-3333-333333333333", text:"How much for acrylic nails? A colleague recommended you.", time:"Yesterday", date:"Yesterday" },
    ], unread:0 },
  ]);
  const accent = C.traderAccent;
  const unreadMsgs = chatThreads?.reduce((a,t)=>a+t.unread,0);

  const navItems = [
    ["feed","🏠","Feed",0,accent],
    ["storefront","🏪","My Shop",0,accent],
    ["bookings","📅","Bookings",3,accent],
    ["messages","💬","Messages",unreadMsgs,accent],
    ["account","👤","Account",0,accent],
  ];

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Source Sans 3',sans-serif",paddingBottom:70}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@700;800&family=Source+Sans+3:wght@400;500;600;700;800&display=swap'); *{box-sizing:border-box;-webkit-tap-highlight-color:transparent} @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <TopBar brand={BRAND} role="My Business" accent={accent} user={user} onSignOut={onLogout}
        actions={<>
          <button onClick={()=>setToast({msg:"Shop link copied! 🔗",type:"success"})} style={{background:`${accent}12`,border:`1px solid ${accent}30`,borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:700,color:accent,cursor:"pointer",fontFamily:"inherit"}}>Share Shop</button>
          <button onClick={()=>setShowPricing(true)} style={{background:`linear-gradient(90deg,${C.goldBright},${C.gold})`,color:"#fff",border:"none",borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✦ Upgrade</button>
        </>}
      />

      <div style={{maxWidth:640,margin:"0 auto",padding:"12px 12px 0"}}>
        {tab==="feed" && (
          <FeedTab user={user} accent={accent} connections={{}} onConnect={()=>{}}/>
        )}

        {tab==="storefront" && (
          <div style={{animation:"slideUp 0.3s ease"}}>
            <div style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,overflow:"hidden",marginBottom:10}}>
              <div style={{height:100,background:`linear-gradient(135deg,${accent},${C.teal})`,position:"relative"}}>
                <img src={IMG.nails} style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.35,mixBlendMode:"luminosity"}}/>
                <div style={{position:"absolute",bottom:8,right:10}}><button style={{background:"rgba(255,255,255,0.9)",border:"none",borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:700,color:accent,cursor:"pointer"}}>Edit cover</button></div>
              </div>
              <div style={{padding:"0 16px 16px",marginTop:-28}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:10}}>
                  <Avatar src={IMG.nandi} initials={user.initials} size={56} border={C.white}/>
                  <button onClick={()=>setToast({msg:"Opening chat with this business…",type:"success"})} style={{background:C.blue,color:"#fff",borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>
                    💬 Message
                  </button>
                </div>
                <div style={{fontWeight:700,fontSize:17,color:C.text,marginBottom:2}}>{user.full_name}</div>
                <div style={{fontSize:13,color:C.mid,marginBottom:2}}>💅 Nails · 💇 Hair · 🧵 Alterations</div>
                <div style={{fontSize:12,color:C.light,marginBottom:10}}>📍 Manzini · Open Mon–Sat 8am–6pm</div>
                <div style={{display:"flex",gap:12,paddingTop:10,borderTop:`1px solid ${C.bg}`}}>
                  {[["E2,450","This month"],["28","Bookings"],["4.9★","Rating"]]?.map(([v,l])=><div key={l} style={{textAlign:"center"}}><div style={{fontWeight:700,fontSize:16,color:accent}}>{v}</div><div style={{fontSize:10,color:C.light}}>{l}</div></div>)}
                </div>
              </div>
            </div>

            <div style={{fontWeight:700,fontSize:15,color:C.text,marginBottom:8}}>Services & prices</div>
            {services?.map((svc,idx)=>(
              <div key={svc.id} style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,marginBottom:10,overflow:"hidden",display:"flex",animation:`slideUp 0.3s ease ${idx*0.06}s both`}}>
                <img src={svc.img} style={{width:90,height:90,objectFit:"cover",flexShrink:0}}/>
                <div style={{padding:"12px 14px",flex:1}}>
                  <div style={{fontWeight:700,fontSize:14,color:C.text}}>{svc.name}</div>
                  <div style={{fontSize:12,color:C.light,marginTop:2}}>⏱ {svc.duration}</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
                    <span style={{fontSize:18,fontWeight:800,color:accent}}>{svc.price}</span>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={()=>setShowPay(svc)} style={{background:`${C.teal}12`,border:`1px solid ${C.teal}30`,borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:700,color:C.teal,cursor:"pointer",fontFamily:"inherit"}}>Pay now</button>
                      <button onClick={()=>setToast({msg:`Booking request for ${svc.name} sent!`,type:"success"})} style={{background:C.blue,color:"#fff",border:"none",borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Book</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={()=>setToast({msg:"Add service feature coming soon!",type:"success"})} style={{width:"100%",background:`${accent}08`,border:`2px dashed ${accent}30`,borderRadius:14,padding:"14px",fontSize:14,fontWeight:700,color:accent,cursor:"pointer",fontFamily:"inherit"}}>+ Add service</button>
          </div>
        )}

        {tab==="bookings" && (
          <div style={{animation:"slideUp 0.3s ease"}}>
            <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:12}}>Upcoming bookings</div>
            {[{client:"Zanele M.",service:"Acrylic nail set",time:"Today 2:00pm",price:"E150",status:"confirmed"},{client:"Thandi D.",service:"Full hair relaxer",time:"Tomorrow 10:00am",price:"E280",status:"pending"},{client:"Nomsa K.",service:"Dress alteration",time:"Thu 9:00am",price:"E80",status:"confirmed"}]?.map((b,i)=>(
              <div key={i} style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,padding:"14px 16px",marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div><div style={{fontWeight:700,fontSize:14,color:C.text}}>{b.client}</div><div style={{fontSize:13,color:C.mid,marginTop:2}}>{b.service}</div><div style={{fontSize:12,color:C.light,marginTop:2}}>🕐 {b.time}</div></div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontWeight:800,fontSize:16,color:C.green,marginBottom:4}}>{b.price}</div>
                    <span style={{background:b.status==="confirmed"?C.greenLight:C.orangeLight,color:b.status==="confirmed"?C.green:C.orange,borderRadius:12,padding:"2px 8px",fontSize:11,fontWeight:700,textTransform:"capitalize"}}>{b.status}</span>
                  </div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setToast({msg:`${b.client} notified via Savuka DM ✓`,type:"success"})} style={{flex:1,background:accent,color:"#fff",border:"none",borderRadius:8,padding:"8px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Confirm</button>
                  <button style={{background:"none",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",fontSize:12,color:C.mid,cursor:"pointer"}}>Reschedule</button>
                  <button onClick={()=>setToast({msg:"Payment link sent to client",type:"success"})} style={{background:C.teal,color:"#fff",border:"none",borderRadius:8,padding:"8px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>💰 Request pay</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==="portfolio" && (
          <div style={{animation:"slideUp 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div><div style={{fontWeight:700,fontSize:15,color:C.text}}>Your portfolio</div><div style={{fontSize:11,color:C.light}}>4 photos · AI-captioned</div></div>
              <button onClick={()=>setShowPortfolio(true)} style={{background:accent,color:"#fff",border:"none",borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ Add photo</button>
            </div>
            <div style={{background:`${accent}08`,border:`1px solid ${accent}20`,borderRadius:12,padding:"10px 12px",marginBottom:12,fontSize:12,color:C.mid,lineHeight:1.6}}>
              <strong style={{color:accent}}>✨ AI Portfolio tip:</strong> Add before/after photos. Our AI writes professional captions for each one — making your work look world-class to clients.
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[{img:IMG.nails,cap:"Acrylic nail art with gel top coat — full set"},{img:IMG.hair,cap:"Full relaxer + blowout, defined style"},{img:IMG.sewing,cap:"Custom dress alteration — perfect fit finish"},{img:IMG.port1,cap:"Bridal nail set with diamond accents"}]?.map((p,i)=>(
                <div key={i} style={{borderRadius:12,overflow:"hidden",aspectRatio:"4/3",position:"relative"}}>
                  <img src={p.img} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,0.75))",padding:"8px 10px"}}>
                    <div style={{fontSize:10,color:"#fff",fontWeight:500,lineHeight:1.3}}>{p.cap}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="messages" && (
          <SavukaChat
            userId={user.id}
            threads={chatThreads}
            onUpdateThreads={setChatThreads}
            setToast={setToast}
            accent={accent}
            onStartChat={()=>setToast({msg:"Search for clients or workers to start a chat",type:"success"})}
          />
        )}

        {tab==="account" && (
          <div style={{animation:"slideUp 0.3s ease"}}>
            <div style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,padding:16,marginBottom:10}}>
              <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:12}}>Business settings</div>
              {[["Business name","Nandi's Beauty Studio"],["Phone (Savuka messages)",user.phone||"+268 7600 0000"],["Location","Manzini"],["Hours","Mon–Sat 8am–6pm"],["DeltaPay reference","NANDI-BEAUTY-001"]]?.map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.bg}`}}>
                  <span style={{fontSize:13,color:C.mid}}>{l}</span>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:13,fontWeight:600,color:C.text}}>{v}</span><button style={{fontSize:11,color:accent,background:"none",border:"none",cursor:"pointer"}}>Edit</button></div>
                </div>
              ))}
            </div>
            <div style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,padding:16,marginBottom:10}}>
              <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:10}}>Payment methods</div>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <div style={{flex:1,background:`${C.momo}12`,border:`1px solid ${C.momo}40`,borderRadius:10,padding:"10px 12px",textAlign:"center"}}><div style={{fontSize:16,marginBottom:2}}>📱</div><div style={{fontSize:12,fontWeight:700,color:C.text}}>MTN MoMo</div><div style={{fontSize:11,color:C.green,fontWeight:600}}>✓ Connected</div></div>
                <div style={{flex:1,background:C.deltaLight,border:`1px solid ${C.delta}40`,borderRadius:10,padding:"10px 12px",textAlign:"center"}}><div style={{fontSize:16,marginBottom:2}}>💳</div><div style={{fontSize:12,fontWeight:700,color:C.text}}>DeltaPay</div><div style={{fontSize:11,color:C.green,fontWeight:600}}>✓ Connected</div></div>
              </div>
              <div style={{fontSize:12,color:C.light,textAlign:"center"}}>Clients can pay via MoMo or DeltaPay. You receive funds within 24 hours.</div>
            </div>
            <button onClick={onLogout} style={{width:"100%",background:"none",border:`1px solid ${C.border}`,borderRadius:12,padding:"12px",fontSize:14,color:C.mid,cursor:"pointer",fontFamily:"inherit"}}>Sign out</button>
          </div>
        )}
      </div>

      <BottomNav items={navItems} active={tab} onSelect={setTab} />
      {showPay&&<PaymentModal amount={showPay.priceNum} description={`${showPay.name} — Nandi's Beauty Studio`} phone="" onClose={()=>setShowPay(null)} onSuccess={()=>{ setShowPay(null); setToast({msg:`Payment of ${showPay.price} received! 💰`,type:"success"}); }} accent={accent} />}
      {showPricing&&<PricingModal onClose={()=>setShowPricing(false)} user={user} onPay={(tier,r)=>setToast({msg:`${tier.name} activated! 🎉`,type:"success"})} />}
      {showPortfolio&&<PortfolioBuilder onClose={()=>setShowPortfolio(false)} trade="Beauty & Nails" existingPhotos={[]} onSave={(p)=>{ setShowPortfolio(false); setToast({msg:`${p.length} photos added to portfolio ✨`,type:"success"}); }} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  LANDING PAGE
// ═══════════════════════════════════════════════════════════
function LandingPage({ onLogin, isMobile }) {
  return (
    <div style={{minHeight:"100vh",fontFamily:"'Source Sans 3',sans-serif",background:"#0A0F1C",overflowX:"hidden"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@700;800&family=Source+Sans+3:wght@400;500;600;700;800&display=swap'); *{box-sizing:border-box;-webkit-tap-highlight-color:transparent} @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:32,height:32,background:`linear-gradient(135deg,${C.blue},${C.blueDark})`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2L3 7v10l9 5 9-5V7L12 2z"/></svg></div>
          <span style={{fontFamily:"'Source Serif 4',serif",fontSize:22,fontWeight:800,color:"#fff"}}>{BRAND}</span>
        </div>
        <button onClick={onLogin} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.3)",borderRadius:24,padding:"8px 20px",fontSize:13,fontWeight:600,color:"#fff",cursor:"pointer"}}>Sign in</button>
      </div>
      <div style={{textAlign:"center",padding:isMobile?"40px 20px 28px":"64px 40px 36px",animation:"fadeUp 0.8s ease"}}>
        <div style={{display:"inline-block",background:"rgba(10,102,194,0.15)",border:"1px solid rgba(10,102,194,0.4)",borderRadius:24,padding:"5px 14px",fontSize:12,fontWeight:700,color:C.blue,letterSpacing:1,marginBottom:20}}>ESWATINI'S #1 TALENT PLATFORM</div>
        <h1 style={{fontFamily:"'Source Serif 4',serif",fontSize:isMobile?34:56,fontWeight:800,color:"#fff",margin:"0 0 16px",lineHeight:1.1,maxWidth:700,marginLeft:"auto",marginRight:"auto"}}>Rise. Be Seen.<br/><span style={{color:C.gold}}>Change Your Life.</span></h1>
        <p style={{fontSize:isMobile?14:17,color:"rgba(255,255,255,0.65)",maxWidth:500,margin:"0 auto 48px",lineHeight:1.7}}>Your experience is your degree. Connect skilled workers with verified employers across Eswatini. Powered by AI.</p>
      </div>
      <div style={{maxWidth:980,margin:"0 auto",padding:isMobile?"0 14px 48px":"0 40px 72px",display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr 1fr",gap:14}}>
        {[
          {role:"worker",  icon:"👷",accent:C.blue,   accentDark:C.blueDark, label:"I AM A WORKER",  title:"Find Work",       desc:"Build your AI profile. Get found by verified employers. Apply to jobs that match your skills and experience.",       tags:["AI profile","Skills tests","Portfolio","Analytics"],  cta:"Get Started →"},
          {role:"employer",icon:"🏢",accent:C.purple, accentDark:"#5B21B6",  label:"I AM HIRING",   title:"Hire Talent",     desc:"Browse verified candidates, see skills test scores, post jobs, and pay via MoMo or DeltaPay. AI matches you instantly.", tags:["Skills scores","AI matching","MoMo / DeltaPay","Verified only"], cta:"Start Hiring →"},
          {role:"trader",  icon:"💅",accent:C.teal,   accentDark:"#065F46",  label:"MY OWN BUSINESS",title:"Advertise Services",desc:"Nails, hair, sewing, makeup — get a professional storefront. List services, take bookings, accept MoMo and DeltaPay.",   tags:["Storefront","Service menu","MoMo bookings","AI portfolio"], cta:"Open My Shop →"},
        ]?.map((r,i)=>(
          <div key={r.role} onClick={onLogin} style={{background:`${r.accent}08`,border:`1px solid ${r.accent}25`,borderRadius:20,padding:"28px 22px",cursor:"pointer",transition:"all 0.2s",animation:`fadeUp 0.8s ease ${i*0.15}s both`}}
            onMouseEnter={e=>{e.currentTarget.style.background=`${r.accent}16`;e.currentTarget.style.transform="translateY(-4px)";}}
            onMouseLeave={e=>{e.currentTarget.style.background=`${r.accent}08`;e.currentTarget.style.transform="translateY(0)";}}>
            <div style={{fontSize:40,marginBottom:14,animation:`float 3s ease-in-out infinite ${i*0.4}s`}}>{r.icon}</div>
            <div style={{fontSize:11,fontWeight:700,color:r.accent,letterSpacing:1,marginBottom:8}}>{r.label}</div>
            <h3 style={{fontSize:22,fontWeight:700,color:"#fff",margin:"0 0 10px"}}>{r.title}</h3>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7,margin:"0 0 18px"}}>{r.desc}</p>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:18}}>
              {r.tags?.map(t=><span key={t} style={{fontSize:11,background:`${r.accent}18`,color:r.accent==="rgba(255,255,255,0.65)"?"#fff":`${r.accent}CC`,borderRadius:12,padding:"3px 10px"}}>{t}</span>)}
            </div>
            <button style={{width:"100%",background:`linear-gradient(90deg,${r.accent},${r.accentDark})`,color:"#fff",border:"none",borderRadius:12,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer"}}>{r.cta}</button>
          </div>
        ))}
      </div>
      {/* Payment logos */}
      <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",padding:"20px 24px",display:"flex",alignItems:"center",justifyContent:"center",gap:20,flexWrap:"wrap"}}>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>ACCEPTED PAYMENTS</div>
        <div style={{background:`${C.momo}20`,border:`1px solid ${C.momo}40`,borderRadius:8,padding:"5px 14px",fontSize:12,fontWeight:700,color:C.momo}}>📱 MTN MoMo</div>
        <div style={{background:`${C.delta}20`,border:`1px solid ${C.delta}40`,borderRadius:8,padding:"5px 14px",fontSize:12,fontWeight:700,color:"#7BB8D0"}}>💳 DeltaPay</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.25)"}}>·</div>
        {[["12,000+","Workers"],["800+","Employers"],["4,200+","Jobs filled"]]?.map(([n,l])=><div key={l} style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:800,color:C.gold}}>{n}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>{l}</div></div>)}
      </div>
      {/* Live community feed preview */}
      <div style={{background:C.bg,padding:"36px 0 48px"}}>
        <div style={{maxWidth:600,margin:"0 auto",padding:"0 16px"}}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <h2 style={{fontFamily:"'Source Serif 4',serif",fontSize:isMobile?20:26,fontWeight:700,color:C.text,margin:"0 0 6px"}}>What Savuka members are sharing</h2>
            <p style={{fontSize:14,color:C.light,margin:0}}>Real work. Real people. Your community is already here.</p>
          </div>
          <FeedTab user={null} accent={C.blue} connections={{}} onConnect={()=>{}}/>
          <div style={{textAlign:"center",marginTop:18}}>
            <button onClick={onLogin} style={{background:`linear-gradient(90deg,${C.blue},${C.blueDark})`,color:"#fff",border:"none",borderRadius:28,padding:"13px 32px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"'Source Sans 3',sans-serif"}}>Join Savuka to participate →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  LOGIN PAGE
// ═══════════════════════════════════════════════════════════
function LoginPage({ onLogin, onBack, isMobile }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const inp = {width:"100%",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"12px 14px",fontSize:15,outline:"none",fontFamily:"inherit",background:C.white,color:C.text,boxSizing:"border-box"};

  const submit = async () => {
    if (!email||!pass) { setErr("Enter email and password."); return; }
    setLoading(true); setErr("");
    await new Promise(r=>setTimeout(r,700));
    const key = email.toLowerCase().trim();
    const profile = DEMO_ACCOUNTS[key];
    onLogin(profile||{ id:`demo-${Date.now()}`, full_name:email.split("@")[0].replace(/[._]/g," ").replace(/\b\w/g,l=>l.toUpperCase()), initials:email.slice(0,2).toUpperCase(), role:"worker", sub:"free", status:"active", phone:"", verified:false, email:key });
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:"#0A0F1C",display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"'Source Sans 3',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@700;800&family=Source+Sans+3:wght@400;600;700;800&display=swap'); *{box-sizing:border-box}`}</style>
      <div style={{background:C.white,borderRadius:20,width:"100%",maxWidth:420,padding:isMobile?24:36}}>
        <button onClick={onBack} style={{background:"none",border:"none",fontSize:13,color:C.light,cursor:"pointer",marginBottom:20,padding:0,fontFamily:"inherit"}}>← Back</button>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:28}}>
          <div style={{width:36,height:36,background:`linear-gradient(135deg,${C.blue},${C.blueDark})`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2L3 7v10l9 5 9-5V7L12 2z"/></svg></div>
          <span style={{fontFamily:"'Source Serif 4',serif",fontSize:24,fontWeight:800,color:C.blue}}>{BRAND}</span>
        </div>
        <h2 style={{fontSize:22,fontWeight:700,color:C.text,margin:"0 0 6px"}}>Sign in</h2>
        <p style={{fontSize:13,color:C.light,margin:"0 0 20px"}}>New? Any email creates an account.</p>
        <div style={{background:"#F0F7FF",borderRadius:10,padding:"12px 14px",marginBottom:18}}>
          <div style={{fontSize:11,fontWeight:700,color:C.blue,marginBottom:8}}>⚡ Demo accounts — tap to auto-fill</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            {[["worker@savuka.online","👷 Worker (Premium)"],["employer@savuka.online","🏢 Employer (Verified)"],["nandi@savuka.online","💅 Sole Trader"],["newbiz@savuka.online","🏢 New Employer"]]?.map(([e,l])=>(
              <button key={e} onClick={()=>{setEmail(e);setPass("demo");}} style={{background:email===e?C.blue:"#fff",color:email===e?"#fff":C.blue,border:`1px solid ${email===e?C.blue:"#BFD7F7"}`,borderRadius:8,padding:"6px 8px",fontSize:11,fontWeight:600,cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}>{l}</button>
            ))}
          </div>
        </div>
        {err&&<div style={{background:C.redLight,borderRadius:8,padding:"8px 12px",marginBottom:12,fontSize:13,color:C.red}}>{err}</div>}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" style={inp} />
        <div style={{height:10}}/>
        <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" onKeyDown={e=>e.key==="Enter"&&submit()} style={inp} />
        <div style={{height:16}}/>
        <button onClick={submit} disabled={loading} style={{width:"100%",background:loading?C.border:`linear-gradient(90deg,${C.blue},${C.blueDark})`,color:loading?C.light:"#fff",border:"none",borderRadius:12,padding:"13px",fontSize:15,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit"}}>{loading?"Signing in…":"Sign in"}</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════
export default function SavukaApp() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("landing");
  const [toast, setToast] = useState(null);
  const { isMobile } = useBreakpoint();

  const login = useCallback((profile) => {
    setUser(profile);
    const dest = profile.role==="employer"||profile.role==="admin" ? "employer" : profile.role==="sole_trader" ? "trader" : "worker";
    setScreen(dest);
    setToast({ msg:`Welcome back, ${profile.full_name.split(" ")[0]}! 👋`, type:"success" });
  }, []);

  const logout = () => { setUser(null); setScreen("landing"); };

  return (
    <>
      {screen==="landing"  && <LandingPage onLogin={()=>setScreen("login")} isMobile={isMobile} />}
      {screen==="login"    && <LoginPage onLogin={login} onBack={()=>setScreen("landing")} isMobile={isMobile} />}
      {screen==="worker"   && <WorkerApp  user={user} onLogout={logout} isMobile={isMobile} setToast={setToast} />}
      {screen==="employer" && <EmployerApp user={user} onLogout={logout} isMobile={isMobile} setToast={setToast} />}
      {screen==="trader"   && <TraderApp   user={user} onLogout={logout} isMobile={isMobile} setToast={setToast} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)} />}
    </>
  );
}
