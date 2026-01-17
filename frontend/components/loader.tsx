"use client"

export default function Loading() {

    return (
        <>
            <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-amber-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-amber-600 border-t-transparent animate-spin"></div>
            </div>


        </>

    )
}