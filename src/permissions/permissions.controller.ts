import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { UserRole } from 'src/enum/user-role.enum';


@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService){}

  
  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard,RolesGuard)
  create(@Body() createPermissionDto:CreatePermissionDto){
    return this.permissionsService.create(createPermissionDto);
  }

    @Get()
     @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard,RolesGuard)
    findAll(){
        return this.permissionsService.findAll();
    }
}