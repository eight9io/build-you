import { create } from "zustand";

export interface ScheduleStore {
  shouldRefreshIndividualCoachData: boolean;

  setShouldRefreshIndividualCoachData: (shouldRefresh: boolean) => void;
}

export const useScheduleStore = create<ScheduleStore>((set, get) => ({
  shouldRefreshIndividualCoachData: false,

  setShouldRefreshIndividualCoachData: (shouldRefresh: boolean) => {
    set({ shouldRefreshIndividualCoachData: shouldRefresh });
  },
}));
