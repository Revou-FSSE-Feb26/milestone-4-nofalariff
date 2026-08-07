import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// income menambah saldo; expense/transfer mengurangi saldo akun sumber
function signedAmount(
  type: 'income' | 'expense' | 'transfer',
  amount: number,
): number {
  return type === 'income' ? amount : -amount;
}

async function main() {
  console.log('Membersihkan data lama...');
  // urutan delete penting karena FK: transaction -> account/category -> user
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding users...');
  const budi = await prisma.user.create({
    data: {
      name: 'Budi Santoso',
      email: 'budi@example.com',
      password: 'password123',
    },
  });
  const siti = await prisma.user.create({
    data: {
      name: 'Siti Aminah',
      email: 'siti@example.com',
      password: 'password123',
    },
  });
  const andi = await prisma.user.create({
    data: {
      name: 'Andi Wijaya',
      email: 'andi@example.com',
      password: 'password123',
    },
  });

  console.log('Seeding categories...');
  const salary = await prisma.category.create({
    data: { name: 'Salary', type: 'income' },
  });
  const freelance = await prisma.category.create({
    data: { name: 'Freelance', type: 'income' },
  });
  const food = await prisma.category.create({
    data: { name: 'Food', type: 'expense' },
  });
  const transport = await prisma.category.create({
    data: { name: 'Transport', type: 'expense' },
  });
  const shopping = await prisma.category.create({
    data: { name: 'Shopping', type: 'expense' },
  });
  // sengaja tidak dipakai transaksi apapun -> data uji untuk LEFT JOIN "kategori kosong"
  await prisma.category.create({
    data: { name: 'Entertainment', type: 'expense' },
  });

  console.log('Seeding accounts...');
  const budiBank = await prisma.account.create({
    data: { user_id: budi.id, name: 'BCA Utama', type: 'bank', balance: 0 },
  });
  const budiCash = await prisma.account.create({
    data: { user_id: budi.id, name: 'Dompet Tunai', type: 'cash', balance: 0 },
  });
  const sitiBank = await prisma.account.create({
    data: { user_id: siti.id, name: 'Mandiri Utama', type: 'bank', balance: 0 },
  });
  const sitiEwallet = await prisma.account.create({
    data: { user_id: siti.id, name: 'GoPay', type: 'ewallet', balance: 0 },
  });
  const andiBank = await prisma.account.create({
    data: { user_id: andi.id, name: 'BNI Utama', type: 'bank', balance: 0 },
  });
  const andiCash = await prisma.account.create({
    data: { user_id: andi.id, name: 'Dompet Tunai', type: 'cash', balance: 0 },
  });

  console.log('Seeding transactions...');
  const transactionsData = [
    // Budi
    {
      account: budiBank,
      category: salary,
      type: 'income' as const,
      amount: 8000000,
      description: 'Gaji bulan Mei',
      date: '2026-05-01',
    },
    {
      account: budiBank,
      category: food,
      type: 'expense' as const,
      amount: 150000,
      description: 'Makan siang tim',
      date: '2026-05-03',
    },
    {
      account: budiBank,
      category: transport,
      type: 'expense' as const,
      amount: 100000,
      description: 'Bensin',
      date: '2026-05-10',
    },
    {
      account: budiCash,
      category: food,
      type: 'expense' as const,
      amount: 50000,
      description: 'Warung makan',
      date: '2026-05-04',
    },
    {
      account: budiCash,
      category: shopping,
      type: 'expense' as const,
      amount: 200000,
      description: 'Beli baju',
      date: '2026-05-15',
    },
    {
      account: budiBank,
      category: freelance,
      type: 'income' as const,
      amount: 1500000,
      description: 'Proyek desain',
      date: '2026-06-02',
    },
    {
      account: budiBank,
      category: food,
      type: 'expense' as const,
      amount: 175000,
      description: 'Makan malam',
      date: '2026-06-05',
    },
    {
      account: budiCash,
      category: transport,
      type: 'expense' as const,
      amount: 30000,
      description: 'Ojek online',
      date: '2026-06-08',
    },

    // Siti
    {
      account: sitiBank,
      category: salary,
      type: 'income' as const,
      amount: 7500000,
      description: 'Gaji bulan Mei',
      date: '2026-05-01',
    },
    {
      account: sitiBank,
      category: shopping,
      type: 'expense' as const,
      amount: 300000,
      description: 'Belanja bulanan',
      date: '2026-05-12',
    },
    {
      account: sitiEwallet,
      category: food,
      type: 'expense' as const,
      amount: 80000,
      description: 'Kopi & snack',
      date: '2026-05-06',
    },
    {
      account: sitiEwallet,
      category: transport,
      type: 'expense' as const,
      amount: 40000,
      description: 'Ojek online',
      date: '2026-05-20',
    },
    {
      account: sitiBank,
      category: food,
      type: 'expense' as const,
      amount: 120000,
      description: 'Makan siang',
      date: '2026-06-03',
    },
    {
      account: sitiEwallet,
      category: freelance,
      type: 'income' as const,
      amount: 900000,
      description: 'Jual barang bekas',
      date: '2026-06-10',
    },
    {
      account: sitiBank,
      category: transport,
      type: 'expense' as const,
      amount: 60000,
      description: 'Bensin',
      date: '2026-06-15',
    },
    {
      account: sitiEwallet,
      category: shopping,
      type: 'expense' as const,
      amount: 250000,
      description: 'Belanja online',
      date: '2026-06-18',
    },

    // Andi
    {
      account: andiBank,
      category: salary,
      type: 'income' as const,
      amount: 9000000,
      description: 'Gaji bulan Mei',
      date: '2026-05-01',
    },
    {
      account: andiBank,
      category: food,
      type: 'expense' as const,
      amount: 200000,
      description: 'Makan bersama keluarga',
      date: '2026-05-07',
    },
    {
      account: andiCash,
      category: transport,
      type: 'expense' as const,
      amount: 70000,
      description: 'Parkir & bensin',
      date: '2026-05-11',
    },
    {
      account: andiCash,
      category: shopping,
      type: 'expense' as const,
      amount: 150000,
      description: 'Beli sepatu',
      date: '2026-05-25',
    },
    {
      account: andiBank,
      category: food,
      type: 'expense' as const,
      amount: 180000,
      description: 'Makan malam',
      date: '2026-06-04',
    },
    {
      account: andiBank,
      category: freelance,
      type: 'income' as const,
      amount: 1200000,
      description: 'Konsultasi',
      date: '2026-06-12',
    },
    {
      account: andiCash,
      category: transport,
      type: 'expense' as const,
      amount: 45000,
      description: 'Ojek online',
      date: '2026-06-20',
    },
    {
      account: andiBank,
      category: shopping,
      type: 'expense' as const,
      amount: 320000,
      description: 'Belanja gadget',
      date: '2026-06-25',
    },
  ];

  // akumulasi saldo per akun sambil insert transaksi satu per satu
  const balanceDelta = new Map<number, number>();

  for (const t of transactionsData) {
    await prisma.transaction.create({
      data: {
        account_id: t.account.id,
        category_id: t.category.id,
        type: t.type,
        amount: t.amount,
        description: t.description,
        transaction_date: new Date(t.date),
      },
    });

    const current = balanceDelta.get(t.account.id) ?? 0;
    balanceDelta.set(t.account.id, current + signedAmount(t.type, t.amount));
  }

  console.log('Menghitung ulang saldo akun berdasarkan transaksi...');
  for (const [accountId, delta] of balanceDelta) {
    await prisma.account.update({
      where: { id: accountId },
      data: { balance: delta },
    });
  }

  console.log(
    `Seed selesai: 3 users, 6 accounts, 6 categories, ${transactionsData.length} transactions.`,
  );
}

main()
  .catch((e) => {
    console.error('Seed gagal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
