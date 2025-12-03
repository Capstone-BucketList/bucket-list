# 🌱 Seed Data Insertion Instructions

## Quick Reference

You have created: **10 test users** in `backend/seed-profiles-10users.sql`

Now insert them into your PostgreSQL database using ONE of the methods below.

---

## METHOD 1: Using pgAdmin (Easiest for GUI Users)

### Steps:
1. **Open pgAdmin** (usually at http://localhost:5050)
2. **Navigate to:**
   - Left sidebar → Servers → PostgreSQL → Databases → wanderlist
3. **Right-click on `wanderlist` database** → Query Tool
4. **Open the SQL file:**
   - Click the folder icon in the query editor
   - Navigate to: `C:\Users\chaot\OneDrive\Desktop\bootcamp\git\Bucket-List\backend\seed-profiles-10users.sql`
   - Open it
5. **Click Execute** (Play button, or F5)
6. **Success message:** Should see "Query returned successfully with no result"

---

## METHOD 2: Using DBeaver (If you have it)

### Steps:
1. **Open DBeaver**
2. **Connect to your wanderlist database**
3. **File → Open File...**
4. **Select:** `backend/seed-profiles-10users.sql`
5. **Right-click in editor → Execute**
6. **Check the output panel** for success confirmation

---

## METHOD 3: Using Docker (Command Line)

### If PostgreSQL is running in Docker:

```bash
# Navigate to project root
cd C:\Users\chaot\OneDrive\Desktop\bootcamp\git\Bucket-List

# Find your PostgreSQL container name
docker ps | grep postgres

# Run the SQL file (replace 'postgres-container' with actual container name)
docker exec -i postgres-container psql -U postgres -d wanderlist < backend/seed-profiles-10users.sql
```

**Expected output:**
```
INSERT 0 10
(10 rows inserted)
```

---

## METHOD 4: Using Command Line (psql)

### If you have PostgreSQL installed locally:

```bash
psql -h localhost -U postgres -d wanderlist < C:\Users\chaot\OneDrive\Desktop\bootcamp\git\Bucket-List\backend\seed-profiles-10users.sql
```

**When prompted for password:** Enter your PostgreSQL password

---

## VERIFY THE INSERT WORKED

After running the SQL, verify by querying:

### In pgAdmin or DBeaver:
```sql
SELECT COUNT(*) as user_count FROM profile WHERE user_name IN (
    'wanderer_alex', 'urban_explorer', 'trail_blazer', 'beach_bum', 'foodie_travels',
    'photo_nomad', 'culture_seeker', 'budget_backpack', 'nature_lover', 'city_guide'
);
```

**Expected result:** `user_count = 10`

---

## AFTER SUCCESSFUL INSERT

### Step 1: Restart Docker
```bash
docker compose down
docker compose up
```
Wait for backend to fully start (watch logs)

### Step 2: Start Frontend
```bash
cd frontend
npm run dev
```

### Step 3: Test Login
1. Go to http://localhost:5173/login (or your frontend URL)
2. Enter credentials:
   - **Email:** wanderer_alex@wanderlist.dev
   - **Password:** welcome1
3. Should see profile dashboard with user data!

---

## TEST LOGIN CREDENTIALS

Use any of these to test:

| Username | Email | Password |
|----------|-------|----------|
| wanderer_alex | wanderer_alex@wanderlist.dev | welcome1 |
| urban_explorer | urban_explorer@wanderlist.dev | welcome2 |
| trail_blazer | trail_blazer@wanderlist.dev | welcome3 |
| beach_bum | beach_bum@wanderlist.dev | welcome4 |
| foodie_travels | foodie_travels@wanderlist.dev | welcome5 |
| photo_nomad | photo_nomad@wanderlist.dev | welcome6 |
| culture_seeker | culture_seeker@wanderlist.dev | welcome7 |
| budget_backpack | budget_backpack@wanderlist.dev | welcome8 |
| nature_lover | nature_lover@wanderlist.dev | welcome9 |
| city_guide | city_guide@wanderlist.dev | welcome10 |

---

## TROUBLESHOOTING

### Error: "Database wanderlist does not exist"
- Make sure your database is named `wanderlist`
- Check: `docker compose ps` to ensure PostgreSQL is running

### Error: "Connection refused"
- PostgreSQL might not be running
- Run: `docker compose up -d postgres`
- Wait 10 seconds for it to start

### Error: "permission denied"
- Make sure you're using the correct PostgreSQL username (usually `postgres`)
- Check your database credentials in `.env` or `docker-compose.yml`

### Nothing happened after running SQL
- The query might have failed silently
- Run the verification query above to check if users were inserted
- If not in database, try a different method above

---

## WHAT COMES NEXT

Once seed data is in database:

✅ Login with any test user
✅ View user profiles
✅ See users in "Suggested for You"
✅ Create posts as test users
✅ Build wanderlists and albums
✅ Test following features
✅ Populate feed with real data

---

**Need help?** Check which PostgreSQL tool you have access to and use the corresponding METHOD above!
