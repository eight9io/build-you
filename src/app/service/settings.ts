
import http from "../utils/http";

export const serviceGetTerms = () =>
    http.get('/document/terms');
export const serviceGetPrivacy = () =>
    http.get('/document/privacy');