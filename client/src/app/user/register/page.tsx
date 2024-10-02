'use client'
import { api } from '@/app/services/api'
import { getCookie, setCookie } from 'cookies-next'
import { redirect } from 'next/navigation'
import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = {
  name: string
  email: string
  password: string
}

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const response = await api.post('', {
      query: `
      mutation Signup($email: String!, $password: String!, $name: String!) {
        signup(email: $email, password: $password, name: $name) {
          token
        }
      }
      `,
      variables:{
        email: data.email,
        password: data.password,
        name: data.name
      }
      
    }).then(resp => resp?.data);

    if(response.errors){
      alert(response.errors[0].message);
      return;
    }

    if(response.data.signup.token){
      setCookie("jwt",response.data.signup.token);
      setCookie("userData",JSON.stringify(response.data.signup.user));
      redirect("/");
    }

  
  };

  if(getCookie("jwt")){
    redirect("/");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name", { required: true })} type="text" />
      <input {...register("email", { required: true })} type="email" />
      <input {...register("password", { required: true })} type="password" />
      <input type="submit" />
      {(errors.email || errors.password) && <span>Verifique os campos</span>}
    </form>
  )
}

export default RegisterPage