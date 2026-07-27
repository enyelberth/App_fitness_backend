import { Injectable, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto, LoginDto, AuthResponseDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto } from './dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, username, password } = registerDto;

    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      throw new ConflictException('Email o username ya existe');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        profile: {
          create: {},
        },
      },
    });

    // Retornar tokens (email auto-verificado en MVP)
    return this.generateTokens(user.id, user.email, user.username);
  }

  async generateVerificationToken(email: string): Promise<{ verificationToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const verificationToken = this.jwtService.sign(
      { sub: user.id, type: 'email-verification' },
      { expiresIn: '24h', secret: this.configService.get('JWT_SECRET') }
    );

    console.log(`Verification token for ${email}: ${verificationToken}`);
    return { verificationToken };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{ message: string }> {
    try {
      const payload = this.jwtService.verify(verifyEmailDto.verificationToken, {
        secret: this.configService.get('JWT_SECRET'),
      });

      if (payload.type !== 'email-verification') {
        throw new UnauthorizedException('Token de verificación inválido');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.deletedAt) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerifiedAt: new Date() },
      });

      return { message: 'Email verificado correctamente' };
    } catch (error) {
      throw new UnauthorizedException('Token de verificación inválido o expirado');
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.generateTokens(user.id, user.email, user.username);
  }

  async validateJwt(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.deletedAt) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      return this.generateTokens(user.id, user.email, user.username);
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: forgotPasswordDto.email },
    });

    if (!user || user.deletedAt) {
      // No revelar si el usuario existe o no por seguridad
      return { message: 'Si el email existe, recibirá un link de reset' };
    }

    const resetToken = this.jwtService.sign(
      { sub: user.id, type: 'password-reset' },
      { expiresIn: '15m', secret: this.configService.get('JWT_SECRET') }
    );

    // En producción: enviar email con resetToken
    // Por ahora solo retornar token (para testing)
    console.log(`Reset token for ${user.email}: ${resetToken}`);

    return { message: 'Si el email existe, recibirá un link de reset' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    try {
      const payload = this.jwtService.verify(resetPasswordDto.resetToken, {
        secret: this.configService.get('JWT_SECRET'),
      });

      if (payload.type !== 'password-reset') {
        throw new UnauthorizedException('Token de reset inválido');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.deletedAt) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const passwordHash = await bcrypt.hash(resetPasswordDto.newPassword, 10);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      });

      return { message: 'Contraseña actualizada correctamente' };
    } catch (error) {
      throw new UnauthorizedException('Token de reset inválido o expirado');
    }
  }

  private generateTokens(
    userId: string,
    email: string,
    username: string,
  ): AuthResponseDto {
    const accessToken = this.jwtService.sign({
      sub: userId,
      email,
      username,
    });

    const refreshToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: '7d' },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: userId,
        email,
        username,
      },
    };
  }
}
