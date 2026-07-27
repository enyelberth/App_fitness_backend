import { PartialType, PickType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

export class UpdateProfileDto extends PartialType(
  PickType(CreateUserDto, [
    "firstName",
    "lastName",
    "age",
    "gender",
    "level",
    "goal",
    "weightKg",
    "heightCm",
    "availableMinutes",
    "availableEquipment",
    "injuries",
    "preferences",
  ] as const),
) {}
