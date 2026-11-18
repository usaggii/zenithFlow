import { IsEmail, IsString, MinLength, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// onboarding company is the same as tenant, so we can reuse the same dto for both onboarding and tenant creation.
export class OnboardCompanyDto {
  @ApiProperty({ example: 'Vicmie Corp' })
  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @ApiProperty({ example: 'vicmie' })
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'subdomain can only contain lowercase letters, numbers, and hyphens',
  })
  @IsNotEmpty()
  subdomain!: string; 

  @ApiProperty({ example: 'admin@vicmie.com' })
  @IsEmail()
  adminEmail!: string;
  

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString()
  @MinLength(8)
  adminPassword!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  adminName!: string;
}


