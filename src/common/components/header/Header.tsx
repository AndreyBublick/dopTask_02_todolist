import React, { memo, useCallback, useState } from "react";
import { AppBar, Box, Button, IconButton, Switch, Toolbar } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useAppSelector } from "common/hooks";
import { styled } from "@mui/material/styles";
import { changeThemeMode, getModeTheme } from "app/app-reducer";
import { getIsAuth, logout } from "../../../features/login/model/auth-reducer/auth-reducer";
import { MenuButton, ProgressLinear } from "common/components";

export const Header = memo(() => {
  const [value, setValue] = useState("1");
  const themeMode = useAppSelector(getModeTheme);
  const dispatch = useDispatch();
  const isAuth = useAppSelector(getIsAuth);

  const onChangeHandler = useCallback(() => {
    dispatch(changeThemeMode({ themeMode: themeMode === "light" ? "dark" : "light" }));
  }, [dispatch, themeMode]);

  const onClickHandler = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <AppBarStyled position="static">
      <ToolbarStyled>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <Menu />
        </IconButton>

        <Box sx={{ display: "flex", gap: "15px" }}>
          <MenuButton defaultValue={value} onClick={() => setValue("1")} variant={"contained"}>
            one
          </MenuButton>
          <MenuButton defaultValue={value} onClick={() => setValue("2")} variant={"contained"}>
            Two
          </MenuButton>
          <MenuButton defaultValue={value} onClick={() => setValue("3")} variant={"contained"}>
            Three
          </MenuButton>

          <Switch onChange={onChangeHandler} />
          {isAuth && (
            <Button color={"secondary"} onClick={onClickHandler} variant="outlined">
              Log Out
            </Button>
          )}
        </Box>
      </ToolbarStyled>
      <ProgressLinear />
    </AppBarStyled>
  );
});

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  marginBottom: "30px",
  backgroundColor: theme.palette.primary.light,
  ...(theme.palette.mode === "dark" && {
    backgroundColor: "#333",
  }),
}));

const ToolbarStyled = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});
