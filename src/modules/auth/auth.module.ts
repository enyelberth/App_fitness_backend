import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CommonModule } from '../../common/common.module';

// Controllers
// import { AuthController } from './controllers/auth.controller';

// Services
// import { AuthService } from './services/auth.service';

// Strategies
// import { JwtStrategy } from './strategies/jwt.strategy';
// import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    CommonModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [
    // AuthController,
  ],
  providers: [
    // AuthService,
    // JwtStrategy,
    // LocalStrategy,
  ],
  exports: [
    // AuthService,
  ],
})
export class AuthModule {}
