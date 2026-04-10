import api from "./axiosInstence";

export const UserApi = {
    logout: () => {
        return api.post("/auth/logout")
    }
}