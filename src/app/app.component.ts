import { Component, Inject, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { Apollo, gql } from 'apollo-angular';
import { TodoRepository } from 'src/app/types/hasura/entities/repositories/todo';
import { Mutation_Root, Todo } from './types/hasura/graphql';

interface GetMyTodosResponse {
  todo: Todo[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isDarkMode = true;
  allTodos: Todo[] = [];

  filter: string = 'All';
  loading = true;

  constructor(
    private apollo: Apollo,
    @Inject('TODO_REPOSITORY')
    private repository: TodoRepository
  ) {}

  ngOnInit(): void {
    this.apollo
      .watchQuery<GetMyTodosResponse>({
        query: gql(
          this.repository.find({
            select: {
              uuid: true,
              title: true,
              created_at: true,
              is_completed: true,
            },
          })
        ),
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.loading = loading;
        this.allTodos = data.todo.map(
          ({ __typename, ...todoRest }) => todoRest
        );
        this.onClickFilter('All');
      });
  }

  get todoList(): Todo[] {
    if (this.filter === 'Active') {
      return this.allTodos.filter((item) => !item.is_completed);
    } else if (this.filter === 'Completed') {
      return this.allTodos.filter((item) => item.is_completed);
    } else {
      return this.allTodos;
    }
  }

  onChangeMode() {
    if (this.isDarkMode) {
      this.isDarkMode = !this.isDarkMode;
    } else {
      this.isDarkMode = true;
    }
  }

  addTodo(value: string) {
    this.apollo
      .mutate<Pick<Mutation_Root, 'insert_todo'>>({
        mutation: gql(
          this.repository.upsert({
            objects: [{ title: value }],
            returning: {
              uuid: true,
              title: true,
              created_at: true,
              is_completed: false,
            },
          })
        ),
      })
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.allTodos.push(data.insert_todo.returning[0]);
      });
  }

  changeTodoDone(todoId: string) {
    this.apollo
      .mutate<Pick<Mutation_Root, 'update_todo'>>({
        mutation: gql(
          this.repository.update({
            set: {
              is_completed: true,
            },
            where: {
              uuid: {
                _eq: '$uuid',
              },
            },
            returning: {
              uuid: true,
              title: true,
              created_at: true,
              is_completed: true,
            },
            variables: {
              uuid: 'uuid!',
            },
          })
        ),
        variables: {
          uuid: todoId,
        },
      })
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.allTodos = this.allTodos.filter((todo) => todo.uuid !== todoId);
        this.allTodos.push(data.update_todo.returning[0]);
      });
  }

  clearDoneTodos() {
    this.apollo
      .mutate<Pick<Mutation_Root, 'delete_todo'>>({
        mutation: gql(
          this.repository.delete({
            where: {
              is_completed: {
                _eq: true,
              },
            },
            returning: {
              uuid: true,
              title: true,
              created_at: true,
              is_completed: true,
            },
          })
        ),
      })
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.allTodos = this.allTodos.filter((todo) =>
          data.delete_todo.returning.find(
            (deletedTodo) => deletedTodo.uuid === todo.uuid
          )
        );
      });
  }

  onCrossDelete(todoid) {
    this.apollo
      .mutate<Pick<Mutation_Root, 'delete_todo'>>({
        mutation: gql(
          this.repository.delete({
            where: {
              uuid: {
                _eq: todoid,
              },
            },
            returning: {
              uuid: true,
              title: true,
              created_at: true,
              is_completed: true,
            },
          })
        ),
      })
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.allTodos = this.allTodos.filter((todo) =>
          data.delete_todo.returning.find(
            (deletedTodo) => deletedTodo.uuid === todo.uuid
          )
        );
      });
  }

  calcItemsLeft() {
    return this.todoList.filter((item) => !item.is_completed).length;
  }

  onClickFilter(filterName) {
    this.filter = filterName;
  }
}
