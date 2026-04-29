import { motion } from 'framer-motion';
import { useState } from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';

const Reports = ({ theme }) => {
  const [reportData, setReportData] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportError, setReportError] = useState('');

  const reportOptions = [
    {
      title: 'Daily Operations Report',
      description: 'Patient admissions, discharges, and resource usage',
      icon: FileText,
      color: 'from-primary-500 to-primary-600',
      type: 'daily',
    },
    {
      title: 'Weekly Performance Summary',
      description: 'Staff efficiency and department metrics',
      icon: Calendar,
      color: 'from-success-500 to-success-600',
      type: 'weekly',
    },
    {
      title: 'Custom Analytics Report',
      description: 'Filtered data with advanced parameters',
      icon: Filter,
      color: 'from-warning-500 to-warning-600',
      type: 'custom',
    },
  ];

  const handleGenerate = (type) => {
    console.log("Generate clicked:", type);

    // FORCE DATA (no backend dependency)
    const demoData = {
      title: "Demo Report",
      hospital: "CareNest Hospital",
      patients: Math.floor(Math.random() * 100) + 50,
      beds: 80,
      icu: 20,
      status: "Stable"
    };

    setReportData(demoData);
  };

  const handleDownloadReport = () => {
    if (reportData) {
      downloadReport(reportData, `hospital-report-${reportData.report_type || 'summary'}.pdf`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.header
          className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                Comprehensive reporting
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Hospital Reports
              </h1>
              <p className="text-lg leading-8 text-slate-300">
                Generate detailed reports on patient care, resource utilization, and operational performance with customizable filters and export options.
              </p>
            </div>
            <div className="rounded-full bg-slate-950/80 px-6 py-3 text-center text-sm text-slate-300">
              Coming Soon
            </div>
          </div>
        </motion.header>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Daily Operations Report',
              description: 'Patient admissions, discharges, and resource usage',
              icon: FileText,
              color: 'from-primary-500 to-primary-600',
            },
            {
              title: 'Weekly Performance Summary',
              description: 'Staff efficiency and department metrics',
              icon: Calendar,
              color: 'from-success-500 to-success-600',
            },
            {
              title: 'Custom Analytics Report',
              description: 'Filtered data with advanced parameters',
              icon: Filter,
              color: 'from-warning-500 to-warning-600',
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/25"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.description}</p>
              <button
                type="button"
                onClick={() => handleGenerate(item.type)}
                disabled={loadingReport}
                className="mt-4 w-full inline-flex items-center justify-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 mr-2" />
                {loadingReport ? 'Generating...' : 'Generate Report'}
              </button>
            </motion.div>
          ))}
        </div>

        {reportError && (
          <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
            {reportError}
          </div>
        )}

        {reportData && (
          <motion.div
            id="report-section"
            className="mt-6 rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/25"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">{reportData.title || 'Generated Report'}</h2>
              <button
                onClick={handleDownloadReport}
                className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
            <p className="text-slate-400 mb-6">Report generated on {new Date(reportData.generated_at).toLocaleString()}.</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-slate-950/80 p-5">
                <p className="text-sm text-slate-400">Hospital</p>
                <p className="mt-2 text-lg font-semibold text-white">{reportData.hospital_name}</p>
                <p className="text-slate-500 text-sm">{reportData.hospital_region}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-5">
                <p className="text-sm text-slate-400">Report Type</p>
                <p className="mt-2 text-lg font-semibold text-white">{reportData.report_type}</p>
              </div>

              {/* Daily Report Fields */}
              {reportData.report_type === 'daily' && (
                <>
                  <div className="rounded-3xl bg-slate-950/80 p-5">
                    <p className="text-sm text-slate-400">Current Patients</p>
                    <p className="mt-2 text-lg font-semibold text-white">{reportData.summary?.current_patients}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-5">
                    <p className="text-sm text-slate-400">Admissions Today</p>
                    <p className="mt-2 text-lg font-semibold text-white">{reportData.summary?.admissions}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-5">
                    <p className="text-sm text-slate-400">Discharges Today</p>
                    <p className="mt-2 text-lg font-semibold text-white">{reportData.summary?.discharges}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-5">
                    <p className="text-sm text-slate-400">Available Beds</p>
                    <p className="mt-2 text-lg font-semibold text-white">{reportData.summary?.beds_available}</p>
                  </div>
                </>
              )}

              {/* Weekly Report Fields */}
              {reportData.report_type === 'weekly' && (
                <>
                  <div className="rounded-3xl bg-slate-950/80 p-5">
                    <p className="text-sm text-slate-400">Staff Efficiency</p>
                    <p className="mt-2 text-lg font-semibold text-white">{reportData.summary?.staff_efficiency}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-5">
                    <p className="text-sm text-slate-400">Average Patients</p>
                    <p className="mt-2 text-lg font-semibold text-white">{reportData.summary?.avg_patients}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-5">
                    <p className="text-sm text-slate-400">Bed Utilization</p>
                    <p className="mt-2 text-lg font-semibold text-white">{reportData.summary?.beds_utilization}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-5">
                    <p className="text-sm text-slate-400">Total Admissions</p>
                    <p className="mt-2 text-lg font-semibold text-white">{reportData.summary?.total_admissions}</p>
                  </div>
                </>
              )}

              {/* Custom Report Fields */}
              {reportData.report_type === 'custom' && (
                <>
                  <div className="rounded-3xl bg-slate-950/80 p-5">
                    <p className="text-sm text-slate-400">Filtered Data</p>
                    <p className="mt-2 text-lg font-semibold text-white">{reportData.summary?.filtered_data}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-5">
                    <p className="text-sm text-slate-400">Analysis Period</p>
                    <p className="mt-2 text-lg font-semibold text-white">{reportData.summary?.analysis_period}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-5">
                    <p className="text-sm text-slate-400">Current Patients</p>
                    <p className="mt-2 text-lg font-semibold text-white">{reportData.summary?.current_patients}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-5">
                    <p className="text-sm text-slate-400">Custom Filters</p>
                    <p className="mt-2 text-sm font-semibold text-white">{reportData.summary?.custom_filters?.join(', ')}</p>
                  </div>
                </>
              )}

              {/* Common Fields */}
              <div className="rounded-3xl bg-slate-950/80 p-5">
                <p className="text-sm text-slate-400">Alert Level</p>
                <p className="mt-2 text-lg font-semibold text-white">{reportData.summary?.alert_level}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-5">
                <p className="text-sm text-slate-400">Confidence</p>
                <p className="mt-2 text-lg font-semibold text-white">{reportData.confidence}</p>
              </div>
            </div>

            {reportData.recommended_action && (
              <div className="mt-6 rounded-3xl bg-slate-950/80 p-5">
                <p className="text-sm text-slate-400 mb-2">Recommended Action</p>
                <p className="text-white">{reportData.recommended_action}</p>
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          className="mt-10 rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/25"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-8">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-4">Advanced Reporting System</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Generate comprehensive reports with customizable date ranges, filters, and export formats including PDF, Excel, and CSV.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              'Patient Flow Reports',
              'Resource Utilization',
              'Staff Performance',
              'Quality Metrics',
            ].map((report, index) => (
              <div key={report} className="rounded-xl bg-slate-950/80 p-4 text-center">
                <p className="text-sm font-medium text-slate-300">{report}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;