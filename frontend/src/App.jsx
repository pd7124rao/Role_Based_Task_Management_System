import { AuthProvider } from "./Context/AuthContex"
import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import "./App.css"
import ProtectedRoutes from "./Routes/ProtectedRoutes"
import Layout from "./Components/Layout"
import AuthorizationRouter from "./Routes/AuthorizationRouter"
import UserProfile from "./Pages/UserProfile"
import ChangePassword from "./Components/ChangePassword"
import CreateTask from "./Components/CreateTask"
import TaskList from "./Components/TaskList"
import ChangeRole from "./Components/ChangeRole"
import OwnTask from "./Components/OwnTask"
import StudentForm from "./Components/StudentForm"

function App() {

  return (
   <>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/user" element={<ProtectedRoutes>
            <Layout>
              <UserProfile />
            </Layout>
          </ProtectedRoutes>} />

          <Route path="/changePassword" element={<ProtectedRoutes>
            <Layout>
              <ChangePassword />
            </Layout>
          </ProtectedRoutes>} />

           <Route path="/ownTask" element={<ProtectedRoutes>
            <Layout>
              <OwnTask />
            </Layout>
          </ProtectedRoutes>} />
          <Route path="/studentCreate" element={<StudentForm/>}/>

          <Route path="/createTask" element={<AuthorizationRouter roleAccess={['admin']} >
            <Layout>
              <CreateTask />
            </Layout>
          </AuthorizationRouter>} />

          <Route path="/taskList" element={<AuthorizationRouter roleAccess={['admin']} >
            <Layout>
              <TaskList />
            </Layout>
          </AuthorizationRouter>} />

           <Route path="/changeRole" element={<AuthorizationRouter roleAccess={['admin','manager','team-lead']} >
            <Layout>
              <ChangeRole />
            </Layout>
          </AuthorizationRouter>} />
          <Route path="/*" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
   </>
  )
}

export default App
