import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { FunctionalArea } from "../../global/app.enum";

export class CreateRoleDto {

    @ApiProperty()
    readonly name: string;
    readonly description?: string;
    readonly functionalArea?: FunctionalArea;
}
