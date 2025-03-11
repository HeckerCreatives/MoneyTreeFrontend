'use client'
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';

interface Weather
{
    _id: string
    name: string,
    sound: string,


}
export default function Weather() {
    const [data, setData] = useState<Weather[]>([])
    const [name, setName] = useState('')
    const [sound, setSound] = useState('')

    useEffect(() => {
        const getData = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/weather/getweather`,{
            withCredentials:true
            })

            setData(response.data.data)
            
          } catch (error) {
            if (axios.isAxiosError(error)) {
              const axiosError = error as AxiosError<{ message: string, data: string }>;
              if (axiosError.response && axiosError.response.status === 401) {
                
                }    
              } 
          }
        }
        getData()
    },[ ])

    const update = async () => {
        try {
            const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/weather/editweather`,{
                name: name, sound: sound, id: data[0]._id
            },{
                withCredentials: true,
                headers:{
                    'Content-Type':'Application/json'
                }
            })

            const response = await toast.promise(request, {
                loading: `Saving weather...`,
                success: `Saved successfully. `,
                error: `Error while saving weather.`,
            });
            if(response.data.message === 'success'){
            }

        } catch (error) {

             if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError<{ message: string, data: string }>;
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
};

  
  return (
    <div className=' h-fit w-fit flex flex-col p-4 gap-4 bg-cream text-amber-950 rounded-md min-w-[200px]'>
        
        <p className=' text-lg font-semibold'>Weather</p>

        <div className=' flex flex-col gap-1'>
            <label htmlFor="">Name</label>
            <Input defaultValue={data[0]?.name} onChange={(e) => setName(e.target.value)}/>

            <label htmlFor="">Sound</label>
            <Input defaultValue={data[0]?.sound} onChange={(e) => setSound(e.target.value)}/>

            <Button onClick={update} className=' mt-4'>Save</Button>
        </div>

        
    </div>
  )
}
