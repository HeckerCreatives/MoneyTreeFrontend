import Playerlayout from '@/components/layout/Playerlayout'
import React from 'react'

export default function page() {
  return (
    <Playerlayout>
        <div className=' w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-12 gap-4'>

            <div className=' w-full aspect-video bg-cream'>

            </div>

            <div className=' w-full aspect-video bg-cream'>

            </div>

            <div className=' w-full aspect-video bg-cream'>

            </div>

        </div>
    </Playerlayout>
  )
}
