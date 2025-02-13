import { v1 } from "uuid";
import {
  addTodoListAC,
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  FilterValuesType,
  removeTodoListAC,
  setTodoListsAC,
  TodoListDomainType,
  todolistsReducer,
} from "../todolist-reducer/todolists-reducer";

let IdForFirstTask: string;
let IdForSecondTask: string;
let IdForThirdTask: string;

let todoLists: TodoListDomainType[];
let id: string;
beforeEach(() => {
  IdForFirstTask = v1();
  IdForSecondTask = v1();
  IdForThirdTask = v1();
  id = v1();
  todoLists = [
    { id: IdForFirstTask, filter: "all", title: "todo all", addedDate: "", order: 0 },
    { id: IdForSecondTask, filter: "completed", title: "todo completed", addedDate: "", order: 0 },
    { id: IdForThirdTask, filter: "active", title: "todo active", addedDate: "", order: 0 },
  ];
});

test("correct todolist should be removed", () => {
  const endState = todolistsReducer(todoLists, removeTodoListAC(IdForSecondTask));

  expect(endState.length).toBe(2);
  expect(endState[1].id).toBe(IdForThirdTask);
});
test("correct todolist should be added", () => {
  const title = "NEW TODO";
  const endState = todolistsReducer(todoLists, addTodoListAC({ id, title, addedDate: "", order: 0 }));

  expect(endState.length).toBe(4);
  expect(endState[3].title).toBe(title);
  expect(endState[3].filter).toBe("all");
});

test("correct todolist should change its title", () => {
  const newTitle = "NewTitlE";

  const endState = todolistsReducer(todoLists, changeTodolistTitleAC({ id: IdForThirdTask, title: newTitle }));

  expect(endState.length).toBe(3);
  expect(endState[2].title).toBe(newTitle);
});
test("correct todolist should change its filter", () => {
  const newFilterValue: FilterValuesType = "active";

  expect(todoLists[0].filter).toBe("all");
  const endState = todolistsReducer(todoLists, changeTodolistFilterAC({ id: IdForFirstTask, filter: newFilterValue }));
  expect(endState.length).toBe(3);
  expect(endState[1].filter).toBe("completed");
  expect(endState[2].filter).toBe("active");
});
test("should SET todolists", () => {
  const todoList = { id, order: 0, title: "title", addedDate: "" };

  const endState = todolistsReducer([], setTodoListsAC([todoList]));

  expect(endState.length).toBe(1);
  expect(endState[0].filter).toBe("all");
  expect(endState).toEqual([{ ...todoList, filter: "all" }]);
});
