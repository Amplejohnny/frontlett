import { useState, useEffect } from "react";
import {
    LuArrowLeft,
    LuBuilding,
    LuBriefcase,
    LuListChecks,
    LuStar,
    LuFileText,
    LuClock,
    LuCalendar,
    LuGraduationCap,
    LuDollarSign,
    LuClock3,
    LuCircleCheckBig,
    LuArrowRight,
} from "react-icons/lu"
import { Link, useNavigate, useParams } from "react-router"
import Button from "~/components/ui/button";
import { get, post } from "~/libs/axios";
import type { Route } from "./+types/apply";
import Modal from "~/components/dashboard/modal";
import Textarea from "~/components/dashboard/textarea";


export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Frontlett - Apply for a Job" },
        { name: "description", content: "Join as a freelancer and start your journey." },
    ];
}

type Job = {
    user: {
        company_name: string;
        company_location: string;
    }
    title: string
    description: string;
    created_at: string
    rate: number;
    skills: string[];
    experience: string;
    education: string;
    level: string;
    requirements: string[];
    time_slot: {
        day: string;
        start: string;
        end: string;
    }[];
    id: number;
}
export default function JobPosting() {
    const [isOpen, setIsOpen] = useState(false);
    const [job, setJob] = useState<Job>()
    const navigate = useNavigate();
    const { id } = useParams()
    const [form, setForm] = useState<{
        slot: any[];
        cover_note: string;
        post_job_id?: number;
    }>({
        slot: [],
        cover_note: '',
        post_job_id: parseInt(id??'0'),
    });
    useEffect(() => {
        getQuery()
    }, []);
    useEffect(() => {
        setErrors({ slot: '' });
        setActive(0),
            setForm({
                slot: [],
                cover_note: '',
                post_job_id: parseInt(id??'0'),
            })
    }, [isOpen])
    const getQuery = async () => {
        await get<{ success: boolean, job: Job }>(`jobs/single/${id}`)
            .then(res => {
                const { success, job } = res.data;
                if (success) {
                    setJob(job);
                }
            })
    }
    const [errors, setErrors] = useState({
        slot: '',
    });
    const [active, setActive] = useState(0);
    const handleNext = async() => {
        if (form.slot.length === 0) {
            setErrors({ ...errors, slot: 'Please select at least one time slot.' });
            return false
        }
        if(active === 0) return setActive(1)
        await post<any, any>('/jobs/apply', form)
            .then(res => {
                const {success} = res.data;
                if(success){
                    navigate('/dashboard/home')
                }
            })
    }

    const handleSelect = (index: number) => {
        const slots = [...form.slot];
        const slot = job?.time_slot[index]
        const isSelected = slots.findIndex((s) => s.day === slot?.day && s.start === slot?.start && s.end === slot?.end);
        if (isSelected !== -1) {
            // setErrors({ ...errors, slot: '' });
            slots.splice(isSelected, 1);
            // return () => setForm(pv => ({...pv, slot: slots.filter(s => s.day !== slot?.day && s.start !== slot?.start && s.end !== slot?.end)}))
        } else {
            // setErrors({ ...errors, slot: '' });
            slots.push(slot);
            // return () => setForm(pv => ({...pv, slot: [...pv.slot, slot]}))
        }
        setForm(pv => ({ ...pv, slot: slots }));
        setErrors({ ...errors, slot: '' });
            console.log(slots)
        // () => setForm(pv => ({...pv, slot: [...pv.slot, slot]}))
    }

    return (
        <div className="max-w-5xl mx-auto bg-[#f8fafc] dark:bg-neutral-800 min-h-screen pb-8">
            {/* Header with back button */}
            <div className="p-4">
                <button onClick={() => navigate(-1)} className="flex items-center text-[#64748b] dark:text-neutral-400 font-medium">
                    <LuArrowLeft className="mr-2 h-4 w-4" />
                    Back to Jobs
                </button>
            </div>

            {/* Banner with profile */}
            <div className="relative w-full aspect-[16_/_6] bg-[#0f1729] rounded-lg overflow-hidden">
                <img
                    src="/images/apply-header.jpg"
                    alt="Person writing in notebook"
                    className="object-cover opacity-80"
                />

                {/* Profile section */}
                <div className="absolute bottom-0 left-0 p-6 w-full">
                    <div className="flex items-start">
                        <div className="bg-[#4f46e5] w-20 h-20 rounded-lg flex items-center justify-center text-white text-4xl font-bold">
                            {job?.user?.company_name?.charAt(0)}
                        </div>
                        <div className="ml-4">
                            <h1 className="text-white text-3xl font-bold">{job?.title}</h1>
                            <div className="flex items-center text-white/80">
                                <LuBuilding className="h-4 w-4 mr-1" />
                                <span>{job?.user?.company_name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Job details */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        <div className="bg-white dark:bg-neutral-700 rounded-full px-4 py-2 flex items-center text-sm">
                            <LuDollarSign className="h-4 w-4 mr-1 text-[#4f46e5] dark:text-neutral-300" />
                            <span>₦{job?.rate}/hr</span>
                        </div>
                        {job?.time_slot?.map(slot => <div key={`${slot.day}_${slot.start}_1`} className="bg-white dark:bg-neutral-700 rounded-full px-4 py-2 flex items-center text-sm">
                            <LuClock3 className="h-4 w-4 mr-1 text-[#4f46e5] dark:text-neutral-300" />
                            <span>{slot.day} {slot.start}-{slot.end}</span>
                        </div>)}
                    </div>

                    {/* Apply button */}
                    <div className="mt-4">
                        <Button onClick={() => setIsOpen(true)}>
                            Apply Now
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 mt-4">
                {/* Left column - 2/3 width */}
                <div className="md:col-span-2 space-y-4">
                    {/* About company */}
                    {/* <div className="bg-white dark:bg-neutral-700 p-6 rounded-lg border border-[#e2e8f0] dark:border-neutral-500 dark:border-neutral-500">
                        <div className="flex items-center mb-4">
                            <LuBuilding className="h-5 w-5 text-[#4f46e5] dark:text-neutral-300 mr-2" />
                            <h2 className="text-xl font-bold">About {job.company_name}</h2>
                        </div>
                        <p className="text-[#64748b] dark:text-neutral-400">
                            Designify is a leading design agency that specializes in creating intuitive and beautiful user
                            experiences. Our team of talented designers work with clients across various industries to bring their
                            digital products to life.
                        </p>
                    </div> */}

                    {/* Job role */}
                    <div className="bg-white dark:bg-neutral-700 p-6 rounded-lg border border-[#e2e8f0] dark:border-neutral-500">
                        <div className="flex items-center mb-4">
                            <LuBriefcase className="h-5 w-5 text-[#4f46e5] dark:text-neutral-300 mr-2" />
                            <h2 className="text-xl font-bold">Job Role</h2>
                        </div>
                        <p className="text-[#64748b] dark:text-neutral-400">
                        <article  dangerouslySetInnerHTML={{__html: job?.description ?? ''}} />
                        </p>
                    </div>

                    {/* Requirements */}
                    <div className="bg-white dark:bg-neutral-700 p-6 rounded-lg border border-[#e2e8f0] dark:border-neutral-500">
                        <div className="flex items-center mb-4">
                            <LuListChecks className="h-5 w-5 text-[#4f46e5] dark:text-neutral-300 mr-2" />
                            <h2 className="text-xl font-bold">Requirements</h2>
                        </div>
                        <ul className="space-y-3">
                            {job?.requirements?.map((requirement, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <LuCircleCheckBig color="#22c55e" />
                                    <span className="text-[#64748b] dark:text-neutral-400">{requirement}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right column - 1/3 width */}
                <div className="space-y-4">
                    {/* Skills */}
                    <div className="bg-white dark:bg-neutral-700 p-6 rounded-lg border border-[#e2e8f0] dark:border-neutral-500">
                        <div className="flex items-center mb-4">
                            <LuStar className="h-5 w-5 text-[#4f46e5] dark:text-neutral-300 mr-2" />
                            <h2 className="text-xl font-bold">Skills</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {job?.skills?.map(skill => (
                                <span key={skill} className="bg-[#e5edff] dark:bg-neutral-600 dark:text-neutral-300 text-[#153b8f] px-3 py-1 rounded-md text-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Job Summary */}
                    <div className="bg-white dark:bg-neutral-700 p-6 rounded-lg border border-[#e2e8f0] dark:border-neutral-500">
                        <div className="flex items-center mb-4">
                            <LuFileText className="h-5 w-5 text-[#4f46e5] dark:text-neutral-300 mr-2" />
                            <h2 className="text-xl font-bold">Job Summary</h2>
                        </div>

                        <div className="space-y-4">
                            {/* Experience */}
                            <div className="flex items-start">
                                <div className="bg-[#e5edff] dark:bg-neutral-600 p-2 rounded-lg mr-3">
                                    <LuCalendar className="h-5 w-5 text-[#4f46e5] dark:text-neutral-300" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Experience</h3>
                                    <p className="text-[#64748b] dark:text-neutral-400">{job?.experience}</p>
                                </div>
                            </div>

                            {/* Education */}
                            <div className="flex items-start">
                                <div className="bg-[#e5edff] dark:bg-neutral-600 p-2 rounded-lg mr-3">
                                    <LuGraduationCap className="h-5 w-5 text-[#4f46e5] dark:text-neutral-300" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Education</h3>
                                    <p className="text-[#64748b] dark:text-neutral-400">{job?.education}</p>
                                </div>
                            </div>

                            {/* Job Level */}
                            <div className="flex items-start">
                                <div className="bg-[#e5edff] dark:bg-neutral-600 p-2 rounded-lg mr-3">
                                    <LuBriefcase className="h-5 w-5 text-[#4f46e5] dark:text-neutral-300" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Job Level</h3>
                                    <p className="text-[#64748b] dark:text-neutral-400">{job?.level}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Available Slots */}
                    <div className="bg-white dark:bg-neutral-700 p-6 rounded-lg border border-[#e2e8f0] dark:border-neutral-500">
                        <div className="flex items-center mb-4">
                            <LuClock className="h-5 w-5 text-[#4f46e5] dark:text-neutral-300 mr-2" />
                            <h2 className="text-xl font-bold">Available Slots</h2>
                        </div>

                        <div className="space-y-3">
                            {/* Tuesday slot */}
                            {job?.time_slot?.map(slot => <div key={`${slot.day}_${slot.start}`} className="flex items-center p-3 border border-[#e2e8f0] dark:border-neutral-500 dark:bg-neutral-600 rounded-lg">
                                <div className="bg-[#e5edff] dark:bg-neutral-600 p-2 rounded-lg mr-3">
                                    <LuCalendar className="h-5 w-5 text-[#4f46e5] dark:text-neutral-300" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{slot.day}</h3>
                                    <p className="text-[#64748b] dark:text-neutral-400 text-sm">{slot.start}-{slot.end}</p>
                                </div>
                            </div>)}
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={`Apply for ${job?.title}`} desc={job?.title}>
                {active === 0 && <div className="flex flex-col gap-4 w-full my-4">
                    <div className="self-stretch text-[#0F1729] dark:text-neutral-300 text-[14px] font-medium">Select available time slots</div>
                    <div className="grid grid-cols-3 items-start gap-2 w-full">
                        {job?.time_slot?.map((slot, index) => <button key={`${slot.day}_${slot.start}_save`} type="button"
                            onClick={() => handleSelect(index)}
                            className={`flex flex-col w-full p-2 items-start gap-[10px] text-left self-stretch rounded-[12px] border dark:border-neutral-500 ${form.slot.includes(slot) ? 'bg-[rgba(37,_99,_235,_0.05)]' : ''}`}>
                            <div className="flex items-start gap-[12px] self-stretch">
                                <div className="flex w-[20px] h-[20px] justify-center items-center bg-[rgba(0,_0,_0,_0.00)]">
                                    <LuCalendar size={20} color="#2563EB" />
                                </div>
                                <div className="flex justify-between items-center flex-1">

                                    <div className="flex flex-col items-start gap-[4px]">
                                        <p className="self-stretch text-[#0F1729] text-[14px] font-medium dark:text-neutral-300">{slot.day}</p>
                                        <span className="self-stretch text-[#64748B] dark:text-neutral-400 text-[13px]">{slot.start}-{slot.end}</span>
                                    </div>
                                    {form.slot.includes(slot) && <LuCircleCheckBig size={20} color="#2563EB" />}
                                </div>
                            </div>
                        </button>)}
                        {errors.slot && <span className="text-sm text-red-500 col-span-full">{errors.slot}</span>}
                    </div>
                </div>}
                {active === 1 && <div className="flex flex-col gap-4 w-full my-4">
                    <div className="self-stretch text-[#0F1729] dark:text-neutral-300 text-[14px] font-medium">Add a cover note (optional)</div>
                    <Textarea onChange={e=>setForm(pv=>({...pv, cover_note: e.target.value}))} value={form.cover_note} rows={6} />
                        <div className="flex p-[12px] flex-col items-start gap-[10px] self-stretch rounded-[12px] bg-[#F0F5FF] dark:bg-neutral-600">
                            <div className="flex flex-col items-start gap-[8px] self-stretch">
                                <p className="self-stretch text-[#153B8F] dark:text-neutral-300 text-[14px] font-medium">
                                    Selected slots
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                    {form.slot.map(slot=><div key={`${slot.day}_${slot.start}_slot`} className="flex gap-2 items-center">
                                    <LuClock className="text-[#0F1729] dark:text-neutral-300" />
                                    <p className="text-[#0F1729] dark:text-neutral-300 text-[12px]">{slot.day} - {slot.start}-{slot.end}</p>
                                </div>)}
                                </div>
                            </div>
                        </div>
                </div>}
                <div className="flex justify-between items-center self-stretch">
                    <Button outline className="h-10 bg-white dark:bg-neutral-600 border-none text-gray-700 dark:text-neutral-300" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button className="h-10" onClick={handleNext}>Next <LuArrowRight /></Button>
                </div>

            </Modal>
        </div>
    )
}
