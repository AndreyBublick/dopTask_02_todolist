import { instance } from 'common/instance';
import type { TodolistType } from './todolistsApi.types';

import type { ResponseType } from 'common/types';
import { AppStatus } from 'common/enums';
import { baseApi } from 'app/baseApi';
import type { TodoListDomain } from '../lib/types/types';

export const _todolistsApi = {
  getTodolists() {
    return instance.get<TodolistType[]>('todo-lists');
  },

  addTodolist(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', { title });
  },

  changeTodolistTitle({ id, title }: { id: string; title: string }) {
    return instance.put<ResponseType>(`todo-lists/${id}`, { title });
  },

  deleteTodolist(id: string) {
    return instance.delete<ResponseType>(`todo-lists/${id}`);
  },
};

export const todolistsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getTodolists: build.query<TodoListDomain[], void>({
      query: () => 'todo-lists',
      transformResponse: (todoLists: TodolistType[]): TodoListDomain[] =>
        todoLists.map(tl => ({ ...tl, filter: 'all', status: AppStatus.idle })),
      providesTags: ['Todolists'],
    }),
    addTodolist: build.mutation<ResponseType<{ item: TodolistType }>, string>({
      query: (title: string) => ({
        url: 'todo-lists',
        method: 'POST',
        body: { title },
      }),
      invalidatesTags: ['Todolists'],
    }),

    updateTodolistTitle: build.mutation<ResponseType, { id: string; title: string }>({
      query: ({ id, title }) => ({
        url: `todo-lists/${id}`,
        method: 'PUT',
        body: { title },
      }),
      invalidatesTags: ['Todolists'],
    }),
    removeTodolist: build.mutation<ResponseType, string>({
      query: (id: string) => ({
        url: `todo-lists/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Todolists'],
    }),
  }),
});
export const {
  useGetTodolistsQuery,
  useAddTodolistMutation,
  useRemoveTodolistMutation,
  useUpdateTodolistTitleMutation,
} = todolistsApi;
