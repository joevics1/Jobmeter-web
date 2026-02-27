import JobList from '@/components/jobs/JobList';

export const revalidate = 1800; // 30 minutes - cache job list

export default function JobsPage() {
  return <JobList />;
}


