// database.service.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from './auth.entity';
import { AuthDto } from './auth.dto';
import { log } from 'console';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthEntity) private databaseRepository: Repository<AuthEntity>,) {}
        private readonly jwtService: JwtService
    findAll(): any{
        return this.databaseRepository.find();
    }
    
    addOne(database: AuthDto): Promise<AuthEntity> {
        return this.databaseRepository.save(database);
    }

    async findUserPass(database: AuthDto)  {
        const result = await this.databaseRepository.find({ 
          where: { 
            username: database.username, 
            password: database.password
          } 
        });
        console.log(result.length);
        return ({result: result.length > 0, token: this.jwtService.sign({username:database.username})});
      }
}

