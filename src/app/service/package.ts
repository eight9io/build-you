import httpInstance from "../utils/http";
import { IPackageResponse } from "../types/package";
import { AxiosResponse } from "axios";

export const serviceGetAllPackages = (): Promise<
  AxiosResponse<IPackageResponse>
> => {
  return httpInstance.get(`/package/all`);
};
