import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding multi-tenant database...');

  // 1. Clean out existing data to prevent duplicate unique key errors
  await prisma.user.deleteMany({});
  await prisma.tenant.deleteMany({});

  // 2. Create a Mock Tenant Workspace
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Zenith Labs',
      subdomain: 'zenith-labs'
    },
  });
  console.log(`Created Tenant: ${tenant.name} (${tenant.id})`);

  // 3. Hash a test password securely
  const hashedPassword = await bcrypt.hash('SecretPass123!', 10);

  // 4. Create a Test Admin User linked directly to that Tenant
  const user = await prisma.user.create({
    data: {
      email: 'admin@zenithlabs.com',
      name: 'Admin',
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      tenantId: tenant.id, // Links user directly to the workspace
    },
  });
  console.log(`Created Admin User: ${user.email}`);

  console.log('Seeding complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
