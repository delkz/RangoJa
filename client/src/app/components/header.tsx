import React from 'react'
import Image from "next/image";
import logo from '/public/imgs/LogoRed.svg'

const Header = () => {
    return (
        <div className="bg-white w-full mb-6 p-8 rounded-3xl flex justify-center md:justify-start">
            <a href="/"><Image src={logo} alt={"RangoJá"} width={220} /></a>   
        </div>
    )
}

export default Header