import { useAppDispatch } from './Hooks';
import { useCallback } from 'react';
import { changeTodolistTitleTC, deleteTodoListTC } from '../../features/todolists/model/todolistSlice/todolistsSlice';
import { createTaskTC, removeAllTasksTC } from '../../features/todolists/model/tasksSlice/tasksSlice';

export const useTodolist = (id: string) => {
  const dispatch = useAppDispatch();

  const deleteTodoList = useCallback(() => dispatch(deleteTodoListTC(id)), [dispatch, id]);

  const changeTitleTodoList = useCallback(
    (title: string) => {
      dispatch(changeTodolistTitleTC({ id, title }));
    },
    [dispatch, id],
  );

  const addNewTask = useCallback(
    (title: string) => {
      dispatch(createTaskTC({ todoListId: id, title }));
    },
    [dispatch, id],
  );

  const removeAllTasksHandler = useCallback(() => {
    /*dispatch(removeAllTasks({ todoListId: id }));*/
    dispatch(removeAllTasksTC({ todoListId: id }));
  }, [dispatch, id]);

  return { deleteTodoList, changeTitleTodoList, addNewTask, removeAllTasksHandler };
};
