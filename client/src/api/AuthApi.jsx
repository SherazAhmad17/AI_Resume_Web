import api from "./axiosInstence"

export const AuthApi ={
    register: (data) => {
        return api.post("/auth/register", data)
    },
    login: (data) => {
        return api.post("auth/login", data)
    },
    refreshToken: () => {
        return api.post("auth/refresh-Token")
    }
}