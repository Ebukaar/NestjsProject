import { FunctionalArea } from "../../global/app.enum";

export class CreateRoleDto {

    readonly name: string;
    readonly description?: string;
    readonly functionalArea?: FunctionalArea;
}
