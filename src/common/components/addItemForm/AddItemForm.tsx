import React, { FC, memo } from "react";
import { Input } from "../input/Input";
import { Button } from "@mui/material";
import styled from "styled-components";
import { useAddItemForm } from "common/hooks/useAddItemForm";

type PropsType = {
  callBack: (value: string) => void;
  status?: boolean;
  label?: string;
};

export const AddItemForm: FC<PropsType> = memo(({ callBack, status, label }) => {
  const { value, error, deactivateEditMode, onChangeHandler } = useAddItemForm(callBack);

  return (
    <AddItemFormStyled>
      <Input
        label={label}
        onKeyDown={deactivateEditMode}
        onChange={onChangeHandler}
        error={!!error}
        required
        value={value}
        disabled={!!status}
      />
      <Button disabled={!!error || status} onClick={deactivateEditMode} variant={"contained"} size={"small"}>
        +
      </Button>
    </AddItemFormStyled>
  );
});

const AddItemFormStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  label + div + p {
    position: absolute;
    color: #2cc5d2;
    top: 102%;
  }
`;
