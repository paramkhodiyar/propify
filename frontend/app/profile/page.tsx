'use client';

import { Suspense } from 'react';
import DashboardLayout from '@/app/dashboard/layout';
import ProfileContent from './profileContent';

export default function ProfilePage() {
    return (
        <DashboardLayout>
            <Suspense fallback={<div className="p-10">Loading profile...</div>}>
                <ProfileContent />
            </Suspense>
        </DashboardLayout>
    );
}
