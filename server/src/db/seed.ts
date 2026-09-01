import pg from 'pg';
import bcrypt from 'bcryptjs';
import { getPool, initSchema, closePool } from './index.js';

export async function seedDatabase(pool?: pg.Pool): Promise<void> {
  const activePool = pool || getPool();

  // Check if users already exist
  const checkResult = await activePool.query('SELECT COUNT(*) as count FROM users');
  const count = parseInt(checkResult.rows[0].count, 10);

  if (count > 0) {
    console.log(`[C-137 SEED] Database already contains ${count} user(s). Skipping automatic seed.`);
    return;
  }

  console.log('[C-137 SEED] Database is empty. Seeding rich universe data with varied dates and categories...');

  // Hash passwords
  const passwordHash = await bcrypt.hash('portal_gun_password_123', 12);
  const standardPasswordHash = await bcrypt.hash('password123', 12);

  // Helper for dates relative to now
  const nowMs = Date.now();
  const dayMs = 86400000;
  const relDate = (daysOffset: number, hour = 14) => {
    const d = new Date(nowMs + daysOffset * dayMs);
    d.setHours(hour, 0, 0, 0);
    return d.toISOString();
  };

  // 1. Create Users
  const usersData = [
    { email: 'rick@c137.universe', name: 'Rick Sanchez', hash: passwordHash },
    { email: 'summer@c137.universe', name: 'Summer Smith', hash: standardPasswordHash },
    { email: 'morty@c137.universe', name: 'Morty Smith', hash: standardPasswordHash },
    { email: 'beth@c137.universe', name: 'Dr. Beth Smith', hash: standardPasswordHash },
  ];

  const userIds: Record<string, string> = {};

  for (const u of usersData) {
    const res = await activePool.query(
      `INSERT INTO users (email, name, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email`,
      [u.email, u.name, u.hash]
    );
    userIds[u.email] = res.rows[0].id;
  }

  // 2. Tasks for Rick Sanchez
  const rickTasks = [
    {
      title: 'Calibrate interdimensional portal gun',
      description: 'Synthesize concentrated dark matter and re-align quantum particle mirrors.',
      priority: 'urgent',
      category: 'science',
      completed: false,
      dueDate: relDate(1, 10), // Tomorrow
    },
    {
      title: 'Refuel flying car with crystallised isotope 322',
      description: 'Collect minerals from Asteroid Belt sector 7-G and clean plasma injectors.',
      priority: 'high',
      category: 'maintenance',
      completed: false,
      dueDate: relDate(3, 16), // In 3 days
    },
    {
      title: 'Debug microverse battery voltage drop',
      description: 'Investigate Zeep Xanflorp miniverse energy diversion in sector 4.',
      priority: 'urgent',
      category: 'research',
      completed: false,
      dueDate: relDate(-1, 18), // Overdue by 1 day
    },
    {
      title: 'Synthesize mega-tree seeds extract',
      description: 'Harvest rare seeds from Dimension 35-C for high-density neural experiments.',
      priority: 'medium',
      category: 'science',
      completed: true,
      dueDate: relDate(-4, 11), // Completed 4 days ago
    },
    {
      title: 'Clean garage lab workbench',
      description: 'Dispose of defective clone remnants and radioactive chemical spill in containment unit.',
      priority: 'low',
      category: 'maintenance',
      completed: true,
      dueDate: relDate(-10, 9), // Completed 10 days ago
    },
    {
      title: 'Implement dimensional firewall against Citadel surveillance',
      description: 'Encrypt subnet gateway tokens and rotate quantum encryption keys.',
      priority: 'high',
      category: 'security',
      completed: false,
      dueDate: relDate(7, 12), // In 7 days
    },
    {
      title: 'Build automated butter-passing robot v2',
      description: 'Upgrade servo motors and implement existential query handler.',
      priority: 'low',
      category: 'robotics',
      completed: false,
      dueDate: relDate(14, 15), // In 2 weeks
    },
    {
      title: 'Order replacement plumbus parts',
      description: 'Stock up on dinglebop and fleeb juice before galactic supply chain disruption.',
      priority: 'medium',
      category: 'inventory',
      completed: true,
      dueDate: relDate(-2, 17),
    },
  ];

  for (const t of rickTasks) {
    await activePool.query(
      `INSERT INTO tasks (user_id, title, description, priority, category, completed, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userIds['rick@c137.universe'], t.title, t.description, t.priority, t.category, t.completed, t.dueDate]
    );
  }

  // 3. Tasks for Summer Smith
  const summerTasks = [
    {
      title: 'Practice interdimensional laser archery',
      description: 'Calibrate target practice holo-drones in the backyard.',
      priority: 'urgent',
      category: 'combat',
      completed: false,
      dueDate: relDate(2, 18),
    },
    {
      title: 'Plan post-apocalyptic survivor strategy',
      description: 'Coordinate alliance pacts with Hemorrhage on Dimension C-137B.',
      priority: 'high',
      category: 'adventure',
      completed: false,
      dueDate: relDate(4, 20),
    },
    {
      title: 'Borrow Rick invisibility belt for high school prank',
      description: 'Make sure the cloaking frequency matches standard visible spectrum.',
      priority: 'medium',
      category: 'personal',
      completed: false,
      dueDate: relDate(8, 14),
    },
    {
      title: 'Help Beth at veterinary clinic surgery ward',
      description: 'Prepare sterile surgical trays and record equine patient logs.',
      priority: 'low',
      category: 'clinic',
      completed: true,
      dueDate: relDate(-3, 16),
    },
    {
      title: 'Study galactic sociology exam',
      description: 'Review chapters on Gazorpazorpian matriarchal culture.',
      priority: 'high',
      category: 'school',
      completed: false,
      dueDate: relDate(0, 18),
    },
    {
      title: 'Tune interdimensional cable receiver',
      description: 'Scan new reality channels from Galaxy Sector 12.',
      priority: 'low',
      category: 'entertainment',
      completed: true,
      dueDate: relDate(-8, 12),
    },
  ];

  for (const t of summerTasks) {
    await activePool.query(
      `INSERT INTO tasks (user_id, title, description, priority, category, completed, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userIds['summer@c137.universe'], t.title, t.description, t.priority, t.category, t.completed, t.dueDate]
    );
  }

  // 4. Tasks for Morty Smith
  const mortyTasks = [
    {
      title: 'Finish history homework essay',
      description: 'Write 3 pages on the American Revolution before Monday morning class.',
      priority: 'urgent',
      category: 'school',
      completed: false,
      dueDate: relDate(1, 8),
    },
    {
      title: 'Feed Jessica’s dog over the weekend',
      description: 'Make sure to follow the feeding instructions on the kitchen counter.',
      priority: 'high',
      category: 'personal',
      completed: false,
      dueDate: relDate(3, 12),
    },
    {
      title: 'Help Rick carry quantum isotope crates',
      description: 'Wear the heavy lead gloves and do not drop the glowing vials.',
      priority: 'medium',
      category: 'science',
      completed: true,
      dueDate: relDate(-2, 16),
    },
    {
      title: 'Practice math fractions and algebra equations',
      description: 'Study chapter 4 math problems with Summer.',
      priority: 'low',
      category: 'school',
      completed: false,
      dueDate: relDate(5, 17),
    },
  ];

  for (const t of mortyTasks) {
    await activePool.query(
      `INSERT INTO tasks (user_id, title, description, priority, category, completed, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userIds['morty@c137.universe'], t.title, t.description, t.priority, t.category, t.completed, t.dueDate]
    );
  }

  // 5. Tasks for Dr. Beth Smith
  const bethTasks = [
    {
      title: 'Equine cardiac bypass surgery preparation',
      description: 'Review echocardiogram charts for champion stallion surgery at 8 AM.',
      priority: 'urgent',
      category: 'surgery',
      completed: false,
      dueDate: relDate(0, 8), // Today 8am
    },
    {
      title: 'Order veterinary surgical anesthesia supplies',
      description: 'Restock isoflurane and sterile surgical blade sets.',
      priority: 'high',
      category: 'clinic',
      completed: true,
      dueDate: relDate(-5, 14),
    },
    {
      title: 'Weekly veterinary clinic staff meeting',
      description: 'Coordinate surgical schedule and emergency on-call rotations.',
      priority: 'medium',
      category: 'management',
      completed: false,
      dueDate: relDate(4, 9),
    },
  ];

  for (const t of bethTasks) {
    await activePool.query(
      `INSERT INTO tasks (user_id, title, description, priority, category, completed, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userIds['beth@c137.universe'], t.title, t.description, t.priority, t.category, t.completed, t.dueDate]
    );
  }

  const totalTasks = rickTasks.length + summerTasks.length + mortyTasks.length + bethTasks.length;
  console.log(`[C-137 SEED] Seeding successfully completed: 4 users, ${totalTasks} tasks across varied dates & categories.`);
}

// Standalone execution
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  (async () => {
    try {
      const pool = getPool();
      await initSchema(pool);
      await seedDatabase(pool);
      await closePool();
      process.exit(0);
    } catch (err) {
      console.error('[C-137 SEED ERROR]', err);
      process.exit(1);
    }
  })();
}
