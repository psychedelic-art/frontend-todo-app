import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { TodoInputComponent } from './components/todo-input/todo-input.component';
import { TodosListComponent } from './components/todos-list/todos-list.component';
import { FiltersComponent } from './components/filters/filters.component';
import { TodoItemComponent } from './components/todos-list/todo-item.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { hasuraProviders } from './providers/DatabaseProviders';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    DragDropModule,
    HttpClientModule,
    ApolloModule,
  ],
  declarations: [
    AppComponent,
    TodoInputComponent,
    TodosListComponent,
    FiltersComponent,
    TodoItemComponent,
  ],
  providers: [
    ...hasuraProviders,
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        const headers = {
          'x-hasura-admin-secret': `myadminsecretkey`,
        } as any;

        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'http://localhost:8080/v1/graphql',
            headers,
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
