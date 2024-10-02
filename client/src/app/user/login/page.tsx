'use client'
import { api } from '@/app/services/api'
import { getCookie, setCookie } from 'cookies-next'
import { redirect } from 'next/navigation'
import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = {
  email: string
  password: string
}

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const response = await api.post('', {
      query: `
      mutation Mutation($password: String!, $email: String!) {
        login(password: $password, email: $email) {
          token
          user {
            name
            id
            email
          }
        }
      }
      `,
      variables:{
        email: data.email,
        password: data.password,
      }
      
    }).then(resp => resp?.data);

    if(response.errors){
      alert(response.errors[0].message);
      return;
    }

    if(response.data.login.token){
      setCookie("jwt",response.data.login.token);
      setCookie("userData",JSON.stringify(response.data.login.user));
      redirect("/");
    }

  
  };

  if(getCookie("jwt")){
    redirect("/");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email", { required: true })} type="email" />
      <input {...register("password", { required: true })} type="password" />
      <input type="submit" />
      {(errors.email || errors.password) && <span>Verifique os campos</span>}
    </form>
  )
}

export default LoginPage