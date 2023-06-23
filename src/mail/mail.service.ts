import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User) {
    const confirmKey = randomBytes(6).toString('hex');
    const url = `http://localhost:4000/user/reset-password/${confirmKey}`;
    await this.mailerService.sendMail({
      to: user.email,
    
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation', 
      context: {
        name: user.name,
        url,
      },
    });
  }
}
