import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoginSchema from "../validation/loginSchema";
import { useAuth } from "../hooks/authContext";
import { AuthApi } from "../api/AuthApi";

const Login = () => {

  const {register,handleSubmit,reset,formState:{errors,isSubmitting}} = useForm({
      resolver: zodResolver(LoginSchema),
      mode: "onBlur",
      reValidateMode: "onBlur",
      defaultValues:{
        email: "",
        password: ""
      }
  })

  const {setUser,setAccessToken,isAuth} = useAuth()

  const onSubmit = async (data) => {
    try {
      const res = await AuthApi.login(data)
      console.log(res)
      setAccessToken(res.data.accessToken)
      setUser(res.data.user)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>

        <input type="email" {...register("email")} placeholder="email" />
        {errors.email && <p>{errors.email.message}</p>}

        <input type="password" {...register("password")} placeholder="password" />
        {errors.password && <p>{errors.password.message}</p>}
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <h1>{isAuth ? "Logged In" : "Not Logged In"}</h1>
    </div>
  )
}

export default Login
