import React from 'react';
import CustomerLayout from '@/layouts/CustomerLayout'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <CustomerLayout>{children}</CustomerLayout>
    )
}

export default layout