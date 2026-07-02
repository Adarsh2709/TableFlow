'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Use same values as backend
const TIME_SLOTS = [
  '12:00', '13:00', '14:00', 
  '18:00', '19:00', '20:00', '21:00'
];

export default function BookTablePage() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        reservationDate: date,
        timeSlot: time,
        guests: parseInt(guests)
      };
      
      const res = await api.post('/reservations', payload);
      if (res.data.success) {
        toast.success('Table booked successfully!');
        router.push('/customer/dashboard');
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error('Sorry, no tables are available for this slot.', {
          description: 'Try changing the time or date.',
        });
      } else if (error.response?.data?.errors) {
         error.response.data.errors.forEach((err: any) => toast.error(err.message));
      } else {
         toast.error(error.response?.data?.message || 'Failed to book table');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get tomorrow's date for minimum date attribute
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <Link href="/customer/dashboard" className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
      
      <Card className="border-indigo-100 shadow-md">
        <CardHeader className="bg-indigo-50/50 border-b border-indigo-50 pb-8 pt-8 px-8">
          <CardTitle className="text-3xl font-bold tracking-tight text-indigo-950">Book a Table</CardTitle>
          <CardDescription className="text-base text-indigo-800/70">
            Select your preferred date, time, and party size. Our system will automatically assign the best table for you.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleBooking}>
          <CardContent className="space-y-6 pt-8 px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="date" className="text-base font-semibold">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  min={minDate}
                  required 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="time" className="text-base font-semibold">Time</Label>
                <Select required value={time} onValueChange={setTime}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map(slot => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="guests" className="text-base font-semibold">Number of Guests</Label>
              <Input 
                id="guests" 
                type="number" 
                min="1" 
                max="20"
                required 
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="h-12"
              />
              <p className="text-xs text-neutral-500">
                We'll find the smallest suitable table for your party.
              </p>
            </div>
          </CardContent>
          <CardFooter className="px-8 pb-8 pt-4">
            <Button size="lg" className="w-full h-14 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Confirming Availability...' : 'Confirm Booking'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
