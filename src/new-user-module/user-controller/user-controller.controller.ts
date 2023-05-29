import { Controller, Res } from '@nestjs/common';
import { UserService } from '../user-service/user-service';
import { Get } from '@nestjs/common';
import {Response } from 'express';

@Controller('user-controller')
export class UserControllerController {
    constructor(private readonly userService: UserService) {}
    @Get()
    getUser(@Res() res: Response): void {
        const message = { message: 'Amen!' };
        res.json(message);
    }
}
