import { IsNotEmpty } from "class-validator";
import { OsEnum } from "src/os/enum/os.enum";

export class createLinkDto {
    @IsNotEmpty()
    originalLinks: string;
    shorterLinks: string;
    createdAt: Date
    name: OsEnum
    destination_url: string;
}