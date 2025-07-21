import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService){}

    async register(data: { nome: string; email: string; senha: string }) {
        const hashed = await bcrypt.hash(data.senha, 10);
        return this.prisma.admin.create({
            data: { ...data, senha: hashed },
        });
    }
    async findByEmail(email: string) {
    return this.prisma.admin.findUnique({ where: { email } });
  }
}
