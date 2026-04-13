import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoginSchema from "../validation/loginSchema";
import { useAuth } from "../hooks/authContext";
import { AuthApi } from "../api/AuthApi";
import LogoutButton from "../components/ui/buttons/logoutBtn";

const Login = () => {
  const {register, handleSubmit, formState:{errors, isSubmitting}} = useForm({
      resolver: zodResolver(LoginSchema),
      mode: "onChange",
      reValidateMode: "onChange",
      defaultValues:{
        email: "",
        password: ""
      }
  })

  const {setUser, setAccessToken, isAuth} = useAuth()

  const onSubmit = async (data) => {
    try {
      const res = await AuthApi.login(data)
      setAccessToken(res.data.accessToken)
      setUser(res.data.user)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
        
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 mt-2 text-sm">Log in to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Email Input */}
          <div>
            <input 
              type="email" 
              {...register("email")} 
              placeholder="Email address" 
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                errors.email ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
          </div>

          {/* Password Input */}
          <div>
            <input 
              type="password" 
              {...register("password")} 
              placeholder="Password" 
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                errors.password ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-3 mt-2 text-white bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold transition-colors disabled:bg-blue-300"
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Development testing tag */}
        {isAuth && <p className="text-center text-green-500 mt-4 text-sm font-medium">Logged In Successfully!</p>}

        <LogoutButton/>
      </div>
    </div>
  )
}

export default Login