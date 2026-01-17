import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function MayaAIPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="text-center max-w-2xl mx-auto">
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-amber-100">
                        <h1 className="text-4xl font-bold text-amber-600 mb-4 animate-bounce">MayaAI</h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Your intelligent real estate assistant is coming soon!
                        </p>
                        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
