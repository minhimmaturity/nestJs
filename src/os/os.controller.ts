import { Controller, Delete, HttpException, HttpStatus, Param } from '@nestjs/common';
import { OsService } from './os.service';

@Controller('os')
export class OsController {
    constructor(
        private readonly OsService: OsService
    ) {}
    
    @Delete(':id')
    async delete(@Param() id: number) {
        if(await this.OsService.delete(id)) {
            return {
                message: "remove successfully"
            }
        } else {
            throw new HttpException("remove failed", HttpStatus.FAILED_DEPENDENCY)
        }
    }
}
