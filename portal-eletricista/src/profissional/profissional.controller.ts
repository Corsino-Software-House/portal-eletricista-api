import {
  Controller,
  Post,
  Body,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
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
  
  @Put('complete-profile')
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async completeProfile(
    @Body() body: { id: number; bio: string },
    @UploadedFile() foto: Express.Multer.File,
  ) {
    const fotoUrl = `http://localhost:3000/uploads/${foto.filename}`;
    return this.service.completeProfile({
      id: body.id,
      bio: body.bio,
      fotoUrl,
    });
  }
}
