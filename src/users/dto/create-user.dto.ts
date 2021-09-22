import { ApiProperty } from "@nestjs/swagger";
import { CreateUserProfileDto } from "src/user-profiles/dto/create-user-profile.dto";
import { CountryList, Gender } from "../../global/app.enum";

export class CreateUserDto {

    /**
     * This is the first name of the user. Should not be more than 20 characters. 
     * @example 'Ebuka'
     */
    readonly firstName: string;
    readonly middleName?: string;
    readonly lastName: string;
    readonly commonName?: string;
    readonly homeAddress?: string;
    readonly gender?: Gender;
    readonly dateOfBirth?: Date;
    readonly nationality?: CountryList;
    readonly state? : string;
    readonly city?: string;
    readonly county?: string;
    readonly zip?: string;
    readonly isActive?: boolean;
    readonly isSoftDeleted?: boolean;
    readonly primaryEmailAddress: string;
    readonly backupEmailAddress?: string;
    readonly phone?: { mobile: string[], office: string[], home: string[] }
    readonly isPrimaryEmailAddressVerified?: boolean;
    readonly isBackupEmailAddressVerified?: boolean;
    passwordHash: string;
    readonly isPasswordChangeRequired?: boolean;
    readonly resetPasswordToken?: string;
    readonly resetPasswordExpiration?: Date;
    readonly primaryEmailVerificationToken?: string;
    readonly backupEmailVerificationToken?: string;
    readonly emailVerificationTokenExpiration?: Date;
    readonly otpEnabled?: boolean;
    readonly otpSecret?: string;
    readonly refreshTokenHash?: string;
    readonly userProfile?: CreateUserProfileDto
    readonly departmentId?: number;

}
