import { ApiProperty } from "@nestjs/swagger";


export class CreateUserProfileDto {

    
    readonly photo?: string; //photo file location. Use stream to send
    readonly photoMimeType?: string; //save the encoding of uploaded file for content-type use for reply.type as shown above
    readonly userId?: number;

}
