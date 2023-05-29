import { Injectable, Res } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class UserService {
    getUser(@Res() res: Response): void {
        const message = { message: 'Nani!' };
        res.json(message);
    }
}