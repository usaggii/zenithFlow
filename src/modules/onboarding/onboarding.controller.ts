import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OnboardingService } from './onboarding.service';
import { OnboardCompanyDto } from './dto/onboard-company.dto';

@ApiTags('Onboarding')
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new company and SUPER_ADMIN account' })
  @ApiResponse({ status: 201, description: 'Company registered successfully' })
  @ApiResponse({ status: 409, description: 'Subdomain or email already exists' })
  async onboard(@Body() dto: OnboardCompanyDto) {
    return this.onboardingService.onboard(dto);
  }
}
