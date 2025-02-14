'use client'
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Pagination from '@/components/common/Pagination'
import { Plus } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import rateStore from '@/store/rate'
import refreshStore from '@/store/refresh'
import loadingtableStore from '@/store/tableloading'
import { Input } from '@/components/ui/input'
import Changepasswordplayer from '@/components/forms/Changepasswordplayer'
  

interface List {
   id: string
    username: string
    phonenumber: string
    status: string
    createdAt: string
}

export default function PlayerTable() {
    const router = useRouter()
    const [list, setList] = useState<List[]>([])
    const [totalpage, setTotalPage] = useState(0)
    const [currentpage, setCurrentPage] = useState(0)
    const {loading, setLoading, clearLoading} = loadingtableStore()
    const {rate, setRate, clearRate} = rateStore()
    const {refresh, setRefresh} = refreshStore()
    const [search, setSearch] = useState('')
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<List[]>([]);
    const [open, setOpen] = useState(false)

    // Handle individual checkbox change
    const handleCheckboxChange = (user: List) => {
        setSelectedUsers((prev) =>
        prev.some((u) => u.id === user.id)
            ? prev.filter((u) => u.id !== user.id) // Deselect
            : [...prev, user] // Select
        );
    };

    const getSameStatus = (): string | null => {
        if (selectedUsers.length === 0) return null; 
      
        const uniqueStatuses = [...new Set(selectedUsers.map(user => user.status))];
      
        return uniqueStatuses.length === 1 ? uniqueStatuses[0] : null;
      };
      
      const sameStatus = getSameStatus();
      const allSameStatus = selectedUsers.every(user => user.status === selectedUsers[0]?.status);




    useEffect(() => {
        setLoading(true);
      
        const delayDebounceFn = setTimeout(async () => {
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/user/getplayerlist?page=${currentpage}&limit=10&search=${search}`,
              {
                withCredentials: true,
              }
            );
      
            setList(response.data.data.userlist);
            setTotalPage(response.data.data.totalPages);
            setLoading(false);
          } catch (error) {
            setLoading(false);
      
            if (axios.isAxiosError(error)) {
              const axiosError = error as AxiosError<{ message: string; data: string }>;
              if (axiosError.response && axiosError.response.status === 401) {
               
              }
            }
          }
        }, 500); 
      
       
        return () => clearTimeout(delayDebounceFn);
      }, [currentpage, refresh, search, router]); 

      const banuser = async () => {
        if (!allSameStatus) {
            toast.error("Selected users must have the same status to perform this action.");
            return;
        }

        if (selectedUsers.length === 0) {
            toast.error("Please select users below.");
            return;
        }
    
        setLoading(true);
        setRefresh("true");
    
        const selectedUserIds = selectedUsers.map(user => user.id);
        const formattedData = {
            status: sameStatus === "active" ? "banned" : "active",
            userlist: selectedUsers.map(user => ({
              userid: user.id,
              banreason: sameStatus === "active" ? "Violation of terms" : "" // Set a reason when banning, empty when unbanning
            }))
          };
    
        try {
            const request = axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/user/multiplebanusers`,
                {
                    status: formattedData.status,
                    userlist: formattedData.userlist,
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "Application/json",
                    },
                }
            );
    
            const response = await toast.promise(request, {
                loading: `${sameStatus === "active" ? "Banning" : "Unbanning"} player account...`,
                success: `Successfully ${sameStatus === "active" ? "banned" : "unbanned"}.`,
                error: `Error while ${sameStatus === "active" ? "banning" : "unbanning"} player account.`,
            });
    
            if (response.data.message === "success") {
                setLoading(false);
                setRefresh("false");
                setSelectedUsers([]);
                setOpen(false);
            }
        } catch (error) {
            setLoading(false);
            setRefresh("false");
    
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{ message: string; data: string }>;
                if (axiosError.response) {
                    toast.error(`${axiosError.response.data.data}`);
                    if (axiosError.response.status === 401) router.push("/");
                }
            }
        }
    };
    

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }



  return (
     <div className=' w-full flex flex-col gap-4 h-auto bg-white rounded-xl shadow-sm mt-4 p-6'>
        <p className=' text-sm font-medium'>Player List</p>

        <div className=' flex flex-wrap items-center gap-4'>
            <Input placeholder='Search e.g user123' value={search} onChange={(e) => setSearch(e.target.value)} className=' w-fit'/>
           <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className={`${sameStatus === 'active' ? 'primary-red' : 'primary-green px-4'}`}>{sameStatus === 'active' ? 'Ban' : 'Unban' }</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>{sameStatus === 'active' ? 'Ban' : 'Unban' } User</DialogTitle>
                <DialogDescription>
                    Are you sure you want to {sameStatus === 'active' ? 'ban' : 'unban' } selected users
                 </DialogDescription>
                </DialogHeader>

                <div className=' flex flex-col'>
                    <p className=' text-sm font-semibold'>Selected users</p>

                    <div className=' flex items-center gap-4'>
                        {selectedUsers.map((item, index) => (
                            <p key={index} className={`text-xs ${sameStatus === 'active' ? 'text-red-600' : 'text-blue-600'}`}>{item.username}</p>
                        ))}

                    </div>
                </div>

                <div className=' w-full flex items-center justify-end gap-4'>
                    <button onClick={banuser} className={`${sameStatus === 'active' ? 'danger-btn' : ' primary-btn px-4'}`}>{sameStatus === 'active' ? 'Ban' : 'Unban' }</button>
                </div>
            </DialogContent>
            </Dialog>

        </div>
            <Table>
                {loading === true && (
                    <TableCaption>
                        <span className='loaderdark'></span>
                    </TableCaption>
                )}
                {list.length === 0 && (
                <TableCaption>No data.</TableCaption>
                )}
            <TableHeader>
                <TableRow>
                <TableHead className=" w-8">Action</TableHead>
                <TableHead className="">Date</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {list.map((item, index) => (
                    <TableRow key={index}>
                    <TableCell className="">
                    <input
                        type="checkbox"
                        checked={selectedUsers.some((u) => u.id === item.id)}
                        onChange={() => handleCheckboxChange(item)}
                        className=' cursor-pointer'
                        />

                    </TableCell>
                    <TableCell className="">{new Date(item.createdAt).toLocaleString()}</TableCell>

                    <TableCell>{item.username}</TableCell>
                    <TableCell className={`${item.status === 'active' ? 'text-blue-600' : 'text-red-600'}`}>{item.status}</TableCell>
                    <TableCell className=' flex items-center gap-2'>
                        <Changepasswordplayer id={item.id} username={item.username}/>
                        <a href={`/superadmin/playeraccount?id=${item.id}`} target='_blank' className=' bg-amber-950 text-[.6rem] px-3 py-1 text-white rounded-sm'>View</a>
                    </TableCell>
                   
                    </TableRow>
                ))}
                
            </TableBody>
            </Table>

            {list.length !== 0 && (
                <div className=' w-full flex items-center justify-center mt-6'>
                    <Pagination currentPage={currentpage} total={totalpage} onPageChange={handlePageChange}/>
                </div>
            )}
        
    </div>
  )
}
