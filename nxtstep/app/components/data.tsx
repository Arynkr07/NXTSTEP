"use client";

import { Career as DataCareer, CourseItem as DataCourseItem, careerOptions as enrichedCareers, getCareerById, getCareerByTitle, getCoursesForCareer } from "@/lib/data/careers";

export type Career = DataCareer;
export type CourseItem = DataCourseItem;
export const careerOptions: Career[] = enrichedCareers;
export { getCareerById, getCareerByTitle, getCoursesForCareer };

export default careerOptions;
