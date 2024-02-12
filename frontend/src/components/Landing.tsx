/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/o4BugowTrOI
 */
"use client";
import Link from "next/link";
import {useEffect, useState} from "react";
import {motion, useAnimation} from "framer-motion";
import Image from 'next/image';

// Import the red database logo SVG


export function Landing() {
    const controls = useAnimation();



    useEffect(() => {
        controls.start({opacity: 1, y: 0});
    }, [controls]);



    return (
        <div>
            {/* Red Database Logo */}
            <div className="absolute top-0 left-0 p-4 flex items-center">
                <Image src={"/database-5-512.png"} width={512} height={512} className="w-12 h-12 text-red-600"
                       alt={"databse icon"}/>
                <span className="ml-2 text-black text-xl font-bold">BetterSQL</span>
            </div>
            <section
                key="1"
                className="relative w-full py-12 md:py-24 lg:py-32 bg-databases bg-cover bg-center flex items-center justify-center"
            >
                <div className="container flex flex-col items-center justify-center gap-4 px-4 text-center md:px-6">
                    <div className="space-y-3">
                        <div className="flex flex-col items-center justify-center">
                            <motion.h1
                                initial={{opacity: 0, y: 50}}
                                animate={controls}
                                className="text-6xl font-bold tracking-tighter sm:text-7xl md:text-8xl"
                            >
                                <span className="inline-block text-black">BETTER</span>
                                <span className="inline-block text-red-600">SQL</span>
                            </motion.h1>
                        </div>
                        <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                            Optimize your SQL queries with the power of AI. Faster results, better performance.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                        <Link
                            href="/connect"
                            className="inline-flex h-16 items-center justify-center rounded-md bg-red-600 px-8 text-xl font-medium text-gray-50 shadow transition-colors hover:bg-red-700 hover:text-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-red-400 dark:text-gray-50 dark:hover:bg-red-500 dark:focus-visible:ring-gray-300"
                            style={{fontWeight: 'bold'}}>
                            Connect Your Database
                        </Link>
                    </div>
                </div>
            </section>
            {/* Red Waves Design */}
            <svg
                className="absolute bottom-0 left-0 right-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
            >
                <path
                    fill="#ff0000"
                    fillOpacity="1"
                    d="M0,96L60,90.7C120,85,240,75,360,101.3C480,128,600,192,720,202.7C840,213,960,171,1080,144C1200,117,1320,107,1380,101.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                ></path>
            </svg>
        </div>
    );
}
