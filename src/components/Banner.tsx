'use client'
import styles from "./banner.module.css";
import Image from "next/image";
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function Banner() {
    const covers = ['/img/cover.jpg', '/img/cover2.jpg', '/img/cover3.jpg', '/img/cover4.jpg']
    const [index, setIndex] = useState(0)
    
    const router = useRouter()
    
    const {data:session} = useSession()

    return (
        <div className={styles.banner} onClick={()=>{setIndex(index+1)}}>
            <Image src={covers[index%4]} alt="banner" fill={true} priority objectFit="cover" />
            <div className={styles.bannerText}>
                <h1 className="text-4xl font-bold">where every event finds its venue</h1>
                <h3 className="text-xl">
                    Finding the perfect venue has never been easier. Whether it's a wedding, corporate event, or private
                    party, we connecting people to the perfect place.
                </h3>
            </div>
            {
                session? <div className="z-10 absolute top-5 right-10 font-semibold text-amber-200 text-xl">
                    Welcome {session.user?.name}
                </div>:null
            }
            <button className="bg-white text-amber-400 border-2 border-amber-400
            font-semibold py-2 px-2 m-2 rounded-tl-2xl z-30 absolute bottom-0 right-0
            hover:bg-amber-400 hover:text-white hover:border-transparent"
            onClick={(e)=>{e.stopPropagation(); router.push('/venue')}}>
                Select Venue
            </button>
        </div>
    );
}
