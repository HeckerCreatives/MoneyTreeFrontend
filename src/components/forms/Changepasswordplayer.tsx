'use client'
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { userchangepassword, UserChangePassword } from "@/validitions/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import loadingStore from "@/store/loading";
import refreshStore from "@/store/refresh";
import { Button } from "../ui/button";

type Props = {
    id: string
    username: string
}
export default function Changepasswordplayer(prop: Props) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const { refresh, setRefresh } = refreshStore();
  const { loading, setLoading, clearLoading } = loadingStore();
  const router = useRouter();
  const [open, setOpen] = useState(false)

   // Form handler
   const {
    register,
    handleSubmit,
    setValue,
    reset,
    trigger,
    formState: { errors },
} = useForm<UserChangePassword>({
    resolver: zodResolver(userchangepassword),
    defaultValues: ({})
});

const changePassword = async (data: UserChangePassword) => {
    setRefresh('true');
    setLoading(true);
    try {
        const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/changepassworduserforadmin`, {
            playerid: prop.id,
            password: data.password
        }, {
            withCredentials: true,
            headers: {
                'Content-Type': 'Application/json'
            }
        });

        const response = await toast.promise(request, {
            loading: `Updating password...`,
            success: `Updated successfully. `,
            error: `Error while updating password.`,
        });
        if (response.data.message === 'success') {
            setRefresh('false');
            reset();
            setLoading(false);
            setOpen(false)
        }
    } catch (error) {
        setRefresh('true');
        setLoading(false);

        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ message: string, data: string }>;
            if (axiosError.response && axiosError.response.status === 401) {
                toast.error(`${axiosError.response.data.data}`);
                router.push('/');
            }

            if (axiosError.response && axiosError.response.status === 400) {
                toast.error(`${axiosError.response.data.data}`);
            }

            if (axiosError.response && axiosError.response.status === 402) {
                toast.error(`${axiosError.response.data.data}`);
            }

            if (axiosError.response && axiosError.response.status === 403) {
                toast.error(`${axiosError.response.data.data}`);
            }

            if (axiosError.response && axiosError.response.status === 404) {
                toast.error(`${axiosError.response.data.data}`);
            }
        }
    }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className=" bg-blue-600 px-3 py-1 text-white rounded-md text-[.6rem]">
        Change Password
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password ({prop.username})</DialogTitle>
          <DialogDescription>Enter a new password to update.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(changePassword)} className="space-y-4">
          {/* New Password */}
          <div className="relative">
            <label className="block text-sm font-medium">New Password</label>
            <Input
              type={showPassword ? "text" : "password"}
              className="w-full p-2 border rounded-md"
             {...register('password')}
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          {errors.password && <p className='text-[.6em] text-red-500'>{errors.password.message}</p>}


          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium">Confirm Password</label>
            <Input
              type={showPassword2 ? "text" : "password"}
              className="w-full p-2 border rounded-md"
             {...register('confirm')}

            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-500"
              onClick={() => setShowPassword2(!showPassword2)}
            >
              {showPassword2 ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          {errors.confirm && <p className='text-[.6em] text-red-500'>{errors.confirm.message}</p>}


          <Button
           
            className=" w-full"
          >
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
