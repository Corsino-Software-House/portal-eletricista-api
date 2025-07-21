import { Controller,Post,Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private service: AdminService) {}
    
    @Post('register')
    register(@Body() data: { nome: string; email: string; senha: string }) {
        return this.service.register(data);
    }
}
