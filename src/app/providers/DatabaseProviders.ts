import { Provider } from '@angular/core';
import { TodoRepository } from '../types/hasura/entities/repositories/todo';

export const hasuraProviders: Provider[] = [
  {
    provide: 'TODO_REPOSITORY',
    useFactory: () => {
      return new TodoRepository();
    },
  },
];
