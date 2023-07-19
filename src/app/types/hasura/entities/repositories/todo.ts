import {
  Todo_Bool_Exp,
  Todo_Insert_Input,
  Todo_Order_By,
  Todo_Set_Input,
  Todo_Select_Column,
  Scalars,
  Todo 
} from "../../graphql"

import { type FindParams, find } from '@tech-j-apprend/type-orm-graphql';
import { type UpdateParams, update } from '@tech-j-apprend/type-orm-graphql';
import { type UpsertParams, upsert } from '@tech-j-apprend/type-orm-graphql';
import { type DeleteParams, deleteSelf } from '@tech-j-apprend/type-orm-graphql';
import { type SuscribeByParams, suscribeBy } from '@tech-j-apprend/type-orm-graphql';
import { type SuscribeParams, suscribe } from '@tech-j-apprend/type-orm-graphql';
import { type FindByParams, findBy } from '@tech-j-apprend/type-orm-graphql';
import { BaseQuery } from '@tech-j-apprend/type-orm-graphql';
import { InjectEntityName } from '@tech-j-apprend/type-orm-graphql';
import { FlattenToBoolean } from '@tech-j-apprend/type-orm-graphql';
import { Repository } from '@tech-j-apprend/type-orm-graphql';

export type TodoOperations = {
  entityColumnsWithRelationsSelection: Partial<FlattenToBoolean<Todo>>;
  entityColumns: Todo_Select_Column;
  entitySetInput: Todo_Set_Input;
  entityInserInput: Todo_Insert_Input;
  boolExpression: Todo_Bool_Exp;
  orderByExpressionList: Todo_Order_By[];
  scalarType: Scalars;
  appendSetInput: never;
  prependSetInput: never;
};

export class TodoRepository extends Repository<TodoOperations> {
  private table: string;

  constructor() {
    super();
    this.table = 'todo';
  }

  getBaseQuery(): BaseQuery {
    return {
      entityName: this.table
    };
  }

  @InjectEntityName()
  findBy(
    findByParams: FindByParams<
      TodoOperations['boolExpression'],
      TodoOperations['entityColumnsWithRelationsSelection'],
      TodoOperations['scalarType']
    >
  ) {
    return findBy(findByParams);
  }

  @InjectEntityName()
  find(
    findParams: FindParams<
      TodoOperations['entityColumnsWithRelationsSelection'],
      TodoOperations['boolExpression'],
      TodoOperations['orderByExpressionList'],
      TodoOperations['entityColumns'],
      TodoOperations['scalarType']
    >
  ) {
    return find(findParams);
  }

  @InjectEntityName()
  update(
    updateParams: UpdateParams<
      TodoOperations['boolExpression'],
      TodoOperations['entitySetInput'],
      TodoOperations['appendSetInput'],
      TodoOperations['prependSetInput'],
      TodoOperations['entityColumns'],
      TodoOperations['scalarType']
    >
  ) {
    return update(updateParams);
  }

  @InjectEntityName()
  upsert(
    upsertParams: UpsertParams<
      TodoOperations['entityInserInput'],
      TodoOperations['entityColumns']
    >
  ) {
    return upsert(upsertParams);
  }

  @InjectEntityName()
  delete(
    deleteParams: DeleteParams<
      TodoOperations['boolExpression'],
      TodoOperations['entityColumns'],
      TodoOperations['scalarType']
    >
  ) {
    return deleteSelf(deleteParams);
  }

  @InjectEntityName()
  subscribeByUuid(
    subscribeByParams: SuscribeByParams<
      TodoOperations['entityColumnsWithRelationsSelection'],
      TodoOperations['scalarType']
    >
  ) {
    return suscribeBy(subscribeByParams);
  }

  @InjectEntityName()
  subscribe(
    subscribeParams: SuscribeParams<
      TodoOperations['entityColumnsWithRelationsSelection'],
      TodoOperations['boolExpression'],
      TodoOperations['orderByExpressionList'],
      TodoOperations['scalarType']
    >
  ) {
    return suscribe(subscribeParams);
  }
}
