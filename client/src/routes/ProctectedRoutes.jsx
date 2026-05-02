import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/authContext"
import { useEffect } from "react"
import { Box, CircularProgress } from "@mui/material"

const ProctectedRoutes = () => {
  const navigate = useNavigate()

  const { isAuth, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuth) {
      navigate("/login");
    }
  }, [isAuth, loading, navigate])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Outlet />
  )
}

export default ProctectedRoutes