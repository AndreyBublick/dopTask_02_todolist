import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addTodoListTC, clearTodolists, deleteTodoListTC } from '../todolistSlice/todolistsSlice';
import { changeAppStatus } from 'app/appSlice';
import { AppStatus, ResultCodeStatus } from 'common/enums';
import { _tasksApi } from '../../api/tasksApi';
import { handleServerAppError, handleServerNetworkError } from 'common/utils';
import type { RootState } from 'app/store';
import type { Model, TaskType } from '../../api/tasksApi.types';

const initialState: TaskItemType = {};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  selectors: {
    selectTasks: (state, todoListId: string) => state[todoListId],
  },
  reducers: () => ({}),
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        if (action.payload) {
          const { todolistId, tasks } = action.payload;
          state[todolistId] = tasks;
        }
      })
      .addCase(createTaskTC.fulfilled, (state, action) => {
        if (action.payload) {
          const { todoListId, task } = action.payload;
          state[todoListId].unshift(task);
        }
      })
      .addCase(updateTaskTC.fulfilled, (state, action) => {
        if (action.payload) {
          const { todoListId, taskId, domainModel } = action.payload;
          const taskIndex = state[todoListId].findIndex(tsk => tsk.id === taskId);
          if (taskIndex !== -1) {
            state[todoListId][taskIndex] = { ...state[todoListId][taskIndex], ...domainModel };
          }
        }
      })
      .addCase(removeTaskTC.fulfilled, (state, action) => {
        if (action.payload) {
          const { todoListId, id } = action.payload;
          const taskIndex = state[todoListId].findIndex(tsk => tsk.id === id);
          if (taskIndex !== -1) {
            state[todoListId].splice(taskIndex, 1);
          }
        }
      })
      .addCase(deleteTodoListTC.fulfilled, (state, action) => {
        if (action.payload) {
          delete state[action.payload.todolistId];
        }
      })
      .addCase(addTodoListTC.fulfilled, (state, action) => {
        if (action.payload) {
          state[action.payload.createdTodolist.id] = [];
        }
      })
      .addCase(removeAllTasksTC.fulfilled, (state, action) => {
        if (action.payload) {
          state[action.payload.todoListId] = [];
        }
      })
      .addCase(clearTodolists, () => ({}));
  },
});

export const fetchTasks = createAsyncThunk('tasks/setTasks', async (todolistId: string, thunkAPI) => {
  try {
    thunkAPI.dispatch(changeAppStatus({ status: AppStatus.loading }));
    const response = await _tasksApi.getTasks(todolistId);
    const tasks = response.data.items;

    return { todolistId, tasks };
  } catch (error) {
    handleServerNetworkError({ error, thunkAPI });
    alert(error);
    thunkAPI.rejectWithValue(error);
  } finally {
    thunkAPI.dispatch(changeAppStatus({ status: AppStatus.succeeded }));
  }
});

export const createTaskTC = createAsyncThunk(
  'tasks/createTask',
  async (payload: { todoListId: string; title: string }, thunkAPI) => {
    try {
      thunkAPI.dispatch(changeAppStatus({ status: AppStatus.loading }));
      const { todoListId } = payload;
      const response = await _tasksApi.createTask(payload);

      if (response.data.resultCode === ResultCodeStatus.success) {
        return { todoListId, task: response.data.data.item };
      } else if (response.data.resultCode === ResultCodeStatus.fail) {
        handleServerAppError({ thunkAPI, response });
      }
    } catch (error) {
      handleServerNetworkError({ error, thunkAPI });
    } finally {
      thunkAPI.dispatch(changeAppStatus({ status: AppStatus.succeeded }));
    }
  },
);

export const updateTaskTC = createAsyncThunk(
  'tasks/updateTask',
  async (payload: { todoListId: string; taskId: string; domainModel: DomainModel }, thunkAPI) => {
    const { todoListId, taskId, domainModel } = payload;
    const state = thunkAPI.getState() as RootState;
    const task = state.tasks[todoListId].find(tsk => tsk.id === taskId);

    if (!task) {
      throw new Error('not the current task');
    }
    const { title, startDate, priority, deadline, status, description } = task;

    const model: Model = {
      title,
      description,
      status,
      deadline,
      priority,
      startDate,
      ...domainModel,
    };

    try {
      thunkAPI.dispatch(changeAppStatus({ status: AppStatus.loading }));
      const response = await _tasksApi.updateTask({ todoListId, taskId, model });

      if (response.data.resultCode === ResultCodeStatus.success) {
        return payload;
      } else if (response.data.resultCode === ResultCodeStatus.fail) {
        handleServerAppError({ thunkAPI, response });
      }
    } catch (error) {
      handleServerNetworkError({ error, thunkAPI });
    } finally {
      thunkAPI.dispatch(changeAppStatus({ status: AppStatus.succeeded }));
    }
  },
);

export const removeTaskTC = createAsyncThunk(
  'tasks/removeTask',
  async (payload: { todoListId: string; id: string }, thunkAPI) => {
    try {
      thunkAPI.dispatch(changeAppStatus({ status: AppStatus.loading }));
      /*const response =*/
      const response = await _tasksApi.deleteTask(payload);

      if (response.data.resultCode === ResultCodeStatus.success) {
        return payload;
      } else if (response.data.resultCode === ResultCodeStatus.fail) {
        handleServerAppError({ thunkAPI, response });
      }
    } catch (error) {
      handleServerNetworkError({ error, thunkAPI });
    } finally {
      thunkAPI.dispatch(changeAppStatus({ status: AppStatus.succeeded }));
    }
  },
);

export const removeAllTasksTC = createAsyncThunk(
  'tasks/removeAllTasksTC',
  async ({ todoListId }: { todoListId: string }, thunkAPI) => {
    try {
      thunkAPI.dispatch(changeAppStatus({ status: AppStatus.loading }));

      const state: RootState = thunkAPI.getState() as RootState;

      for (const tsk of state.tasks[todoListId]) {
        await _tasksApi.deleteTask({ todoListId, id: tsk.id });
      }
      /* await tasksApi.deleteTask(payload);*/
      return { todoListId };
    } catch (error) {
      handleServerNetworkError({ error, thunkAPI });
    } finally {
      thunkAPI.dispatch(changeAppStatus({ status: AppStatus.succeeded }));
    }
  },
);

export const tasksReducer = tasksSlice.reducer;

export const { selectTasks } = tasksSlice.selectors;
/*export const { clearTasks } = tasksSlice.actions;*/

export type TaskItemType = Record<string, TaskType[]>;

export type DomainModel = Partial<Model>;
