import { ObjectType, Field } from '@nestjs/graphql';
import { Meta } from '../models/meta.model';

export function Paginated<TItem>(classRef: new () => TItem) {
  @ObjectType(`Paginated${classRef.name}`)
  abstract class PaginatedType {
    @Field(() => [classRef], { nullable: true })
    results: TItem[];

    @Field(() => Meta)
    meta: Meta;
  }
  return PaginatedType;
}
