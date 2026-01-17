"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

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

export default function MayaAIPage() {
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
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: ["city", "location", "property_type"].includes(name)
                ? value
                : Number(value),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setPrice(null);

        try {
            const res = await fetch("https://mayaai-microservice.onrender.com/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Failed");

            const data = await res.json();
            setPrice(data.predicted_price);
        } catch (err) {
            setError("AI service is waking up or unavailable. Please try again in a few seconds.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex flex-col">
            <Navbar />

            <div className="flex-grow flex items-center justify-center p-6">
                <div className="w-full max-w-5xl bg-white/80 backdrop-blur p-8 rounded-3xl shadow-xl border border-amber-100">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-amber-600">MayaAI</h1>
                        <p className="text-gray-600 mt-2">
                            Your intelligent real estate price assistant
                        </p>
                    </div>

                    {/* Main layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Left: Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">

                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                🏠 Property Details
                            </h2>

                            <Field label="City">
                                <input name="city" value={form.city} onChange={handleChange} className="input" placeholder="e.g. gurgaon" />
                            </Field>

                            <Field label="Locality / Area">
                                <input name="location" value={form.location} onChange={handleChange} className="input" placeholder="e.g. sector 57" />
                            </Field>

                            <Field label="Property Type">
                                <select name="property_type" value={form.property_type} onChange={handleChange} className="input">
                                    <option value="apartment">Apartment</option>
                                    <option value="villa">Villa</option>
                                    <option value="house">House</option>
                                    <option value="plot">Plot / Land</option>
                                </select>
                            </Field>

                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Area (sqft)">
                                    <input type="number" name="area_sqft" value={form.area_sqft} onChange={handleChange} className="input" />
                                </Field>
                                <Field label="Property Age (years)">
                                    <input type="number" name="age" value={form.age} onChange={handleChange} className="input" />
                                </Field>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <Field label="Bedrooms">
                                    <input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} className="input" />
                                </Field>
                                <Field label="Bathrooms">
                                    <input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} className="input" />
                                </Field>
                                <Field label="Balconies">
                                    <input type="number" name="balconies" value={form.balconies} onChange={handleChange} className="input" />
                                </Field>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Floor Number">
                                    <input type="number" name="floor_num" value={form.floor_num} onChange={handleChange} className="input" />
                                </Field>
                                <Field label="Total Floors in Building">
                                    <input type="number" name="total_floor" value={form.total_floor} onChange={handleChange} className="input" />
                                </Field>
                            </div>

                            <Field label="Furnishing">
                                <select name="furnish" value={form.furnish} onChange={handleChange} className="input">
                                    <option value={0}>Unfurnished</option>
                                    <option value={1}>Semi Furnished</option>
                                    <option value={2}>Fully Furnished</option>
                                </select>
                            </Field>

                            <Field label="Facing Direction">
                                <select name="facing" value={form.facing} onChange={handleChange} className="input">
                                    <option value={0}>Unknown</option>
                                    <option value={1}>East</option>
                                    <option value={2}>West</option>
                                    <option value={3}>North</option>
                                    <option value={4}>South</option>
                                </select>
                            </Field>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition"
                            >
                                {loading ? "MayaAI is thinking..." : "Ask MayaAI for Price"}
                            </button>
                        </form>

                        {/* Right: Result panel */}
                        <div className="flex flex-col justify-center">

                            <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-2xl p-6 shadow-inner text-center min-h-[250px] flex flex-col justify-center">

                                {!price && !loading && (
                                    <p className="text-gray-500">
                                        🤖 MayaAI will analyze your property and estimate its market price.
                                    </p>
                                )}

                                {loading && (
                                    <div>
                                        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-amber-600 font-semibold">Analyzing market data...</p>
                                    </div>
                                )}

                                {price && (
                                    <div>
                                        <p className="text-gray-600">Estimated Market Value</p>
                                        <p className="text-4xl font-bold text-green-600 mt-2">
                                            ₹ {Math.round(price).toLocaleString("en-IN")}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            This is an AI-generated estimate based on similar properties.
                                        </p>
                                    </div>
                                )}

                                {error && (
                                    <p className="text-red-500 font-semibold">{error}</p>
                                )}

                            </div>

                        </div>

                    </div>
                </div>
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

/* Reusable field wrapper */
function Field({ label, children }: FieldProps) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
                {label}
            </label>
            {children}
        </div>
    );
}
