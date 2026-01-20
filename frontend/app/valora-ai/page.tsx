"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { FaHome, FaMagic, FaRupeeSign, FaCity, FaBuilding, FaDatabase, FaBroom, FaCogs, FaChartLine, FaExclamationTriangle } from "react-icons/fa";

interface FormData {
    city: string;
    location: string;
    property_type: string;
    bedrooms: number;
    bathrooms: number;
    balconies: number;
    area_sqft: number;
    floor_num: number;
    total_floor: number;
    age: number;
    furnish: number;
    facing: number;
}

interface FieldProps {
    label: string;
    children: React.ReactNode;
}

export default function ValoraAIPage() {
    const [form, setForm] = useState<FormData>({
        city: "gurgaon",
        location: "",
        property_type: "apartment",
        bedrooms: 3,
        bathrooms: 2,
        balconies: 1,
        area_sqft: 1000,
        floor_num: 1,
        total_floor: 10,
        age: 5,
        furnish: 1,
        facing: 1,
    });

    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState<number | null>(null);
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        const ok = localStorage.getItem("valora_ai_disclaimer");
        if (ok === "true") setAccepted(true);
    }, []);

    const acceptDisclaimer = () => {
        localStorage.setItem("valora_ai_disclaimer", "true");
        setAccepted(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: ["city", "location", "property_type"].includes(name) ? value : Number(value),
        }));
    };

    const autofillGurgaon = () => {
        setForm({
            city: "gurgaon",
            location: "sector 57",
            property_type: "apartment",
            bedrooms: 3,
            bathrooms: 3,
            balconies: 2,
            area_sqft: 1850,
            floor_num: 5,
            total_floor: 14,
            age: 5,
            furnish: 2,
            facing: 1,
        });
        toast.success("Gurgaon sample loaded");
    };

    const autofillMumbai = () => {
        setForm({
            city: "mumbai",
            location: "malabar hill",
            property_type: "apartment",
            bedrooms: 4,
            bathrooms: 5,
            balconies: 2,
            area_sqft: 3200,
            floor_num: 18,
            total_floor: 30,
            age: 3,
            furnish: 2,
            facing: 3,
        });
        toast.success("South Bombay luxury sample loaded");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setPrice(null);

        const toastId = toast.loading("ValoraAI is analyzing market data...");

        try {
            const res = await fetch("https://mayaai-microservice.onrender.com/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Failed");

            const data = await res.json();
            setPrice(data.predicted_price);
            toast.success("Prediction successful", { id: toastId });
        } catch (err) {
            toast.error("AI service is waking up or unavailable. Try again.", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex flex-col">
            <Navbar />

            <AnimatePresence>
                {!accepted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-black/40 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-2xl p-8 max-w-lg text-center shadow-2xl"
                        >
                            <div className="text-red-500 text-4xl flex justify-center mb-4">
                                <FaExclamationTriangle />
                            </div>
                            <h2 className="text-2xl font-bold mb-3">Important Disclaimer</h2>
                            <p className="text-gray-600 mb-6">
                                ValoraAI is an experimental AI system trained on historical data. Predictions may be inaccurate and should not be used for real financial decisions.
                            </p>
                            <button
                                onClick={acceptDisclaimer}
                                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl"
                            >
                                I Understand
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-grow p-6 space-y-12 max-w-7xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full bg-white/80 backdrop-blur p-8 rounded-3xl shadow-xl border border-amber-100"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-amber-600 flex items-center justify-center gap-3">
                            <FaMagic /> ValoraAI
                        </h1>
                        <p className="text-gray-600 mt-2">
                            AI-powered real estate price prediction engine
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center mb-8">
                        <button onClick={autofillGurgaon} className="px-4 py-2 rounded-xl border hover:bg-amber-50 flex items-center gap-2">
                            <FaCity /> Load Gurgaon Sample
                        </button>
                        <button onClick={autofillMumbai} className="px-4 py-2 rounded-xl border hover:bg-amber-50 flex items-center gap-2">
                            <FaBuilding /> Load South Bombay Sample
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <FaHome /> Property Details
                            </h2>

                            <Field label="City">
                                <input name="city" value={form.city} onChange={handleChange} className="input" />
                            </Field>

                            <Field label="Locality">
                                <input name="location" value={form.location} onChange={handleChange} className="input" />
                            </Field>

                            <Field label="Property Type">
                                <select name="property_type" value={form.property_type} onChange={handleChange} className="input">
                                    <option value="apartment">Apartment</option>
                                    <option value="villa">Villa</option>
                                    <option value="house">House</option>
                                    <option value="plot">Plot</option>
                                </select>
                            </Field>

                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Area (sqft)">
                                    <input type="number" name="area_sqft" value={form.area_sqft} onChange={handleChange} className="input" />
                                </Field>
                                <Field label="Property Age">
                                    <input type="number" name="age" value={form.age} onChange={handleChange} className="input" />
                                </Field>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                disabled={loading}
                                className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                            >
                                <FaMagic />
                                {loading ? "Analyzing..." : "Predict Price"}
                            </motion.button>
                        </form>

                        <div className="flex items-center justify-center">
                            <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-2xl p-8 shadow-inner text-center w-full min-h-[260px] flex flex-col justify-center">
                                <AnimatePresence mode="wait">
                                    {price && (
                                        <motion.div
                                            key="result"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                        >
                                            <p className="text-gray-600">Estimated Market Value</p>
                                            <p className="text-4xl font-bold text-green-600 mt-2 flex items-center justify-center gap-2">
                                                <FaRupeeSign />
                                                {Math.round(price).toLocaleString("en-IN")}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl p-8 shadow-xl border"
                >
                    <h2 className="text-3xl font-bold text-center mb-8">How ValoraAI Works</h2>

                    <div className="grid md:grid-cols-4 gap-6">
                        <Step icon={<FaDatabase />} title="Data Collection" text="Collected multiple real estate datasets from Kaggle during GenAI coursework." />
                        <Step icon={<FaBroom />} title="Data Cleaning" text="Handled missing values, removed noise, normalized and standardized features." />
                        <Step icon={<FaCogs />} title="Feature Engineering" text="Merged datasets into a unified training dataset with consistent schema." />
                        <Step icon={<FaChartLine />} title="Model Training" text="Trained a regression model to learn pricing patterns and predict new values." />
                    </div>
                </motion.div>
            </div>

            <Footer />

            <style jsx>{`
                .input {
                    border: 1px solid #e5e7eb;
                    border-radius: 0.75rem;
                    padding: 0.6rem 0.9rem;
                    width: 100%;
                    outline: none;
                    background: white;
                }
                .input:focus {
                    border-color: #f59e0b;
                    box-shadow: 0 0 0 1px #f59e0b;
                }
            `}</style>
        </div>
    );
}

function Field({ label, children }: FieldProps) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
            {children}
        </div>
    );
}

function Step({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
    return (
        <div className="p-6 rounded-2xl border text-center space-y-3">
            <div className="text-3xl text-amber-500 flex justify-center">{icon}</div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-sm text-gray-600">{text}</p>
        </div>
    );
}
