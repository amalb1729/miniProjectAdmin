import React, { useEffect, useState } from 'react';

export default function PrintJobsPanel() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/print/jobs')
      .then(res => res.json())
      .then(data => { setJobs(data.jobs || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handlePrint = async (filename) => {
    setMessage('');
    const res = await fetch(`/api/print/print/${filename}`, { method: 'POST' });
    if (res.ok) setMessage('Sent to printer!');
    else setMessage('Print failed.');
  };

  return (
    <div style={{maxWidth: 600, margin: '2rem auto', padding: 20, border: '1px solid #eee', borderRadius: 8}}>
      <h2>Print Jobs</h2>
      {loading ? <div>Loading...</div> : (
        <ul>
          {jobs.length === 0 && <li>No print jobs.</li>}
          {jobs.map(job => (
            <li key={job.filename} style={{marginBottom: 8}}>
              {job.originalname || job.filename}
              <button style={{marginLeft: 12}} onClick={() => handlePrint(job.filename)}>Print</button>
            </li>
          ))}
        </ul>
      )}
      {message && <div style={{marginTop: 10}}>{message}</div>}
    </div>
  );
}
