import { Injectable, ConflictException, InternalServerErrorException} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OnboardCompanyDto } from './dto/onboard-company.dto';
import { Prisma, Role} from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OnboardingService {
  constructor(private prisma: PrismaService) {}

  async onboard(dto: OnboardCompanyDto) {
    const { companyName, subdomain, adminEmail, adminPassword, adminName } = dto;
    await this.checkForConflicts(subdomain, adminEmail);
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    try {
      const result = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const tenant = await tx.tenant.create({
          data: { 
            name: companyName,
            subdomain: subdomain
           },
        });

        const admin = await tx.user.create({
          data: {
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: Role.SUPER_ADMIN,
            tenantId: tenant.id,
          },
        });

        return {
          tenant,
          admin
        };
      });

      return this.buildResponse(result.tenant, result.admin);
      
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Company name or Email already exists');
        
      }
      throw new InternalServerErrorException('An error occurred during onboarding');
    }
  }
  
    private async checkForConflicts(subdomain: string, email: string): Promise<void> {
    const [existingTenant, existingUser] = await Promise.all([
      this.prisma.client.tenant.findUnique({ where: { subdomain } }),
      this.prisma.client.user.findFirst({ where: { email } }),
    ]);
    
    if (existingTenant) {
      throw new ConflictException('A company with this subdomain already exists');
    }

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }
  }

  private buildResponse(tenant: any, admin: any) {
    return {
      message: 'Company registered successfully',
      company: {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        createdAt: tenant.createdAt,
      },
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }
}


