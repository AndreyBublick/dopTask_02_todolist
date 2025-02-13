import { useEffect, useState } from "react";
import { todolistsApi } from "../../features/todolists/api/todolistsApi";

export const GetResponse = () => {
  const [state, setState] = useState<any>([]);

  useEffect(() => {
    todolistsApi.getTodolists().then((response) => setState(response.data));
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};
