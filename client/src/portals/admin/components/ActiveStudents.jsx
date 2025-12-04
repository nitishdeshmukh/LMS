import React, { useState, useEffect } from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import StudentsTable from '../components/StudentsTable';
import StatisticsSection from './StatisticsSection';
import adminService from '@/services/admin/adminService';
import { Button } from '@/common/components/ui/button';
import CertificateIssueDialog from './CertificateIssueDialog';

const ActiveStudents = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Certificate Dialog State
  const [isCertDialogOpen, setIsCertDialogOpen] = useState(false);
  const [selectedStudentForCert, setSelectedStudentForCert] = useState(null);
  const [isIssuingCert, setIsIssuingCert] = useState(false);

  // Helper function to determine capstone status
  const getCapstoneStatus = student => {
    if (!student.isCompleted) {
      return 'In Progress';
    }
    if (student.certificateId) {
      return 'Graded';
    }
    return 'Submitted';
  };

  // Helper function to format payment status
  const getPaymentStatus = status => {
    const statusMap = {
      UNPAID: 'Unpaid',
      PARTIAL_PAYMENT_VERIFICATION_PENDING: 'Pending Verification',
      PARTIAL_PAID: 'Half Paid',
      FULLY_PAYMENT_VERIFICATION_PENDING: 'Pending Verification',
      FULLY_PAID: 'Full Paid',
    };
    return statusMap[status] || status;
  };

  // Fetch active students data
  const fetchActiveStudents = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      const response = await adminService.getActiveStudents();

      if (response.success) {
        // Transform API data to match table structure
        // response.data is an array of enrollments
        const transformedData = response.data.map(enrollment => ({
          id: enrollment._id,
          enrollmentId: enrollment._id,
          name: `${enrollment.student?.name || ''} ${enrollment.student?.middleName || ''} ${enrollment.student?.lastName || ''}`.trim(),
          email: enrollment.student?.email,
          college: enrollment.student?.collegeName,
          year: enrollment.student?.yearOfStudy,
          currentProgress: enrollment.progressPercentage || 0,
          capstoneStatus: getCapstoneStatus(enrollment),
          partialPaymentDetails: enrollment.partialPaymentDetails,
          fullPaymentDetails: enrollment.fullPaymentDetails,
          paymentStatus: getPaymentStatus(enrollment.paymentStatus),
          isCompleted: enrollment.isCompleted || false,
          courseAmount: enrollment.courseAmount,
          amountRemaining: enrollment.amountRemaining,
          certificateId: enrollment.certificateId,
          userId: enrollment.student?._id,
        }));
        setStudentsData(transformedData);
      } else {
        throw new Error(response.message || 'Failed to fetch active students');
      }
    } catch (err) {
      console.error('Error fetching active students:', err);
      setError(err.message || 'Failed to load active students');
      toast.error('Failed to load students', {
        description: err.message || 'Please try again later',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Open Certificate Dialog
  const handleIssueCertificateClick = (enrollmentId) => {
    const student = studentsData.find(s => s.enrollmentId === enrollmentId);
    if (student) {
      setSelectedStudentForCert(student);
      setIsCertDialogOpen(true);
    }
  };

  // Confirm Issue Certificate
  const handleConfirmIssueCertificate = async (student) => {
    try {
      setIsIssuingCert(true);
      toast.loading('Issuing certificate...', { id: 'cert-issue' });

      // const response = await adminService.issueCertificateByEnrollmentId({ enrollmentId: student.enrollmentId });

      
    } catch (err) {
      console.error('Error issuing certificate:', err);
      toast.error('Failed to issue certificate', {
        id: 'cert-issue',
        description: err.message || 'Please try again later',
      });
    } finally {
      setIsIssuingCert(false);
    }
  };

  // Fetch on component mount
  useEffect(() => {
    fetchActiveStudents();
  }, []);

  // Manual refresh handler
  const handleRefresh = () => {
    fetchActiveStudents(false);
  };

  return (
    <div className="min-h-screen">
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Active Students</h1>
              <p className="text-zinc-400 text-sm mt-1">
                Manage and monitor active student enrollments
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="mt-2 text-red-400 border-red-500/20 hover:bg-red-500/10"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-zinc-400">Loading active students...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Statistics Section */}
              <StatisticsSection studentsData={studentsData} />

              {/* Students Table */}
              <div className="mt-8">
                <StudentsTable
                  data={studentsData}
                  onIssueCertificate={handleIssueCertificateClick}
                  onRefresh={handleRefresh}
                />
              </div>
            </>
          )}
        </div>
      </main>

      {/* Certificate Issue Dialog */}
      <CertificateIssueDialog
        isOpen={isCertDialogOpen}
        onOpenChange={setIsCertDialogOpen}
        student={selectedStudentForCert}
        onConfirm={handleConfirmIssueCertificate}
        isIssuing={isIssuingCert}
      />
    </div>
  );
};

export default ActiveStudents;
