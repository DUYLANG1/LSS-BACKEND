import { PrismaService } from '../prisma/prisma.service';

export abstract class BaseService {
  constructor(protected prisma: PrismaService) {}

  protected async softDelete(model: string, id: string) {
    return this.prisma[model].update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });
  }

  protected defaultFindManyOptions = {
    where: {
      isActive: true,
      deletedAt: null,
    },
  };
}
