import { DetectionResult } from '../types';

export function exportToCSV(results: DetectionResult[]): void {
  const headers = [
    'Timestamp',
    'Platform',
    'Username',
    'Exists',
    'Verified',
    'Risk %',
    'Status',
    'Indicators',
    'Explanation'
  ];

  const csvContent = [
    headers.join(','),
    ...results.map(result => [
      result.timestamp.toISOString(),
      result.platform.name,
      result.username,
      result.exists.toString(),
      result.isVerified.toString(),
      result.riskPercentage.toString(),
      result.status,
      `"${result.indicators.join('; ')}"`,
      `"${result.explanation}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `fake-detector-results-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}