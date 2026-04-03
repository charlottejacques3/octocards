'use server'
import { redirect } from "next/navigation";
import { callAPIServer } from "./callAPIServer";

export const logout = async () => {
  await callAPIServer('logout/', {
    method: 'POST'
  });
  redirect('/login');
}