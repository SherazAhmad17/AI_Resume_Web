import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/authContext"
import { useEffect } from "react"

const ProctectedRoutes = () => {
  const navigate = useNavigate()

  const { isAuth, user } = useAuth()

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth, navigate])

  return (
    <Outlet />
  )
}

export default ProctectedRoutes