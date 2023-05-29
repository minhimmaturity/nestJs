import { Controller, Res, Get, Post, Req } from '@nestjs/common';
import { UserService } from '../user-service/user-service';
import { UserEntity } from 'src/new-user-module/user/UserEntity';
import * as bcrypt from 'bcrypt';

@Controller('user-controller')
export class UserControllerController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  async create(@Req() req, @Res() res): Promise<void> {
    const saltOrRounds = 10;
    const User = new UserEntity();
    User.name = req.body.name;
    User.role = req.body.role;
    const password = req.body.password;
    const hash = await bcrypt.hash(password, saltOrRounds);
    User.password = hash;
    if (await this.userService.save(User)) {
      res.status(201).json({ message: 'User created successfully.' });
    } else {
      res.status(400).json({ message: 'Add failed!' });
    }
  }

  @Get()
  async getUser(@Req() req, @Res() res): Promise<void> {
    const User = await this.userService.findAll();
    res.status(201).json(User);
  }

  @Post('/login')
  async login(@Req() req, @Res() res): Promise<void> {
    const username = req.body.name;
    const password = req.body.password;
    const User = await this.userService.findOne(username);
    if (User != null) {
      const storedPassword = User.password;
      const isMatch = await bcrypt.compare(password, storedPassword);
      if (username == User.name && isMatch && User.role == 0) {
        res.status(201).json({ message: 'Admin' });
      } else if (username == User.name && isMatch && User.role == 1) {
        res.status(201).json({ message: 'User' });
      } else {
        res
          .status(404)
          .json({ message: 'Username or password are not correct' });
      }
    }
  }
}
