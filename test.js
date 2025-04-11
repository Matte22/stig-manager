const fs = require('fs');

const headers = [
  'Name',
  'Description',
  'IP',
  'FQDN',
  'MAC',
  'Non-Computing',
  'STIGs',
  'Labels',
  'Metadata'
];

function randomIp() {
  return "1.1.1.1"
}

function randomMac() {
  return "awdawdwa"
}

function escapeCsv(value) {
  if (value == null) return '';
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

const rows = [];
for (let i = 0; i < 500; i++) {
  const row = [
    `Asset ${i}`,
    `Asset${i} Description`,
    "1.1.1.1",
    `Asset-f.q.d.n`,
    randomMac(),
    i % 2 === 0 ? 'True' : 'False',
    `VPN_SRG_TEST\nWindows_10_STIG_TEST`,
    `Label${i}\nLabel${(i)}`,
    JSON.stringify({ [`key:${i % 10}`]: `value:${i % 10}` })
  ];
  rows.push(row.map(escapeCsv).join(','));
}

const csv = [headers.join(','), ...rows].join('\n');

fs.writeFileSync('generated_api_asset_dense.csv', csv);
console.log('✅ Generated 1000-row api_asset_dense-style CSV');
