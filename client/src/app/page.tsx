import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Utensils, Clock, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between border-b border-neutral-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <Utensils className="h-6 w-6 text-indigo-600" />
          <span className="font-bold text-xl tracking-tight">TableFlow</span>
        </div>
        <nav className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-semibold">Log in</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">Sign up</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 lg:py-32 bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-800">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
            Smart Table Allocation Algorithm
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-neutral-900 leading-tight">
            Book your perfect table <br className="hidden lg:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">without the wait.</span>
          </h1>
          <p className="text-lg lg:text-xl text-neutral-600 max-w-2xl mx-auto">
            Experience flawless dining. Our smart system instantly pairs you with the best available table, guaranteeing no double-bookings or conflicts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 h-14 text-lg">
                Book a Table Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/admin/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 h-14 text-lg border-neutral-300">
                Admin Portal
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Features Snippet */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl w-full">
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-neutral-100 transition-all hover:shadow-md">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-blue-600">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Real-time Availability</h3>
            <p className="text-neutral-500 text-sm">See exactly what time slots are open instantly. No refreshing needed.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-neutral-100 transition-all hover:shadow-md">
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4 text-emerald-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Atomic Booking</h3>
            <p className="text-neutral-500 text-sm">Guaranteed conflict-free reservations backed by enterprise transactions.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-neutral-100 transition-all hover:shadow-md">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4 text-purple-600">
              <Utensils className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Optimal Allocation</h3>
            <p className="text-neutral-500 text-sm">Smartly matches your party size to the most efficient table configuration.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
