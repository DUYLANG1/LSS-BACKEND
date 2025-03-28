import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Check if any data exists
  const existingUsers = await prisma.user.findMany();
  if (existingUsers.length > 0) {
    console.log('Data already exists, skipping seeding');
    return;
  }

  // User data
  const user1 = await prisma.user.create({ data: { name: 'Alice', email: 'alice@example.com', password: 'password' } });
  const user2 = await prisma.user.create({ data: { name: 'Bob', email: 'bob@example.com', password: 'password' } });
  const user3 = await prisma.user.create({ data: { name: 'Charlie', email: 'charlie@example.com', password: 'password' } });
  const user4 = await prisma.user.create({ data: { name: 'Diana', email: 'diana@example.com', password: 'password' } });
  const user5 = await prisma.user.create({ data: { name: 'Eve', email: 'eve@example.com', password: 'password' } });

  // Category data
  await prisma.category.createMany({
    data: [
      { name: 'Programming', description: 'Software development and coding' },
      { name: 'Design', description: 'Graphic and UI/UX design' },
      { name: 'Writing', description: 'Content creation and copywriting' },
      { name: 'Marketing', description: 'Digital marketing and advertising' },
      { name: 'Photography', description: 'Photo editing and shooting' }
    ]
  });

  // Skill data
  await prisma.skill.createMany({
    data: [
      { title: 'JavaScript', categoryId: 1, description: 'A programming language for building web applications', userId: user1.id },
      { title: 'React', categoryId: 2, description: 'A JavaScript library for building user interfaces', userId: user2.id },
      { title: 'Figma', categoryId: 3, description: 'A vector graphics editor and prototyping tool', userId: user3.id },
      { title: 'Copywriting', categoryId: 4, description: 'Creating engaging and effective copy for marketing and content', userId: user4.id },
      { title: 'SEO', categoryId: 5, description: 'Optimizing websites for search engines', userId: user5.id }
    ]
  });

  // Exchange data
  const request1 = await prisma.exchangeRequest.create({
    data: {
      fromUserId: user1.id,
      toUserId: user2.id,
      offeredSkillId: (await prisma.skill.findFirst({ where: { title: 'JavaScript' } }))?.id || '1',
      requestedSkillId: (await prisma.skill.findFirst({ where: { title: 'React' } }))?.id || '2'
    }
  });
  await prisma.exchange.create({
    data: {
      requestId: request1.id
    }
  });

  const request2 = await prisma.exchangeRequest.create({
    data: {
      fromUserId: user2.id,
      toUserId: user3.id,
      offeredSkillId: (await prisma.skill.findFirst({ where: { title: 'React' } }))?.id || '2',
      requestedSkillId: (await prisma.skill.findFirst({ where: { title: 'Figma' } }))?.id || '3'
    }
  });
  await prisma.exchange.create({
    data: {
      requestId: request2.id
    }
  });

  const request3 = await prisma.exchangeRequest.create({
    data: {
      fromUserId: user3.id,
      toUserId: user4.id,
      offeredSkillId: (await prisma.skill.findFirst({ where: { title: 'Figma' } }))?.id || '3',
      requestedSkillId: (await prisma.skill.findFirst({ where: { title: 'Copywriting' } }))?.id || '4'
    }
  });
  await prisma.exchange.create({
    data: {
      requestId: request3.id
    }
  });

  const request4 = await prisma.exchangeRequest.create({
    data: {
      fromUserId: user4.id,
      toUserId: user5.id,
      offeredSkillId: (await prisma.skill.findFirst({ where: { title: 'Copywriting' } }))?.id || '4',
      requestedSkillId: (await prisma.skill.findFirst({ where: { title: 'SEO' } }))?.id || '5'
    }
  });
  await prisma.exchange.create({
    data: {
      requestId: request4.id
    }
  });

  const request5 = await prisma.exchangeRequest.create({
    data: {
      fromUserId: user5.id,
      toUserId: user1.id,
      offeredSkillId: (await prisma.skill.findFirst({ where: { title: 'SEO' } }))?.id || '5',
      requestedSkillId: (await prisma.skill.findFirst({ where: { title: 'JavaScript' } }))?.id || '1'
    }
  });
  await prisma.exchange.create({
    data: {
      requestId: request5.id
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
