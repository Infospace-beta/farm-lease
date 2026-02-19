import { promises as fs } from 'fs';
import path from 'path';

const root = path.join(__dirname, '../src/app/(main)');

const structure = {
  admin: [
    'agreements',
    'analytics',
    'dashboard',
    'dealer-oversight',
    'land-verifications',
    'payments',
    'profile',
    'users',
    'users/list',
  ],
  dealer: [
    'analytics',
    'dashboard',
    'inventory',
    'notifications',
    'orders',
    'products',
    'products/add',
    'profile',
    'queries',
    'transactions',
    'trends',
  ],
  lessee: [
    'ai-predictor',
    'ai-predictor/history',
    'browse',
    'browse/find',
    'compare',
    'dashboard',
    'financials',
    'land-detail',
    'leases',
    'notifications',
    'shop',
  ],
  owner: [
    'agreements',
    'dashboard',
    'escrow',
    'financials',
    'lands',
    'lands/add',
    'lease-requests',
    'profile',
  ],
};

const mainFolders = Object.keys(structure);

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function ensureFile(file: string, content = '') {
  try {
    await fs.writeFile(file, content, { flag: 'wx' });
  } catch (e: any) {
    if (e.code !== 'EEXIST') throw e;
  }
}

async function createStructure() {
  // (main) root layout
  await ensureFile(path.join(root, 'layout.tsx'), "export default function MainLayout({ children }: { children: React.ReactNode }) {\n  return <main>{children}</main>;\n}\n");

  for (const main of mainFolders) {
    const mainPath = path.join(root, main);
    await ensureDir(mainPath);
    await ensureFile(path.join(mainPath, 'layout.tsx'), `export default function ${capitalize(main)}Layout({ children }: {{ children: React.ReactNode }}) {\n  return <section>{children}</section>;\n}\n`);
    await ensureFile(path.join(mainPath, 'page.tsx'), `export default function ${capitalize(main)}Page() {\n  return <div>${capitalize(main)} Page</div>;\n}\n`);
    for (const sub of structure[main as keyof typeof structure]) {
      const subPath = path.join(mainPath, sub);
      await ensureDir(subPath);
      await ensureFile(path.join(subPath, 'page.tsx'), `export default function ${capitalize(sub.replace(/\//g, ' '))}Page() {\n  return <div>${capitalize(sub.replace(/\//g, ' '))} Page</div>;\n}\n`);
    }
  }
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

createStructure().then(() => console.log('Structure created!')).catch(console.error);
