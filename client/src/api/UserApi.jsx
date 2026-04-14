import api from "./axiosInstence";

export const UserApi = {
    logout: () => {
        return api.post("/auth/logout")
    },
    updateProfile: (data) => {
        return api.put("/user/update-profile", data);
    }
}