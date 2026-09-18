"use client"

import Button from "@/components/button";
import Input from "@/components/input";
import Navbar from "@/components/navbar";
import Textarea from "@/components/textarea";
import buildValidationError from "@/lib/build-validation-error";
import { IconBrandGithub, IconBrandInstagram, IconBrandLinkedin, IconBrandTelegram, IconMail } from "@tabler/icons-react";
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
      <div className="mt-20">
        <h1 className="text-xl md:text-2xl text-gray-900 dark:text-white font-bold">Hi 👋, I'm Alfisyahri Amrun A.</h1>
        <div className="text-neutral-700 dark:text-neutral-300 text-justify leading-7 flex flex-col gap-4 mt-2">
          <p>
            I am Alfisyahri Amrun A., also known as Asa, a Software Engineering Technology student at Universitas Negeri Gorontalo, currently pursuing a D4 degree in Software Engineering Technology. I have a strong interest in software development and enjoy learning by building projects and experimenting with different technologies.
          </p>
          <p>
            My interests span across backend development, web development, and data-related technologies. I work with programming languages such as Go, Python, JavaScript, and Kotlin, while continuously improving my understanding of databases, APIs, and software development practices.
          </p>
          <p>
            As a self-taught developer, I enjoy exploring new technologies through personal projects and practical experiments. I have experience working with{" "}
            <span className="highlight">{GHLang}</span> and have contributed to{" "}
            <span className="highlight">{contrib}</span> repositories on GitHub, ranging from small experiments to projects built to deepen my technical skills.
          </p>
          <p>
            Currently based in Gorontalo, Indonesia, I am focused on strengthening my programming fundamentals, exploring different areas of software development, and building projects that can grow alongside my skills. I enjoy solving problems, learning through experimentation, and turning ideas into working software.
          </p>
        </div>
        <div className="mt-4 flex gap-4">
          <Link href={'https://github.com/syxhri'} target="_blank" className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"><IconBrandGithub className="w-6 h-6" /></Link>
          <Link href={'https://instagram.com/alfi.ndyou'} target="_blank" className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"><IconBrandInstagram className="w-6 h-6" /></Link>
          <Link href={'https://www.linkedin.com/in/alfisyahri-asa'} target="_blank" className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"><IconBrandLinkedin className="w-6 h-6" /></Link>
          <Link href={'mailto:alfisyahri.aac@gmail.com'} target="_blank" className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"><IconMail className="w-6 h-6" /></Link>
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
