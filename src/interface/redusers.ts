import { RepoRef } from ".";

/** Projects Reducer types */
export type projectsInitialStateType = {
  loading: boolean;
  error: string | null;
  projects: RepoRef[];
};

export type projectsReducderType = (
  state: projectsInitialStateType,
  payload: { type: any; payload: any }
) => projectsInitialStateType;
