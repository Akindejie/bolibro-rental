'use client';

import ApplicationCard from '@/components/ApplicationCard';
import Header from '@/components/Header';
import Loading from '@/components/Loading';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useGetApplicationsQuery } from '@/state/api';
import { useAppSelector } from '@/state/redux';
import { CircleCheckBig, Clock, Download, XCircle } from 'lucide-react';
import React from 'react';

const Applications = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.user);
  const {
    data: applications,
    isLoading,
    isError,
  } = useGetApplicationsQuery(
    {
      userId: user?.supabaseId,
      userType: 'tenant',
    },
    {
      skip: !isAuthenticated || !user?.supabaseId,
    }
  );

  if (isLoading) return <Loading />;
  if (isError || !applications) return <div>Error fetching applications</div>;

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/tenants/favorites' },
    { label: 'Applications', href: '/tenants/applications' },
  ];

  return (
    <div className="dashboard-container">
      <Breadcrumbs items={breadcrumbItems} />
      <Header
        title="Applications"
        subtitle="Track and manage your property rental applications"
        showBackButton
        backButtonDestination="/tenants/favorites"
      />
      <div className="w-full">
        {applications?.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            userType="renter"
          >
            <div className="flex justify-between gap-5 w-full pb-4 px-4">
              {application.status === 'Approved' ? (
                <div className="bg-green-100 p-4 text-green-700 grow flex items-center">
                  <CircleCheckBig className="w-5 h-5 mr-2" />
                  The property is being rented by you until{' '}
                  {new Date(application.lease?.endDate).toLocaleDateString()}
                </div>
              ) : application.status === 'Pending' ? (
                <div className="bg-yellow-100 p-4 text-yellow-700 grow flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Your application is pending approval
                </div>
              ) : (
                <div className="bg-red-100 p-4 text-red-700 grow flex items-center">
                  <XCircle className="w-5 h-5 mr-2" />
                  Your application has been denied
                </div>
              )}

              <button
                className={`bg-white border border-gray-300 text-gray-700 py-2 px-4
                          rounded-md flex items-center justify-center hover:bg-primary-700 hover:text-primary-50`}
              >
                <Download className="w-5 h-5 mr-2" />
                Download Agreement
              </button>
            </div>
          </ApplicationCard>
        ))}
      </div>
    </div>
  );
};

export default Applications;
