import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import RegisterSchema from "../validation/RegisterSchema"
import { AuthApi } from "../api/AuthApi"
import { useNavigate } from "react-router-dom"

const Register = () => {
    const navigate = useNavigate()

    const { register, reset, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({
        resolver: zodResolver(RegisterSchema),
        mode: "onBlur",
        reValidateMode: "onBlur",
        defaultValues: {
            name: "",
            email: "",
            password: "",
            gender: ""
        }
    })

    async function onSubmit(data) {
        try {
            const res = await AuthApi.register(data)
            console.log(res, "register response")
            navigate("/login")
        } catch (error) {
            // Optional chaining (?.) added to prevent app crash if server is down
            if (error?.response?.data?.message) {
                setError("general", { type: "server", message: error.response.data.message })
            }
            else {
                setError("general", { type: "server", message: "Failed to register user" })
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-10 px-4">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
                
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
                    <p className="text-slate-500 mt-2 text-sm">Join us to build your perfect CV</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    
                    {/* Name Input */}
                    <div>
                        <input 
                            type='text' 
                            {...register("name")} 
                            placeholder='Name' 
                            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                                errors.name ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                            }`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>}
                    </div>

                    {/* Email Input */}
                    <div>
                        <input 
                            type="email" 
                            {...register("email")} 
                            placeholder='Email Address' 
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
                            placeholder='Password' 
                            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                                errors.password ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                            }`}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
                    </div>

                    {/* Gender Radio Buttons */}
                    <div className="pt-2">
                        <p className="text-sm font-medium text-slate-700 mb-2">Gender</p>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type='radio' value="male" {...register("gender")} className="w-4 h-4 text-blue-500 cursor-pointer" />
                                <span className="text-slate-600 text-sm">Male</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type='radio' value="female" {...register("gender")} className="w-4 h-4 text-blue-500 cursor-pointer" />
                                <span className="text-slate-600 text-sm">Female</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type='radio' value="other" {...register("gender")} className="w-4 h-4 text-blue-500 cursor-pointer" />
                                <span className="text-slate-600 text-sm">Other</span>
                            </label>
                        </div>
                        {errors.gender && <p className="text-red-500 text-xs mt-1 ml-1">{errors.gender.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button 
                        type='submit' 
                        disabled={isSubmitting}
                        className="w-full py-3 mt-4 text-white bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold transition-colors disabled:bg-blue-300"
                    >
                        {isSubmitting ? "Submitting.." : "Submit"}
                    </button>

                </form>

                {/* General/Server Error Message */}
                {errors.general && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-600 text-sm text-center font-medium">{errors.general.message}</p>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Register