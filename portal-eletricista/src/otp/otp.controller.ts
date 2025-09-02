import { Controller, Post, Body } from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private otpService: OtpService) {}

  @Post('send')
  async sendOtp(@Body('email') email: string) {
    return this.otpService.sendOtp(email);
  }

  @Post('validate')
  async validateOtp(
    @Body('email') email: string,
    @Body('code') code: string,
  ) {
    return this.otpService.validateOtp(email, code);
  }
}
