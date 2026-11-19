# What I need from you

Everything below is marked `TODO` in `content/*.ts`. In `npm run dev` each one shows as a dashed orange marker; in production it's hidden.

## Decisions (I used a default; confirm or change)
- [ ] **Public email**: using the BIMTECH address from the resume. Swap for a personal one? (`content/profile.ts`)
- [ ] **GitHub URL**: hidden until you add one (`profile.links.github`)
- [ ] **Site URL**: set `NEXT_PUBLIC_SITE_URL` once you have a domain (Vercel's URL is used automatically until then)
- [ ] **"DealerDesk" vs "BayBoard"**: your screenshot says BayBoard, so the site uses BayBoard
- [ ] **AI Lead-Routing**: the resume says "a stationery supplier"; I used your brief's "OfficeHub" and "CRM course". OK to publish?
- [ ] **IndiGo**: capstone or self-learning? (The resume says self-learning.) It's featured, but it has the least content. Consider featuring the MDAE project instead (set `featured: true` there and remove it from IndiGo)
- [ ] **Side builds** (BreatheRide, Tokamak, No Mercy): not on your resume. Keep them?
- [ ] Phone number and CGPA are intentionally **not** on the site (they're in the downloadable PDF)

## Featured projects
**Pocket Scholar**
- [ ] Problem statement (what gap students face)
- [ ] What exists today (pilot / MVP / first cohort) + screenshots → `assets/raw/pocket-scholar__*.png`
- [ ] Any honest traction numbers
- [ ] Tools used; month range and whether it's ongoing (`experience.ts`)

**BayBoard (Parking MVP)**
- [ ] Month/year
- [ ] Your specific part in the team of 5
- [ ] What the buyer said in UAT and what happened next
- [ ] Build stack
- [ ] More screenshots (floor map, passes & billing, staff & upkeep tabs) → `assets/raw/bayboard__*.png`

**AI Lead-Routing Agent**
- [ ] Month/year · solo or team · any result from the demo/grade

**IndiGo classifier**
- [ ] Dataset source and size, cleaning steps, models compared, metric, final score (only numbers you can show)
- [ ] Notebook screenshots → `assets/raw/indigo-recommendation__*.png` (replaces the illustrative art)

## Other projects
- [ ] **MDAE live project**: your role; what decision it supported; what "win rate" measures (the resume says consolidation "improved win rates by 78%")
- [ ] **Prime Video EDA**: date, question, findings, which BI tool + dashboard screenshot
- [ ] **Asian Paints IMC**: course, date, role, brief, field study details, the plan, outcome (not on resume)
- [ ] **Hermes' Dialogue 7.0**: date, team, framing, recommendations
- [ ] **Green-infra research (Prakritik Sukoon)**: your role, what the company did with it
- [ ] **Third Wave Coffee**: course, date, role, observations, strategy, outcome (not on resume)
- [ ] **Markstrat**: date, role, MOST/MOVE decisions, final result
- [ ] **Quantum chemistry simulator**: what it simulates, method, libraries, repo link, a real output image
- [ ] **BreatheRide / Tokamak / No Mercy**: dates, tools used, outcome or learning

## Assets
- [ ] Design references (`assets/inspo/`) never arrived. I worked from your written description.
