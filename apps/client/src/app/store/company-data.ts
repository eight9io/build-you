import { create } from "zustand";
import { IUserData } from "../types/user";

export interface EmployeeListStore {
    employeeList: IUserData[]
    setEmployeeList: (list: any[]) => void;
    getEmployeeList: () => any[];
}


export const useEmployeeListStore = create<EmployeeListStore>((set, get) => ({
    employeeList: [],
    setEmployeeList: (list) => {
        set({ employeeList: list });
    }
    ,
    getEmployeeList: () => get().employeeList

}))