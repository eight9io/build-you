import { create } from "zustand";
import { IScheduledTime } from "../types/schedule";

export interface ScheduleStore {
  shouldRefreshIndividualCoachData: boolean;
  shouldRefreshScheduleData: boolean;
  updatedScheduleData?: IScheduledTime;

  setShouldRefreshIndividualCoachData: (shouldRefresh: boolean) => void;
  setShouldRefreshScheduleData: (shouldRefresh: boolean) => void;
  setUpdatedScheduleData: (schedule?: IScheduledTime) => void;
}

export const useScheduleStore = create<ScheduleStore>((set) => ({
  shouldRefreshIndividualCoachData: false,
  shouldRefreshScheduleData: false,
  updatedScheduleData: undefined,

  setShouldRefreshIndividualCoachData: (shouldRefresh: boolean) => {
    set({ shouldRefreshIndividualCoachData: shouldRefresh });
  },
  setShouldRefreshScheduleData: (shouldRefresh: boolean) => {
    set({ shouldRefreshScheduleData: shouldRefresh });
  },
  setUpdatedScheduleData: (schedule?: IScheduledTime) => {
    set({ updatedScheduleData: schedule });
  },
}));
