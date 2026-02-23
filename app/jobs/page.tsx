import JobList from '@/components/jobs/JobList';

export const revalidate = 600; // 10 minutes - job list changes most

export default function JobsPage() {
  return <JobList />;
}


