import {
  Controller,
  Post,
  Body,
  Put,
  UploadedFile,
  UseInterceptors,
  Get,
  Query,
  Req,
  Param
} from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProfissionalService } from './profissional.service';

@Controller('profissional')
export class ProfissionalController {
  constructor(private service: ProfissionalService) {}

  @Post('register')
  register(
    @Body()
    data: {
      nome: string;
      email: string;
      senha: string;
      cidade: string;
      bairro: string;
    },
  ) {
    return this.service.register(data);
  }

  @Get('see-all')
  seeAll() {
    return this.service.seeAll();
  }

  
@Get('/top-avaliados')
  getTopAvaliados() {
    return this.service.findTopAvaliados();
  }

  @Get('/:id')
findById(@Param('id') id: number) {
  return this.service.findById(Number(id));
}
  
@Put('complete-profile')
@UseInterceptors(
  FileInterceptor('foto', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
async completeProfile(
  @Body() body: { id: number; bio: string,telefone: string, especialidade: string },
  @UploadedFile() foto: Express.Multer.File,
  @Req() req: Request, // ✅ Aqui com tipo do express
) {
  const fotoUrl = `${req.protocol}://${req.get('host')}/uploads/${foto.filename}`;

  return this.service.completeProfile({
    id: body.id,
    bio: body.bio,
    fotoUrl,
    telefone: body.telefone,
    especialidade: body.especialidade,
  });
}

@Get('account/:email')
getAccount(@Param('email') email: string) {
  return this.service.findByEmail(email);
}

  @Put('edit-profile')
@UseInterceptors(
  FileInterceptor('foto', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
async editProfile(
  @Body() body: { id: number; nome?: string; email:string, telefone?: string,bio ?: string },
  @Req() req: Request,
  @UploadedFile() foto?: Express.Multer.File,
) {
  const fotoUrl = foto
    ? `${req.protocol}://${req.get('host')}/uploads/${foto.filename}`
    : undefined;

  return this.service.updateProfile({
    id: body.id,
    nome: body.nome,
    email: body.email,
    telefone: body.telefone,
    fotoUrl,
    bio: body.bio,
  });
}

@Put('change-password')
async changePassword(@Body() body: { id: number; senhaAtual: string; novaSenha: string }) {
  return this.service.changePassword(body);
}

@Get('total')
async countProfissionais() {
  return this.service.contarProfissionais();
}

}
