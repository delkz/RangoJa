import React from 'react'
import Image from "next/image";
import logo from '/public/imgs/LogoGray.svg'

const Footer = () => {
    return (
        <div className="bg-white w-full mb-6 p-8 rounded-3xl flex justify-center items-center gap-3 text-gray-400 flex-col text-center">
            <Image src={logo} alt={"RangoJá"} width={110} />
            <a rel="follow" target='_blank' title='Creditos ao autor' href="https://github.com/delkz">Desenvolvido por: David</a>
        </div>
    )
}

export default Footer