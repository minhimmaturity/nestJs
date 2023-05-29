import { Controller, Res, Get, Post, Req } from '@nestjs/common';
import { UserService } from '../user-service/user-service';
import { UserEntity } from 'src/new-user-module/user/UserEntity';
import * as bcrypt from 'bcrypt';
import  jwt from 'jsonwebtoken';

@Controller('user-controller')
export class UserControllerController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async create(@Req() req, @Res() res): Promise<void> {
    const saltOrRounds = 10;
    const password = req.body.password;
    if (password.length < 8) {
      res
        .status(401)
        .json({ message: 'Password contains at least 8 characters' });
    } else if (!password.match(/[A-Z]/)) {
      res
        .status(400)
        .json({ message: 'Password must contain at least one uppercase' });
    } else if (!password.match(/[!-@]/)) {
      res.status(400).json({
        message: 'Password must contain at least one special character',
      });
    }

    const name = req.body.name;
    if (name.length == 0) {
      res.status(401).json({ message: 'Please enter valid name' });
    }

    const role = req.body.role;
    if (role.length == 0) {
      res.status(401).json({ message: 'Please enter valid name' });
    }

    try {
      const User = new UserEntity();
      User.name = name;
      User.role = role;
      const hash = await bcrypt.hash(password, saltOrRounds);
      User.password = hash;
      if (await this.userService.save(User)) {
        res.status(201).json({ message: 'User created successfully.' });
      } else {
        res.status(400).json({ message: 'Add failed!' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
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
    if (username.length == 0) {
      res.status(400).json({ message: 'Please enter valid name' });
    }
    const password = req.body.password;
    if (password.length == 0) {
      res.status(400).json({ message: 'Please enter valid password' });
    }

    // try {
      const user = await this.userService.findOneBy({ name: username });

      if (user) {
        const storedPassword = user.password;
        const isMatch = await bcrypt.compare(password, storedPassword);
        if (isMatch) {
          const accessToken = jwt.sign(
            { _id: user.id, name: user.name },
            process.env.JWT_KEY,
            {
              expiresIn: process.env.REFRESH_TOKEN_EXP,
            },
          );
          if (isMatch && user.role === 0) {
            res.status(201).json({ message: 'Admin', token: accessToken });
          } else if (isMatch && user.role === 1) {
            res.status(201).json({ message: 'User', token: accessToken });
          } else {
            res.status(401).json({ message: 'Invalid username or password' });
          }
        } else {
          res.status(401).json({ message: 'Invalid username or password' });
        }
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    // } catch (error) {
    //   res.status(500).json({ message: 'Internal server error' });
    // }
  }
}
