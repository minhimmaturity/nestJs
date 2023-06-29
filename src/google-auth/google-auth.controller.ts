import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthService } from './google-auth.service';

@Controller('google-auth')
export class GoogleAuthController {
    constructor(private readonly GoogleAuthService: GoogleAuthService) {}

    @Get()
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}

    // @Get('auth/login')
    // @UseGuards(AuthGuard('google'))
    // googleAuthRedirect(@Req() req) {
    // return this.GoogleAuthService.googleLogin(req)
    // }
}
