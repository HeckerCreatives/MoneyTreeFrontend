'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios, { AxiosError } from 'axios'
import { useRouter } from "next/navigation"
import toast from 'react-hot-toast'
import { useEffect, useState } from "react"
import { Eye, EyeOff } from "lucide-react" // Import eye icons for toggling
import loadingStore from "@/store/loading"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { loading, setLoading, clearLoading } = loadingStore()

  const [ip, setIp] = useState('');

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIp(data.ip);
      } catch (error) {
      }
    };

    fetchIP();
  }, []);

  const login = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/login?username=${username}&password=${password}&ipAddress=${ip}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.data.auth === 'player') {
        toast.success('Successfully logged in')
        router.push('/user/dashboard')
        setLoading(false)
      } else if (response.data.data.auth === 'superadmin') {
        toast.success('Successfully logged in')
        router.push('/superadmin/analytics')
        setLoading(false)
      } 
      else if (response.data.data.auth === 'admin') {
        toast.success('Successfully logged in')
        router.push('/admin/analytics')
        setLoading(false)
      }
      
      else {
        toast.error(response.data.data)
        setLoading(false)
      }

    } catch (error) {
      setLoading(false)

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string, data: string }>
        if (axiosError.response && axiosError.response.status === 401) {
          toast.error(`${axiosError.response.data.data}`)
        }

        if (axiosError.response && axiosError.response.status === 400) {
          toast.error(`${axiosError.response.data.data}`)
        }

        if (axiosError.response && axiosError.response.status === 402) {
          toast.error(`${axiosError.response.data.data}`)
        }

        if (axiosError.response && axiosError.response.status === 403) {
          toast.error(`${axiosError.response.data.data}`)
        }

        if (axiosError.response && axiosError.response.status === 404) {
          toast.error(`${axiosError.response.data.data}`)
        }
      }
    }
  }

  

  return (
    <div className={cn("flex flex-col gap-6 max-w-[400px] max-h-[500px] w-full h-full", className)} {...props}>
      <div className=" bg-transparent border-none  p-4 text-amber-950 w-full h-[500px]  "
      style={{backgroundImage: 'url(/assets/login.png)', backgroundPosition:'bottom', backgroundRepeat:'no-repeat', backgroundSize:'cover'}}
      >

            <a href="/" className=" flex items-center justify-center mt-4">
                <img src="/assets/logo.png" alt="moneytree" width={150} height={150} />
            </a>

            <div className=" w-full flex flex-col items-center justify-center gap-2">
              <p className=" text-lg font-black">Welcome</p>
              <p className=" text-sm">Log in your account</p>

            </div>

          <div className=" w-full px-4 mt-4">
            <div className="grid gap-2">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Username</Label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    id="username"
                    type="test"
                    placeholder="e.g user123"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                   
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                      onClick={() => setShowPassword(!showPassword)} 
                    >
                      {showPassword ? <Eye size={15} /> : <EyeOff size={15} />} 
                    </button>
                  </div>
                </div>

                <div className=" flex items-center justify-center mt-4">
                <Button onClick={login} disabled={loading} className=' relative w-full flex items-center justify-center  duration-200'>
                    <p className=' relative z-20 text-amber-950 font-black text-sm flex items-center justify-center gap-1'>
                    {loading === true && (
                      <span className="loader"></span>
                    )}
                        Login</p>
                </Button>
                </div>

                
              
                
              </div>
            
            </div>
          </div>
      </div>
    
    </div>
  )
}