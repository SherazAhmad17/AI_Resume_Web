import { createContext, useEffect, useLayoutEffect, useState } from "react";
import { AuthApi } from "../api/AuthApi";
import api from "../api/axiosInstence";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);
    let isAuth = accessToken ? true : false;

    useLayoutEffect(() => {
        const requestInterceptor = api.interceptors.request.use(
            (config) => {
                if (accessToken && !config._retry) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;

            },
            (error) => {
                return Promise.reject(error)
            }
        );

        return () => {
            return api.interceptors.request.eject(requestInterceptor);
        }

    }, [accessToken])

    useLayoutEffect(() => {
        const responceInterceptor = api.interceptors.response.use(
            (res) => {
                return res;
            },
            async (error) => {
                const faildReq = error.config;
                if ((error.response?.status === 401 || error.response?.status === 403) && !faildReq._retry && !faildReq.url.includes("refresh-Token")) {
                    faildReq._retry = true;
                    try {
                        const res = await AuthApi.refreshToken();
                        faildReq.headers.Authorization = `Bearer ${res.data.accessToken}`;
                        setAccessToken(res.data.accessToken);
                        setUser(res.data.user);
                        return api(faildReq);
                    } catch (error) {
                        setAccessToken(null);
                        setUser(null);
                    }
                }
                return Promise.reject(error);
            }
        )
        return () => {
            return api.interceptors.response.eject(responceInterceptor);
        }
    }, [accessToken])

    useEffect(()=>{
        async function restoreSession(){
            try {
                const res = await AuthApi.refreshToken();
                setAccessToken(res.data.accessToken);
                setUser(res.data.user);
            } catch (error) {
                setAccessToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        restoreSession();
    }, [])


    return (
        <AuthContext.Provider value={{user,setUser,setAccessToken,accessToken,isAuth,loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthContextProvider }