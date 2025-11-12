'use client'
import Playerlayout from '@/components/layout/Playerlayout'
import React, { useRef, useState } from 'react'
import Dashboard from './Dashboard'
import Tables from './Table'
import Playnow from './Playnow'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Volume2, VolumeX } from 'lucide-react'

export default function page() {
  const [open, setOpen] = useState(true)
   const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
      const video = videoRef.current;
      if (video) {
        video.muted = !video.muted;
        setMuted(video.muted);
      }
    };


  return (
    <Playerlayout>

      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className=' !p-0 w-[95%]'>
        <video
          src={'/popupvideo.mp4'}
          autoPlay
          ref={videoRef}
          loop
          muted={muted}
          playsInline
          preload="auto"
          className=' h-auto rounded-md'
        />

         <button
          onClick={toggleMute}
          className="absolute z-50 bottom-4 right-4  text-white p-2 rounded-full transition"
          aria-label={muted ? 'Unmute video' : 'Mute video'}
        >
          {muted ? <VolumeX size={25} /> : <Volume2 size={25} />}
        </button>
      </DialogContent>
    </Dialog>
       

      <Dashboard/>
        <div className=' w-full '>
          <Tables/>
        </div>
    </Playerlayout>
  )
}
