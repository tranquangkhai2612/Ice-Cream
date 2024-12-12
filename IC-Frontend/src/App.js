import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"

import { createBrowserRouter, RouterProvider } from "react-router-dom"
// import store from "./store"
import { Provider, useSelector } from "react-redux"
import axios from "axios"
import React from "react"
import { store, persistor } from "./store"
import { PersistGate } from "redux-persist/integration/react"

import Home from "./pages/Home"
import AddRecipe from "./pages/AddRecipe"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import ForgotPassword from "./pages/ForgotPassword"
import CodeResetPassword from "./pages/CodeResetPassword"
import ResetPassword from "./pages/ResetPassword"
import Registration from "./pages/Registration"
import DetailRecipe from "./pages/DetailRecipe"
import DetailVideoStep from "./pages/DetailVideoStep"
import EditProfile from "./pages/EditProfile"
import EditRecipe from "./pages/EditRecipe"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/add-recipe",
    element: <AddRecipe />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/code-reset-password",
    element: <CodeResetPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/detail-recipe/:slug",
    element: <DetailRecipe />,
  },
  {
    path: "/detail-video-step/:id",
    element: <DetailVideoStep />,
  },
  {
    path: "/edit-profile",
    element: <EditProfile />,
  },
  {
    path: "/edit-recipe/:id",
    element: <EditRecipe />,
  },
])

function App() {
  return (
    <div>
      <PersistGate loading={null} persistor={persistor}>
        <Provider store={store}>
          <RunApp RouterProvider={RouterProvider} router={router} />
        </Provider>
      </PersistGate>
    </div>
  )
}

function RunApp({ RouterProvider, router }) {
  const state = useSelector((reducer) => reducer.auth)

  React.useEffect(() => {
    axios.interceptors.request.use(
      (config) => {
        if (state?.token != "") {
          config.headers["Authorization"] = `Bearer ${state?.token}`
        }
        return config
      },
      (error) => {
        Promise.reject(error)
      }
    )
  }, [])

  return <RouterProvider router={router} />
}

export default App
