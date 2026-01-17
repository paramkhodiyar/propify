'use client';

import { Suspense } from 'react';
import DashboardLayout from '@/app/dashboard/layout';
import ProfileContent from './profileContent';
import Loader from '@/components/loader';

export default function ProfilePage() {
    return (
        <DashboardLayout>
            <Suspense fallback={<Loader />}>
                <ProfileContent />
            </Suspense>
        </DashboardLayout>
    );
}
