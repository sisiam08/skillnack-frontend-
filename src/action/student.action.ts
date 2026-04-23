"use server";

import { StudentService } from "@/service/student.service";


export const getStudentStats = async () => {
  const { data, error } = await StudentService.getStudentStats();

  return { data, error };
};

export const getStudentRecentActivity = async () => {
  const { data, error } = await StudentService.getStudentRecentActivity();
  return { data, error };
};
