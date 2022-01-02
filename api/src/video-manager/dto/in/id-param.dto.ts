import { IsMongoId } from '../../../shared/decorators/validation/is-mongo-id.decorator';

export class IdParamDto {
  @IsMongoId()
  id: string;
}
