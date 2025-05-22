import { createElement, useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { AiOutlineFundView } from "react-icons/ai";
import { LuArrowRight, LuBriefcase, LuCalendar, LuSearch, LuTrendingUp, LuUsers } from "react-icons/lu";
import Button from "~/components/ui/button";
import useAuth from "~/stores/authStore";
import Modal from "./modal";
import { get } from "~/libs/axios";
import { useNavigate } from 'react-router'
import { format } from 'date-fns'
import type { Route } from "../../routes/dashboard/+types/dashboard";


const lists = [{
    title: 'All Jobs Posted',
    icon: LuBriefcase,
    colors: ['#E5EDFF', '#1C4FBD', '#2563EB']
}, {
    title: 'Total Applicants',
    icon: LuUsers,
    colors: ['#DCFCE7', '#16A34A', '#16A34A']
}, {
    title: 'Total Views',
    icon: AiOutlineFundView,
    colors: ['#EDC7FE', '#AF06D9', '#AF06D9']
}, {
    title: 'Pending Interviews',
    icon: LuCalendar,
    colors: ['#FEF3C7', '#D97706', '#D97706']
},]
type Job = {
    id: number;
    title: string;
    created_at: string;
    time_slot: string[]
}

const BusinessDashboard = (loaderData: { jobs?: Job[]; dashboard?: number[] }) => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [jobs, setJobs] = useState<Job[]>(loaderData.jobs ?? [])
    const [dashboard, setDashboard] = useState(loaderData.dashboard ?? [0, 0, 0, 0]);
    const navigate = useNavigate();
    // useEffect(() => {
    //     getQuery()
    // }, []);
    // const getQuery = async () => {
    //     await get<{ success: boolean, jobs: { id: number; title: string; created_at: string; time_slot: string[] }[]; applicants: number }>('jobs')
    //         .then(res => {
    //             const { success, jobs, applicants } = res.data;
    //             if (success) {
    //                 setJobs(jobs);
    //                 setDashboard([jobs.length, applicants, 0, 0])
    //             }
    //         })
    // }
    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col items-center gap-6 self-stretch py-4">
                <div className="flex items-center justify-between self-stretch border-b dark:border-neutral-500">
                    <div className="flex items-center gap-2 md:gap-6">
                        <div className="flex w-[72px] h-[72px] p-0 justify-center items-center rounded-[50px]">
                            <img src="/images/avatar.png" alt="" />
                        </div>
                        <div className="flex max-w-[721px] w-full flex-col items-start gap-1">
                            <p className="text-sm">{user?.company_name}</p>
                            <h2 className="text-lg md:text-2xl font-medium tracking-[0px]">Welcome, {user?.full_name?.substring(0, user.full_name.indexOf(' ')).toUpperCase()} 👋</h2>
                        </div>
                    </div>
                    <Button onClick={() => navigate('/dashboard/job/create')}>Post a Job</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-center gap-2.5 self-stretch">
                    {lists.map((item, index) => <Card key={item.title} item={item} amount={dashboard[index]} />)}
                </div>
                <div className="md:h-[184px] pt-4 flex items-center flex-col overflow-hidden md:flex-row justify-between self-stretch rounded-[20px] bg-[rgba(214,_217,_235,_0.60)] dark:bg-neutral-700 md:px-4 px-2">
                    <div className="flex max-w-[534px] w-full flex-col items-start gap-4">
                        <div className="flex flex-col items-start gap-2 self-stretch">
                            <p className="self-stretch md:text-2xl text-xl font-medium tracking-[0px]">Cut Salary Costs by 40% with Flexible Talent</p>
                            <p className="self-stretch text-[17px] dark:text-neutral-400">Hire vetted professionals for exact time slots—no full-time overhead.</p>
                        </div>
                        <button className="flex w-[203px] p-[10px] items-center gap-1.5 rounded-[20px] border dark:border-neutral-500 bg-white dark:bg-neutral-500">
                            <LuSearch size={20} className="text-[#64748B] dark:text-neutral-300" />
                            <span className="flex flex-col justify-center text-sm font-semibold text-black dark:text-white">Discover resources</span>
                        </button>
                    </div>
                    <div className="flex">
                        <img src="/images/discover2.png" alt="" className="flex-shrink-0 -mr-12" />
                        <img src="/images/business-middle.png" alt="" className="flex-shrink-0 -ml-24 z-[2]" />
                        <img src="/images/business-right.png" alt="" className="flex-shrink-0 h-5/6 mt-6 w-auto -ml-20 z-[1]" />
                    </div>

                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-[24px] self-stretch">
                <div className="flex p-px flex-col items-start gap-[10px] rounded-[12px] border-[1px] dark:border-neutral-500 bg-white dark:bg-neutral-700 [box-shadow:0px]">
                    <div className="flex h-[334px] flex-col items-center self-stretch shadow overflow-y-auto">
                        <div className="flex p-[23px] items-center justify-between gap-[27px] self-stretch bg-[rgba(0,_0,_0,_0.00)]">
                            <div className="flex flex-col items-start gap-[7px]">
                                <div className="flex items-center gap-[8px]">
                                    <LuBriefcase />
                                    <h2 className="flex flex-col justify-center text-[#0F1729] dark:text-neutral-300 text-[15px] font-medium tracking-[0px]">Recent Job Postings</h2>
                                </div>
                                <p className="self-stretch text-[#64748B] dark:text-neutral-400 text-[14px]">Your most recently posted jobs</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <p className="flex flex-col justify-center text-[12px] font-medium">View All Jobs</p>
                                <LuArrowRight />
                            </div>
                        </div>
                        {jobs.length === 0 && <div className="flex h-full justify-center items-center">
                            <div className="flex flex-col items-center gap-2.5">
                                <p className="self-stretch text-[12px] font-medium">You haven’t posted any job yet</p>
                                <Button onClick={() => setIsOpen(true)}>Post a Job</Button>
                            </div>
                        </div>}

                        {jobs.length > 0 && <div className="flex flex-col items-start gap-[1px] self-stretch">
                            <div className="flex p-[16px] flex-col items-start gap-[10px] self-stretch bg-[rgba(0,_0,_0,_0.00)]">
                                {jobs.map(job => <div key={job.id} className="flex justify-between items-center self-stretch">
                                    <div className="flex flex-col items-start">
                                        <h2 className="self-stretch text-[#0F1729] dark:text-neutral-300 text-[16px] font-medium">{job.title} {job.time_slot.length} 2-Hours Slot</h2>
                                        <p className="self-stretch text-[#64748B] dark:text-neutral-400 text-[14px]">0 applicants • Posted {format(new Date(job.created_at), 'dd/MM/yyyy')}</p>
                                    </div>
                                    {/* <button className="flex p-2 md:px-4 justify-center items-center gap-[10px] rounded-[10px] border-[1px] text-[#0F1729] dark:text-neutral-300 text-center text-[14px] font-medium">
                                        View
                                    </button> */}
                                </div>)}
                            </div>
                        </div>}
                    </div>
                </div>
                <div className="flex p-px flex-col items-start gap-[10px] rounded-[12px] border-[1px] dark:border-neutral-500 bg-white dark:bg-neutral-700 [box-shadow:0px]">
                    <div className="flex h-[334px] flex-col items-center gap-[74px] self-stretch shadow">
                        <div className="flex p-[23px] items-center justify-between gap-[27px] self-stretch bg-[rgba(0,_0,_0,_0.00)]">
                            <div className="flex w-[310px] flex-col items-start gap-[7px]">
                                <div className="flex items-center gap-[8px]">
                                    <LuCalendar />
                                    <h2 className="flex flex-col justify-center text-[#0F1729] dark:text-neutral-300 text-[15px] font-medium tracking-[0px]">Upcoming Interviews</h2>
                                </div>
                                <p className="self-stretch text-[#64748B] dark:text-neutral-400 text-[14px]">Your scheduled candidate interviews</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <p className="flex flex-col justify-center text-[12px] font-medium">View All</p>
                                <LuArrowRight />
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2.5">
                            <p className="self-stretch text-[12px] font-medium">You have no upcoming interviews</p>
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={isOpen} title="How do you want to hire?" onClose={() => setIsOpen(false)}>
                <div className="flex justify-center items-center self-stretch bg-[rgba(0,_0,_0,_0.00)]">
                    <div className="grid grid-cols-2 w-full gap-2">
                        <button onClick={() => navigate('/dashboard/job/create')} className="flex pb-1 flex-col items-start gap-[10px] flex-shrink-0 rounded-[16px] overflow-hidden border dark:border-neutral-500 bg-[rgba(0,_0,_0,_0.00)]">
                            <div className="flex flex-col items-center md:gap-4 gap-2 self-stretch">
                                <div className="h-[153px] self-stretch bg-gray-300"></div>
                                <div className="flex w-[190px] flex-col items-start">
                                    <p className="self-stretch text-[19px] font-medium text-left">Post a job</p>
                                    <span className="self-stretch text-[11px] text-left">Get matched with top contractors</span>
                                </div>
                            </div>
                        </button>
                        <button className="flex pb-1 flex-col items-start gap-[10px] flex-shrink-0 rounded-[16px] overflow-hidden border dark:border-neutral-500 bg-[rgba(0,_0,_0,_0.00)]">
                            <div className="flex flex-col items-center md:gap-4 gap-2 self-stretch">
                                <div className="h-[153px] self-stretch bg-gray-300"></div>
                                <div className="flex w-[190px] flex-col items-start">
                                    <p className="self-stretch text-[19px] font-medium text-left">Search for Resource</p>
                                    <span className="self-stretch text-[11px] text-left">Discover resource for you organization</span>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
type Props = {
    item: {
        colors: string[],
        title: string;
        icon: IconType
    }
    amount: number;
}

const Card = ({ item: { colors, title, icon }, amount }: Props) => {
    return (
        <div className="flex p-4 flex-col items-start gap-2.5 rounded-[12px] border dark:border-neutral-600 bg-white dark:bg-neutral-700 [box-shadow:0px]">
            <div className="flex flex-col items-start gap-0.5 self-stretch">
                <div className="flex justify-between items-center self-stretch">
                    <div className="flex flex-col items-start gap-1">
                        <p className="text-[#64748B] dark:text-neutral-300 text-[12px] font-medium">{title}</p>
                        <h2 className="self-stretch text-[#0F1729] dark:text-white text-[30px] font-bold">{amount}</h2>
                    </div>
                    <div className="flex w-[48px] h-[48px] p-[14px] justify-center items-center rounded-full" style={{ backgroundColor: colors[0] }}>
                        {createElement(icon, {
                            color: colors[1]
                        })}
                        {/* <LuBriefcase color={} /> */}
                    </div>
                </div>
                {/* <div className="flex items-center gap-1">
                    <LuTrendingUp color={colors[2]} />
                    <p className="flex flex-col justify-center text-[12px]" style={{ color: colors[2] }}>12.5%</p>
                    <p className="text-[#65758B] dark:text-neutral-300 text-xs">vs last period</p>
                </div> */}
            </div>
        </div>
    )
}

export default BusinessDashboard