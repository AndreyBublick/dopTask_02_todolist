import React, { FC, useEffect } from "react";
import "../App.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Main } from "./Main";
import { Header } from "common/components/header/Header";
import { useAppSelector } from "common/hooks/Hooks";
import { getTheme } from "common/theme/Theme";
import { fetchTodoListsTC } from "../features/todolists/model/todolist-reducer/todolists-reducer";
import { getAppError, getModeTheme } from "./app-reducer";
import { AlertStatus } from "common/components/alertStatus/AlertStatus";
import { Navigate, Route, Routes } from "react-router";
import { routes } from "common/routes/routes";

export const App: FC = () => {
  const themeMode = useAppSelector(getModeTheme);
  const error = useAppSelector(getAppError);
  const theme = getTheme(themeMode);
  const isOpen = error !== null;

  useEffect(() => {
    fetchTodoListsTC();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <CssBaseline />
        <Header />
        {isOpen && <AlertStatus />}
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>

        {/*  {isAuth ? <Main /> : <Navigate to={"/login"} />}*/}
      </div>
    </ThemeProvider>
  );
};
