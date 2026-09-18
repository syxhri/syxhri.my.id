"use client"

import Button from "@/components/button";
import Input from "@/components/input";
import Navbar from "@/components/navbar";
import ProfileAvatar from "@/components/profile-avatar";
import Textarea from "@/components/textarea";
import buildValidationError from "@/lib/build-validation-error";
import { IconBrandGithub, IconBrandInstagram, IconBrandLinkedin, IconBrandTelegram, IconDownload, IconMail } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type ContactInputs = { name: string; email: string; message: string; }

export default function Home() {
  let { register, handleSubmit, reset, setError, formState: { errors } } = useForm<ContactInputs>();
  let [loading, setLoading] = useState<boolean>(false);
  let [contrib, setContrib] = useState<string>("fetching...");
  let [GHLang, setGHLang] = useState<string>("fetching...");

  useEffect(() => {
    const fetchStats = async() => {
      try {
        let get = await fetch('/api/stats');
        let data = await get.json();

        setContrib(data.contributed_to);
        setGHLang(data.most_used_lang);
      } catch {
        setContrib('failed to load...');
        setGHLang('failed to load...');
      }
    }

    fetchStats();
  }, []);

  let sendMessage: SubmitHandler<ContactInputs> = async(d) => {
    try {
      setLoading(true);
      let { data } = await axios('/api/sendmessage', { method: 'POST', data: d });

      toast.success(data.message);
      reset();
      setLoading(false);
    } catch (error) {
      buildValidationError(error, setError);
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar page="home" />
      <div className="mt-16">
        <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-xl md:text-2xl text-gray-900 dark:text-white font-bold">Hi 👋, I'm Alfisyahri Amrun A.</h1>
            <p className="text-sm text-primary-600 dark:text-primary-400 font-mono mt-1">
              Software Engineering Technology Student • Gorontalo, ID
            </p>
          </div>
          <ProfileAvatar className="w-20 h-20 sm:w-24 sm:h-24 shrink-0" />
        </div>

        <div className="text-neutral-700 dark:text-neutral-300 leading-7 flex flex-col gap-3 mt-4 text-justify">
          <p>
            Also known as Asa, a Software Engineering Technology student at Universitas Negeri Gorontalo. I focus on backend systems, web development, and data technologies, working with Go, Python, JavaScript, and Kotlin.
          </p>
          <p>
            I love learning by building practical software and experimenting with modern tech. Currently, I work mostly with{" "}
            <span className="highlight">{GHLang}</span> and have contributed to{" "}
            <span className="highlight">{contrib}</span> repositories on GitHub.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-4 items-center">
            <Link href={'https://github.com/syxhri'} target="_blank" aria-label="GitHub" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"><IconBrandGithub className="w-6 h-6" /></Link>
            <Link href={'https://instagram.com/alfi.ndyou'} target="_blank" aria-label="Instagram" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"><IconBrandInstagram className="w-6 h-6" /></Link>
            <Link href={'https://www.linkedin.com/in/alfisyahri-asa'} target="_blank" aria-label="LinkedIn" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"><IconBrandLinkedin className="w-6 h-6" /></Link>
            <Link href={'mailto:alfisyahri.aac@gmail.com'} target="_blank" aria-label="Email" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"><IconMail className="w-6 h-6" /></Link>
          </div>
          <a
            href="/Curriculum Vitae.pdf"
            download="Curriculum Vitae - Alfisyahri Amrun A.pdf"
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md bg-primary-500 hover:bg-primary-600 text-white shadow-xs transition-all"
          >
            <IconDownload className="w-4 h-4" />
            <span>Download CV</span>
          </a>
        </div>
      </div>
      <div className="mt-32">
        <h1 className="text-xl md:text-2xl text-gray-900 dark:text-white font-bold">Get In Touch 📮</h1>
        <form onSubmit={handleSubmit(sendMessage)} className="mt-4 text-neutral-700 dark:text-neutral-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name">name</label>
              <Input type="text" id="name" {...register('name', { required: true })} placeholder="asa" />
              <span className="text-xs text-red-400">{errors.name?.message}</span>
            </div>
            <div>
              <label htmlFor="email">email</label>
              <Input type="email" id="email" {...register('email', { required: true })} placeholder="asa@example.com" />
              <span className="text-xs text-red-400">{errors.email?.message}</span>
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="message">message</label>
            <Textarea id="message" {...register('message', { required: true })} placeholder="haloo kaks!" />
            <span className="text-xs text-red-400">{errors.message?.message}</span>
          </div>
          <div className="mt-2">
            <Button className="w-full" disabled={loading}>send message</Button>
          </div>
        </form>
      </div>
    </>
  );
}
