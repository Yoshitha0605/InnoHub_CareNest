import { motion } from 'framer-motion';
import { useState } from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';

const Reports = ({ theme }) => {
  const [report, setReport] = useState(null);
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

    let title, hospital, patients;

    if (type === "daily") {
      title = "Daily Report";
      hospital = "City General Hospital";
      patients = 120;
    } else if (type === "weekly") {
      title = "Weekly Report";
      hospital = "Metro Hospital";
      patients = 300;
    } else if (type === "custom") {
      title = "Custom Report";
      hospital = "Advanced Care Center";
      patients = 200;
    } else {
      title = "Demo Report";
      hospital = "CareNest Hospital";
      patients = Math.floor(Math.random() * 100) + 50;
    }

    const demoData = {
      title,
      hospital,
      patients,
      beds: 80,
      icu: 20,
      status: "Stable"
    };

    setReport(demoData);
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
          {reportOptions.map((item, index) => (
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
                style={{ position: "relative", zIndex: 10 }}
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

        {report && (
          <div className="mt-8 rounded-lg border border-slate-800 bg-slate-900 p-6">
            <h2>{report.title}</h2>
            <p>{report.hospital}</p>
            <p>Patients: {report.patients}</p>
            <p>Status: {report.status}</p>
          </div>
        )}

        <button onClick={() => console.log("Clicked")}>
          Test Button
        </button>


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